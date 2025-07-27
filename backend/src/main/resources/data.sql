-- Ensure compatibility with MySQL by using proper SQL syntax for data insertion.

-- Insert Categories
INSERT INTO categories (name, description) VALUES 
('Electronics', 'Electronic devices and gadgets'),
('Clothing', 'Fashion and apparel'),
('Books', 'Books and educational materials'),
('Home & Garden', 'Home improvement and garden supplies'),
('Sports', 'Sports and outdoor equipment');

-- Insert Sample Products
INSERT INTO products (sku, name, description, unit_price, image_url, active, units_in_stock, date_created, last_updated, category_id) VALUES 
('ELEC-001', 'iPhone 14 Pro', 'Latest iPhone with advanced camera system', 999.99, 'https://via.placeholder.com/300x300?text=iPhone+14+Pro', true, 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
('ELEC-002', 'Samsung Galaxy S23', 'Premium Android smartphone', 899.99, 'https://via.placeholder.com/300x300?text=Galaxy+S23', true, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
('ELEC-003', 'MacBook Pro 16 inch', 'Professional laptop for developers', 2499.99, 'https://via.placeholder.com/300x300?text=MacBook+Pro', true, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
('ELEC-004', 'AirPods Pro', 'Wireless earbuds with noise cancellation', 249.99, 'https://via.placeholder.com/300x300?text=AirPods+Pro', true, 100, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
('ELEC-005', 'iPad Air', 'Powerful tablet for work and play', 599.99, 'https://via.placeholder.com/300x300?text=iPad+Air', true, 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 1),
('CLOTH-001', 'Nike Air Max', 'Comfortable running shoes', 129.99, 'https://via.placeholder.com/300x300?text=Nike+Air+Max', true, 75, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
('CLOTH-002', 'Levis Jeans', 'Classic denim jeans', 79.99, 'https://via.placeholder.com/300x300?text=Levis+Jeans', true, 80, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
('CLOTH-003', 'Adidas T-Shirt', 'Comfortable cotton t-shirt', 29.99, 'https://via.placeholder.com/300x300?text=Adidas+Tshirt', true, 120, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
('CLOTH-004', 'Winter Jacket', 'Warm winter jacket', 199.99, 'https://via.placeholder.com/300x300?text=Winter+Jacket', true, 45, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
('CLOTH-005', 'Baseball Cap', 'Stylish baseball cap', 24.99, 'https://via.placeholder.com/300x300?text=Baseball+Cap', true, 90, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 2),
('BOOK-001', 'Spring Boot in Action', 'Learn Spring Boot development', 49.99, 'https://via.placeholder.com/300x300?text=Spring+Boot+Book', true, 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
('BOOK-002', 'Angular Complete Guide', 'Master Angular framework', 59.99, 'https://via.placeholder.com/300x300?text=Angular+Book', true, 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
('BOOK-003', 'Java Programming', 'Comprehensive Java guide', 69.99, 'https://via.placeholder.com/300x300?text=Java+Book', true, 35, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
('BOOK-004', 'Database Design', 'Learn database design principles', 54.99, 'https://via.placeholder.com/300x300?text=Database+Book', true, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3),
('BOOK-005', 'Web Development', 'Full-stack web development', 64.99, 'https://via.placeholder.com/300x300?text=Web+Dev+Book', true, 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 3);

-- Insert Admin User
INSERT INTO users (email, password, first_name, last_name, role, enabled, date_created, last_updated) VALUES 
('admin@ecommerce.com', '$2a$10$Kd4V2KGxl3.7EAMqpE8rJOQxWzjbPhpM7TvLdHVwK6s0nY1dDnR5G', 'Admin', 'User', 'ROLE_ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user@ecommerce.com', '$2a$10$Kd4V2KGxl3.7EAMqpE8rJOQxWzjbPhpM7TvLdHVwK6s0nY1dDnR5G', 'John', 'Doe', 'ROLE_USER', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Default password for both users is: password
