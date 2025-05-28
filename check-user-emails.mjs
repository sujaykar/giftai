// Check what user emails exist in the system
import { storage } from './server/storage.js';

console.log('🔍 Checking registered user emails in your GIFT AI system...\n');

try {
  // Check for test emails
  const testEmails = [
    'karsujay@gmail.com',
    'sujay_kar@yahoo.com',
    'karsujay@karinfinity.com'
  ];
  
  console.log('Testing these email addresses:');
  
  for (const email of testEmails) {
    try {
      const user = await storage.getUserByEmail(email);
      if (user) {
        console.log(`✅ ${email} - User exists (ID: ${user.id})`);
      } else {
        console.log(`❌ ${email} - No account found`);
      }
    } catch (error) {
      console.log(`❌ ${email} - Error checking: ${error.message}`);
    }
  }
  
  console.log('\n💡 Only emails with existing accounts will receive password reset emails.');
  console.log('This is correct security behavior to prevent email enumeration attacks.');
  
} catch (error) {
  console.error('Error:', error.message);
}