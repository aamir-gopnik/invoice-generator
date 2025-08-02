------------------------------------ DDL QUERIES ---------------------------------------
----------------------------------------------------------------------------------------
-- Table: customers
CREATE TABLE customers (
    id IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone_number VARCHAR(50),
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: products
CREATE TABLE products (
    id IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    price DECIMAL(10,2) NOT NULL,
    sku VARCHAR(100) UNIQUE,
    unit VARCHAR(50),
    tax_rate DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: invoices
CREATE TABLE invoices (
    id IDENTITY PRIMARY KEY,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id BIGINT NOT NULL,
    invoice_date DATE,
    due_date DATE,
    subtotal DECIMAL(10,2),
    tax_amount DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    notes VARCHAR(2000),
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Table: invoice_items
CREATE TABLE invoice_items (
    id IDENTITY PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    description VARCHAR(1000),
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    tax_rate DECIMAL(5,2),
    line_total DECIMAL(10,2),
    FOREIGN KEY (invoice_id) REFERENCES invoices(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);