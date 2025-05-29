// Populate demo user with realistic data for testing
console.log('🎭 Populating Demo User with Test Data\n');

const baseUrl = 'http://localhost:5000';

// First login as demo user to get session
async function loginDemoUser() {
  const response = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'demo@giftai.com',
      password: 'Demo2024!'
    })
  });
  
  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('✅ Demo user logged in successfully');
  return response.headers.get('set-cookie');
}

// Create recipients for demo user
async function createRecipients(cookie) {
  const recipients = [
    {
      name: "Sarah Johnson",
      relationship: "Sister", 
      age: 28,
      interests: "Fashion, Photography, Travel, Yoga",
      preferences: "Modern, minimalist, sustainable",
      notes: "Loves eco-friendly products and experiences"
    },
    {
      name: "Alex Chen",
      relationship: "Best Friend",
      age: 26, 
      interests: "Technology, Gaming, Fitness, Coffee",
      preferences: "Tech-forward, practical, high-quality",
      notes: "Always looking for the latest gadgets"
    },
    {
      name: "Mom (Linda)",
      relationship: "Mother",
      age: 55,
      interests: "Gardening, Cooking, Reading, Wellness", 
      preferences: "Classic, comfortable, quality over quantity",
      notes: "Appreciates thoughtful, practical gifts"
    },
    {
      name: "James Wilson", 
      relationship: "Colleague",
      age: 35,
      interests: "Business, Wine, Golf, Travel",
      preferences: "Professional, sophisticated, premium",
      notes: "Enjoys luxury items and experiences"
    }
  ];

  console.log('👥 Creating recipients...');
  
  for (const recipient of recipients) {
    try {
      const response = await fetch(`${baseUrl}/api/recipients`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cookie': cookie 
        },
        body: JSON.stringify(recipient)
      });
      
      if (response.ok) {
        const created = await response.json();
        console.log(`✅ Created recipient: ${recipient.name}`);
      } else {
        console.log(`❌ Failed to create ${recipient.name}: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Error creating ${recipient.name}:`, error.message);
    }
  }
}

// Create sample products
async function createProducts(cookie) {
  const products = [
    {
      name: "Sustainable Yoga Mat Set",
      description: "Eco-friendly yoga mat with matching blocks and strap",
      price: 89.99,
      category: "Fitness & Wellness",
      url: "https://yogaoutlet.com/eco-yoga-set",
      tags: "yoga,fitness,sustainable,wellness,eco-friendly"
    },
    {
      name: "Professional Photography Lighting Kit", 
      description: "Complete LED lighting setup for photographers",
      price: 179.99,
      category: "Photography",
      url: "https://bhphotovideo.com/lighting-kit", 
      tags: "photography,lighting,professional,creative,equipment"
    },
    {
      name: "Premium Coffee Bean Subscription",
      description: "Monthly delivery of freshly roasted specialty coffee",
      price: 45.00,
      category: "Food & Beverage", 
      url: "https://bluebottlecoffee.com/subscription",
      tags: "coffee,subscription,premium,monthly,beans"
    },
    {
      name: "Smart Gaming Headset",
      description: "Wireless gaming headset with 7.1 surround sound",
      price: 199.99,
      category: "Gaming",
      url: "https://steelseries.com/gaming-headset",
      tags: "gaming,headset,wireless,technology,audio"
    },
    {
      name: "Herb Garden Starter Kit",
      description: "Indoor herb growing kit with seeds and nutrients",
      price: 39.99,
      category: "Gardening", 
      url: "https://aerogarden.com/herb-kit",
      tags: "gardening,herbs,indoor,growing,fresh"
    }
  ];

  console.log('\n🎁 Creating sample products...');
  
  for (const product of products) {
    try {
      const response = await fetch(`${baseUrl}/api/products`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cookie': cookie 
        },
        body: JSON.stringify(product)
      });
      
      if (response.ok) {
        console.log(`✅ Created product: ${product.name}`);
      } else {
        console.log(`❌ Failed to create ${product.name}: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Error creating ${product.name}:`, error.message);
    }
  }
}

// Main execution
async function populateDemoData() {
  try {
    const cookie = await loginDemoUser();
    await createRecipients(cookie);
    await createProducts(cookie);
    
    console.log('\n🎉 Demo data population complete!');
    console.log('\n📊 You can now test:');
    console.log('✓ Recommendations page - AI suggestions for each recipient');
    console.log('✓ Budget tracker - Set and monitor spending limits');
    console.log('✓ Dashboard - Overview of recipients and occasions');
    console.log('✓ Feedback system - Rate recommendations to improve AI');
    
    console.log('\n🌐 AWS Amplify Compatibility:');
    console.log('This data structure works with your AWS deployment!');
    console.log('The same API calls will populate data in production.');
    
  } catch (error) {
    console.error('❌ Error populating demo data:', error.message);
  }
}

populateDemoData();