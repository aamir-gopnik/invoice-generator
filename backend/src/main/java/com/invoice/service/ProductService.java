package com.invoice.service;

import com.invoice.dto.ProductDto;
import com.invoice.entity.Product;
import com.invoice.repository.ProductRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public Optional<ProductDto> getProductById(Long id) {
        return productRepository.findById(id)
                .map(this::convertToDto);
    }
    
    public Optional<ProductDto> getProductBySku(String sku) {
        return productRepository.findBySku(sku)
                .map(this::convertToDto);
    }
    
    public List<ProductDto> searchProducts(String searchTerm) {
        return productRepository.searchProducts(searchTerm).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public ProductDto createProduct(ProductDto productDto) {
        if (productDto.getSku() != null && productRepository.existsBySku(productDto.getSku())) {
            throw new RuntimeException("Product with SKU " + productDto.getSku() + " already exists");
        }
        
        Product product = convertToEntity(productDto);
        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }
    
    public Optional<ProductDto> updateProduct(Long id, ProductDto productDto) {
        return productRepository.findById(id)
                .map(existingProduct -> {
                    // Check if SKU is being changed and if it already exists
                    if (productDto.getSku() != null && 
                            !productDto.getSku().equals(existingProduct.getSku()) &&
                            productRepository.existsBySku(productDto.getSku())) {
                        throw new RuntimeException("Product with SKU " + productDto.getSku() + " already exists");
                    }
                    
                    BeanUtils.copyProperties(productDto, existingProduct, "id", "createdAt");
                    Product savedProduct = productRepository.save(existingProduct);
                    return convertToDto(savedProduct);
                });
    }
    
    public boolean deleteProduct(Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    private ProductDto convertToDto(Product product) {
        ProductDto dto = new ProductDto();
        BeanUtils.copyProperties(product, dto);
        return dto;
    }
    
    private Product convertToEntity(ProductDto dto) {
        Product product = new Product();
        BeanUtils.copyProperties(dto, product);
        return product;
    }
} 