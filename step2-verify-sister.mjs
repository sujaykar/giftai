// Step 2: Verify sister account and add recipient
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

console.log('STEP 2: Verify Sister Account & Add Recipient');
console.log('==============================================');

const sisterEmail = 'sister.demo.1748453564213@giftai.com';
const verificationCode = '199265';

try {
  // Verify email
  console.log('1. Verifying email address...');
  await axios.post(`${BASE_URL}/api/auth/verify`, {
    email: sisterEmail,
    code: verificationCode
  });
  console.log('✅ Email verified successfully');

  // Login
  console.log('2. Logging in...');
  const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
    email: sisterEmail,
    password: 'TestPassword123!'
  }, { withCredentials: true });
  
  const cookies = loginResponse.headers['set-cookie'];
  console.log('✅ Logged in successfully');

  // Add sister recipient
  console.log('3. Adding sister recipient...');
  const recipientResponse = await axios.post(`${BASE_URL}/api/recipients`, {
    name: 'Emma',
    relationship: 'sister',
    ageRange: '25-34',
    notes: 'Art lover, yoga enthusiast, coffee addict. Loves indie music and vintage clothing. Creative soul who enjoys handmade crafts and DIY projects.'
  }, {
    headers: { Cookie: cookies?.join('; ') || '' }
  });
  
  console.log('✅ Sister recipient created successfully');
  console.log(`👩 Name: ${recipientResponse.data.name}`);
  console.log(`💕 Relationship: ${recipientResponse.data.relationship}`);
  console.log(`📝 Notes: ${recipientResponse.data.notes}`);
  
  console.log('\n🎯 Sister account ready for recommendations!');
  console.log(`📊 Recipient ID: ${recipientResponse.data.id}`);
  
} catch (error) {
  console.error('❌ Error:', error.response?.data || error.message);
}