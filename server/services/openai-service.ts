import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate gift recommendations based on relationship dynamics
 */
export async function generateRelationshipBasedRecommendations(
  relationship: string,
  recipientDetails: any,
  budget: number,
  mood: string = ""
): Promise<any[]> {
  try {
    // Prepare recipient details for the prompt
    const interests = recipientDetails.interests?.join(", ") || "various interests";
    const age = recipientDetails.age || "unknown age";
    const gender = recipientDetails.gender || "unspecified gender";
    
    // Include mood in the prompt if specified
    const moodPrompt = mood 
      ? `The gift should evoke a ${mood} mood or feeling.` 
      : "";

    // Craft a detailed prompt for the API
    const prompt = `
      I need gift recommendations for a ${relationship} relationship. 
      
      The recipient is a ${age}-year-old ${gender} who enjoys ${interests}.
      My budget is around $${budget}.
      ${moodPrompt}
      
      Please suggest 3 thoughtful gifts that could strengthen our ${relationship} relationship.
      
      For each gift, provide:
      1. Gift name
      2. Price estimate (in USD)
      3. Why it's suitable for this relationship type
      4. Where it can be purchased
      5. A brief description
      
      Format your response as a JSON array with objects containing these fields:
      - name
      - price
      - relationshipReasoning
      - purchaseLocation
      - description
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
      response_format: { type: "json_object" }
    });

    // Parse the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content received from OpenAI API");
    }

    const result = JSON.parse(content);
    return result.recommendations || [];
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