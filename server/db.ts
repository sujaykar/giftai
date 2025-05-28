import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Temporarily disable database connection for memory storage testing
console.log('Database connection disabled - using memory storage');

// Mock exports to prevent import errors
export const pool = null;
export const db = null;
