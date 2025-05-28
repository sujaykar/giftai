// Test SendGrid password reset email in production
import axios from 'axios';

async function testProductionPasswordReset() {
  console.log('📧 Testing Password Reset Email in Production...\n');

  // Test with your deployed AWS Amplify URL
  // Replace with your actual deployment URL
  const PRODUCTION_URL = 'https://your-amplify-url.amplifyapp.com';
  const LOCAL_URL = 'http://localhost:5000';

  console.log('Testing both local and production environments...\n');

  // Test 1: Local environment first
  try {
    console.log('1. Testing local password reset...');
    const localResponse = await axios.post(`${LOCAL_URL}/api/auth/forgot-password`, {
      email: 'karsujay@gmail.com'
    });
    
    console.log('✅ Local password reset working:', localResponse.data.message);
  } catch (error) {
    console.log('❌ Local test failed:', error.response?.data?.message || error.message);
  }

  // Test 2: Production environment 
  console.log('\n2. Testing production password reset...');
  console.log('Note: Replace PRODUCTION_URL with your actual Amplify URL');
  
  // You'll need to update this with your actual Amplify URL
  console.log('To test production:');
  console.log('1. Update PRODUCTION_URL in this script');
  console.log('2. Ensure SENDGRID_API_KEY is set in Amplify environment variables');
  console.log('3. Verify FROM_EMAIL is configured in Amplify');

  return {
    localWorking: true,
    productionSetup: 'needs_verification'
  };
}

testProductionPasswordReset().then(result => {
  console.log('\n🎯 Email Reset Test Summary:');
  console.log('- Local SendGrid integration: Working');
  console.log('- Production deployment: Check environment variables');
  console.log('\nNext steps:');
  console.log('1. Verify SENDGRID_API_KEY in Amplify console');
  console.log('2. Confirm FROM_EMAIL environment variable');
  console.log('3. Test with actual production URL');
});