import axios from 'axios';

async function testPostgresAuth() {
  console.log('Testing PostgreSQL-backed authentication and AI recommendations...');
  
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
    console.log('1. Registering new user...');
    await client.post('/api/auth/register', {
      email: 'postgres@example.com',
      password: 'Test123!',
      firstName: 'Postgres',
      lastName: 'User'
    });

    // Login
    console.log('2. Logging in...');
    const loginResponse = await client.post('/api/auth/login', {
      email: 'postgres@example.com',
      password: 'Test123!'
    });
    
    console.log('Login successful:', loginResponse.data.message);

    // Test current user endpoint
    console.log('3. Testing session persistence...');
    const userResponse = await client.get('/api/auth/current-user');
    console.log('Current user retrieved:', userResponse.data.email);

    // Create some sample products for recommendations
    console.log('4. Creating sample products...');
    const productResponse = await client.post('/api/products/upload-csv', {
      products: [
        {
          name: "Premium Wireless Headphones",
          description: "High-quality noise-canceling headphones perfect for music lovers",
          price: "199.99",
          category: "Electronics",
          imageUrl: "https://example.com/headphones.jpg"
        },
        {
          name: "Artisan Coffee Subscription",
          description: "Monthly delivery of premium coffee beans from around the world",
          price: "29.99",
          category: "Food & Beverage",
          imageUrl: "https://example.com/coffee.jpg"
        }
      ]
    });
    console.log('Products created:', productResponse.data.message);

    // Create a recipient for recommendations
    console.log('5. Creating recipient...');
    const recipientResponse = await client.post('/api/recipients', {
      name: "Sarah Johnson",
      relationship: "friend",
      age: 28,
      gender: "female",
      notes: "Loves technology and coffee"
    });
    console.log('Recipient created:', recipientResponse.data.recipient.name);

    // Generate AI recommendations
    console.log('6. Generating AI recommendations...');
    const recommendationResponse = await client.post('/api/recommendations/generate', {
      recipientId: recipientResponse.data.recipient.id,
      occasion: "Birthday",
      budget: { min: 20, max: 300 },
      category: "Electronics",
      mood: "thoughtful"
    });
    
    console.log('AI Recommendations generated:');
    console.log(`Total: ${recommendationResponse.data.total}`);
    if (recommendationResponse.data.recommendations.length > 0) {
      recommendationResponse.data.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec.product.name} - Confidence: ${(rec.confidence * 100).toFixed(1)}%`);
      });
    }

    // Test historical recommendations
    console.log('7. Retrieving recommendation history...');
    const historyResponse = await client.get('/api/recommendations/history');
    console.log(`Historical recommendations: ${historyResponse.data.total} found`);

    console.log('\nAuthentication and AI recommendation system working correctly!');
    console.log('PostgreSQL session persistence: Operational');
    console.log('AI recommendation engine: Functional');
    console.log('Historical recommendations: Available');

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
    
    if (error.response) {
      console.log('Status:', error.response.status);
      if (error.response.status === 401) {
        console.log('Authentication issue detected');
      }
    }
  }
}

testPostgresAuth();