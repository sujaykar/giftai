// Complete recommendation system test
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function completeRecommendationTest() {
  console.log('🎁 Complete AI Recommendation System Test...\n');

  try {
    // Step 1: Verify and login sister test account
    console.log('1. Verifying sister test account...');
    const sisterEmail = 'sister.test.1748453399820@giftai.com';
    
    await axios.post(`${BASE_URL}/api/auth/verify`, {
      email: sisterEmail,
      code: '386823'
    });
    console.log('✓ Sister account verified');

    const sisterLogin = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: sisterEmail,
      password: 'TestPassword123!'
    }, { withCredentials: true });
    
    const sisterCookies = sisterLogin.headers['set-cookie'];
    console.log('✓ Sister account logged in');

    // Step 2: Create sister recipient
    console.log('2. Adding sister recipient...');
    const sisterRecipient = await axios.post(`${BASE_URL}/api/recipients`, {
      name: 'Emma',
      relationship: 'sister',
      ageRange: '25-34',
      notes: 'Art lover, yoga enthusiast, coffee addict. Loves indie music and vintage clothing. Creative soul who enjoys handmade crafts.'
    }, {
      headers: { Cookie: sisterCookies?.join('; ') || '' }
    });
    
    console.log('✓ Sister recipient created: Emma (sister)');

    // Step 3: Create colleague test account
    console.log('3. Creating colleague test account...');
    const colleagueEmail = `colleague.test.${Date.now()}@giftai.com`;
    
    await axios.post(`${BASE_URL}/api/auth/register`, {
      firstName: 'Test',
      lastName: 'Colleague',
      email: colleagueEmail,
      password: 'TestPassword123!'
    });
    
    console.log('✓ Colleague account registered');
    console.log('⏳ Waiting for verification code...');

    // Wait a moment for verification code to appear in logs
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      sisterAccount: { email: sisterEmail, recipientId: sisterRecipient.data.id, cookies: sisterCookies },
      colleagueEmail: colleagueEmail,
      nextStep: 'verify_colleague_and_test_recommendations'
    };

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
}

completeRecommendationTest().then(result => {
  if (result.success) {
    console.log('\n🎯 Test setup progressing...');
    console.log('✅ Sister account ready with recipient');
    console.log('⏳ Colleague account created, check logs for verification code');
  }
});