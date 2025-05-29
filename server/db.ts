import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Use Replit's local PostgreSQL database
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found. Please set DATABASE_URL environment variable');
  throw new Error('Database configuration missing');
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: false // Replit doesn't require SSL for local DB
});

export const db = drizzle(pool, { schema });

console.log('✅ Database connection configured for Replit PostgreSQL');
