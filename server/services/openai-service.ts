import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface RecipientInput {
  name: string;
  age?: number | null;
  gender?: string | null;
  relationship: string;
}

interface RecommendationInput {
  recipient: RecipientInput;
  interests: string[];
  budget?: number;
  mood?: string | null;
  occasion?: string | null;
}

interface ProductRecommendation {
  name: string;
  price: string;
  description: string;
  imageUrl?: string;
  purchaseUrl?: string;
}

interface RelationshipRecommendation {
  product: ProductRecommendation;
  reasoning: string;
  reasonText: string;
  relationshipContext: string;
  mood?: string;
  occasionRelevance?: string;
  category: string;
}

/**
 * Generate gift recommendations based on relationship dynamics
 */
export async function generateRelationshipBasedRecommendations(
  input: RecommendationInput
): Promise<RelationshipRecommendation[]> {
  try {
    // Prepare recipient details for the prompt
    const { recipient, interests, budget, mood, occasion } = input;
    const interestsText = interests.length > 0 ? interests.join(", ") : "various interests";
    const ageText = recipient.age ? `${recipient.age}-year-old` : "unknown age";
    const genderText = recipient.gender || "unspecified gender";
    
    // Include mood and occasion in the prompt if specified
    const moodPrompt = mood 
      ? `The gift should evoke a ${mood} mood or feeling.` 
      : "";
      
    const occasionPrompt = occasion
      ? `The gift is for the occasion: ${occasion}.`
      : "The gift is for no specific occasion.";
      
    const budgetPrompt = budget
      ? `My budget is around $${budget}.`
      : "My budget is flexible.";

    // Craft a detailed prompt for the API
    const prompt = `
      I need gift recommendations for ${recipient.name}, who is my ${recipient.relationship}. 
      
      The recipient is a ${ageText} ${genderText} who enjoys ${interestsText}.
      ${budgetPrompt}
      ${moodPrompt}
      ${occasionPrompt}
      
      Please suggest 3 thoughtful gifts that could strengthen our ${recipient.relationship} relationship.
      
      For each gift, provide:
      1. Gift name
      2. Price estimate (in USD)
      3. Why it's suitable for this relationship type (detailed reasoning)
      4. A brief summary sentence explaining why it's appropriate (concise reason)
      5. A brief description of the product
      6. Product category
      
      Format your response as a JSON object with a "recommendations" array containing these fields for each recommendation:
      {
        "recommendations": [
          {
            "product": {
              "name": "string",
              "price": "string",
              "description": "string"
            },
            "reasoning": "string", 
            "reasonText": "string",
            "relationshipContext": "string",
            "mood": "string",
            "category": "string"
          }
        ]
      }
    `;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert gift consultant specialized in analyzing relationship dynamics and suggesting appropriate gifts that strengthen bonds between people."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI API");
    }

    const result = JSON.parse(content);
    
    // Add mood and occasion to each recommendation if provided
    const recommendations = (result.recommendations || []).map((rec: any) => ({
      ...rec,
      mood: mood || undefined,
      occasionRelevance: occasion || undefined
    }));
    
    return recommendations;
  } catch (error) {
    console.error("Error generating relationship-based recommendations:", error);
    throw error;
  }
}

/**
 * Analyze an existing gift to determine its suitability for a relationship
 */
export async function analyzeGiftForRelationship(
  giftName: string,
  giftDescription: string,
  relationship: string,
  recipientDetails: any
): Promise<any> {
  try {
    // Prepare recipient details for the prompt
    const interests = recipientDetails.interests?.join(", ") || "various interests";
    const age = recipientDetails.age || "unknown age";
    const gender = recipientDetails.gender || "unspecified gender";

    // Craft a detailed prompt for the API
    const prompt = `
      I want to give a "${giftName}" (${giftDescription}) to my ${relationship}.
      
      The recipient is a ${age}-year-old ${gender} who enjoys ${interests}.
      
      Please analyze this gift choice and tell me:
      1. How appropriate is this gift for our ${relationship} relationship?
      2. What message does this gift convey in the context of our relationship?
      3. How might it strengthen or potentially weaken our bond?
      4. Would you recommend this gift for this relationship? Why or why not?
      
      Format your response as JSON with these fields:
      - appropriatenessScore (1-10)
      - message
      - impactOnRelationship
      - recommendation (boolean)
      - reasoning
    `;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: "You are an expert in relationship psychology and gift-giving who understands the subtle messages conveyed through gifts in different types of relationships."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI API");
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("Error analyzing gift for relationship:", error);
    throw error;
  }
}