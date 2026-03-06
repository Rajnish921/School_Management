-- Database Setup Script for School Management System
-- Run this script in MySQL to create the database and tables

-- Create Database
CREATE DATABASE IF NOT EXISTS school_management;
USE school_management;

-- Create Schools Table
CREATE TABLE IF NOT EXISTS schools (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_location (latitude, longitude)
);

-- Insert Sample Data (Optional)
INSERT INTO schools (name, address, latitude, longitude) VALUES
('Green Valley High School', '123 Main Street', 40.7128, -74.0060),
('Riverside Elementary', '456 Oak Avenue', 40.7580, -73.9855),
('Central Middle School', '789 Pine Road', 40.6892, -74.0445),
('Sunnybrook Academy', '321 Elm Street', 40.7489, -73.9680);
