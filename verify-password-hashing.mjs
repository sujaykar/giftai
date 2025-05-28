// Verify password hashing consistency for karsujay@gmail.com
import { hashPassword, comparePassword } from './server/utils/password-utils.js';

async function verifyPasswordHashing() {
  console.log('🔍 Verifying password hashing for karsujay@gmail.com...\n');
  
  const testPassword = 'Sikandar123%';
  
  try {
    // Test 1: Hash the password (simulate sign-up process)
    console.log('1. Testing password hashing (sign-up simulation)...');
    const hashedPassword = await hashPassword(testPassword);
    console.log('✅ Password hashed successfully');
    console.log('Hash format:', hashedPassword.substring(0, 50) + '...');
    
    // Test 2: Verify the password (simulate sign-in process)
    console.log('\n2. Testing password verification (sign-in simulation)...');
    const isMatch = await comparePassword(testPassword, hashedPassword);
    console.log('Password verification result:', isMatch ? '✅ Match' : '❌ No match');
    
    // Test 3: Test with wrong password
    console.log('\n3. Testing with wrong password...');
    const wrongMatch = await comparePassword('WrongPassword123!', hashedPassword);
    console.log('Wrong password result:', wrongMatch ? '❌ Incorrectly matched' : '✅ Correctly rejected');
    
    // Test 4: Test edge cases
    console.log('\n4. Testing special characters in password...');
    const specialPassword = 'Test@123#$%';
    const specialHashed = await hashPassword(specialPassword);
    const specialMatch = await comparePassword(specialPassword, specialHashed);
    console.log('Special characters test:', specialMatch ? '✅ Works' : '❌ Failed');
    
    console.log('\n🎯 Password Hashing Analysis:');
    if (isMatch && !wrongMatch && specialMatch) {
      console.log('✅ Password hashing system is working correctly!');
      console.log('The login issue must be elsewhere in the authentication flow.');
    } else {
      console.log('❌ Password hashing system has issues');
    }
    
  } catch (error) {
    console.error('❌ Error during password verification:', error.message);
  }
}

verifyPasswordHashing();