// Test the actual app's forgot password functionality
import axios from 'axios';

async function testAppForgotPassword() {
  console.log('🔍 Testing your GIFT AI app\'s forgot password feature...\n');
  
  try {
    console.log('Testing forgot password for sujay_kar@yahoo.com...');
    
    const response = await axios.post('http://localhost:5000/api/auth/forgot-password', {
      email: 'sujay_kar@yahoo.com'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      validateStatus: () => true // Don't throw on any status
    });
    
    console.log('Status:', response.status);
    console.log('Response:', response.data);
    
    if (response.status === 200) {
      console.log('\n✅ The forgot password endpoint is working correctly!');
      console.log('📧 The system should have attempted to send an email');
      
      // Check if this is the same response we get for non-existent emails
      console.log('\n🔍 Testing with a non-existent email to compare...');
      const testResponse = await axios.post('http://localhost:5000/api/auth/forgot-password', {
        email: 'nonexistent@test.com'
      }, {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: () => true
      });
      
      console.log('Non-existent email response:', testResponse.data);
      
      if (response.data.message === testResponse.data.message) {
        console.log('\n❌ Your Yahoo account might not be found in the system');
        console.log('This suggests an email encryption mismatch issue');
      } else {
        console.log('\n✅ Your account was found and email should have been sent!');
      }
    }
    
  } catch (error) {
    console.log('❌ Error testing forgot password:', error.message);
  }
}

testAppForgotPassword();