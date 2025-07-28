package com.invoice.service;

import com.invoice.dto.InvoiceDto;
import com.invoice.dto.InvoiceItemDto;
import com.invoice.entity.*;
import com.invoice.repository.CustomerRepository;
import com.invoice.repository.InvoiceRepository;
import com.invoice.repository.ProductRepository;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.property.TextAlignment;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class InvoiceService {
    
    @Autowired
    private InvoiceRepository invoiceRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<InvoiceDto> getAllInvoices() {
        return invoiceRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public Optional<InvoiceDto> getInvoiceById(Long id) {
        return invoiceRepository.findById(id)
                .map(this::convertToDto);
    }
    
    public Optional<InvoiceDto> getInvoiceByNumber(String invoiceNumber) {
        return invoiceRepository.findByInvoiceNumber(invoiceNumber)
                .map(this::convertToDto);
    }
    
    public List<InvoiceDto> getInvoicesByCustomer(Long customerId) {
        return invoiceRepository.findByCustomerId(customerId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<InvoiceDto> getInvoicesByStatus(Invoice.InvoiceStatus status) {
        return invoiceRepository.findByStatus(status).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public List<InvoiceDto> searchInvoices(String searchTerm) {
        return invoiceRepository.searchInvoices(searchTerm).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public InvoiceDto createInvoice(InvoiceDto invoiceDto) {
        // Generate invoice number if not provided
        if (invoiceDto.getInvoiceNumber() == null || invoiceDto.getInvoiceNumber().isEmpty()) {
            invoiceDto.setInvoiceNumber(generateInvoiceNumber());
        }
        
        // Check if invoice number already exists
        if (invoiceRepository.existsByInvoiceNumber(invoiceDto.getInvoiceNumber())) {
            throw new RuntimeException("Invoice with number " + invoiceDto.getInvoiceNumber() + " already exists");
        }
        
        // Get customer
        Customer customer = customerRepository.findById(invoiceDto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        // Create invoice
        Invoice invoice = new Invoice(invoiceDto.getInvoiceNumber(), customer);
        BeanUtils.copyProperties(invoiceDto, invoice, "id", "customerId", "items", "customerName", "customerEmail");
        
        // Add items
        if (invoiceDto.getItems() != null) {
            for (InvoiceItemDto itemDto : invoiceDto.getItems()) {
                Product product = productRepository.findById(itemDto.getProductId())
                        .orElseThrow(() -> new RuntimeException("Product not found"));
                
                InvoiceItem item = new InvoiceItem(product, itemDto.getQuantity(), itemDto.getUnitPrice());
                item.setDescription(itemDto.getDescription());
                item.setTaxRate(itemDto.getTaxRate());
                invoice.addItem(item);
            }
        }
        
        // Calculate totals
        invoice.calculateTotals();
        
        Invoice savedInvoice = invoiceRepository.save(invoice);
        return convertToDto(savedInvoice);
    }
    
    public Optional<InvoiceDto> updateInvoice(Long id, InvoiceDto invoiceDto) {
        return invoiceRepository.findById(id)
                .map(existingInvoice -> {
                    // Check if invoice number is being changed and if it already exists
                    if (!existingInvoice.getInvoiceNumber().equals(invoiceDto.getInvoiceNumber()) &&
                            invoiceRepository.existsByInvoiceNumber(invoiceDto.getInvoiceNumber())) {
                        throw new RuntimeException("Invoice with number " + invoiceDto.getInvoiceNumber() + " already exists");
                    }
                    
                    // Update basic properties
                    BeanUtils.copyProperties(invoiceDto, existingInvoice, "id", "items", "customerName", "customerEmail");
                    
                    // Update customer if changed
                    if (!existingInvoice.getCustomer().getId().equals(invoiceDto.getCustomerId())) {
                        Customer customer = customerRepository.findById(invoiceDto.getCustomerId())
                                .orElseThrow(() -> new RuntimeException("Customer not found"));
                        existingInvoice.setCustomer(customer);
                    }
                    
                    // Clear existing items and add new ones
                    existingInvoice.getItems().clear();
                    if (invoiceDto.getItems() != null) {
                        for (InvoiceItemDto itemDto : invoiceDto.getItems()) {
                            Product product = productRepository.findById(itemDto.getProductId())
                                    .orElseThrow(() -> new RuntimeException("Product not found"));
                            
                            InvoiceItem item = new InvoiceItem(product, itemDto.getQuantity(), itemDto.getUnitPrice());
                            item.setDescription(itemDto.getDescription());
                            item.setTaxRate(itemDto.getTaxRate());
                            existingInvoice.addItem(item);
                        }
                    }
                    
                    // Recalculate totals
                    existingInvoice.calculateTotals();
                    
                    Invoice savedInvoice = invoiceRepository.save(existingInvoice);
                    return convertToDto(savedInvoice);
                });
    }
    
    public boolean deleteInvoice(Long id) {
        if (invoiceRepository.existsById(id)) {
            invoiceRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public byte[] generatePdf(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);
            
            // Add header
            Paragraph header = new Paragraph("INVOICE")
                    .setFontSize(24)
                    .setTextAlignment(TextAlignment.CENTER);
            document.add(header);
            
            // Add invoice details
            Paragraph invoiceNumber = new Paragraph("Invoice #: " + invoice.getInvoiceNumber());
            document.add(invoiceNumber);
            
            Paragraph invoiceDate = new Paragraph("Date: " + invoice.getInvoiceDate().format(DateTimeFormatter.ofPattern("MM/dd/yyyy")));
            document.add(invoiceDate);
            
            if (invoice.getDueDate() != null) {
                Paragraph dueDate = new Paragraph("Due Date: " + invoice.getDueDate().format(DateTimeFormatter.ofPattern("MM/dd/yyyy")));
                document.add(dueDate);
            }
            
            // Add customer information
            Paragraph customerHeader = new Paragraph("Bill To:").setFontSize(14);
            document.add(customerHeader);
            
            Customer customer = invoice.getCustomer();
            Paragraph customerName = new Paragraph(customer.getName());
            document.add(customerName);
            
            if (customer.getAddress() != null) {
                Paragraph customerAddress = new Paragraph(customer.getAddress());
                document.add(customerAddress);
            }
            
            // Add items table
            Table table = new Table(5);
            table.addCell("Item");
            table.addCell("Description");
            table.addCell("Qty");
            table.addCell("Price");
            table.addCell("Total");
            
            for (InvoiceItem item : invoice.getItems()) {
                table.addCell(item.getProduct().getName());
                table.addCell(item.getDescription() != null ? item.getDescription() : "");
                table.addCell(item.getQuantity().toString());
                table.addCell("$" + item.getUnitPrice().toString());
                table.addCell("$" + item.getLineTotal().toString());
            }
            
            document.add(table);
            
            // Add totals
            Paragraph subtotal = new Paragraph("Subtotal: $" + invoice.getSubtotal());
            document.add(subtotal);
            
            Paragraph tax = new Paragraph("Tax: $" + invoice.getTaxAmount());
            document.add(tax);
            
            Paragraph total = new Paragraph("Total: $" + invoice.getTotalAmount())
                    .setFontSize(16);
            document.add(total);
            
            if (invoice.getNotes() != null && !invoice.getNotes().isEmpty()) {
                Paragraph notes = new Paragraph("Notes: " + invoice.getNotes());
                document.add(notes);
            }
            
            document.close();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }
    
    private String generateInvoiceNumber() {
        // Simple invoice number generation - in production, you might want a more sophisticated approach
        return "INV-" + System.currentTimeMillis();
    }
    
    private InvoiceDto convertToDto(Invoice invoice) {
        InvoiceDto dto = new InvoiceDto();
        BeanUtils.copyProperties(invoice, dto, "customer", "items");
        
        // Set customer ID and details
        dto.setCustomerId(invoice.getCustomer().getId());
        dto.setCustomerName(invoice.getCustomer().getName());
        dto.setCustomerEmail(invoice.getCustomer().getEmail());
        
        // Convert items
        if (invoice.getItems() != null) {
            List<InvoiceItemDto> itemDtos = invoice.getItems().stream()
                    .map(this::convertItemToDto)
                    .collect(Collectors.toList());
            dto.setItems(itemDtos);
        }
        
        return dto;
    }
    
    private InvoiceItemDto convertItemToDto(InvoiceItem item) {
        InvoiceItemDto dto = new InvoiceItemDto();
        BeanUtils.copyProperties(item, dto, "invoice", "product");
        
        // Set product ID and details
        dto.setProductId(item.getProduct().getId());
        dto.setProductName(item.getProduct().getName());
        dto.setProductSku(item.getProduct().getSku());
        
        return dto;
    }
} 