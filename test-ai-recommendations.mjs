import { storage } from './server/storage.js';
import { recommendationEngine } from './server/services/recommendation-engine.js';

async function testAIRecommendations() {
  console.log('🧪 Testing AI Recommendation Engine...');
  
  try {
    // First, let's add some sample products and a test recipient
    console.log('📦 Creating sample products...');
    
    const sampleProducts = [
      {
        name: "Wireless Bluetooth Headphones",
        description: "High-quality noise-canceling headphones with premium sound",
        price: "149.99",
        category: "Electronics",
        imageUrl: "https://example.com/headphones.jpg",
        sourceUrl: "https://example.com/product/1",
        currency: "USD",
        brand: "TechBrand",
        tags: ["bluetooth", "wireless", "noise-canceling", "music"],
        targetAgeRange: "18-45",
        targetGender: "unisex",
        isActive: true
      },
      {
        name: "Cozy Reading Blanket",
        description: "Soft, warm blanket perfect for reading and relaxation",
        price: "39.99",
        category: "Home & Living",
        imageUrl: "https://example.com/blanket.jpg",
        sourceUrl: "https://example.com/product/2",
        currency: "USD",
        brand: "HomeBrand",
        tags: ["cozy", "soft", "reading", "relaxation"],
        targetAgeRange: "25-65",
        targetGender: "unisex",
        isActive: true
      },
      {
        name: "Artisan Coffee Set",
        description: "Premium coffee beans with elegant ceramic mug",
        price: "29.99",
        category: "Food & Beverage",
        imageUrl: "https://example.com/coffee.jpg",
        sourceUrl: "https://example.com/product/3",
        currency: "USD",
        brand: "CoffeeBrand",
        tags: ["coffee", "artisan", "ceramic", "premium"],
        targetAgeRange: "22-55",
        targetGender: "unisex",
        isActive: true
      }
    ];

    // Create products
    const createdProducts = [];
    for (const productData of sampleProducts) {
      try {
        const product = await storage.createProduct(productData);
        createdProducts.push(product);
        console.log(`✅ Created product: ${product.name}`);
      } catch (error) {
        console.log(`⚠️ Product might already exist: ${productData.name}`);
      }
    }

    // Get existing user for testing
    const testUser = await storage.getUserByEmail('demo@giftai.com');
    if (!testUser) {
      console.log('❌ Test user not found. Please make sure demo@giftai.com exists.');
      return;
    }

    console.log(`👤 Using test user: ${testUser.email}`);

    // Create a test recipient
    console.log('👥 Creating test recipient...');
    let testRecipient;
    try {
      testRecipient = await storage.createRecipient({
        userId: testUser.id,
        name: "Sarah Johnson",
        relationship: "friend",
        age: 28,
        gender: "female",
        notes: "Loves reading, coffee, and technology. Works as a software developer."
      });
      console.log(`✅ Created recipient: ${testRecipient.name}`);
    } catch (error) {
      // Get existing recipient if creation fails
      const recipients = await storage.getRecipientsByUserId(testUser.id);
      if (recipients.length > 0) {
        testRecipient = recipients[0];
        console.log(`✅ Using existing recipient: ${testRecipient.name}`);
      } else {
        console.log('❌ Could not create or find test recipient');
        return;
      }
    }

    // Add some preferences for the recipient
    console.log('🎯 Adding recipient preferences...');
    const preferences = [
      {
        recipientId: testRecipient.id,
        preferenceType: "category",
        preferenceValue: "Electronics",
        importance: 8
      },
      {
        recipientId: testRecipient.id,
        preferenceType: "category", 
        preferenceValue: "Books",
        importance: 9
      },
      {
        recipientId: testRecipient.id,
        preferenceType: "interest",
        preferenceValue: "Coffee",
        importance: 7
      }
    ];

    for (const prefData of preferences) {
      try {
        await storage.createPreference(prefData);
        console.log(`✅ Added preference: ${prefData.preferenceType} - ${prefData.preferenceValue}`);
      } catch (error) {
        console.log(`⚠️ Preference might already exist: ${prefData.preferenceValue}`);
      }
    }

    // Test the AI recommendation engine
    console.log('\n🤖 Testing AI Recommendation Engine...');
    
    const recommendationRequest = {
      userId: testUser.id,
      recipientId: testRecipient.id,
      occasion: "Birthday",
      budget: { min: 20, max: 200 },
      category: "Electronics",
      mood: "thoughtful"
    };

    console.log('📊 Generating recommendations...');
    const result = await recommendationEngine.generateRecommendations(recommendationRequest);

    console.log('\n🎁 AI Recommendation Results:');
    console.log(`Total recommendations: ${result.totalRecommendations}`);
    
    if (result.recommendations.length > 0) {
      result.recommendations.forEach((rec, index) => {
        console.log(`\n${index + 1}. ${rec.product.name}`);
        console.log(`   Price: $${rec.product.price}`);
        console.log(`   Category: ${rec.product.category}`);
        console.log(`   Confidence: ${(rec.confidence * 100).toFixed(1)}%`);
        console.log(`   Reasoning: ${rec.reasoning}`);
      });
    } else {
      console.log('No recommendations generated');
    }

    console.log('\n✅ AI Recommendation Engine test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', error.message);
  }
}

// Run the test
testAIRecommendations();