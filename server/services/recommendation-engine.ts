import OpenAI from 'openai';
import { storage } from '../storage';
import type { User, Recipient, Product, Recommendation, Preference } from '@shared/schema';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface RecommendationRequest {
  userId: number;
  recipientId: number;
  occasion?: string;
  budget?: { min: number; max: number };
  category?: string;
  mood?: string;
}

interface RecommendationResult {
  recommendations: Array<{
    product: Product;
    score: number;
    reasoning: string;
    confidence: number;
  }>;
  totalRecommendations: number;
}

export class RecommendationEngine {
  /**
   * Main recommendation method that combines content-based and collaborative filtering
   */
  async generateRecommendations(request: RecommendationRequest): Promise<RecommendationResult> {
    try {
      const recipient = await storage.getRecipient(request.recipientId);
      if (!recipient) {
        throw new Error('Recipient not found');
      }

      const user = await storage.getUser(request.userId);
      if (!user) {
        throw new Error('User not found');
      }

      const preferences = await storage.getPreferencesByRecipientId(request.recipientId);
      const allProducts = await storage.getProducts();
      
      // Apply budget filter if provided
      let filteredProducts = allProducts;
      if (request.budget) {
        filteredProducts = allProducts.filter(product => {
          const price = parseFloat(product.price || '0');
          return price >= request.budget!.min && price <= request.budget!.max;
        });
      }

      // Apply category filter if provided
      if (request.category) {
        filteredProducts = filteredProducts.filter(product => 
          product.category?.toLowerCase().includes(request.category!.toLowerCase())
        );
      }

      // Get content-based recommendations
      const contentBasedRecs = await this.getContentBasedRecommendations(
        recipient,
        preferences,
        filteredProducts,
        request
      );

      // Get collaborative filtering recommendations
      const collaborativeRecs = await this.getCollaborativeRecommendations(
        request.userId,
        recipient,
        filteredProducts
      );

      // Combine and rank recommendations
      const combinedRecommendations = this.combineRecommendations(
        contentBasedRecs,
        collaborativeRecs,
        filteredProducts
      );

      // Use AI to enhance and explain recommendations
      const enhancedRecommendations = await this.enhanceWithAI(
        combinedRecommendations,
        recipient,
        preferences,
        request
      );

      return {
        recommendations: enhancedRecommendations.slice(0, 10), // Top 10 recommendations
        totalRecommendations: enhancedRecommendations.length
      };
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }

  /**
   * Content-based filtering using recipient preferences and product attributes
   */
  private async getContentBasedRecommendations(
    recipient: Recipient,
    preferences: Preference[],
    products: Product[],
    request: RecommendationRequest
  ): Promise<Array<{ product: Product; score: number }>> {
    const recommendations: Array<{ product: Product; score: number }> = [];

    for (const product of products) {
      let score = 0;
      let factorCount = 0;

      // Score based on preferences
      for (const preference of preferences) {
        if (preference.preferenceType === 'category' && product.category) {
          const preferenceValue = preference.preferenceValue as string;
          if (product.category.toLowerCase().includes(preferenceValue.toLowerCase())) {
            score += (preference.importance || 5) * 10;
            factorCount++;
          }
        }
        
        if (preference.preferenceType === 'brand' && product.description) {
          const preferenceValue = preference.preferenceValue as string;
          if (product.description.toLowerCase().includes(preferenceValue.toLowerCase())) {
            score += (preference.importance || 5) * 15;
            factorCount++;
          }
        }

        if (preference.preferenceType === 'color' && product.description) {
          const preferenceValue = preference.preferenceValue as string;
          if (product.description.toLowerCase().includes(preferenceValue.toLowerCase())) {
            score += (preference.importance || 5) * 8;
            factorCount++;
          }
        }
      }

      // Score based on recipient demographics
      if (recipient.age && product.targetAgeRange) {
        const ageRange = product.targetAgeRange.split('-').map(Number);
        if (ageRange.length === 2 && recipient.age >= ageRange[0] && recipient.age <= ageRange[1]) {
          score += 20;
          factorCount++;
        }
      }

      if (recipient.gender && product.targetGender) {
        if (product.targetGender.toLowerCase() === recipient.gender.toLowerCase() || 
            product.targetGender.toLowerCase() === 'unisex') {
          score += 15;
          factorCount++;
        }
      }

      // Normalize score
      if (factorCount > 0) {
        score = score / factorCount;
        recommendations.push({ product, score });
      }
    }

    return recommendations.sort((a, b) => b.score - a.score);
  }

  /**
   * Collaborative filtering based on similar users' preferences
   */
  private async getCollaborativeRecommendations(
    userId: number,
    recipient: Recipient,
    products: Product[]
  ): Promise<Array<{ product: Product; score: number }>> {
    try {
      // Get all recommendations from the system to find patterns
      const allRecommendations = await storage.getRecommendationsWithProducts(userId);
      const userRecommendations = await storage.getRecommendationsByUserId(userId);
      
      const recommendations: Array<{ product: Product; score: number }> = [];
      const productScores = new Map<number, number>();

      // Find products that were highly rated by users with similar recipients
      for (const rec of allRecommendations) {
        if (rec.product && rec.recommendationScore) {
          const score = parseFloat(rec.recommendationScore);
          if (score > 0.7) { // High confidence recommendations
            const currentScore = productScores.get(rec.product.id) || 0;
            productScores.set(rec.product.id, currentScore + score);
          }
        }
      }

      // Convert to recommendation format
      for (const product of products) {
        const score = productScores.get(product.id) || 0;
        if (score > 0) {
          recommendations.push({ product, score: score * 10 }); // Scale score
        }
      }

      return recommendations.sort((a, b) => b.score - a.score);
    } catch (error) {
      console.error('Error in collaborative filtering:', error);
      return [];
    }
  }

  /**
   * Combine content-based and collaborative filtering results
   */
  private combineRecommendations(
    contentBased: Array<{ product: Product; score: number }>,
    collaborative: Array<{ product: Product; score: number }>,
    allProducts: Product[]
  ): Array<{ product: Product; score: number }> {
    const combinedScores = new Map<number, number>();
    const productMap = new Map<number, Product>();

    // Add content-based scores (weight: 0.7)
    for (const rec of contentBased) {
      combinedScores.set(rec.product.id, rec.score * 0.7);
      productMap.set(rec.product.id, rec.product);
    }

    // Add collaborative scores (weight: 0.3)
    for (const rec of collaborative) {
      const currentScore = combinedScores.get(rec.product.id) || 0;
      combinedScores.set(rec.product.id, currentScore + (rec.score * 0.3));
      productMap.set(rec.product.id, rec.product);
    }

    // Include some random popular products if we don't have enough recommendations
    if (combinedScores.size < 5) {
      for (const product of allProducts.slice(0, 10)) {
        if (!combinedScores.has(product.id)) {
          combinedScores.set(product.id, Math.random() * 30); // Random baseline score
          productMap.set(product.id, product);
        }
      }
    }

    // Convert to array and sort
    const recommendations: Array<{ product: Product; score: number }> = [];
    for (const [productId, score] of combinedScores) {
      const product = productMap.get(productId);
      if (product) {
        recommendations.push({ product, score });
      }
    }

    return recommendations.sort((a, b) => b.score - a.score);
  }

  /**
   * Use OpenAI to enhance recommendations with reasoning and confidence scores
   */
  private async enhanceWithAI(
    recommendations: Array<{ product: Product; score: number }>,
    recipient: Recipient,
    preferences: Preference[],
    request: RecommendationRequest
  ): Promise<Array<{ product: Product; score: number; reasoning: string; confidence: number }>> {
    try {
      const topRecommendations = recommendations.slice(0, 15); // Process top 15
      const enhancedRecommendations = [];

      for (const rec of topRecommendations) {
        const prompt = this.buildAIPrompt(rec.product, recipient, preferences, request);
        
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "You are an expert gift recommendation AI. Analyze the gift match and provide a confidence score (0-1) and reasoning in JSON format."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          response_format: { type: "json_object" },
          max_tokens: 300
        });

        try {
          const aiResponse = JSON.parse(response.choices[0].message.content || '{}');
          
          enhancedRecommendations.push({
            product: rec.product,
            score: rec.score,
            reasoning: aiResponse.reasoning || 'This product matches the recipient\'s preferences.',
            confidence: Math.max(0, Math.min(1, aiResponse.confidence || 0.5))
          });
        } catch (parseError) {
          // Fallback if AI response parsing fails
          enhancedRecommendations.push({
            product: rec.product,
            score: rec.score,
            reasoning: 'This product matches the recipient\'s profile and preferences.',
            confidence: 0.6
          });
        }
      }

      return enhancedRecommendations.sort((a, b) => b.confidence - a.confidence);
    } catch (error) {
      console.error('Error enhancing with AI:', error);
      // Return recommendations without AI enhancement
      return recommendations.map(rec => ({
        ...rec,
        reasoning: 'This product matches the recipient\'s preferences.',
        confidence: 0.5
      }));
    }
  }

  /**
   * Build AI prompt for recommendation analysis
   */
  private buildAIPrompt(
    product: Product,
    recipient: Recipient,
    preferences: Preference[],
    request: RecommendationRequest
  ): string {
    return `
Analyze this gift recommendation:

PRODUCT:
- Name: ${product.name}
- Category: ${product.category || 'N/A'}
- Description: ${product.description || 'N/A'}
- Price: $${product.price || 'N/A'}
- Brand: ${product.brand || 'N/A'}

RECIPIENT:
- Name: ${recipient.name}
- Age: ${recipient.age || 'N/A'}
- Gender: ${recipient.gender || 'N/A'}
- Relationship: ${recipient.relationship}
- Notes: ${recipient.notes || 'N/A'}

PREFERENCES:
${preferences.map(p => `- ${p.preferenceType}: ${JSON.stringify(p.preferenceValue)} (importance: ${p.importance || 5}/10)`).join('\n')}

OCCASION: ${request.occasion || 'General gift'}
BUDGET: ${request.budget ? `$${request.budget.min}-$${request.budget.max}` : 'No specific budget'}
MOOD: ${request.mood || 'N/A'}

Provide a JSON response with:
{
  "confidence": 0.85,
  "reasoning": "Brief explanation of why this is a good match"
}

Consider recipient preferences, age appropriateness, relationship context, and occasion relevance.
    `.trim();
  }

  /**
   * Save recommendations to database
   */
  async saveRecommendations(
    userId: number,
    recipientId: number,
    recommendations: Array<{ product: Product; score: number; reasoning: string; confidence: number }>,
    occasion?: string
  ): Promise<Recommendation[]> {
    const savedRecommendations: Recommendation[] = [];

    for (const rec of recommendations) {
      try {
        const recommendation = await storage.createRecommendation({
          userId,
          recipientId,
          productId: rec.product.id,
          recommendationScore: rec.confidence.toString(),
          confidenceScore: rec.confidence.toString(),
          reasoning: rec.reasoning,
          status: 'active',
          occasion: occasion || null,
          mood: null
        });
        
        savedRecommendations.push(recommendation);
      } catch (error) {
        console.error('Error saving recommendation:', error);
      }
    }

    return savedRecommendations;
  }
}

export const recommendationEngine = new RecommendationEngine();