import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import 'dotenv/config';

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : true
});

async function setupProductionData() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Setting up production data...');

    // Create demo user and 10 test users
    const users = [
      {
        email: 'demo@giftai.com',
        password: 'Demo2024!',
        firstName: 'Demo',
        lastName: 'User',
        isVerified: true
      },
      {
        email: 'alice.johnson@example.com',
        password: 'TestUser2024!',
        firstName: 'Alice',
        lastName: 'Johnson',
        isVerified: true
      },
      {
        email: 'bob.smith@example.com',
        password: 'TestUser2024!',
        firstName: 'Bob',
        lastName: 'Smith',
        isVerified: true
      },
      {
        email: 'carol.davis@example.com',
        password: 'TestUser2024!',
        firstName: 'Carol',
        lastName: 'Davis',
        isVerified: true
      },
      {
        email: 'david.wilson@example.com',
        password: 'TestUser2024!',
        firstName: 'David',
        lastName: 'Wilson',
        isVerified: true
      },
      {
        email: 'emma.brown@example.com',
        password: 'TestUser2024!',
        firstName: 'Emma',
        lastName: 'Brown',
        isVerified: true
      },
      {
        email: 'frank.taylor@example.com',
        password: 'TestUser2024!',
        firstName: 'Frank',
        lastName: 'Taylor',
        isVerified: true
      },
      {
        email: 'grace.anderson@example.com',
        password: 'TestUser2024!',
        firstName: 'Grace',
        lastName: 'Anderson',
        isVerified: true
      },
      {
        email: 'henry.thomas@example.com',
        password: 'TestUser2024!',
        firstName: 'Henry',
        lastName: 'Thomas',
        isVerified: true
      },
      {
        email: 'iris.jackson@example.com',
        password: 'TestUser2024!',
        firstName: 'Iris',
        lastName: 'Jackson',
        isVerified: true
      },
      {
        email: 'jack.white@example.com',
        password: 'TestUser2024!',
        firstName: 'Jack',
        lastName: 'White',
        isVerified: true
      }
    ];

    console.log('👥 Creating users...');
    const createdUsers = [];

    for (const userData of users) {
      // Check if user already exists
      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [userData.email]
      );

      if (existingUser.rows.length === 0) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const userResult = await client.query(
          `INSERT INTO users (uuid, email, password, first_name, last_name, is_verified, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING id, email`,
          [
            uuidv4(),
            userData.email,
            hashedPassword,
            userData.firstName,
            userData.lastName,
            userData.isVerified
          ]
        );
        createdUsers.push(userResult.rows[0]);
        console.log(`✅ Created user: ${userData.email}`);
      } else {
        createdUsers.push({ id: existingUser.rows[0].id, email: userData.email });
        console.log(`✅ User already exists: ${userData.email}`);
      }
    }

    // Create sample products
    console.log('🎁 Creating sample products...');
    
    const products = [
      {
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium noise-cancelling wireless headphones with 30-hour battery life',
        price: 199.99,
        category: 'Electronics',
        tags: ['music', 'technology', 'wireless', 'gift'],
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        amazonUrl: 'https://amazon.com/example-headphones',
        rating: 4.5
      },
      {
        name: 'Gourmet Coffee Gift Set',
        description: 'Artisan coffee collection with beans from around the world',
        price: 45.99,
        category: 'Food & Beverages',
        tags: ['coffee', 'gourmet', 'drinks', 'morning'],
        imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400',
        amazonUrl: 'https://amazon.com/example-coffee',
        rating: 4.8
      },
      {
        name: 'Silk Scarf',
        description: 'Elegant silk scarf with hand-painted floral design',
        price: 79.99,
        category: 'Fashion & Accessories',
        tags: ['fashion', 'silk', 'elegant', 'accessories'],
        imageUrl: 'https://images.unsplash.com/photo-1601924774866-847bcfb57a85?w=400',
        amazonUrl: 'https://amazon.com/example-scarf',
        rating: 4.3
      },
      {
        name: 'Smart Fitness Watch',
        description: 'Advanced fitness tracker with heart rate monitoring and GPS',
        price: 299.99,
        category: 'Electronics',
        tags: ['fitness', 'health', 'technology', 'sports'],
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        amazonUrl: 'https://amazon.com/example-watch',
        rating: 4.6
      },
      {
        name: 'Artisan Chocolate Box',
        description: 'Handcrafted premium chocolates from Belgian chocolatiers',
        price: 34.99,
        category: 'Food & Beverages',
        tags: ['chocolate', 'sweet', 'gourmet', 'luxury'],
        imageUrl: 'https://images.unsplash.com/photo-1549007953-2f2dc0b24019?w=400',
        amazonUrl: 'https://amazon.com/example-chocolate',
        rating: 4.7
      },
      {
        name: 'Essential Oil Diffuser',
        description: 'Ultrasonic aromatherapy diffuser with LED lighting',
        price: 49.99,
        category: 'Home & Garden',
        tags: ['aromatherapy', 'relaxation', 'home', 'wellness'],
        imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        amazonUrl: 'https://amazon.com/example-diffuser',
        rating: 4.4
      },
      {
        name: 'Leather Wallet',
        description: 'Genuine leather bifold wallet with RFID protection',
        price: 69.99,
        category: 'Fashion & Accessories',
        tags: ['leather', 'wallet', 'men', 'accessories'],
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
        amazonUrl: 'https://amazon.com/example-wallet',
        rating: 4.5
      },
      {
        name: 'Indoor Plant Collection',
        description: 'Set of 3 easy-care indoor plants with decorative pots',
        price: 89.99,
        category: 'Home & Garden',
        tags: ['plants', 'home', 'decor', 'green'],
        imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
        amazonUrl: 'https://amazon.com/example-plants',
        rating: 4.2
      },
      {
        name: 'Cookbook Collection',
        description: 'Set of 3 bestselling cookbooks for international cuisine',
        price: 59.99,
        category: 'Books & Media',
        tags: ['cooking', 'books', 'recipes', 'kitchen'],
        imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        amazonUrl: 'https://amazon.com/example-cookbooks',
        rating: 4.6
      },
      {
        name: 'Spa Gift Set',
        description: 'Luxury spa collection with bath bombs, oils, and candles',
        price: 124.99,
        category: 'Health & Beauty',
        tags: ['spa', 'relaxation', 'beauty', 'self-care'],
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
        amazonUrl: 'https://amazon.com/example-spa',
        rating: 4.8
      },
      {
        name: 'Bluetooth Speaker',
        description: 'Portable waterproof speaker with 360-degree sound',
        price: 89.99,
        category: 'Electronics',
        tags: ['music', 'portable', 'wireless', 'outdoor'],
        imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
        amazonUrl: 'https://amazon.com/example-speaker',
        rating: 4.4
      },
      {
        name: 'Wine Selection',
        description: 'Curated selection of 3 premium wines from renowned vineyards',
        price: 149.99,
        category: 'Food & Beverages',
        tags: ['wine', 'alcohol', 'premium', 'celebration'],
        imageUrl: 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400',
        amazonUrl: 'https://amazon.com/example-wine',
        rating: 4.7
      }
    ];

    for (const product of products) {
      // Check if product already exists
      const existingProduct = await client.query(
        'SELECT id FROM products WHERE name = $1',
        [product.name]
      );

      if (existingProduct.rows.length === 0) {
        await client.query(
          `INSERT INTO products (uuid, name, description, price, category, tags, image_url, source_url, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
          [
            uuidv4(),
            product.name,
            product.description,
            product.price,
            product.category,
            product.tags,
            product.imageUrl,
            product.amazonUrl
          ]
        );
        console.log(`✅ Created product: ${product.name}`);
      } else {
        console.log(`✅ Product already exists: ${product.name}`);
      }
    }

    // Create sample recipients for demo user
    const demoUser = createdUsers.find(user => user.email === 'demo@giftai.com');
    if (demoUser) {
      console.log('👨‍👩‍👧‍👦 Creating sample recipients for demo user...');
      
      const recipients = [
        {
          name: 'Sarah Johnson',
          relationship: 'Sister',
          age: 28,
          gender: 'Female',
          interests: ['reading', 'yoga', 'cooking', 'travel']
        },
        {
          name: 'Mike Chen',
          relationship: 'Best Friend',
          age: 32,
          gender: 'Male',
          interests: ['gaming', 'technology', 'sports', 'music']
        },
        {
          name: 'Mom',
          relationship: 'Mother',
          age: 58,
          gender: 'Female',
          interests: ['gardening', 'cooking', 'reading', 'family']
        }
      ];

      for (const recipient of recipients) {
        const existingRecipient = await client.query(
          'SELECT id FROM recipients WHERE user_id = $1 AND name = $2',
          [demoUser.id, recipient.name]
        );

        if (existingRecipient.rows.length === 0) {
          await client.query(
            `INSERT INTO recipients (uuid, user_id, name, relationship, age, gender, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
            [
              uuidv4(),
              demoUser.id,
              recipient.name,
              recipient.relationship,
              recipient.age,
              recipient.gender
            ]
          );
          console.log(`✅ Created recipient: ${recipient.name}`);
        } else {
          console.log(`✅ Recipient already exists: ${recipient.name}`);
        }
      }
    }

    console.log('🎉 Production data setup complete!');
    console.log('\n📋 Demo Credentials:');
    console.log('Email: demo@giftai.com');
    console.log('Password: Demo2024!');
    console.log('\n📋 Test User Credentials (all use password: TestUser2024!):');
    users.slice(1).forEach(user => {
      console.log(`- ${user.email}`);
    });

  } catch (error) {
    console.error('❌ Error setting up production data:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

setupProductionData().catch(console.error);