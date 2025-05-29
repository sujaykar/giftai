// Simple test to verify OpenAI recommendation API endpoint
import axios from 'axios';

async function testRecommendationAPI() {
  console.log('Testing OpenAI-powered recommendation API...');
  
  try {
    // First login to get session
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'demo@giftai.com',
      password: 'Demo2024!'
    }, {
      withCredentials: true
    });

    console.log('✅ Login successful');
    
    // Get session cookies for authenticated requests
    const cookies = loginResponse.headers['set-cookie'];
    
    // Test the recommendation endpoint
    const recommendationData = {
      recipientId: 1, // Using test recipient ID
      occasion: "Birthday",
      budget: { min: 20, max: 200 },
      category: "Electronics",
      mood: "thoughtful"
    };

    const recommendationResponse = await axios.post(
      'http://localhost:5000/api/recommendations/generate',
      recommendationData,
      {
        headers: {
          'Cookie': cookies ? cookies.join('; ') : ''
        },
        withCredentials: true
      }
    );

    console.log('✅ Recommendation API Response:');
    console.log(JSON.stringify(recommendationResponse.data, null, 2));

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testRecommendationAPI();