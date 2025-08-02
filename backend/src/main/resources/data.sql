------------------------------------ INSERT QUERIES ---------------------------------------
-------------------------------------------------------------------------------------------

-- Insert sample customers
INSERT INTO customers (name, email, phone_number, address, city, state, zip_code, country, created_at, updated_at) VALUES
('John Doe', 'john.doe@example.com', '555-0123', '123 Main St', 'Anytown', 'CA', '12345', 'USA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Jane Smith', 'jane.smith@example.com', '555-0124', '456 Oak Ave', 'Somewhere', 'NY', '67890', 'USA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Acme Corporation', 'contact@acme.com', '555-0125', '789 Business Blvd', 'Corporate City', 'TX', '54321', 'USA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample products
INSERT INTO products (name, description, price, sku, unit, tax_rate, created_at, updated_at) VALUES
('Web Development Services', 'Custom web application development', 150.00, 'WEB-DEV-001', 'hour', 8.25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Database Consulting', 'Database design and optimization services', 200.00, 'DB-CONS-001', 'hour', 8.25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Software License', 'Annual software license', 1200.00, 'SW-LIC-001', 'license', 8.25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Technical Support', 'Monthly technical support package', 500.00, 'TECH-SUP-001', 'month', 8.25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Training Services', 'Professional training and workshops', 100.00, 'TRAIN-001', 'hour', 8.25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample invoices
INSERT INTO invoices (invoice_number, customer_id, invoice_date, due_date, subtotal, tax_amount, total_amount, notes, status, created_at, updated_at) VALUES
('INV-2024-001', 1, '2024-01-15', '2024-02-15', 1500.00, 123.75, 1623.75, 'Website development project - Phase 1', 'SENT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('INV-2024-002', 2, '2024-01-20', '2024-02-20', 800.00, 66.00, 866.00, 'Database optimization consulting', 'PAID', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('INV-2024-003', 3, '2024-01-25', '2024-02-25', 1200.00, 99.00, 1299.00, 'Annual software license renewal', 'DRAFT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample invoice items
INSERT INTO invoice_items (invoice_id, product_id, description, quantity, unit_price, tax_rate, line_total) VALUES
(1, 1, 'Web Development Services', 10, 150.00, 8.25, 1500.00),
(2, 2, 'Database Consulting', 4, 200.00, 8.25, 800.00),
(3, 3, 'Software License', 1, 1200.00, 8.25, 1200.00); 