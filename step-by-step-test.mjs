// Step-by-step recommendation system test
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

console.log('🎁 Step-by-Step AI Recommendation System Test\n');

// Step 1: Create Sister Test Account
console.log('STEP 1: Creating Sister Test Account');
console.log('=====================================');

const sisterEmail = `sister.demo.${Date.now()}@giftai.com`;

try {
  const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
    firstName: 'Demo',
    lastName: 'Sister',
    email: sisterEmail,
    password: 'TestPassword123!'
  });
  
  console.log('✅ Sister test account created successfully');
  console.log(`📧 Email: ${sisterEmail}`);
  console.log('⏳ Check console logs for verification code...');
  console.log('\nNext: Use verification code to complete account setup');
  
} catch (error) {
  console.error('❌ Error creating sister account:', error.response?.data || error.message);
}