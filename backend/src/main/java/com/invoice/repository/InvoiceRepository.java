package com.invoice.repository;

import com.invoice.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    
    List<Invoice> findByCustomerId(Long customerId);
    
    List<Invoice> findByStatus(Invoice.InvoiceStatus status);
    
    List<Invoice> findByInvoiceDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT i FROM Invoice i WHERE i.invoiceNumber LIKE %:searchTerm% OR i.customer.name LIKE %:searchTerm%")
    List<Invoice> searchInvoices(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT i FROM Invoice i WHERE i.dueDate < :today AND i.status != 'PAID'")
    List<Invoice> findOverdueInvoices(@Param("today") LocalDate today);
    
    boolean existsByInvoiceNumber(String invoiceNumber);
} 