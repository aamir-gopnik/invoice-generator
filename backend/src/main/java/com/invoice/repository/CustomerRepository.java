package com.invoice.repository;

import com.invoice.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    
    Optional<Customer> findByEmail(String email);
    
    List<Customer> findByNameContainingIgnoreCase(String name);
    
    @Query("SELECT c FROM Customer c WHERE c.name LIKE %:searchTerm% OR c.email LIKE %:searchTerm%")
    List<Customer> searchCustomers(@Param("searchTerm") String searchTerm);
    
    boolean existsByEmail(String email);
} 