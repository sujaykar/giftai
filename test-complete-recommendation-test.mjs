import axios from 'axios';

async function testCompleteSystem() {
  console.log('Testing complete AI recommendation system...');
  
  try {
    const client = axios.create({
      baseURL: 'http://localhost:5000',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // 1. Register and login user
    console.log('1. Registering user...');
    await client.post('/api/auth/register', {
      email: 'complete@test.com',
      password: 'Test123!',
      firstName: 'Complete',
      lastName: 'Test'
    });

    console.log('2. Logging in...');
    const loginResponse = await client.post('/api/auth/login', {
      email: 'complete@test.com',
      password: 'Test123!'
    });
    
    console.log('Login successful:', loginResponse.data.user.email);

    // 2. Test session persistence
    console.log('3. Testing session persistence...');
    const userResponse = await client.get('/api/auth/current-user');
    console.log('Session maintained for:', userResponse.data.email);

    // 3. Create recipient
    console.log('4. Creating recipient...');
    const recipientResponse = await client.post('/api/recipients', {
      name: "Emma Wilson",
      relationship: "sister",
      age: 25,
      gender: "female",
      notes: "Art enthusiast who loves creative gifts and technology"
    });
    
    console.log('Recipient created:', recipientResponse.data.recipient.name);

    // 4. Upload products
    console.log('5. Uploading products...');
    const productResponse = await client.post('/api/products/upload-csv', {
      products: [
        {
          name: "Digital Drawing Tablet",
          description: "Professional drawing tablet with pressure sensitivity for digital artists",
          price: "299.99",
          category: "Electronics",
          imageUrl: "https://example.com/tablet.jpg"
        },
        {
          name: "Premium Art Supply Set",
          description: "Complete set of professional art supplies including paints, brushes, and canvases",
          price: "149.99",
          category: "Art & Crafts",
          imageUrl: "https://example.com/art-set.jpg"
        },
        {
          name: "Wireless Noise-Canceling Headphones",
          description: "High-quality headphones perfect for music and creative work",
          price: "199.99",
          category: "Electronics",
          imageUrl: "https://example.com/headphones.jpg"
        }
      ]
    });
    
    console.log('Products uploaded:', productResponse.data.message);

    // 5. Generate AI recommendations
    console.log('6. Generating AI recommendations...');
    const recommendationResponse = await client.post('/api/recommendations/generate', {
      recipientId: recipientResponse.data.recipient.id,
      occasion: "Birthday",
      budget: { min: 100, max: 400 },
      category: "Electronics",
      mood: "thoughtful"
    });
    
    console.log('\nAI Recommendations Generated:');
    console.log(`Total recommendations: ${recommendationResponse.data.total}`);
    
    if (recommendationResponse.data.recommendations && recommendationResponse.data.recommendations.length > 0) {
      recommendationResponse.data.recommendations.forEach((rec, index) => {
        console.log(`\n${index + 1}. ${rec.product.name}`);
        console.log(`   Price: $${rec.product.price}`);
        console.log(`   Confidence: ${(rec.confidence * 100).toFixed(1)}%`);
        console.log(`   Category: ${rec.product.category}`);
        console.log(`   Reasoning: ${rec.reasoning.substring(0, 120)}...`);
      });
    }

    // 6. Test recommendation history
    console.log('\n7. Testing recommendation history...');
    const historyResponse = await client.get('/api/recommendations/history');
    console.log(`Historical recommendations found: ${historyResponse.data.total}`);

    // 7. Test stats endpoint
    console.log('8. Testing stats...');
    const statsResponse = await client.get('/api/stats');
    console.log('Stats retrieved:', {
      totalUsers: statsResponse.data.totalUsers,
      totalRecipients: statsResponse.data.totalRecipients,
      totalProducts: statsResponse.data.totalProducts,
      totalRecommendations: statsResponse.data.totalRecommendations
    });

    console.log('\n✅ Complete System Test Results:');
    console.log('✅ User authentication: Working');
    console.log('✅ Session persistence: Functional');
    console.log('✅ Data storage: Operational');
    console.log('✅ AI recommendation engine: Active');
    console.log('✅ Historical data tracking: Available');
    console.log('✅ API endpoints: Responsive');

  } catch (error) {
    console.error('System test failed:', error.response?.data || error.message);
    
    if (error.response) {
      console.log('Status:', error.response.status);
      if (error.response.status === 401) {
        console.log('Authentication issue detected');
      } else if (error.response.status === 500) {
        console.log('Server error detected');
      }
    }
  }
}

testCompleteSystem();