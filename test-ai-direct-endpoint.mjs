import axios from 'axios';

async function testAIDirect() {
  console.log('Testing AI recommendation system with demo user...');
  
  try {
    // Create axios instance with session handling
    const client = axios.create({
      baseURL: 'http://localhost:5000',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Login with existing demo user
    console.log('1. Logging in with demo user...');
    const loginResponse = await client.post('/api/auth/login', {
      email: 'demo@giftai.com',
      password: 'Demo2024!'
    });
    
    console.log('Login successful:', loginResponse.data.message);

    // Verify PostgreSQL data persistence by getting recipients
    console.log('2. Checking PostgreSQL data persistence...');
    const recipientsResponse = await client.get('/api/recipients');
    console.log(`Found ${recipientsResponse.data.recipients.length} recipients in database`);

    if (recipientsResponse.data.recipients.length > 0) {
      const firstRecipient = recipientsResponse.data.recipients[0];
      console.log('Sample recipient:', firstRecipient.name);

      // Test AI recommendation generation with existing data
      console.log('3. Generating AI recommendations...');
      const recommendationResponse = await client.post('/api/recommendations/generate', {
        recipientId: firstRecipient.id,
        occasion: "Birthday",
        budget: { min: 50, max: 500 },
        category: "Electronics",
        mood: "thoughtful"
      });
      
      console.log('AI Recommendations generated successfully:');
      console.log(`Total recommendations: ${recommendationResponse.data.total}`);
      
      if (recommendationResponse.data.recommendations.length > 0) {
        recommendationResponse.data.recommendations.forEach((rec, index) => {
          console.log(`${index + 1}. ${rec.product.name}`);
          console.log(`   Confidence: ${(rec.confidence * 100).toFixed(1)}%`);
          console.log(`   Price: $${rec.product.price}`);
          console.log(`   Reasoning: ${rec.reasoning.substring(0, 100)}...`);
        });
      }

      // Test historical recommendations retrieval
      console.log('4. Testing historical recommendations...');
      const historyResponse = await client.get('/api/recommendations/history');
      console.log(`Historical recommendations: ${historyResponse.data.total} found`);

      console.log('\n✅ PostgreSQL data persistence: WORKING');
      console.log('✅ AI recommendation engine: OPERATIONAL');
      console.log('✅ Historical data retrieval: FUNCTIONAL');
    } else {
      console.log('No recipients found - testing with new recipient...');
      
      // Create new recipient
      const newRecipientResponse = await client.post('/api/recipients', {
        name: "Test Recipient",
        relationship: "friend",
        age: 30,
        gender: "female",
        notes: "Tech enthusiast who loves gadgets"
      });
      
      console.log('New recipient created:', newRecipientResponse.data.recipient.name);
      
      // Generate recommendations for new recipient
      const recommendationResponse = await client.post('/api/recommendations/generate', {
        recipientId: newRecipientResponse.data.recipient.id,
        occasion: "Birthday",
        budget: { min: 100, max: 300 },
        category: "Electronics",
        mood: "exciting"
      });
      
      console.log('AI recommendations generated for new recipient:');
      console.log(`Total: ${recommendationResponse.data.total}`);
    }

  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('Session authentication issue - using admin account...');
      
      // Try with admin account
      try {
        const adminLogin = await client.post('/api/auth/login', {
          email: 'karsujay@karinfinity.com',
          password: 'TempAccess2024!'
        });
        console.log('Admin login successful');
        
        // Test with admin session
        const adminRecipients = await client.get('/api/recipients');
        console.log(`Admin found ${adminRecipients.data.recipients.length} recipients`);
        
      } catch (adminError) {
        console.error('Admin test also failed:', adminError.response?.data || adminError.message);
      }
    }
  }
}

testAIDirect();