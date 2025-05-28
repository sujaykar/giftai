// Test emergency login for karsujay@karinfinity.com
import axios from 'axios';

async function testEmergencyLogin() {
  console.log('🚨 Testing Emergency Login for GIFT AI Platform\n');
  
  try {
    console.log('Testing emergency login endpoint...');
    
    const response = await axios.post('http://localhost:5000/api/auth/emergency-login', {
      email: 'karsujay@karinfinity.com',
      password: 'Test123!'  // Common test password
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
      validateStatus: () => true
    });
    
    console.log('Status:', response.status);
    console.log('Response:', response.data);
    
    if (response.status === 200) {
      console.log('\n✅ EMERGENCY LOGIN SUCCESSFUL!');
      console.log('Your GIFT AI account is working correctly.');
      console.log('You can now log in through the emergency endpoint.');
    } else if (response.status === 401) {
      console.log('\n⚠️ Account found but password incorrect');
      console.log('Try with different password variations');
    } else {
      console.log('\n❌ Unexpected response');
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testEmergencyLogin();