// Create demo users to test recommendation system
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function createDemoUsers() {
  console.log('🎁 Creating demo users for recommendation testing...\n');

  try {
    // Create Demo User 1 - Test Sister Relationship
    console.log('1. Creating demo user for sister relationship test...');
    const userResponse = await axios.post(`${BASE_URL}/api/auth/register`, {
      firstName: 'Demo',
      lastName: 'Sister',
      email: `demo.sister.${Date.now()}@giftai.com`,
      password: 'TestPassword123!'
    });
    
    console.log('✓ Demo user created successfully');
    
    // Login to get session
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: userResponse.data.user.email,
      password: 'TestPassword123!'
    }, { 
      withCredentials: true,
      maxRedirects: 0,
      validateStatus: () => true
    });
    
    const sessionCookies = loginResponse.headers['set-cookie'];
    console.log('✓ User logged in successfully');

    // Create Sister Recipient (Casual)
    console.log('2. Creating sister recipient (casual relationship)...');
    const sisterResponse = await axios.post(`${BASE_URL}/api/recipients`, {
      name: 'Emma',
      relationship: 'sister', 
      age: 25,
      gender: 'female',
      notes: 'Art lover, yoga enthusiast, coffee addict. Loves indie music and vintage clothing. Creative soul who enjoys handmade crafts.'
    }, {
      headers: { 
        Cookie: sessionCookies?.join('; ') || '',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✓ Sister recipient created');

    // Create Demo User 2 - Test Colleague Relationship  
    console.log('3. Creating demo user for colleague relationship test...');
    const userResponse2 = await axios.post(`${BASE_URL}/api/auth/register`, {
      firstName: 'Demo',
      lastName: 'Colleague', 
      email: `demo.colleague.${Date.now()}@giftai.com`,
      password: 'TestPassword123!'
    });
    
    const loginResponse2 = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: userResponse2.data.user.email,
      password: 'TestPassword123!'
    }, { 
      withCredentials: true,
      maxRedirects: 0,
      validateStatus: () => true
    });
    
    const sessionCookies2 = loginResponse2.headers['set-cookie'];

    // Create Colleague Recipient (Formal)
    console.log('4. Creating colleague recipient (formal relationship)...');
    const colleagueResponse = await axios.post(`${BASE_URL}/api/recipients`, {
      name: 'Michael',
      relationship: 'colleague',
      age: 35, 
      gender: 'male',
      notes: 'Professional colleague, enjoys reading business books and leadership content. Recently promoted to manager. Appreciates quality and sophistication.'
    }, {
      headers: { 
        Cookie: sessionCookies2?.join('; ') || '',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✓ Colleague recipient created');

    console.log('\n🎯 Demo users created successfully!');
    console.log('\nTest Scenarios Ready:');
    console.log(`📧 Sister Test Account: ${userResponse.data.user.email}`);
    console.log(`👩 Sister: Emma (art lover, yoga enthusiast, indie music)`);
    console.log(`📧 Colleague Test Account: ${userResponse2.data.user.email}`);
    console.log(`👨 Colleague: Michael (business books, leadership, recently promoted)`);
    
    return {
      success: true,
      sisterAccount: {
        email: userResponse.data.user.email,
        recipientId: sisterResponse.data.id,
        cookies: sessionCookies
      },
      colleagueAccount: {
        email: userResponse2.data.user.email, 
        recipientId: colleagueResponse.data.id,
        cookies: sessionCookies2
      }
    };

  } catch (error) {
    console.error('❌ Error creating demo users:', error.response?.data || error.message);
    return { success: false, error: error.message };
  }
}

// Run the demo user creation
createDemoUsers().then(result => {
  if (result.success) {
    console.log('\n✅ Ready to test AI recommendations!');
    console.log('Next: Generate recommendations to see accuracy differences');
  } else {
    console.log('\n⚠️ Setup failed:', result.error);
  }
});