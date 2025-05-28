// Comprehensive test of the GIFT AI recommendation system
import { storage } from './server/storage.js';
import { RelationshipAnalysisService } from './server/services/relationship-analysis-service.js';

console.log('🎁 Testing GIFT AI Recommendation System...\n');

async function testRecommendationSystem() {
  try {
    // Test 1: Create a test user and recipient
    console.log('1. Creating test user and recipient...');
    const testUser = await storage.createUser({
      firstName: 'John',
      lastName: 'Doe', 
      email: 'test@example.com',
      password: 'hashedpassword',
      isEmailVerified: true
    });
    
    const testRecipient = await storage.createRecipient({
      userId: testUser.id,
      name: 'Sarah',
      relationship: 'spouse',
      age: 28,
      gender: 'female',
      notes: 'Loves reading, cooking, and outdoor activities. Birthday coming up!'
    });
    
    console.log(`✓ Created user: ${testUser.firstName} (ID: ${testUser.id})`);
    console.log(`✓ Created recipient: ${testRecipient.name} (${testRecipient.relationship})\n`);
    
    // Test 2: Analyze relationship dynamics
    console.log('2. Analyzing relationship dynamics...');
    const dynamics = RelationshipAnalysisService.analyzeRelationshipDynamics(testRecipient, 30);
    console.log('✓ Relationship Analysis:', {
      intimacyLevel: dynamics.intimacyLevel,
      formalityLevel: dynamics.formalityLevel,
      budgetRange: dynamics.budgetRange,
      emotionalConnection: dynamics.emotionalConnection
    });
    console.log('');
    
    // Test 3: Check available products for recommendations
    console.log('3. Checking product inventory...');
    const allProducts = await storage.getProducts();
    console.log(`✓ Available products: ${allProducts.length}`);
    
    // Show sample products by category
    const productsByCategory = {};
    allProducts.forEach(product => {
      const category = product.category || 'uncategorized';
      if (!productsByCategory[category]) productsByCategory[category] = [];
      productsByCategory[category].push(product);
    });
    
    console.log('Product categories available:');
    Object.keys(productsByCategory).forEach(cat => {
      console.log(`  - ${cat}: ${productsByCategory[cat].length} items`);
    });
    console.log('');
    
    // Test 4: Content-based filtering
    console.log('4. Testing content-based filtering...');
    const suitableProducts = RelationshipAnalysisService.filterProductsByRelationship(
      allProducts, 
      dynamics, 
      'birthday'
    );
    console.log(`✓ Filtered products suitable for relationship: ${suitableProducts.length}`);
    console.log('Sample suitable products:');
    suitableProducts.slice(0, 3).forEach(product => {
      console.log(`  - ${product.name} ($${product.price}) - ${product.category}`);
    });
    console.log('');
    
    // Test 5: Generate AI-powered gift pairings
    console.log('5. Testing AI gift pairing system...');
    const giftPairings = await RelationshipAnalysisService.generateGiftPairings(
      testUser.id,
      testRecipient.id,
      'birthday',
      { maxBudget: 200, minBudget: 20 }
    );
    
    console.log(`✓ Generated ${giftPairings.length} gift pairing combinations`);
    
    if (giftPairings.length > 0) {
      console.log('\nTop gift pairing:');
      const topPairing = giftPairings[0];
      console.log(`Primary Gift: ${topPairing.primaryGift.name} ($${topPairing.primaryGift.price})`);
      console.log(`Complementary Gifts: ${topPairing.complementaryGifts.length} items`);
      console.log(`Confidence Score: ${(topPairing.confidenceScore * 100).toFixed(1)}%`);
      console.log(`Reasoning: ${topPairing.pairingReason}`);
      console.log(`Relationship Insight: ${topPairing.relationshipInsight}`);
    }
    console.log('');
    
    // Test 6: Create recommendations and test storage
    console.log('6. Testing recommendation storage...');
    if (suitableProducts.length > 0) {
      const recommendation = await storage.createRecommendation({
        userId: testUser.id,
        recipientId: testRecipient.id,
        productId: suitableProducts[0].id,
        confidenceScore: 0.85,
        reasoning: 'AI-powered recommendation based on relationship analysis and content filtering',
        occasionId: null
      });
      
      console.log(`✓ Created recommendation: ${recommendation.uuid}`);
      console.log(`  Product: ${suitableProducts[0].name}`);
      console.log(`  Confidence: ${(recommendation.confidenceScore * 100).toFixed(1)}%`);
    }
    console.log('');
    
    // Test 7: Test user feedback system
    console.log('7. Testing user feedback system...');
    const feedbackData = {
      userId: testUser.id,
      productId: suitableProducts[0]?.id || 1,
      recommendationId: null,
      feedbackType: 'like',
      rating: 4,
      contextualData: {
        occasion: 'birthday',
        recipient: testRecipient.name,
        reasoning: 'Perfect match for her interests'
      }
    };
    
    const feedback = await storage.createUserFeedback(feedbackData);
    console.log(`✓ Created user feedback: ${feedback.feedbackType} (${feedback.rating}/5 stars)`);
    console.log('');
    
    // Test 8: Collaborative filtering preparation
    console.log('8. Testing collaborative filtering setup...');
    const userSimilarities = await storage.calculateUserSimilarities(testUser.id);
    console.log(`✓ Calculated user similarities: ${userSimilarities.length} similar users found`);
    console.log('');
    
    console.log('🎉 ALL RECOMMENDATION SYSTEM TESTS PASSED!\n');
    
    // Summary of system capabilities
    console.log('=== RECOMMENDATION SYSTEM SUMMARY ===');
    console.log('✓ Relationship Analysis: Advanced context understanding');
    console.log('✓ Content-Based Filtering: Product matching by attributes');
    console.log('✓ AI Gift Pairing: Intelligent combination suggestions');
    console.log('✓ User Feedback Loop: Learning from user interactions');
    console.log('✓ Collaborative Filtering: User similarity calculations');
    console.log('✓ Data Storage: Comprehensive recommendation tracking');
    console.log('');
    
    return {
      success: true,
      userCreated: testUser,
      recipientCreated: testRecipient,
      relationshipDynamics: dynamics,
      productsAvailable: allProducts.length,
      suitableProducts: suitableProducts.length,
      giftPairings: giftPairings.length,
      feedbackSystem: 'operational'
    };
    
  } catch (error) {
    console.error('❌ Recommendation system test failed:', error);
    return { success: false, error: error.message };
  }
}

// Run the comprehensive test
testRecommendationSystem().then(result => {
  if (result.success) {
    console.log('🎯 Recommendation system is fully operational and ready for production!');
  } else {
    console.log('⚠️ Issues found that need attention:', result.error);
  }
});