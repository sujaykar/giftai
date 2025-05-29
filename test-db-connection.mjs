// Test PostgreSQL connection with detailed error reporting
import pkg from 'pg';
const { Pool } = pkg;

console.log('Testing PostgreSQL connection to AWS RDS...\n');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    console.log('Attempting connection...');
    const client = await pool.connect();
    console.log('✅ Connection successful!');
    
    const result = await client.query('SELECT version()');
    console.log('Database version:', result.rows[0].version);
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.log('❌ Connection failed:');
    console.log('Error code:', error.code);
    console.log('Error message:', error.message);
    console.log('Error details:', error.detail || 'None');
    
    if (error.code === '28000') {
      console.log('\n🔍 Diagnosis: Authentication failure');
      console.log('Possible causes:');
      console.log('1. Incorrect username or password in DATABASE_URL');
      console.log('2. Database name does not exist');
      console.log('3. SSL/TLS configuration mismatch');
      console.log('4. pg_hba.conf restrictions on the server');
    }
    
    await pool.end();
  }
}

testConnection();