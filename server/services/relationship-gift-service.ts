import OpenAI from 'openai';
import { storage } from '../storage';
import { Recipient, Product } from '../../shared/schema';

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const OPENAI_MODEL = "gpt-4o";

// Initialize OpenAI with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface RelationshipContext {
  relationship: string;
  occasion: string;
  yearsKnown?: number;
  closeness?: string;
  backgroundInfo?: string;
  interests?: string[];
  pastGifts?: string[];
}

export interface RelationshipRecommendation {
  productId: number;
  recommendationScore: string;
  confidenceScore: string;
  relationshipReasoning: string;
  personalizedMessage?: string;
}

export interface GiftPairingResult {
  recipient: Recipient;
  recommendations: (RelationshipRecommendation & { product: Product })[];
  relationshipAnalysis: string;
}

class RelationshipGiftService {
  /**
   * Generates gift suggestions based on relationship dynamics
   */
  async suggestGiftsForRelationship(
    userId: number,
    recipientId: number,
    context?: Partial<RelationshipContext>,
  ): Promise<GiftPairingResult> {
    try {
      // Retrieve the recipient
      const recipient = await storage.getRecipient(recipientId);
      if (!recipient) {
        throw new Error(`Recipient with ID ${recipientId} not found`);
      }

      // Retrieve recipient preferences
      const preferences = await storage.getPreferencesByRecipientId(recipientId);
      
      // Get recipient occasions
      const occasions = await storage.getOccasionsByRecipientId(recipientId);
      
      // Retrieve potential products for recommendations
      // In a real implementation, we might use filters based on preferences
      const products = await storage.getProducts();
      
      // Prepare the context data for AI analysis
      const fullContext: RelationshipContext = {
        relationship: recipient.relationship,
        occasion: context?.occasion || (occasions.length > 0 ? occasions[0].name : 'general gift'),
        yearsKnown: context?.yearsKnown || 1,
        closeness: context?.closeness || 'medium',
        backgroundInfo: context?.backgroundInfo || recipient.notes || '',
        interests: context?.interests || preferences.map(p => p.preferenceValue.toString()),
        pastGifts: context?.pastGifts || [],
      };

      // Get relationship-based recommendations using AI
      const aiRecommendations = await this.generateRelationshipRecommendations(fullContext, products);
      
      // Get products for the recommendations
      const recommendationsWithProducts = await this.attachProductsToRecommendations(aiRecommendations);
      
      // Generate relationship analysis
      const relationshipAnalysis = await this.analyzeRelationship(fullContext);

      return {
        recipient,
        recommendations: recommendationsWithProducts,
        relationshipAnalysis,
      };
    } catch (error) {
      console.error('Error suggesting gifts based on relationship:', error);
      throw new Error('Failed to generate relationship-based gift suggestions');
    }
  }

  /**
   * Generate gift recommendations based on relationship context using OpenAI
   */
  private async generateRelationshipRecommendations(
    context: RelationshipContext,
    products: Product[],
  ): Promise<RelationshipRecommendation[]> {
    // Prepare a sample of products (max 20) to keep the API call manageable
    const productSample = products.slice(0, 20);
    
    const prompt = `
    I need to find appropriate gifts for someone based on our relationship dynamics.

    RELATIONSHIP CONTEXT:
    - Our relationship: ${context.relationship}
    - Occasion: ${context.occasion}
    - Years known: ${context.yearsKnown}
    - Closeness level: ${context.closeness}
    - Background info: ${context.backgroundInfo || 'None provided'}
    - Their interests: ${context.interests?.join(', ') || 'None specified'}
    - Past gifts given: ${context.pastGifts?.join(', ') || 'None recorded'}

    POTENTIAL GIFT OPTIONS:
    ${productSample.map(product => (
      `ID: ${product.id} - ${product.name} - ${product.description || 'No description'} - Price: ${product.price || 'unknown'}`
    )).join('\n')}

    Based on the relationship context, analyze which gifts would be most appropriate and meaningful. Consider the emotional and relational aspects of gift-giving.

    Please provide recommendations in the following JSON format:
    {
      "recommendations": [
        {
          "productId": number,
          "recommendationScore": string (1-10),
          "confidenceScore": string (1-10),
          "relationshipReasoning": string (explanation of why this gift fits the relationship context),
          "personalizedMessage": string (optional suggestion for a personal message to include)
        }
      ]
    }

    Recommend up to 5 gifts that would be most appropriate for this relationship context. Focus on why these gifts would be meaningful in the context of the relationship.
    `;

    try {
      const response = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: 'You are a gift pairing expert who understands the emotional and relational aspects of gift-giving.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error('Empty response from OpenAI');
      }

      const parsedResponse = JSON.parse(content);
      return parsedResponse.recommendations || [];
    } catch (error) {
      console.error('Error generating relationship recommendations:', error);
      return [];
    }
  }

  /**
   * Attach product details to recommendations
   */
  private async attachProductsToRecommendations(
    recommendations: RelationshipRecommendation[]
  ): Promise<(RelationshipRecommendation & { product: Product })[]> {
    const result: (RelationshipRecommendation & { product: Product })[] = [];

    for (const recommendation of recommendations) {
      const product = await storage.getProduct(recommendation.productId);
      if (product) {
        result.push({
          ...recommendation,
          product,
        });
      }
    }

    return result;
  }

  /**
   * Generate a relationship analysis based on the context
   */
  private async analyzeRelationship(context: RelationshipContext): Promise<string> {
    const prompt = `
    Analyze the following relationship context and provide insights about the gift-giving dynamics:
    
    RELATIONSHIP CONTEXT:
    - Relationship: ${context.relationship}
    - Occasion: ${context.occasion}
    - Years known: ${context.yearsKnown}
    - Closeness level: ${context.closeness}
    - Background info: ${context.backgroundInfo || 'None provided'}
    - Their interests: ${context.interests?.join(', ') || 'None specified'}
    - Past gifts given: ${context.pastGifts?.join(', ') || 'None recorded'}
    
    Please provide a brief analysis (2-3 paragraphs) of this relationship and what might be meaningful in a gift. Consider:
    1. The stage and depth of the relationship
    2. The emotional significance of the occasion
    3. How to make the gift meaningful based on shared history and interests
    4. Gift-giving considerations specific to this type of relationship
    
    Write in a helpful, warm tone that acknowledges the importance of the relationship.
    `;

    try {
      const response = await openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: 'You are a relationship expert who understands the emotional aspects of gift-giving in different types of relationships.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      return response.choices[0].message.content || 'Could not generate relationship analysis.';
    } catch (error) {
      console.error('Error analyzing relationship:', error);
      return 'Could not generate relationship analysis due to an error.';
    }
  }
}

export const relationshipGiftService = new RelationshipGiftService();