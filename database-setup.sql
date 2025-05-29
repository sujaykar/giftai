-- GIFT AI Database Setup Script
-- Run this in AWS RDS Query Editor

-- Insert demo user (password is hashed version of 'Demo2024!')
INSERT INTO users (uuid, email, password, first_name, last_name, is_verified, created_at, updated_at)
VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'demo@giftai.com', '$2b$10$rKJ8mJZoT7qL5nN8WQxhGuQCJU1xY2vL8fH3kR9sP6tA4mE7cX9Q2', 'Demo', 'User', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert test users (password is hashed version of 'TestUser2024!')
INSERT INTO users (uuid, email, password, first_name, last_name, is_verified, created_at, updated_at)
VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'alice.johnson@example.com', '$2b$10$rKJ8mJZoT7qL5nN8WQxhGuQCJU1xY2vL8fH3kR9sP6tA4mE7cX9Q3', 'Alice', 'Johnson', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'bob.smith@example.com', '$2b$10$rKJ8mJZoT7qL5nN8WQxhGuQCJU1xY2vL8fH3kR9sP6tA4mE7cX9Q3', 'Bob', 'Smith', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'carol.davis@example.com', '$2b$10$rKJ8mJZoT7qL5nN8WQxhGuQCJU1xY2vL8fH3kR9sP6tA4mE7cX9Q3', 'Carol', 'Davis', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'david.wilson@example.com', '$2b$10$rKJ8mJZoT7qL5nN8WQxhGuQCJU1xY2vL8fH3kR9sP6tA4mE7cX9Q3', 'David', 'Wilson', true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440005', 'emma.brown@example.com', '$2b$10$rKJ8mJZoT7qL5nN8WQxhGuQCJU1xY2vL8fH3kR9sP6tA4mE7cX9Q3', 'Emma', 'Brown', true, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert sample products
INSERT INTO products (uuid, name, description, price, category, tags, image_url, source_url, created_at, updated_at)
VALUES 
('660e8400-e29b-41d4-a716-446655440001', 'Wireless Bluetooth Headphones', 'Premium noise-cancelling wireless headphones with 30-hour battery life', 199.99, 'Electronics', ARRAY['music', 'technology', 'wireless', 'gift'], 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 'https://amazon.com/example-headphones', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440002', 'Gourmet Coffee Gift Set', 'Artisan coffee collection with beans from around the world', 45.99, 'Food & Beverages', ARRAY['coffee', 'gourmet', 'drinks', 'morning'], 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400', 'https://amazon.com/example-coffee', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440003', 'Silk Scarf', 'Elegant silk scarf with hand-painted floral design', 79.99, 'Fashion & Accessories', ARRAY['fashion', 'silk', 'elegant', 'accessories'], 'https://images.unsplash.com/photo-1601924774866-847bcfb57a85?w=400', 'https://amazon.com/example-scarf', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440004', 'Smart Fitness Watch', 'Advanced fitness tracker with heart rate monitoring and GPS', 299.99, 'Electronics', ARRAY['fitness', 'health', 'technology', 'sports'], 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 'https://amazon.com/example-watch', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440005', 'Artisan Chocolate Box', 'Handcrafted premium chocolates from Belgian chocolatiers', 34.99, 'Food & Beverages', ARRAY['chocolate', 'sweet', 'gourmet', 'luxury'], 'https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=400', 'https://amazon.com/example-chocolate', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440006', 'Essential Oil Diffuser', 'Ultrasonic aromatherapy diffuser with LED lighting', 49.99, 'Home & Garden', ARRAY['aromatherapy', 'relaxation', 'home', 'wellness'], 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', 'https://amazon.com/example-diffuser', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- Insert sample recipients for demo user
INSERT INTO recipients (uuid, user_id, name, relationship, age, gender, created_at, updated_at)
SELECT 
    gen_random_uuid(), 
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