// Test the AI recommendation system with sample product data
console.log('🧪 Testing GIFT AI Recommendation System\n');

// Sample product data to test with
const sampleProducts = [
  {
    name: "Wireless Noise-Canceling Headphones",
    description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and superior sound quality perfect for music lovers and professionals.",
    price: 299.99,
    category: "Electronics",
    url: "https://amazon.com/sony-headphones-wh1000xm4",
    imageUrl: "https://example.com/headphones.jpg",
    tags: ["technology", "audio", "wireless", "premium", "music"]
  },
  {
    name: "Organic Skincare Gift Set",
    description: "Luxurious collection of organic face serums, moisturizers, and cleansers made with natural ingredients for radiant, healthy skin.",
    price: 89.99,
    category: "Beauty & Personal Care",
    url: "https://etsy.com/organic-skincare-set",
    imageUrl: "https://example.com/skincare.jpg",
    tags: ["skincare", "organic", "beauty", "self-care", "natural"]
  },
  {
    name: "Artisan Coffee Subscription Box",
    description: "Monthly delivery of freshly roasted, single-origin coffee beans from small-batch roasters around the world. Perfect for coffee enthusiasts.",
    price: 45.00,
    category: "Food & Beverage",
    url: "https://coffeeshop.com/subscription",
    imageUrl: "https://example.com/coffee.jpg",
    tags: ["coffee", "subscription", "gourmet", "artisan", "monthly"]
  },
  {
    name: "Smart Fitness Tracker Watch",
    description: "Advanced fitness tracking with heart rate monitoring, GPS, sleep tracking, and smartphone integration for active lifestyle enthusiasts.",
    price: 249.99,
    category: "Fitness & Health",
    url: "https://fitbit.com/smart-watch",
    imageUrl: "https://example.com/fitness-watch.jpg",
    tags: ["fitness", "technology", "health", "tracking", "smart"]
  },
  {
    name: "Vintage Leather Journal",
    description: "Handcrafted leather-bound journal with aged paper, perfect for writers, artists, or anyone who loves the feel of quality stationery.",
    price: 35.99,
    category: "Books & Stationery",
    url: "https://etsy.com/leather-journal",
    imageUrl: "https://example.com/journal.jpg",
    tags: ["writing", "leather", "vintage", "journal", "handmade"]
  }
];

console.log('📦 Sample Products for Testing:');
sampleProducts.forEach((product, index) => {
  console.log(`${index + 1}. ${product.name} - $${product.price}`);
  console.log(`   Category: ${product.category}`);
  console.log(`   Tags: ${product.tags.join(', ')}\n`);
});

console.log('🎯 This data can be used to test:');
console.log('✓ CSV upload functionality');
console.log('✓ GPT-4 content-based filtering');
console.log('✓ Product matching with recipient interests');
console.log('✓ Budget-based recommendations');
console.log('✓ Category and tag-based suggestions\n');

// CSV format for testing
const csvData = `name,description,price,category,url,imageUrl,tags
"Wireless Noise-Canceling Headphones","Premium over-ear headphones with active noise cancellation, 30-hour battery life, and superior sound quality perfect for music lovers and professionals.",299.99,Electronics,https://amazon.com/sony-headphones-wh1000xm4,https://example.com/headphones.jpg,"technology,audio,wireless,premium,music"
"Organic Skincare Gift Set","Luxurious collection of organic face serums, moisturizers, and cleansers made with natural ingredients for radiant, healthy skin.",89.99,Beauty & Personal Care,https://etsy.com/organic-skincare-set,https://example.com/skincare.jpg,"skincare,organic,beauty,self-care,natural"
"Artisan Coffee Subscription Box","Monthly delivery of freshly roasted, single-origin coffee beans from small-batch roasters around the world. Perfect for coffee enthusiasts.",45.00,Food & Beverage,https://coffeeshop.com/subscription,https://example.com/coffee.jpg,"coffee,subscription,gourmet,artisan,monthly"
"Smart Fitness Tracker Watch","Advanced fitness tracking with heart rate monitoring, GPS, sleep tracking, and smartphone integration for active lifestyle enthusiasts.",249.99,Fitness & Health,https://fitbit.com/smart-watch,https://example.com/fitness-watch.jpg,"fitness,technology,health,tracking,smart"
"Vintage Leather Journal","Handcrafted leather-bound journal with aged paper, perfect for writers, artists, or anyone who loves the feel of quality stationery.",35.99,Books & Stationery,https://etsy.com/leather-journal,https://example.com/journal.jpg,"writing,leather,vintage,journal,handmade"`;

console.log('📄 Ready-to-use CSV format:');
console.log(csvData);

console.log('\n🚀 Next Steps:');
console.log('1. Upload this CSV data through the Product Manager');
console.log('2. Test AI recommendations with your existing recipients');
console.log('3. Verify GPT-4 content filtering matches interests');
console.log('4. Check collaborative filtering suggestions');
console.log('5. Validate budget-based product filtering');