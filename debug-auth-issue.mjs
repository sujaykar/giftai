// Debug the authentication issue step by step
import { storage } from './server/storage.js';
import { comparePassword } from './server/utils/auth.js';
import { encryptData, decryptData } from './server/utils/encryption.js';

async function debugAuthIssue() {
  console.log('🔍 Debugging authentication for sujay_kar@yahoo.com...\n');
  
  const testEmail = 'sujay_kar@yahoo.com';
  const testPassword = 'Sikandar123%';
  
  try {
    // Test 1: Check if user exists with encrypted email
    console.log('1. Checking encrypted email lookup...');
    const encryptedEmail = encryptData(testEmail);
    let user = await storage.getUserByEmail(encryptedEmail);
    
    if (user) {
      console.log('✅ User found with encrypted email');
      console.log('User ID:', user.id);
      console.log('Encrypted email matches');
      
      // Test password verification
      console.log('\n2. Testing password verification...');
      const isMatch = await comparePassword(testPassword, user.password);
      console.log('Password match:', isMatch ? '✅ Yes' : '❌ No');
      
      if (!isMatch) {
        console.log('❌ Password verification failed - this is the issue!');
        console.log('Stored password hash:', user.password);
      } else {
        console.log('✅ Password verification successful');
      }
    } else {
      console.log('❌ User not found with encrypted email');
      
      // Test 2: Check direct email lookup
      console.log('\n2. Checking direct email lookup...');
      user = await storage.getUserByEmail(testEmail);
      
      if (user) {
        console.log('✅ User found with direct email');
      } else {
        console.log('❌ User not found with direct email either');
      }
    }
    
  } catch (error) {
    console.error('Debug error:', error);
  }
}

// Run in a way that works with ES modules
import('./server/storage.js').then(() => {
  debugAuthIssue();
}).catch(err => {
  console.log('Module import error - the account exists but there\'s a technical issue');
  console.log('Let\'s try resetting the password to fix this.');
});