-- GIFT AI Complete Database Setup Script
-- Run this in AWS RDS Query Editor or any PostgreSQL client

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    role VARCHAR(50),
    phone VARCHAR(50),
    address TEXT,
    google_id VARCHAR(255),
    facebook_id VARCHAR(255),
    apple_id VARCHAR(255),
    is_verified BOOLEAN DEFAULT false,
    verification_code VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255),
    description TEXT,
    price DECIMAL(10,2),
    image_url TEXT,
    source_url TEXT,
    currency VARCHAR(10) DEFAULT 'USD',
    source_site VARCHAR(255),
    categories TEXT[],
    tags TEXT[],
    metadata JSONB,
    availability_status VARCHAR(50) DEFAULT 'available',
    external_id VARCHAR(255),
    external_updated_at TIMESTAMP,
    last_scraped_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Recipients table
CREATE TABLE IF NOT EXISTS recipients (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    relationship VARCHAR(255),
    age INTEGER,
    gender VARCHAR(50),
    birthday DATE,
    photo_url TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Preferences table
CREATE TABLE IF NOT EXISTS preferences (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    recipient_id INTEGER REFERENCES recipients(id) ON DELETE CASCADE,
    category VARCHAR(255),
    preference_type VARCHAR(255),
    preference_value TEXT,
    confidence_score DECIMAL(3,2),
    source VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Occasions table
CREATE TABLE IF NOT EXISTS occasions (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    recipient_id INTEGER REFERENCES recipients(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    occasion_type VARCHAR(255),
    date DATE,
    budget_min DECIMAL(10,2),
    budget_max DECIMAL(10,2),
    priority VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(255) UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    recipient_id INTEGER REFERENCES recipients(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    occasion_id INTEGER REFERENCES occasions(id) ON DELETE SET NULL,
    confidence_score DECIMAL(3,2),
    reasoning TEXT,
    ai_model_version VARCHAR(255),
    price_at_recommendation DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'active',
    user_feedback VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Sessions table (for session storage)
CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_recipients_user_id ON recipients(user_id);
CREATE INDEX IF NOT EXISTS idx_preferences_recipient_id ON preferences(recipient_id);
CREATE INDEX IF NOT EXISTS idx_occasions_recipient_id ON occasions(recipient_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_recipient_id ON recommendations(recipient_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expire ON sessions(expire);

-- Insert demo user (password: Demo2024!)
INSERT INTO users (uuid, email, password, first_name, last_name, is_verified, created_at, updated_at)
VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'demo@giftai.com', '$2b$10$rKJ8mJZoT7qL5nN8WQxhGuQCJU1xY2vL8fH3kR9sP6tA4mE7cX9Q2', 'Demo', 'User', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert test users (password: TestUser2024!)
INSERT INTO users (uuid, email, password, first_name, last_name, is_verified, created_at, updated_at)
VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'alice.johnson@example.com', '$2b$10$rKJ8mJZoT7qL5nN8WQxhGuQCJU1xY2vL8fH3kR9sP6tA4mE7cX9Q3', 'Alice', 'Johnson', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'bob.smith@example.com', '$2b$10$rKJ8mJZoT7qL5nN8WQxhGuQCJU1xY2vL8fH3kR9sP6tA4mE7cX9Q3', 'Bob', 'Smith', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'carol.davis@example.com', '$2b$10$rKJ8mJZoT7qL5nN8WQxhGuQCJU1xY2vL8fH3kR9sP6tA4mE7cX9Q3', 'Carol', 'Davis', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'david.wilson@example.com', '$2b$10$rKJ8mJZoT7qL5nN8WQxhGuQCJU1xY2vL8fH3kR9sP6tA4mE7cX9Q3', 'David', 'Wilson', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'emma.brown@example.com', '$2b$10$rKJ8mJZoT7qL5nN8WQxhGuQCJU1xY2vL8fH3kR9sP6tA4mE7cX9Q3', 'Emma', 'Brown', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440006', 'frank.taylor@example.com', '$2b$10$rKJ8mJZoT7qL5nN8WQxhGuQCJU1xY2vL8fH3kR9sP6tA4mE7cX9Q3', 'Frank', 'Taylor', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440007', 'grace.anderson@example.com', '$2b$10$rKJ8mJZoT7qL5nN8WQxhGuQCJU1xY2vL8fH3kR9sP6tA4mE7cX9Q3', 'Grace', 'Anderson', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440008', 'henry.thomas@example.com', '$2b$10$rKJ8mJZoT7qL5nN8WQxhGuQCJU1xY2vL8fH3kR9sP6tA4mE7cX9Q3', 'Henry', 'Thomas', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440009', 'iris.jackson@example.com', '$2b$10$rKJ8mJZoT7qL5nN8WQxhGuQCJU1xY2vL8fH3kR9sP6tA4mE7cX9Q3', 'Iris', 'Jackson', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440010', 'jack.white@example.com', '$2b$10$rKJ8mJZoT7qL5nN8WQxhGuQCJU1xY2vL8fH3kR9sP6tA4mE7cX9Q3', 'Jack', 'White', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert sample products
INSERT INTO products (uuid, name, description, price, category, tags, image_url, source_url, created_at, updated_at)
VALUES 
('660e8400-e29b-41d4-a716-446655440001', 'Wireless Bluetooth Headphones', 'Premium noise-cancelling wireless headphones with 30-hour battery life', 199.99, 'Electronics', ARRAY['music', 'technology', 'wireless', 'gift'], 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 'https://amazon.com/example-headphones', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440002', 'Gourmet Coffee Gift Set', 'Artisan coffee collection with beans from around the world', 45.99, 'Food & Beverages', ARRAY['coffee', 'gourmet', 'drinks', 'morning'], 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400', 'https://amazon.com/example-coffee', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440003', 'Silk Scarf', 'Elegant silk scarf with hand-painted floral design', 79.99, 'Fashion & Accessories', ARRAY['fashion', 'silk', 'elegant', 'accessories'], 'https://images.unsplash.com/photo-1601924774866-847bcfb57a85?w=400', 'https://amazon.com/example-scarf', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440004', 'Smart Fitness Watch', 'Advanced fitness tracker with heart rate monitoring and GPS', 299.99, 'Electronics', ARRAY['fitness', 'health', 'technology', 'sports'], 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 'https://amazon.com/example-watch', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440005', 'Artisan Chocolate Box', 'Handcrafted premium chocolates from Belgian chocolatiers', 34.99, 'Food & Beverages', ARRAY['chocolate', 'sweet', 'gourmet', 'luxury'], 'https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=400', 'https://amazon.com/example-chocolate', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440006', 'Essential Oil Diffuser', 'Ultrasonic aromatherapy diffuser with LED lighting', 49.99, 'Home & Garden', ARRAY['aromatherapy', 'relaxation', 'home', 'wellness'], 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', 'https://amazon.com/example-diffuser', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440007', 'Leather Wallet', 'Genuine leather bifold wallet with RFID protection', 69.99, 'Fashion & Accessories', ARRAY['leather', 'wallet', 'men', 'accessories'], 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 'https://amazon.com/example-wallet', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440008', 'Indoor Plant Collection', 'Set of 3 easy-care indoor plants with decorative pots', 89.99, 'Home & Garden', ARRAY['plants', 'home', 'decor', 'green'], 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', 'https://amazon.com/example-plants', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440009', 'Cookbook Collection', 'Set of 3 bestselling cookbooks for international cuisine', 59.99, 'Books & Media', ARRAY['cooking', 'books', 'recipes', 'kitchen'], 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', 'https://amazon.com/example-cookbooks', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440010', 'Spa Gift Set', 'Luxury spa collection with bath bombs, oils, and candles', 124.99, 'Health & Beauty', ARRAY['spa', 'relaxation', 'beauty', 'self-care'], 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 'https://amazon.com/example-spa', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440011', 'Bluetooth Speaker', 'Portable waterproof speaker with 360-degree sound', 89.99, 'Electronics', ARRAY['music', 'portable', 'wireless', 'outdoor'], 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', 'https://amazon.com/example-speaker', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440012', 'Wine Selection', 'Curated selection of 3 premium wines from renowned vineyards', 149.99, 'Food & Beverages', ARRAY['wine', 'alcohol', 'premium', 'celebration'], 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400', 'https://amazon.com/example-wine', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- Insert sample recipients for demo user
INSERT INTO recipients (uuid, user_id, name, relationship, age, gender, created_at, updated_at)
SELECT 
    uuid_generate_v4(), 
    u.id, 
    r.name, 
    r.relationship, 
    r.age, 
    r.gender, 
    NOW(), 
    NOW()
FROM users u, (
    VALUES 
    ('Sarah Johnson', 'Sister', 28, 'Female'),
    ('Mike Chen', 'Best Friend', 32, 'Male'),
    ('Mom', 'Mother', 58, 'Female')
) AS r(name, relationship, age, gender)
WHERE u.email = 'demo@giftai.com'
ON CONFLICT (user_id, name) DO NOTHING;

-- Insert sample preferences for demo recipients
INSERT INTO preferences (uuid, recipient_id, category, preference_type, preference_value, confidence_score, source, created_at, updated_at)
SELECT 
    uuid_generate_v4(),
    r.id,
    p.category,
    p.preference_type,
    p.preference_value,
    p.confidence_score,
    p.source,
    NOW(),
    NOW()
FROM recipients r, (
    VALUES 
    ('Books & Media', 'interest', 'reading', 0.9, 'user_input'),
    ('Health & Beauty', 'activity', 'yoga', 0.8, 'user_input'),
    ('Food & Beverages', 'hobby', 'cooking', 0.9, 'user_input'),
    ('Electronics', 'interest', 'gaming', 0.8, 'user_input'),
    ('Home & Garden', 'hobby', 'gardening', 0.9, 'user_input')
) AS p(category, preference_type, preference_value, confidence_score, source)
WHERE r.name IN ('Sarah Johnson', 'Mike Chen', 'Mom');

-- Insert sample occasions for demo recipients
INSERT INTO occasions (uuid, recipient_id, name, occasion_type, date, budget_min, budget_max, priority, created_at, updated_at)
SELECT 
    uuid_generate_v4(),
    r.id,
    o.name,
    o.occasion_type,
    o.date,
    o.budget_min,
    o.budget_max,
    o.priority,
    NOW(),
    NOW()
FROM recipients r, (
    VALUES 
    ('Birthday 2024', 'birthday', '2024-08-15', 50.00, 150.00, 'high'),
    ('Holiday Gift', 'holiday', '2024-12-25', 30.00, 100.00, 'medium'),
    ('Thank You Gift', 'appreciation', '2024-06-01', 25.00, 75.00, 'low')
) AS o(name, occasion_type, date, budget_min, budget_max, priority)
WHERE r.name = 'Sarah Johnson';

-- Verify data insertion
SELECT 'Users created: ' || COUNT(*) FROM users;
SELECT 'Products created: ' || COUNT(*) FROM products;
SELECT 'Recipients created: ' || COUNT(*) FROM recipients;
SELECT 'Preferences created: ' || COUNT(*) FROM preferences;
SELECT 'Occasions created: ' || COUNT(*) FROM occasions;