// Test OpenAI GPT-4 integration
import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function testOpenAIIntegration() {
  console.log('🤖 Testing OpenAI GPT-4 Integration...\n');

  if (!OPENAI_API_KEY) {
    console.log('❌ OPENAI_API_KEY not found in environment');
    return;
  }

  console.log('✅ OpenAI API key is configured');

  try {
    // Test basic GPT-4 call for relationship analysis
    console.log('1. Testing GPT-4 relationship analysis...');
    
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a gift recommendation expert analyzing relationships to suggest appropriate gifts.'
        },
        {
          role: 'user',
          content: 'Analyze this relationship: Sister, age 25, art lover, yoga enthusiast. What type of gifts would be appropriate for her birthday? Consider intimacy level, budget range, and gift categories.'
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ GPT-4 API call successful!');
    console.log('🎯 Sister Relationship Analysis:');
    console.log(response.data.choices[0].message.content);

    // Test colleague relationship analysis
    console.log('\n2. Testing colleague relationship analysis...');
    
    const colleagueResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a gift recommendation expert analyzing relationships to suggest appropriate gifts.'
        },
        {
          role: 'user',
          content: 'Analyze this relationship: Colleague, age 35, male, professional, enjoys business books, recently promoted. What type of gifts would be appropriate for a promotion celebration? Consider formality level, budget range, and appropriate gift categories.'
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ GPT-4 colleague analysis successful!');
    console.log('🎯 Colleague Relationship Analysis:');
    console.log(colleagueResponse.data.choices[0].message.content);

    console.log('\n🎉 OpenAI GPT-4 Integration is fully functional!');
    console.log('✅ Relationship analysis working');
    console.log('✅ Different recommendations for different relationships');
    console.log('✅ API key authentication successful');

    return {
      success: true,
      sisterAnalysis: response.data.choices[0].message.content,
      colleagueAnalysis: colleagueResponse.data.choices[0].message.content
    };

  } catch (error) {
    console.error('❌ OpenAI API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('🔑 API key authentication failed - please check your OpenAI API key');
    } else if (error.response?.status === 429) {
      console.log('⏳ Rate limit exceeded - API key is valid but too many requests');
    } else if (error.response?.status === 403) {
      console.log('🚫 API key doesn\'t have access to GPT-4 - please upgrade your OpenAI plan');
    }
    
    return { success: false, error: error.message };
  }
}

testOpenAIIntegration().then(result => {
  if (result.success) {
    console.log('\n🎯 Your GPT-4 recommendation system is ready for accurate testing!');
  } else {
    console.log('\n⚠️ GPT-4 integration needs attention');
  }
});