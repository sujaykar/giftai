-- Extended Test Data for GIFT AI Database
-- Run this after the main database setup script

-- Insert additional products (20+ total products)
INSERT INTO products (uuid, name, description, price, category, tags, image_url, source_url, created_at, updated_at)
VALUES 
-- Electronics & Gadgets
('660e8400-e29b-41d4-a716-446655440013', 'Smart Watch Pro', 'Advanced fitness tracking with heart rate, GPS, and sleep monitoring', 349.99, 'Electronics', ARRAY['fitness', 'smartwatch', 'health', 'technology'], 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400', 'https://amazon.com/example-smartwatch', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440014', 'Wireless Charging Pad', 'Fast wireless charging station for multiple devices', 89.99, 'Electronics', ARRAY['wireless', 'charging', 'technology', 'convenience'], 'https://images.unsplash.com/photo-1606406506815-667e2e53e33a?w=400', 'https://amazon.com/example-charger', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440015', 'Gaming Mechanical Keyboard', 'RGB backlit mechanical keyboard for gaming enthusiasts', 159.99, 'Electronics', ARRAY['gaming', 'keyboard', 'RGB', 'mechanical'], 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400', 'https://amazon.com/example-keyboard', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440016', 'Tablet Pro 11-inch', '11-inch tablet with stylus support for digital art and productivity', 799.99, 'Electronics', ARRAY['tablet', 'digital', 'art', 'productivity'], 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', 'https://amazon.com/example-tablet', NOW(), NOW()),

-- Fashion & Accessories
('660e8400-e29b-41d4-a716-446655440017', 'Designer Handbag', 'Luxury leather handbag with gold hardware accents', 425.00, 'Fashion & Accessories', ARRAY['handbag', 'luxury', 'leather', 'designer'], 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', 'https://amazon.com/example-handbag', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440018', 'Cashmere Sweater', 'Premium cashmere pullover sweater in multiple colors', 189.99, 'Fashion & Accessories', ARRAY['cashmere', 'sweater', 'luxury', 'comfort'], 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400', 'https://amazon.com/example-sweater', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440019', 'Vintage Watch', 'Classic vintage-style automatic watch with leather strap', 299.99, 'Fashion & Accessories', ARRAY['watch', 'vintage', 'automatic', 'classic'], 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400', 'https://amazon.com/example-vintage-watch', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440020', 'Pearl Jewelry Set', 'Elegant pearl necklace and earring set', 149.99, 'Fashion & Accessories', ARRAY['jewelry', 'pearls', 'elegant', 'formal'], 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', 'https://amazon.com/example-pearls', NOW(), NOW()),

-- Home & Garden
('660e8400-e29b-41d4-a716-446655440021', 'Smart Home Hub', 'Voice-controlled smart home automation hub', 199.99, 'Home & Garden', ARRAY['smart', 'home', 'automation', 'voice'], 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 'https://amazon.com/example-smarthub', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440022', 'Artisan Candle Collection', 'Set of 6 hand-poured soy candles with unique scents', 78.99, 'Home & Garden', ARRAY['candles', 'soy', 'aromatherapy', 'handmade'], 'https://images.unsplash.com/photo-1602874801006-04e2c83c1781?w=400', 'https://amazon.com/example-candles', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440023', 'Modern Floor Lamp', 'Minimalist LED floor lamp with adjustable brightness', 134.99, 'Home & Garden', ARRAY['lamp', 'LED', 'modern', 'lighting'], 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'https://amazon.com/example-lamp', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440024', 'Herb Garden Kit', 'Complete indoor herb growing kit with seeds and pots', 45.99, 'Home & Garden', ARRAY['herbs', 'gardening', 'indoor', 'growing'], 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', 'https://amazon.com/example-herbs', NOW(), NOW()),

-- Health & Beauty
('660e8400-e29b-41d4-a716-446655440025', 'Skincare Gift Set', 'Complete anti-aging skincare routine with premium ingredients', 189.99, 'Health & Beauty', ARRAY['skincare', 'anti-aging', 'beauty', 'premium'], 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', 'https://amazon.com/example-skincare', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440026', 'Electric Toothbrush', 'Smart electric toothbrush with multiple cleaning modes', 129.99, 'Health & Beauty', ARRAY['dental', 'electric', 'smart', 'health'], 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400', 'https://amazon.com/example-toothbrush', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440027', 'Yoga Mat Premium', 'Extra-thick yoga mat with carrying strap and alignment guides', 67.99, 'Health & Beauty', ARRAY['yoga', 'fitness', 'exercise', 'wellness'], 'https://images.unsplash.com/photo-1506629905542-b5702e4d3d5b?w=400', 'https://amazon.com/example-yogamat', NOW(), NOW()),

-- Food & Beverages
('660e8400-e29b-41d4-a716-446655440028', 'Tea Tasting Set', 'Premium loose leaf tea collection from around the world', 89.99, 'Food & Beverages', ARRAY['tea', 'premium', 'collection', 'international'], 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400', 'https://amazon.com/example-tea', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440029', 'Craft Beer Selection', 'Curated selection of 12 craft beers from local breweries', 65.99, 'Food & Beverages', ARRAY['beer', 'craft', 'local', 'selection'], 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400', 'https://amazon.com/example-beer', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440030', 'Gourmet Cheese Board', 'Artisan cheese selection with crackers and accompaniments', 95.99, 'Food & Beverages', ARRAY['cheese', 'gourmet', 'artisan', 'appetizer'], 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400', 'https://amazon.com/example-cheese', NOW(), NOW()),

-- Books & Media
('660e8400-e29b-41d4-a716-446655440031', 'Bestseller Book Collection', 'Set of 5 current bestselling novels across genres', 79.99, 'Books & Media', ARRAY['books', 'bestseller', 'fiction', 'reading'], 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', 'https://amazon.com/example-books', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440032', 'Vinyl Record Collection', 'Classic rock vinyl records from the 70s and 80s', 124.99, 'Books & Media', ARRAY['vinyl', 'music', 'classic', 'records'], 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400', 'https://amazon.com/example-vinyl', NOW(), NOW()),

-- Sports & Outdoors
('660e8400-e29b-41d4-a716-446655440033', 'Hiking Backpack', 'Professional hiking backpack with hydration system', 159.99, 'Sports & Outdoors', ARRAY['hiking', 'backpack', 'outdoor', 'adventure'], 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', 'https://amazon.com/example-backpack', NOW(), NOW()),
('660e8400-e29b-41d4-a716-446655440034', 'Tennis Racket Pro', 'Professional-grade tennis racket for intermediate players', 189.99, 'Sports & Outdoors', ARRAY['tennis', 'racket', 'sports', 'professional'], 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400', 'https://amazon.com/example-tennis', NOW(), NOW());

-- Add more recipients for test users
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
FROM users u 
CROSS JOIN (
    VALUES 
    ('Emma Wilson', 'Sister', 25, 'Female'),
    ('James Carter', 'Brother', 30, 'Male'),
    ('Lisa Parker', 'Best Friend', 28, 'Female'),
    ('Dad', 'Father', 55, 'Male'),
    ('Alex Thompson', 'Colleague', 35, 'Male'),
    ('Sarah Davis', 'Cousin', 24, 'Female')
) AS r(name, relationship, age, gender)
WHERE u.email LIKE '%@example.com'
LIMIT 30; -- Distribute recipients across test users

-- Add preferences for recipients
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
FROM recipients r 
CROSS JOIN (
    VALUES 
    ('Electronics', 'interest', 'technology', 0.9, 'user_input'),
    ('Fashion & Accessories', 'style', 'modern', 0.8, 'user_input'),
    ('Health & Beauty', 'activity', 'fitness', 0.85, 'user_input'),
    ('Food & Beverages', 'taste', 'gourmet', 0.7, 'user_input'),
    ('Books & Media', 'interest', 'mystery novels', 0.9, 'user_input'),
    ('Home & Garden', 'hobby', 'decorating', 0.8, 'user_input'),
    ('Sports & Outdoors', 'activity', 'hiking', 0.85, 'user_input'),
    ('Electronics', 'interest', 'gaming', 0.75, 'user_input'),
    ('Fashion & Accessories', 'preference', 'jewelry', 0.8, 'user_input'),
    ('Health & Beauty', 'routine', 'skincare', 0.9, 'user_input')
) AS p(category, preference_type, preference_value, confidence_score, source)
WHERE r.id IN (SELECT id FROM recipients LIMIT 20); -- Add to first 20 recipients

-- Add occasions for recipients
INSERT INTO occasions (uuid, recipient_id, name, occasion_type, date, budget_min, budget_max, priority, created_at, updated_at)
SELECT 
    uuid_generate_v4(),
    r.id,
    o.name,
    o.occasion_type,
    o.date::DATE,
    o.budget_min,
    o.budget_max,
    o.priority,
    NOW(),
    NOW()
FROM recipients r 
CROSS JOIN (
    VALUES 
    ('Birthday 2024', 'birthday', '2024-09-15', 75.00, 200.00, 'high'),
    ('Anniversary Gift', 'anniversary', '2024-10-20', 100.00, 300.00, 'high'),
    ('Graduation Gift', 'graduation', '2024-06-15', 50.00, 150.00, 'medium'),
    ('Holiday Present', 'holiday', '2024-12-25', 40.00, 120.00, 'medium'),
    ('Housewarming Gift', 'housewarming', '2024-07-30', 30.00, 100.00, 'low'),
    ('Thank You Gift', 'appreciation', '2024-08-10', 25.00, 75.00, 'low')
) AS o(name, occasion_type, date, budget_min, budget_max, priority)
WHERE r.id IN (SELECT id FROM recipients LIMIT 15); -- Add to first 15 recipients

-- Generate AI recommendations for users
INSERT INTO recommendations (uuid, user_id, recipient_id, product_id, occasion_id, confidence_score, reasoning, ai_model_version, price_at_recommendation, status, created_at, updated_at)
SELECT 
    uuid_generate_v4(),
    u.id,
    r.id,
    p.id,
    o.id,
    (RANDOM() * 0.3 + 0.7)::DECIMAL(3,2), -- Random confidence between 0.7-1.0
    CASE 
        WHEN p.category = 'Electronics' THEN 'Perfect for tech enthusiasts. This product matches their interest in modern technology and fits within the specified budget range.'
        WHEN p.category = 'Fashion & Accessories' THEN 'Stylish and elegant choice that aligns with their fashion preferences. The quality and design make it an ideal gift.'
        WHEN p.category = 'Health & Beauty' THEN 'Great for someone who values self-care and wellness. This product supports their healthy lifestyle choices.'
        WHEN p.category = 'Food & Beverages' THEN 'Perfect for food lovers and those who appreciate gourmet experiences. High-quality ingredients and unique flavors.'
        WHEN p.category = 'Home & Garden' THEN 'Ideal for someone who enjoys creating a beautiful living space. This item adds both functionality and style to any home.'
        WHEN p.category = 'Books & Media' THEN 'Excellent choice for avid readers and media enthusiasts. This selection offers hours of entertainment and learning.'
        WHEN p.category = 'Sports & Outdoors' THEN 'Perfect for active individuals who love outdoor adventures. High-quality gear that enhances their outdoor experiences.'
        ELSE 'Thoughtfully selected based on their preferences and interests. This gift shows care and consideration for what they truly enjoy.'
    END,
    'claude-3.5-sonnet',
    p.price,
    'active',
    NOW(),
    NOW()
FROM users u
CROSS JOIN recipients r
CROSS JOIN products p
CROSS JOIN occasions o
WHERE u.id = r.user_id 
  AND r.id = o.recipient_id
  AND p.price BETWEEN o.budget_min AND o.budget_max
  AND RANDOM() < 0.3 -- Only create recommendations for 30% of possible combinations
LIMIT 100; -- Limit to 100 recommendations total

-- Add some user feedback to recommendations
UPDATE recommendations 
SET user_feedback = CASE 
    WHEN RANDOM() < 0.3 THEN 'liked'
    WHEN RANDOM() < 0.6 THEN 'saved'
    ELSE NULL
END
WHERE id IN (SELECT id FROM recommendations ORDER BY RANDOM() LIMIT 50);

-- Final verification queries
SELECT 'Total Users: ' || COUNT(*) FROM users;
SELECT 'Total Products: ' || COUNT(*) FROM products;
SELECT 'Total Recipients: ' || COUNT(*) FROM recipients;
SELECT 'Total Preferences: ' || COUNT(*) FROM preferences;
SELECT 'Total Occasions: ' || COUNT(*) FROM occasions;
SELECT 'Total Recommendations: ' || COUNT(*) FROM recommendations;

-- Show sample data for verification
SELECT 'Sample recommendations with details:' as info;
SELECT 
    u.email as user_email,
    r.name as recipient_name,
    p.name as product_name,
    p.price,
    o.name as occasion_name,
    rec.confidence_score,
    rec.user_feedback
FROM recommendations rec
JOIN users u ON rec.user_id = u.id
JOIN recipients r ON rec.recipient_id = r.id
JOIN products p ON rec.product_id = p.id
JOIN occasions o ON rec.occasion_id = o.id
ORDER BY rec.created_at DESC
LIMIT 10;