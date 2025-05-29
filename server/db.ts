import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// AWS PostgreSQL connection
const connectionString = process.env.DATABASE_URL || 
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@gift-ai-db.ctaas0sswh6h.us-east-1.rds.amazonaws.com:5432/${process.env.DB_NAME}`;

if (!process.env.DATABASE_URL && (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME)) {
  console.error('❌ Database credentials not found. Please set DATABASE_URL or DB_USER, DB_PASSWORD, DB_NAME environment variables');
  throw new Error('Database configuration missing');
}

export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false // Required for AWS RDS
  }
});

export const db = drizzle(pool, { schema });

console.log('✅ Database connection configured for AWS PostgreSQL');
