// Debug authentication issue for karsujay@gmail.com
import { storage } from './server/storage.js';

async function debugUserAccount() {
  console.log('🔍 Debugging authentication issue for karsujay@gmail.com\n');
  
  try {
    // Check if user exists with plain email
    console.log('1. Checking with plain email...');
    const plainUser = await storage.getUserByEmail('karsujay@gmail.com');
    console.log('Plain email result:', plainUser ? 'FOUND' : 'NOT FOUND');
    
    if (plainUser) {
      console.log('✅ User found with plain email!');
      console.log('User ID:', plainUser.id);
      console.log('Email stored as:', plainUser.email);
      console.log('Is verified:', plainUser.isVerified);
      console.log('Has password:', !!plainUser.password);
      
      // Test password verification
      if (plainUser.password) {
        const bcrypt = await import('bcrypt');
        const passwordMatch = await bcrypt.compare('Sikandar123%', plainUser.password);
        console.log('Password matches:', passwordMatch);
      }
    } else {
      console.log('❌ User not found with plain email');
      
      // Try to find user by any means
      console.log('\n2. Searching all users for similar emails...');
      // Since we can't easily iterate MemStorage, let's check if the issue is encryption
      
      const { encryptData } = await import('./server/utils/auth.js');
      try {
        const encryptedEmail = encryptData('karsujay@gmail.com');
        console.log('3. Checking with encrypted email...');
        console.log('Encrypted email:', encryptedEmail);
        
        const encryptedUser = await storage.getUserByEmail(encryptedEmail);
        console.log('Encrypted email result:', encryptedUser ? 'FOUND' : 'NOT FOUND');
        
        if (encryptedUser) {
          console.log('✅ User found with encrypted email!');
          console.log('User ID:', encryptedUser.id);
          console.log('Email stored as:', encryptedUser.email);
        }
      } catch (encryptError) {
        console.log('❌ Encryption test failed:', encryptError.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Debug error:', error);
  }
}

debugUserAccount();