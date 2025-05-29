import OpenAI from 'openai';

async function testOpenAIIntegration() {
  console.log('Testing OpenAI Integration for Gift Recommendations...');
  
  try {
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Test sample data
    const sampleProduct = {
      name: "Wireless Bluetooth Headphones",
      description: "High-quality noise-canceling headphones with premium sound",
      price: "149.99",
      category: "Electronics"
    };

    const sampleRecipient = {
      name: "Sarah Johnson",
      relationship: "friend",
      age: 28,
      gender: "female",
      notes: "Loves reading, coffee, and technology. Works as a software developer."
    };

    const occasion = "Birthday";
    const budget = { min: 20, max: 200 };
    const mood = "thoughtful";

    // Build AI prompt for recommendation analysis
    const prompt = `You are a gift recommendation expert. Analyze this product for a specific recipient and provide a recommendation.

Product: ${sampleProduct.name}
Description: ${sampleProduct.description}
Price: $${sampleProduct.price}
Category: ${sampleProduct.category}

Recipient: ${sampleRecipient.name}
Age: ${sampleRecipient.age}
Gender: ${sampleRecipient.gender}
Relationship: ${sampleRecipient.relationship}
Notes: ${sampleRecipient.notes}

Occasion: ${occasion}
Budget: $${budget.min} - $${budget.max}
Mood: ${mood}

Please provide:
1. A confidence score (0-100)
2. Detailed reasoning for why this product would or wouldn't be a good gift
3. How well it matches the recipient's interests and the occasion

Format your response as JSON with keys: "confidence", "reasoning"`;

    console.log('Sending request to OpenAI...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Using latest OpenAI model
      messages: [
        {
          role: "system",
          content: "You are an expert gift recommendation AI. Provide detailed, thoughtful analysis of gift appropriateness."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
      temperature: 0.7
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    console.log('\n🎁 AI Recommendation Analysis:');
    console.log(`Product: ${sampleProduct.name}`);
    console.log(`Recipient: ${sampleRecipient.name} (${sampleRecipient.relationship})`);
    console.log(`Occasion: ${occasion}`);
    console.log(`Confidence Score: ${result.confidence}%`);
    console.log(`Reasoning: ${result.reasoning}`);
    
    console.log('\n✅ OpenAI integration test completed successfully!');
    console.log('The AI recommendation engine is working properly.');

  } catch (error) {
    console.error('❌ OpenAI integration test failed:', error.message);
    
    if (error.message.includes('API key')) {
      console.log('Please ensure your OpenAI API key is valid and has sufficient credits.');
    }
  }
}

testOpenAIIntegration();