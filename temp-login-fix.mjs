// Temporary login solution for karsujay@gmail.com
import axios from 'axios';

async function createTempLoginSolution() {
  console.log('🚀 Creating temporary login solution for your GIFT AI account...\n');
  
  // Test direct login endpoint
  try {
    console.log('Testing login endpoint...');
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'karsujay@gmail.com',
      password: 'Sikandar123%'
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true,
      validateStatus: () => true
    });
    
    console.log('Status:', response.status);
    console.log('Headers:', Object.keys(response.headers));
    
    if (response.status === 401) {
      console.log('\n💡 The login route is working but authentication is failing.');
      console.log('Since your account exists and password reset emails work,');
      console.log('let\'s use the working password reset system to get you logged in.');
      
      console.log('\n✅ RECOMMENDED SOLUTION:');
      console.log('1. Use the password reset email you received');
      console.log('2. Set a simple new password like "NewPass123!"');
      console.log('3. Log in with the new password');
      console.log('\nThis bypasses the current authentication issue completely.');
    }
    
  } catch (error) {
    console.log('Network error:', error.message);
  }
}

createTempLoginSolution();