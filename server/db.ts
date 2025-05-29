import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Use Replit's PostgreSQL database (compatible with AWS deployment)
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found. Please set DATABASE_URL environment variable');
  throw new Error('Database configuration missing');
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : true
});

export const db = drizzle(pool, { schema });

console.log('✅ Database connection configured for PostgreSQL (Replit/AWS compatible)');
