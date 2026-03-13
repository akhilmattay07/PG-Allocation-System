-- PG Allocator Database Schema
-- Run this script in PHPMyAdmin to create the database

CREATE DATABASE IF NOT EXISTS pg_allocator;
USE pg_allocator;

-- Users table (tenants and owners)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('tenant', 'owner', 'admin') NOT NULL DEFAULT 'tenant',
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PG Listings table
CREATE TABLE pg_listings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    rent DECIMAL(10,2) NOT NULL,
    sharing_type ENUM('single', 'double', 'triple', 'dormitory') NOT NULL,
    gender_preference ENUM('male', 'female', 'any') NOT NULL DEFAULT 'any',
    amenities JSON,
    image_url VARCHAR(500),
    description TEXT,
    available_rooms INT DEFAULT 1,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bookings table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pg_id INT NOT NULL,
    user_id INT NOT NULL,
    booking_date DATE NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pg_id) REFERENCES pg_listings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO users (name, email, password, role, phone) VALUES
('Admin User', 'admin@pgallocator.com', 'admin123', 'admin', '9999999999'),
('John Doe', 'john@example.com', 'password123', 'tenant', '9876543210'),
('Jane Smith', 'jane@example.com', 'password123', 'owner', '9876543211'),
('Amit Patel', 'amit@example.com', 'password123', 'owner', '9876543212');

INSERT INTO pg_listings (owner_id, name, city, address, rent, sharing_type, gender_preference, amenities, image_url, description, available_rooms, is_verified) VALUES
(3, 'Sunrise PG for Students', 'Bangalore', 'Koramangala, Bangalore', 8500.00, 'double', 'any', '["WiFi", "AC", "Laundry", "Parking", "CCTV"]', 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400', 'Comfortable PG accommodation for students with all modern amenities', 5, TRUE),
(3, 'Elite Mens PG', 'Bangalore', 'Indiranagar, Bangalore', 10000.00, 'single', 'male', '["WiFi", "AC", "Gym", "Laundry", "Parking"]', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400', 'Premium PG for working professionals', 3, TRUE),
(4, 'Comfort Ladies PG', 'Mumbai', 'Andheri West, Mumbai', 12000.00, 'double', 'female', '["WiFi", "AC", "Security", "Meals"]', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400', 'Safe and secure accommodation for ladies', 4, TRUE),
(4, 'Budget Friendly PG', 'Delhi', 'Lajpat Nagar, Delhi', 6000.00, 'triple', 'any', '["WiFi", "Laundry", "CCTV"]', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400', 'Affordable PG with basic amenities', 8, TRUE),
(3, 'Luxury Executive PG', 'Pune', 'Koregaon Park, Pune', 15000.00, 'single', 'any', '["WiFi", "AC", "Gym", "Swimming Pool", "Power Backup"]', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400', 'Luxury accommodation for executives', 2, TRUE),
(4, 'Student Hub PG', 'Chennai', 'Anna Nagar, Chennai', 7500.00, 'double', 'any', '["WiFi", "Study Room", "Laundry", "Meals"]', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', 'Perfect for students with study facilities', 6, TRUE);

INSERT INTO bookings (pg_id, user_id, booking_date, status, message) VALUES
(1, 2, '2024-01-15', 'confirmed', 'Looking forward to staying here'),
(2, 2, '2024-01-20', 'pending', 'Please confirm availability'),
(3, 2, '2024-02-01', 'pending', 'Need accommodation urgently');
