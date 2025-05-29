// Create PostgreSQL tables manually
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const createTablesSQL = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  uuid VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  phone VARCHAR(20),
  address TEXT,
  google_id VARCHAR(255),
  facebook_id VARCHAR(255),
  apple_id VARCHAR(255),
  is_verified BOOLEAN DEFAULT false,
  verification_code VARCHAR(10),
  reset_password_token VARCHAR(255),
  reset_password_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Recipients table
CREATE TABLE IF NOT EXISTS recipients (
  id SERIAL PRIMARY KEY,
  uuid VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  relationship VARCHAR(100) NOT NULL,
  age INTEGER,
  gender VARCHAR(20),
  birthday DATE,
  photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  uuid VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  description TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  source_url TEXT,
  currency VARCHAR(10) DEFAULT 'USD',
  source_site VARCHAR(100),
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

-- Preferences table
CREATE TABLE IF NOT EXISTS preferences (
  id SERIAL PRIMARY KEY,
  uuid VARCHAR(255) UNIQUE NOT NULL,
  recipient_id INTEGER REFERENCES recipients(id) ON DELETE CASCADE,
  preference_type VARCHAR(100) NOT NULL,
  preference_value JSONB NOT NULL,
  category VARCHAR(100),
  importance INTEGER CHECK (importance >= 1 AND importance <= 5),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id SERIAL PRIMARY KEY,
  uuid VARCHAR(255) UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  recipient_id INTEGER REFERENCES recipients(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'pending',
  recommendation_score DECIMAL(3,2),
  confidence_score DECIMAL(3,2),
  reasoning TEXT,
  occasion VARCHAR(100),
  budget_min DECIMAL(10,2),
  budget_max DECIMAL(10,2),
  mood VARCHAR(50),
  generated_at TIMESTAMP DEFAULT NOW(),
  notified_at TIMESTAMP
);

-- Occasions table
CREATE TABLE IF NOT EXISTS occasions (
  id SERIAL PRIMARY KEY,
  uuid VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  recipient_id INTEGER REFERENCES recipients(id) ON DELETE CASCADE,
  status VARCHAR(50) DEFAULT 'upcoming',
  is_recurring BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_recipients_user_id ON recipients(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_recipient_id ON recommendations(recipient_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
`;

async function createTables() {
  try {
    console.log('Creating PostgreSQL tables...');
    await pool.query(createTablesSQL);
    console.log('✅ All tables created successfully!');
    
    // Verify tables exist
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('\nCreated tables:');
    result.rows.forEach(row => console.log(`- ${row.table_name}`));
    
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
  } finally {
    await pool.end();
  }
}

createTables();