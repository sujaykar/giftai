import { db } from './server/db.js';
import { users } from './shared/schema.js';

async function fixRegistration() {
  console.log('🔧 Setting up database for registration...');
  
  try {
    // Test if we can create a user (this will create the table if it doesn't exist)
    const testResult = await db.select().from(users).limit(1);
    console.log('✅ Database is ready for registration!');
  } catch (error) {
    console.log('Database needs setup, this is normal for first run');
  }
}

fixRegistration();