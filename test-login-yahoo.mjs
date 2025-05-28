// Test login for the Yahoo account we just created
import axios from 'axios';

async function testYahooAccountLogin() {
  console.log('🔐 Testing login for sujay_kar@yahoo.com...\n');
  
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'sujay_kar@yahoo.com',
      password: 'Sikandar123%'
    }, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Login successful!');
    console.log('Status:', response.status);
    console.log('Response:', response.data);
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Login failed');
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
      
      if (error.response.status === 401) {
        console.log('\n💡 This means either:');
        console.log('- The password is incorrect');
        console.log('- The email encryption is causing issues');
        console.log('- The account verification didn\'t complete properly');
      }
    } else {
      console.log('❌ Network error:', error.message);
    }
  }
}

testYahooAccountLogin();