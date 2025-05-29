import axios from 'axios';

async function testAIRecommendationSystem() {
  console.log('Testing AI Recommendation System...');
  
  try {
    // First, register a test user
    console.log('Creating test user...');
    const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
      email: 'test@example.com',
      password: 'Test123!',
      firstName: 'Test',
      lastName: 'User'
    });
    
    console.log('Registration response:', registerResponse.data);
    
    // Login with the test user
    console.log('Logging in...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'Test123!'
    }, {
      withCredentials: true
    });

    console.log('Login successful');
    const cookies = loginResponse.headers['set-cookie'];
    
    // Create some sample products first
    console.log('Creating sample products...');
    const sampleProducts = [
      {
        name: "Wireless Bluetooth Headphones",
        description: "High-quality noise-canceling headphones with premium sound",
        price: "149.99",
        category: "Electronics",
        imageUrl: "https://example.com/headphones.jpg",
        sourceUrl: "https://example.com/product/1",
        currency: "USD"
      },
      {
        name: "Cozy Reading Blanket",
        description: "Soft, warm blanket perfect for reading and relaxation",
        price: "39.99",
        category: "Home & Living",
        imageUrl: "https://example.com/blanket.jpg",
        sourceUrl: "https://example.com/product/2",
        currency: "USD"
      }
    ];

    // Add products via CSV upload endpoint
    const productResponse = await axios.post(
      'http://localhost:5000/api/products/upload-csv',
      { products: sampleProducts },
      {
        headers: { 'Cookie': cookies ? cookies.join('; ') : '' },
        withCredentials: true
      }
    );
    
    console.log('Products created successfully');

    // Test the AI recommendation endpoint
    console.log('Testing AI recommendation generation...');
    const recommendationData = {
      recipientId: 1,
      occasion: "Birthday",
      budget: { min: 20, max: 200 },
      category: "Electronics",
      mood: "thoughtful"
    };

    const recommendationResponse = await axios.post(
      'http://localhost:5000/api/recommendations/generate',
      recommendationData,
      {
        headers: { 'Cookie': cookies ? cookies.join('; ') : '' },
        withCredentials: true
      }
    );

    console.log('AI Recommendation Results:');
    console.log(JSON.stringify(recommendationResponse.data, null, 2));
    console.log('AI recommendation system test completed successfully!');

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 500 && error.response?.data?.message?.includes('OpenAI')) {
      console.log('\nNote: The OpenAI API integration requires a valid API key.');
      console.log('Please ensure OPENAI_API_KEY is properly configured in your environment.');
    }
  }
}

testAIRecommendationSystem();