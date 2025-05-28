import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configure WebSocket for Neon
neonConfig.webSocketConstructor = ws;
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL
});

async function setupDatabase() {
  console.log('🚀 Setting up database tables for GIFT AI platform...');
  
  try {
    // Create users table (core authentication table)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        uuid UUID NOT NULL DEFAULT gen_random_uuid(),
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        "firstName" VARCHAR(100) NOT NULL,
        "lastName" VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'user' NOT NULL,
        phone TEXT,
        address TEXT,
        "googleId" VARCHAR(100),
        "facebookId" VARCHAR(100),
        "appleId" VARCHAR(100),
        "profileImageUrl" TEXT,
        "lastLogin" TIMESTAMP,
        "isVerified" BOOLEAN DEFAULT false,
        "verificationToken" TEXT,
        "verificationCode" TEXT,
        "resetPasswordToken" TEXT,
        "resetPasswordExpires" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log('✅ Users table created');

    // Create recipients table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS recipients (
        id SERIAL PRIMARY KEY,
        uuid UUID NOT NULL DEFAULT gen_random_uuid(),
        "userId" INTEGER NOT NULL REFERENCES users(id),
        name VARCHAR(100) NOT NULL,
        relationship VARCHAR(50) NOT NULL,
        age INTEGER,
        gender VARCHAR(20),
        birthday TIMESTAMP,
        "photoUrl" TEXT,
        notes TEXT,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log('✅ Recipients table created');

    // Create products table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        uuid UUID NOT NULL DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2),
        "imageUrl" TEXT,
        "purchaseUrl" TEXT,
        "sourceUrl" TEXT,
        currency VARCHAR(3) DEFAULT 'USD',
        "sourceSite" VARCHAR(50),
        category VARCHAR(100),
        categories TEXT[],
        occasions TEXT[],
        moods TEXT[],
        "ageRanges" TEXT[],
        genders TEXT[],
        relationships TEXT[],
        interests TEXT[],
        tags TEXT[],
        metadata JSONB,
        "isActive" BOOLEAN DEFAULT true,
        "lastScrapedAt" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);
    console.log('✅ Products table created');

    // Create other essential tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS preferences (
        id SERIAL PRIMARY KEY,
        uuid UUID NOT NULL DEFAULT gen_random_uuid(),
        "recipientId" INTEGER NOT NULL REFERENCES recipients(id),
        "preferenceType" VARCHAR(50) NOT NULL,
        "preferenceValue" JSONB NOT NULL,
        category VARCHAR(100),
        importance INTEGER,
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS recommendations (
        id SERIAL PRIMARY KEY,
        uuid UUID NOT NULL DEFAULT gen_random_uuid(),
        "userId" INTEGER NOT NULL REFERENCES users(id),
        "recipientId" INTEGER NOT NULL REFERENCES recipients(id),
        "productId" INTEGER NOT NULL REFERENCES products(id),
        "recommendationScore" DECIMAL(4,2),
        "confidenceScore" DECIMAL(4,2),
        reasoning TEXT,
        "reasonText" TEXT,
        "relationshipContext" VARCHAR(50),
        mood VARCHAR(30),
        status VARCHAR(20) NOT NULL DEFAULT 'new',
        "generatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
        "notifiedAt" TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS occasions (
        id SERIAL PRIMARY KEY,
        uuid UUID NOT NULL DEFAULT gen_random_uuid(),
        "recipientId" INTEGER NOT NULL REFERENCES recipients(id),
        name VARCHAR(100) NOT NULL,
        date TIMESTAMP NOT NULL,
        "isRecurring" BOOLEAN NOT NULL DEFAULT false,
        status VARCHAR(20) NOT NULL DEFAULT 'not_started',
        "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
        "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `);

    console.log('✅ All core tables created successfully!');
    
    // Now create a demo user for immediate testing
    const hashedPassword = '$2b$10$4/fjF8/LFOIOSBrwD5vMPO1SQRRpFOXGICCLgavsoqybyhDFoJy4O'; // Demo123!
    
    await pool.query(`
      INSERT INTO users (email, password, "firstName", "lastName", role, "isVerified")
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO UPDATE SET
        password = EXCLUDED.password,
        "updatedAt" = NOW()
      RETURNING id, email, "firstName", "lastName"
    `, ['demo@giftai.com', hashedPassword, 'Demo', 'User', 'user', true]);
    
    console.log('✅ Demo user created: demo@giftai.com / Demo123!');
    console.log('🎉 Database setup complete! Your authentication system now has persistent storage.');
    
  } catch (error) {
    console.error('❌ Database setup error:', error.message);
  } finally {
    await pool.end();
  }
}

setupDatabase();