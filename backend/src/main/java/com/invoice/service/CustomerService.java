package com.invoice.service;

import com.invoice.dto.CustomerDto;
import com.invoice.entity.Customer;
import com.invoice.repository.CustomerRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CustomerService {
    
    @Autowired
    private CustomerRepository customerRepository;
    
    public List<CustomerDto> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public Optional<CustomerDto> getCustomerById(Long id) {
        return customerRepository.findById(id)
                .map(this::convertToDto);
    }
    
    public Optional<CustomerDto> getCustomerByEmail(String email) {
        return customerRepository.findByEmail(email)
                .map(this::convertToDto);
    }
    
    public List<CustomerDto> searchCustomers(String searchTerm) {
        return customerRepository.searchCustomers(searchTerm).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    
    public CustomerDto createCustomer(CustomerDto customerDto) {
        if (customerRepository.existsByEmail(customerDto.getEmail())) {
            throw new RuntimeException("Customer with email " + customerDto.getEmail() + " already exists");
        }
        
        Customer customer = convertToEntity(customerDto);
        Customer savedCustomer = customerRepository.save(customer);
        return convertToDto(savedCustomer);
    }
    
    public Optional<CustomerDto> updateCustomer(Long id, CustomerDto customerDto) {
        return customerRepository.findById(id)
                .map(existingCustomer -> {
                    // Check if email is being changed and if it already exists
                    if (!existingCustomer.getEmail().equals(customerDto.getEmail()) &&
                            customerRepository.existsByEmail(customerDto.getEmail())) {
                        throw new RuntimeException("Customer with email " + customerDto.getEmail() + " already exists");
                    }
                    
                    BeanUtils.copyProperties(customerDto, existingCustomer, "id", "createdAt");
                    Customer savedCustomer = customerRepository.save(existingCustomer);
                    return convertToDto(savedCustomer);
                });
    }
    
    public boolean deleteCustomer(Long id) {
        if (customerRepository.existsById(id)) {
            customerRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    private CustomerDto convertToDto(Customer customer) {
        CustomerDto dto = new CustomerDto();
        BeanUtils.copyProperties(customer, dto);
        return dto;
    }
    
    private Customer convertToEntity(CustomerDto dto) {
        Customer customer = new Customer();
        BeanUtils.copyProperties(dto, customer);
        return customer;
    }
} 