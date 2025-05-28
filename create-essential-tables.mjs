import { db } from './server/db.js';
import { sql } from 'drizzle-orm';

async function createEssentialTables() {
  console.log('🚀 Creating essential database tables...');
  
  try {
    // Create users table - the core table needed for registration
    await db.execute(sql`
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
    
    console.log('✅ Users table created successfully!');
    console.log('🎉 Registration should now work properly!');
    
  } catch (error) {
    console.log('❌ Error creating tables:', error.message);
  } finally {
    process.exit(0);
  }
}

createEssentialTables();