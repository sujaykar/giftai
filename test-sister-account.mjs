// Test sister relationship recommendations
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function testSisterRecommendations() {
  console.log('🎁 Testing Sister Relationship Recommendations...\n');

  try {
    // Step 1: Register test user
    console.log('1. Creating test account for sister relationship...');
    const email = `sister.test.${Date.now()}@giftai.com`;
    
    const registerResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
      firstName: 'Test',
      lastName: 'Sister',
      email: email,
      password: 'TestPassword123!'
    });
    
    console.log('✓ User registered successfully');
    console.log(`📧 Email: ${email}`);
    
    // Extract verification code from console logs (we saw it in the logs)
    console.log('⏳ Need to verify email before testing recommendations...');
    console.log('📝 Check console logs for verification code');
    
    return {
      success: true,
      email: email,
      message: 'User created - needs email verification'
    };

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
}

testSisterRecommendations().then(result => {
  if (result.success) {
    console.log('\n✅ Sister test account ready!');
    console.log('Next: Verify email and add sister recipient');
  }
});