// Check all user emails to find karsujay@gmail.com account
import { storage } from './server/storage.js';

async function findUserAccount() {
  console.log('🔍 Searching for karsujay@gmail.com account in the system...\n');
  
  try {
    // Since we know password reset works, the account exists
    // Let's check if it might be stored with a different format
    
    const testEmails = [
      'karsujay@gmail.com',
      'KARSUJAY@GMAIL.COM',
      'karsujay@GMAIL.COM',
      ' karsujay@gmail.com ',
      'karsujay@gmail.com '.trim()
    ];
    
    for (const testEmail of testEmails) {
      console.log(`Testing email: "${testEmail}"`);
      try {
        const user = await storage.getUserByEmail(testEmail);
        if (user) {
          console.log('✅ FOUND USER!');
          console.log('- Stored email:', `"${user.email}"`);
          console.log('- User ID:', user.id);
          console.log('- Verified:', user.isVerified);
          console.log('- Has password:', !!user.password);
          return;
        }
      } catch (e) {
        console.log('  ❌ Not found');
      }
    }
    
    // Try encrypted versions
    console.log('\n🔐 Trying encrypted email formats...');
    const { encryptData } = await import('./server/utils/auth.js');
    
    for (const testEmail of testEmails) {
      try {
        const encrypted = encryptData(testEmail);
        console.log(`Testing encrypted: "${testEmail}" -> "${encrypted}"`);
        const user = await storage.getUserByEmail(encrypted);
        if (user) {
          console.log('✅ FOUND USER WITH ENCRYPTED EMAIL!');
          console.log('- Stored email:', `"${user.email}"`);
          console.log('- User ID:', user.id);
          return;
        }
      } catch (e) {
        console.log('  ❌ Encrypted not found');
      }
    }
    
    console.log('\n❌ Account not found with any email format');
    console.log('💡 This suggests a registration issue or the account needs to be recreated');
    
  } catch (error) {
    console.error('Error during search:', error);
  }
}

findUserAccount();