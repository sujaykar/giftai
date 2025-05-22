const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/neon-serverless');
const { migrate } = require('drizzle-orm/neon-serverless/migrator');
const schema = require('../../shared/schema');

async function runMigration() {
  // Check for database URL
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  console.log('Connecting to database...');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    const db = drizzle(pool, { schema });
    
    console.log('Starting database migration...');
    
    // Create tables based on schema
    await migrate(db, { migrationsFolder: './drizzle' });
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigration().catch(console.error);