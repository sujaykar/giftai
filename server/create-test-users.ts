// Create test users to demonstrate recommendation system
import { storage } from './storage';

async function createTestUsers() {
  console.log('🎁 Creating test users for recommendation system demo...\n');

  try {
    // Create Test User 1
    const testUser = await storage.createUser({
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@giftai.com',
      password: 'test123', // This would be hashed in real implementation
      isEmailVerified: true
    });
    console.log(`✓ Created test user: ${testUser.firstName} ${testUser.lastName} (ID: ${testUser.id})`);

    // Create Recipient 1: Sister (Casual relationship)
    const sisterRecipient = await storage.createRecipient({
      userId: testUser.id,
      name: 'Emma',
      relationship: 'sister',
      age: 25,
      gender: 'female',
      notes: 'Art lover, yoga enthusiast, coffee addict. Loves indie music and vintage clothing.'
    });
    console.log(`✓ Created sister recipient: ${sisterRecipient.name} (${sisterRecipient.relationship})`);

    // Create Recipient 2: Colleague (Formal relationship)
    const colleagueRecipient = await storage.createRecipient({
      userId: testUser.id,
      name: 'Michael',
      relationship: 'colleague',
      age: 35,
      gender: 'male',
      notes: 'Professional colleague, enjoys reading business books and fine dining. Recently promoted to manager.'
    });
    console.log(`✓ Created colleague recipient: ${colleagueRecipient.name} (${colleagueRecipient.relationship})`);

    console.log('\n=== Test Users Created Successfully ===');
    console.log('Ready to test recommendation differences between:');
    console.log('1. Sister (casual, intimate relationship)');
    console.log('2. Colleague (formal, professional relationship)');

    return {
      user: testUser,
      sister: sisterRecipient,
      colleague: colleagueRecipient
    };

  } catch (error) {
    console.error('Error creating test users:', error);
    throw error;
  }
}

// Run the setup
createTestUsers().then(result => {
  console.log('\n🎯 Test users ready for recommendation system testing!');
}).catch(error => {
  console.error('Setup failed:', error);
});