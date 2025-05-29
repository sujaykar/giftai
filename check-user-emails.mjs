import axios from 'axios';

async function checkUsers() {
  console.log('Checking existing users in PostgreSQL database...');
  
  try {
    // Register a new test user first
    const client = axios.create({
      baseURL: 'http://localhost:5000',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('1. Creating a test user...');
    await client.post('/api/auth/register', {
      email: 'testuser@giftai.com',
      password: 'Test123!',
      firstName: 'Test',
      lastName: 'User'
    });

    console.log('2. Attempting login...');
    const loginResponse = await client.post('/api/auth/login', {
      email: 'testuser@giftai.com',
      password: 'Test123!'
    });
    
    console.log('Login successful:', loginResponse.data.message);
    console.log('User ID:', loginResponse.data.user.id);

    // Test PostgreSQL data operations
    console.log('3. Testing PostgreSQL data persistence...');
    
    // Create a recipient
    const recipientResponse = await client.post('/api/recipients', {
      name: "Sarah Johnson",
      relationship: "friend",
      age: 28,
      gender: "female",
      notes: "Loves technology and coffee"
    });
    
    console.log('Recipient created:', recipientResponse.data.recipient.name);

    // Upload some products
    const productResponse = await client.post('/api/products/upload-csv', {
      products: [
        {
          name: "Wireless Bluetooth Headphones",
          description: "Premium noise-canceling headphones with long battery life",
          price: "149.99",
          category: "Electronics",
          imageUrl: "https://example.com/headphones.jpg"
        },
        {
          name: "Artisan Coffee Gift Set",
          description: "Premium coffee beans from around the world with brewing accessories",
          price: "89.99",
          category: "Food & Beverage",
          imageUrl: "https://example.com/coffee.jpg"
        }
      ]
    });
    
    console.log('Products uploaded:', productResponse.data.message);

    // Generate AI recommendations
    console.log('4. Testing AI recommendation system...');
    const recommendationResponse = await client.post('/api/recommendations/generate', {
      recipientId: recipientResponse.data.recipient.id,
      occasion: "Birthday",
      budget: { min: 50, max: 200 },
      category: "Electronics",
      mood: "thoughtful"
    });
    
    console.log('AI Recommendations generated:');
    console.log(`Total: ${recommendationResponse.data.total}`);
    
    if (recommendationResponse.data.recommendations.length > 0) {
      recommendationResponse.data.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec.product.name} - $${rec.product.price}`);
        console.log(`   Confidence: ${(rec.confidence * 100).toFixed(1)}%`);
      });
    }

    // Test historical recommendations
    console.log('5. Checking recommendation history...');
    const historyResponse = await client.get('/api/recommendations/history');
    console.log(`Historical recommendations: ${historyResponse.data.total} found`);

    console.log('\n✅ PostgreSQL Integration Status:');
    console.log('✅ User authentication: Working');
    console.log('✅ Data persistence: Functional');
    console.log('✅ AI recommendations: Operational');
    console.log('✅ Historical data: Available');

  } catch (error) {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else {
      console.error('Network Error:', error.message);
    }
  }
}

checkUsers();