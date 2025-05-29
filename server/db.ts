import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// AWS PostgreSQL connection
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found. Please set DATABASE_URL environment variable');
  throw new Error('Database configuration missing');
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

console.log('✅ Database connection configured for AWS PostgreSQL');
