const { Pool } = require('pg');

// Create a connection pool
let pool;

const initializePool = () => {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
};

// Database query helper
const executeQuery = async (query, params = []) => {
  if (!pool) {
    pool = initializePool();
  }
  
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return result;
  } finally {
    client.release();
  }
};

// Response helper with CORS
const createResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'https://giftsai.com',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,Cookie',
      'Access-Control-Allow-Credentials': 'true'
    },
    body: JSON.stringify(body)
  };
};

// Simple authentication - extract user from session/token
const getUserFromAuth = async (event) => {
  const authHeader = event.headers.Authorization || event.headers.authorization;
  if (!authHeader) return null;
  
  // For demo purposes, return demo user if auth header exists
  // In production, implement proper JWT verification
  if (authHeader.includes('demo')) {
    return { id: 1, email: 'demo@giftai.com' };
  }
  
  return null;
};

// Authentication middleware
const isAuthenticated = async (event) => {
  const user = await getUserFromAuth(event);
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
};

// AI Recommendation Engine using native fetch
const generateAIRecommendations = async (recipientData, occasion, budget, category, mood) => {
  try {
    const prompt = `Generate 5 personalized gift recommendations based on:
    Recipient: ${recipientData.name}, ${recipientData.age} years old, ${recipientData.gender}
    Relationship: ${recipientData.relationship}
    Occasion: ${occasion || 'general'}
    Budget: $${budget?.min || 0} - $${budget?.max || 500}
    Category: ${category || 'any'}
    Mood: ${mood || 'thoughtful'}
    
    Return JSON with this exact structure:
    {
      "recommendations": [
        {
          "name": "Product Name",
          "description": "Why this is perfect for them",
          "price": 99.99,
          "category": "Electronics",
          "reasoning": "Explanation of why this fits"
        }
      ]
    }`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are an expert gift consultant specialized in personalized recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7
      })
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('OpenAI Error:', error);
    // Return fallback recommendations if OpenAI fails
    return {
      recommendations: [
        {
          name: "Personalized Gift",
          description: "A thoughtful gift recommendation",
          price: 50.00,
          category: "General",
          reasoning: "Generated recommendation based on preferences"
        }
      ]
    };
  }
};

// Route handlers
const handleAuth = async (event, user) => {
  const { httpMethod, pathParameters } = event;
  const body = event.body ? JSON.parse(event.body) : {};
  const action = pathParameters?.action;

  switch (`${httpMethod}:${action}`) {
    case 'POST:register':
      try {
        const { email, password, firstName, lastName } = body;
        
        // Simple password storage (in production, use proper hashing)
        const result = await executeQuery(
          'INSERT INTO users (uuid, email, password, first_name, last_name, is_verified) VALUES (gen_random_uuid(), $1, $2, $3, $4, true) RETURNING id, email, first_name, last_name',
          [email, password, firstName, lastName]
        );
        
        return createResponse(201, { user: result.rows[0] });
      } catch (error) {
        return createResponse(400, { error: 'Registration failed', message: error.message });
      }

    case 'POST:login':
      try {
        const { email, password } = body;
        
        const result = await executeQuery(
          'SELECT id, email, password, first_name, last_name FROM users WHERE email = $1',
          [email]
        );
        
        if (result.rows.length === 0) {
          return createResponse(401, { error: 'Invalid credentials' });
        }
        
        const user = result.rows[0];
        
        // Simple password check (in production, use bcrypt.compare)
        if (user.password !== password) {
          return createResponse(401, { error: 'Invalid credentials' });
        }
        
        const { password: _, ...userWithoutPassword } = user;
        return createResponse(200, { 
          user: userWithoutPassword,
          token: 'demo-token' // In production, generate proper JWT
        });
      } catch (error) {
        return createResponse(500, { error: 'Login failed', message: error.message });
      }

    case 'GET:user':
      return createResponse(200, { user });

    default:
      return createResponse(404, { error: 'Auth endpoint not found' });
  }
};

const handleRecipients = async (event, user) => {
  const { httpMethod, pathParameters } = event;
  const body = event.body ? JSON.parse(event.body) : {};
  const recipientId = pathParameters?.id;

  switch (httpMethod) {
    case 'GET':
      if (recipientId) {
        const result = await executeQuery(
          'SELECT * FROM recipients WHERE id = $1 AND user_id = $2',
          [recipientId, user.id]
        );
        return createResponse(200, { recipient: result.rows[0] });
      } else {
        const result = await executeQuery(
          'SELECT * FROM recipients WHERE user_id = $1 ORDER BY created_at DESC',
          [user.id]
        );
        return createResponse(200, { recipients: result.rows });
      }

    case 'POST':
      try {
        const { name, relationship, age, gender, birthday, notes } = body;
        const result = await executeQuery(
          'INSERT INTO recipients (uuid, user_id, name, relationship, age, gender, birthday, notes) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7) RETURNING *',
          [user.id, name, relationship, age, gender, birthday, notes]
        );
        return createResponse(201, { recipient: result.rows[0] });
      } catch (error) {
        return createResponse(400, { error: 'Failed to create recipient', message: error.message });
      }

    case 'PUT':
      if (!recipientId) {
        return createResponse(400, { error: 'Recipient ID required' });
      }
      try {
        const { name, relationship, age, gender, birthday, notes } = body;
        const result = await executeQuery(
          'UPDATE recipients SET name = $1, relationship = $2, age = $3, gender = $4, birthday = $5, notes = $6, updated_at = NOW() WHERE id = $7 AND user_id = $8 RETURNING *',
          [name, relationship, age, gender, birthday, notes, recipientId, user.id]
        );
        return createResponse(200, { recipient: result.rows[0] });
      } catch (error) {
        return createResponse(400, { error: 'Failed to update recipient', message: error.message });
      }

    case 'DELETE':
      if (!recipientId) {
        return createResponse(400, { error: 'Recipient ID required' });
      }
      try {
        await executeQuery(
          'DELETE FROM recipients WHERE id = $1 AND user_id = $2',
          [recipientId, user.id]
        );
        return createResponse(200, { message: 'Recipient deleted successfully' });
      } catch (error) {
        return createResponse(400, { error: 'Failed to delete recipient', message: error.message });
      }

    default:
      return createResponse(405, { error: 'Method not allowed' });
  }
};

const handleRecommendations = async (event, user) => {
  const { httpMethod, pathParameters } = event;
  const body = event.body ? JSON.parse(event.body) : {};
  const action = pathParameters?.action;

  switch (`${httpMethod}:${action}`) {
    case 'POST:generate':
      try {
        const { recipientId, occasion, budget, category, mood } = body;
        
        // Get recipient data
        const recipientResult = await executeQuery(
          'SELECT * FROM recipients WHERE id = $1 AND user_id = $2',
          [recipientId, user.id]
        );
        
        if (recipientResult.rows.length === 0) {
          return createResponse(404, { error: 'Recipient not found' });
        }
        
        const recipient = recipientResult.rows[0];
        
        // Generate AI recommendations
        const aiRecommendations = await generateAIRecommendations(recipient, occasion, budget, category, mood);
        
        // Save recommendations to database
        const savedRecommendations = [];
        for (const rec of aiRecommendations.recommendations) {
          const result = await executeQuery(
            'INSERT INTO recommendations (uuid, user_id, recipient_id, status, recommendation_score, confidence_score, reasoning, occasion, budget_min, budget_max, mood) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
            [user.id, recipientId, 'pending', 0.9, 0.85, rec.reasoning, occasion, budget?.min || 0, budget?.max || 500, mood]
          );
          savedRecommendations.push(result.rows[0]);
        }
        
        return createResponse(200, { 
          success: true, 
          recommendations: aiRecommendations.recommendations,
          saved: savedRecommendations.length 
        });
      } catch (error) {
        return createResponse(500, { error: 'Failed to generate recommendations', message: error.message });
      }

    case 'GET:history':
      try {
        const result = await executeQuery(
          'SELECT * FROM recommendations WHERE user_id = $1 ORDER BY generated_at DESC LIMIT 50',
          [user.id]
        );
        return createResponse(200, { recommendations: result.rows });
      } catch (error) {
        return createResponse(500, { error: 'Failed to get recommendation history', message: error.message });
      }

    default:
      return createResponse(404, { error: 'Recommendation endpoint not found' });
  }
};

const handleProducts = async (event, user) => {
  const { httpMethod, queryStringParameters } = event;
  const { category, limit = 20, offset = 0 } = queryStringParameters || {};

  switch (httpMethod) {
    case 'GET':
      try {
        let query = 'SELECT * FROM products WHERE is_active = true';
        let params = [];
        
        if (category) {
          query += ' AND category = $1';
          params.push(category);
        }
        
        query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);
        
        const result = await executeQuery(query, params);
        return createResponse(200, { products: result.rows });
      } catch (error) {
        return createResponse(500, { error: 'Failed to get products', message: error.message });
      }

    default:
      return createResponse(405, { error: 'Method not allowed' });
  }
};

const handleStats = async (event, user) => {
  try {
    const [recipientsResult, recommendationsResult, occasionsResult] = await Promise.all([
      executeQuery('SELECT COUNT(*) as count FROM recipients WHERE user_id = $1', [user.id]),
      executeQuery('SELECT COUNT(*) as count FROM recommendations WHERE user_id = $1', [user.id]),
      executeQuery('SELECT COUNT(*) as count FROM occasions r JOIN recipients rec ON r.recipient_id = rec.id WHERE rec.user_id = $1', [user.id])
    ]);
    
    return createResponse(200, {
      recipients: parseInt(recipientsResult.rows[0].count),
      recommendations: parseInt(recommendationsResult.rows[0].count),
      occasions: parseInt(occasionsResult.rows[0].count)
    });
  } catch (error) {
    return createResponse(500, { error: 'Failed to get stats', message: error.message });
  }
};

// Main Lambda handler
exports.handler = async (event) => {
  console.log('Event received:', JSON.stringify(event, null, 2));
  
  // Handle preflight OPTIONS requests
  if (event.httpMethod === 'OPTIONS') {
    return createResponse(200, {});
  }
  
  try {
    const path = event.path || '';
    const pathSegments = path.split('/').filter(segment => segment);
    const resource = pathSegments[0];
    
    // Handle routes
    switch (resource) {
      case 'auth':
        if (event.httpMethod === 'GET' && pathSegments[1] === 'user') {
          const user = await isAuthenticated(event);
          return handleAuth(event, user);
        } else {
          return handleAuth(event, null);
        }
        
      case 'recipients':
        const user = await isAuthenticated(event);
        return handleRecipients(event, user);
        
      case 'recommendations':
        const userForRec = await isAuthenticated(event);
        return handleRecommendations(event, userForRec);
        
      case 'products':
        const userForProducts = await isAuthenticated(event);
        return handleProducts(event, userForProducts);
        
      case 'stats':
        const userForStats = await isAuthenticated(event);
        return handleStats(event, userForStats);
        
      default:
        return createResponse(404, { error: 'Endpoint not found' });
    }
    
  } catch (error) {
    console.error('Lambda Error:', error);
    
    if (error.message === 'Unauthorized') {
      return createResponse(401, { error: 'Authentication required' });
    }
    
    return createResponse(500, { error: 'Internal server error', message: error.message });
  }
};