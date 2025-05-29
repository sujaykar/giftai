// Create demo users in PostgreSQL database
import pkg from 'pg';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function createDemoUsers() {
  try {
    console.log('Creating demo users...');

    // Demo user
    const demoPassword = await bcrypt.hash('Demo2024!', 10);
    await pool.query(`
      INSERT INTO users (uuid, email, password, first_name, last_name, role, is_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (email) DO NOTHING
    `, [uuidv4(), 'demo@giftai.com', demoPassword, 'Demo', 'User', 'user', true]);

    // Admin user
    const adminPassword = await bcrypt.hash('TempAccess2024!', 10);
    await pool.query(`
      INSERT INTO users (uuid, email, password, first_name, last_name, role, is_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (email) DO NOTHING
    `, [uuidv4(), 'karsujay@karinfinity.com', adminPassword, 'Kar', 'Sujay', 'admin', true]);

    console.log('✅ Demo users created successfully!');

    // Verify users were created
    const result = await pool.query('SELECT id, email, first_name, last_name, role FROM users ORDER BY id');
    console.log('\nUsers in database:');
    result.rows.forEach(user => {
      console.log(`- ${user.email} (${user.first_name} ${user.last_name}) - ${user.role}`);
    });

  } catch (error) {
    console.error('❌ Error creating demo users:', error.message);
  } finally {
    await pool.end();
  }
}

createDemoUsers();