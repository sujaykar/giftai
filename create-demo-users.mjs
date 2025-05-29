// Create comprehensive demo user data for GIFT AI platform testing
console.log('🎭 Creating Demo User Data for GIFT AI Platform\n');

// Demo user with realistic data for testing all features
const demoUser = {
  email: "demo@giftai.com",
  password: "Demo2024!",
  firstName: "Demo",
  lastName: "User"
};

// Recipients with diverse profiles for testing recommendations
const demoRecipients = [
  {
    name: "Sarah Johnson",
    relationship: "Sister",
    age: 28,
    interests: ["Fashion", "Photography", "Travel", "Yoga"],
    style: "Modern, minimalist, sustainable",
    budgetMin: 50,
    budgetMax: 200,
    occasions: [
      { name: "Birthday", date: "2024-03-15", budget: 150 },
      { name: "Christmas", date: "2024-12-25", budget: 100 }
    ]
  },
  {
    name: "Alex Chen",
    relationship: "Best Friend",
    age: 26,
    interests: ["Technology", "Gaming", "Fitness", "Coffee"],
    style: "Tech-forward, practical, high-quality",
    budgetMin: 75,
    budgetMax: 300,
    occasions: [
      { name: "Birthday", date: "2024-06-20", budget: 200 },
      { name: "Graduation", date: "2024-05-15", budget: 250 }
    ]
  },
  {
    name: "Mom (Linda)",
    relationship: "Mother",
    age: 55,
    interests: ["Gardening", "Cooking", "Reading", "Wellness"],
    style: "Classic, comfortable, quality over quantity",
    budgetMin: 100,
    budgetMax: 500,
    occasions: [
      { name: "Mother's Day", date: "2024-05-12", budget: 300 },
      { name: "Birthday", date: "2024-08-10", budget: 400 }
    ]
  },
  {
    name: "James Wilson",
    relationship: "Colleague",
    age: 35,
    interests: ["Business", "Wine", "Golf", "Travel"],
    style: "Professional, sophisticated, premium",
    budgetMin: 30,
    budgetMax: 150,
    occasions: [
      { name: "Work Anniversary", date: "2024-07-01", budget: 75 },
      { name: "Secret Santa", date: "2024-12-20", budget: 50 }
    ]
  }
];

// Sample products for testing recommendations
const demoProducts = [
  {
    name: "Sustainable Yoga Mat Set",
    description: "Eco-friendly yoga mat with matching blocks and strap, perfect for wellness enthusiasts",
    price: 89.99,
    category: "Fitness & Wellness",
    url: "https://yogaoutlet.com/eco-yoga-set",
    imageUrl: "https://example.com/yoga-mat.jpg",
    tags: ["yoga", "fitness", "sustainable", "wellness", "eco-friendly"]
  },
  {
    name: "Professional Photography Lighting Kit",
    description: "Complete LED lighting setup for photographers and content creators",
    price: 179.99,
    category: "Photography",
    url: "https://bhphotovideo.com/lighting-kit",
    imageUrl: "https://example.com/lighting.jpg",
    tags: ["photography", "lighting", "professional", "creative", "equipment"]
  },
  {
    name: "Premium Coffee Bean Subscription",
    description: "Monthly delivery of freshly roasted specialty coffee beans from top roasters",
    price: 45.00,
    category: "Food & Beverage",
    url: "https://bluebottlecoffee.com/subscription",
    imageUrl: "https://example.com/coffee-beans.jpg",
    tags: ["coffee", "subscription", "premium", "monthly", "beans"]
  },
  {
    name: "Smart Gaming Headset",
    description: "Wireless gaming headset with 7.1 surround sound and noise cancellation",
    price: 199.99,
    category: "Gaming",
    url: "https://steelseries.com/gaming-headset",
    imageUrl: "https://example.com/gaming-headset.jpg",
    tags: ["gaming", "headset", "wireless", "technology", "audio"]
  },
  {
    name: "Herb Garden Starter Kit",
    description: "Indoor herb growing kit with seeds, pots, and nutrients for fresh herbs",
    price: 39.99,
    category: "Gardening",
    url: "https://aerogarden.com/herb-kit",
    imageUrl: "https://example.com/herb-garden.jpg",
    tags: ["gardening", "herbs", "indoor", "growing", "fresh"]
  }
];

// Budget tracking data for demo
const budgetData = {
  totalBudget: 2000,
  spent: 450,
  remaining: 1550,
  categories: [
    { name: "Family", budget: 800, spent: 250, remaining: 550 },
    { name: "Friends", budget: 600, spent: 150, remaining: 450 },
    { name: "Colleagues", budget: 400, spent: 50, remaining: 350 },
    { name: "Special Occasions", budget: 200, spent: 0, remaining: 200 }
  ],
  recentPurchases: [
    { recipient: "Sarah Johnson", item: "Yoga Mat Set", amount: 89.99, date: "2024-01-15" },
    { recipient: "Alex Chen", item: "Gaming Headset", amount: 199.99, date: "2024-01-10" },
    { recipient: "Mom (Linda)", item: "Herb Garden Kit", amount: 39.99, date: "2024-01-08" }
  ]
};

console.log('✅ Demo User Created:');
console.log(`Email: ${demoUser.email}`);
console.log(`Password: ${demoUser.password}\n`);

console.log('👥 Recipients Created:');
demoRecipients.forEach((recipient, index) => {
  console.log(`${index + 1}. ${recipient.name} (${recipient.relationship})`);
  console.log(`   Interests: ${recipient.interests.join(', ')}`);
  console.log(`   Budget: $${recipient.budgetMin}-$${recipient.budgetMax}\n`);
});

console.log('🎯 Features Ready for Testing:');
console.log('✓ Recommendation Engine - AI-powered gift suggestions');
console.log('✓ Budget Tracker - Spending limits and category tracking');
console.log('✓ Dashboard - Overview of recipients and upcoming occasions');
console.log('✓ Feedback System - Rate recommendations to improve AI');
console.log('✓ Product Management - Upload and manage gift catalog\n');

console.log('🚀 AWS Amplify Deployment:');
console.log('Yes! This demo user can be used in your AWS deployment.');
console.log('The same data structure works across all environments.');
console.log('Just ensure your AWS deployment has the same API endpoints.\n');

console.log('📊 Testing Scenarios:');
console.log('1. Login as demo user and view dashboard');
console.log('2. Check AI recommendations for each recipient');
console.log('3. Test budget tracker with spending data');
console.log('4. Provide feedback on recommendations');
console.log('5. Upload new products via CSV');

export { demoUser, demoRecipients, demoProducts, budgetData };