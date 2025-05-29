import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function setupDatabase() {
  try {
    const client = await pool.connect();
    
    // Create the giftai database if it doesn't exist
    try {
      await client.query('CREATE DATABASE giftai');
      console.log('✅ Database "giftai" created successfully');
    } catch (error) {
      if (error.code === '42P04') {
        console.log('✅ Database "giftai" already exists');
      } else {
        throw error;
      }
    }
    
    client.release();
    await pool.end();
    
    console.log('✅ Database setup complete');
    
  } catch (error) {
    console.log('❌ Database setup failed:', error.message);
    await pool.end();
  }
}

setupDatabase();