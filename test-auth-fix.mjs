import axios from 'axios';

async function testAuthenticationFix() {
  console.log('Testing authentication fix...');
  
  try {
    // Create axios instance with proper session handling
    const client = axios.create({
      baseURL: 'http://localhost:5000',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Register user
    console.log('1. Registering user...');
    await client.post('/api/auth/register', {
      email: 'authtest@example.com',
      password: 'Test123!',
      firstName: 'Auth',
      lastName: 'Test'
    });

    // Login
    console.log('2. Logging in...');
    const loginResponse = await client.post('/api/auth/login', {
      email: 'authtest@example.com',
      password: 'Test123!'
    });
    
    console.log('Login response:', loginResponse.data);

    // Test authenticated endpoint
    console.log('3. Testing authenticated endpoint...');
    const userResponse = await client.get('/api/auth/current-user');
    console.log('Current user:', userResponse.data);

    // Create sample products
    console.log('4. Creating sample products...');
    const productResponse = await client.post('/api/products/upload-csv', {
      products: [
        {
          name: "Test Product",
          description: "A test product for AI recommendations",
          price: "50.00",
          category: "Electronics"
        }
      ]
    });
    console.log('Products created:', productResponse.data);

    // Test AI recommendations
    console.log('5. Testing AI recommendations...');
    const recommendationResponse = await client.post('/api/recommendations/generate', {
      recipientId: 1,
      occasion: "Birthday",
      budget: { min: 20, max: 100 },
      category: "Electronics",
      mood: "thoughtful"
    });
    
    console.log('AI Recommendations:', recommendationResponse.data);
    console.log('Authentication and AI recommendation system working!');

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
    
    // Log more details about the error
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Headers:', error.response.headers);
    }
  }
}

testAuthenticationFix();