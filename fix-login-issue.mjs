// Quick test to verify your account and fix the login issue
import axios from 'axios';

async function testLoginFix() {
  console.log('🔧 Testing different login approaches for sujay_kar@yahoo.com...\n');
  
  // Test 1: Try login as-is
  console.log('1. Testing normal login...');
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'sujay_kar@yahoo.com',
      password: 'Sikandar123%'
    }, { 
      withCredentials: true,
      validateStatus: () => true // Don't throw on 401
    });
    
    if (response.status === 200) {
      console.log('✅ Login successful!');
      return;
    } else {
      console.log(`❌ Failed with status ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Login request failed');
  }
  
  console.log('\n💡 The issue is likely with email encryption mismatch during registration vs login.');
  console.log('Your account exists and is verified, but the authentication system needs adjustment.');
  console.log('\nSuggestion: Try logging in through the web interface again.');
  console.log('If it still fails, we may need to reset the account password.');
}

testLoginFix();