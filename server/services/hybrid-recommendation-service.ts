import OpenAI from "openai";
import { storage } from "../storage";
import { collaborativeFilteringService } from "./collaborative-filtering-service";

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

/**
 * Service for hybrid recommendation system that combines:
 * 1. Content-based filtering (based on recipient preferences)
 * 2. Collaborative filtering (based on similar users)
 * 3. AI recommendations (based on relationship context)
 */
export const hybridRecommendationService = {
  /**
   * Generate recommendations using a hybrid approach
   */
  async getHybridRecommendations(
    userId: number,
    recipientId: number,
    options: {
      limit?: number,
      includeAI?: boolean,
      includeCollaborative?: boolean,
      includeContentBased?: boolean,
      mood?: string,
      occasion?: string,
      minPrice?: number,
      maxPrice?: number
    } = {}
  ): Promise<any[]> {
    try {
      const {
        limit = 10,
        includeAI = true,
        includeCollaborative = true,
        includeContentBased = true,
        mood,
        occasion,
        minPrice,
        maxPrice
      } = options;
      
      let recommendations: any[] = [];
      
      // Get recommendations from each source
      if (includeContentBased) {
        const contentRecommendations = await this.getContentBasedRecommendations(
          userId,
          recipientId,
          { mood, occasion, minPrice, maxPrice, limit: Math.ceil(limit / 2) }
        );
        recommendations = [...recommendations, ...contentRecommendations];
      }
      
      if (includeCollaborative) {
        const collaborativeRecommendations = await collaborativeFilteringService.getCollaborativeRecommendations(
          userId,
          Math.ceil(limit / 3)
        );
        recommendations = [...recommendations, ...collaborativeRecommendations];
      }
      
      if (includeAI) {
        const aiRecommendations = await this.getAIRecommendations(
          userId,
          recipientId,
          { mood, occasion, minPrice, maxPrice, limit: Math.ceil(limit / 3) }
        );
        recommendations = [...recommendations, ...aiRecommendations];
      }
      
      // Remove duplicates (by productId)
      const uniqueRecommendations = Array.from(
        new Map(recommendations.map(item => [item.productId, item])).values()
      );
      
      // Sort by relevance score, limiting to the requested number
      const sortedRecommendations = this.sortRecommendationsByRelevance(uniqueRecommendations)
        .slice(0, limit);
      
      return sortedRecommendations;
    } catch (error) {
      console.error(`Error generating hybrid recommendations for user ${userId}, recipient ${recipientId}:`, error);
      return [];
    }
  },
  
  /**
   * Generate content-based recommendations based on recipient preferences
   */
  async getContentBasedRecommendations(
    userId: number,
    recipientId: number,
    options: {
      categories?: string[],
      tags?: string[],
      mood?: string,
      occasion?: string,
      minPrice?: number,
      maxPrice?: number,
      limit?: number
    } = {}
  ): Promise<any[]> {
    try {
      const { limit = 10 } = options;
      
      // Get the recipient's preferences
      const recipient = await storage.getRecipient(recipientId);
      if (!recipient) {
        throw new Error(`Recipient with ID ${recipientId} not found`);
      }
      
      const preferences = await storage.getPreferencesByRecipientId(recipientId);
      
      // Extract preferred categories, interests, etc.
      const preferredCategories = preferences
        .filter(pref => pref.preferenceType === 'category' || pref.preferenceType === 'interest')
        .map(pref => {
          if (typeof pref.preferenceValue === 'object' && pref.preferenceValue !== null) {
            return (pref.preferenceValue as any).value;
          }
          return String(pref.preferenceValue);
        })
        .filter(Boolean);
      
      // Get all products
      const allProducts = await storage.getProducts();
      
      // Score each product based on how well it matches preferences
      const scoredProducts = await Promise.all(allProducts.map(async (product) => {
        let score = 0;
        
        // Get product tags
        const productTags = await storage.getProductTags(product.id);
        
        // Match with preferred categories and interests
        for (const category of preferredCategories) {
          // Check if product has matching category or tag
          const hasMatch = productTags.some(tag => 
            tag.tagValue.toLowerCase() === category.toLowerCase() ||
            (product.categories && Array.isArray(product.categories) && 
              product.categories.some((c: string) => c.toLowerCase() === category.toLowerCase()))
          );
          
          if (hasMatch) {
            score += 10; // Give significant boost for category match
          }
        }
        
        // Match with recipient age group if available
        if (recipient.age) {
          const ageGroupTags = productTags.filter(tag => tag.tagType === 'age_group');
          for (const tag of ageGroupTags) {
            // Parse age ranges like "18-24", "25-34", etc.
            const match = tag.tagValue.match(/(\d+)-(\d+)/);
            if (match) {
              const [, minAge, maxAge] = match;
              if (recipient.age >= parseInt(minAge) && recipient.age <= parseInt(maxAge)) {
                score += 5;
              }
            }
          }
        }
        
        // Match with gender if available
        if (recipient.gender) {
          const genderTags = productTags.filter(tag => tag.tagType === 'gender_affinity');
          for (const tag of genderTags) {
            if (tag.tagValue.toLowerCase() === recipient.gender.toLowerCase()) {
              score += 5;
            }
          }
        }
        
        // Filter by price range if specified
        if (options.minPrice !== undefined && options.maxPrice !== undefined) {
          const productPrice = product.price ? parseFloat(product.price) : 0;
          if (productPrice < options.minPrice || productPrice > options.maxPrice) {
            score = 0; // Exclude products outside price range
          }
        }
        
        // Filter by mood if specified
        if (options.mood) {
          const moodTags = productTags.filter(tag => tag.tagType === 'mood');
          const hasMatchingMood = moodTags.some(tag => tag.tagValue.toLowerCase() === options.mood?.toLowerCase());
          
          if (!hasMatchingMood) {
            score *= 0.5; // Reduce score for non-matching mood
          } else {
            score += 8; // Boost for matching mood
          }
        }
        
        // Filter by occasion if specified
        if (options.occasion) {
          const occasionTags = productTags.filter(tag => tag.tagType === 'occasion');
          const hasMatchingOccasion = occasionTags.some(tag => tag.tagValue.toLowerCase() === options.occasion?.toLowerCase());
          
          if (!hasMatchingOccasion) {
            score *= 0.5; // Reduce score for non-matching occasion
          } else {
            score += 10; // Significant boost for matching occasion
          }
        }
        
        // Additional factors like popularity, etc. could be considered here
        
        return {
          ...product,
          contentScore: score,
          matchReason: score > 0 ? "Based on recipient's preferences" : undefined
        };
      }));
      
      // Sort by score, filter out zero scores, and take top N
      const recommendations = scoredProducts
        .filter(product => product.contentScore > 0)
        .sort((a, b) => b.contentScore - a.contentScore)
        .slice(0, limit);
      
      return recommendations;
    } catch (error) {
      console.error(`Error generating content-based recommendations for recipient ${recipientId}:`, error);
      return [];
    }
  },
  
  /**
   * Generate AI-powered recommendations based on relationship and context
   */
  async getAIRecommendations(
    userId: number,
    recipientId: number,
    options: {
      mood?: string,
      occasion?: string,
      minPrice?: number,
      maxPrice?: number,
      limit?: number
    } = {}
  ): Promise<any[]> {
    try {
      const { 
        mood, 
        occasion,
        minPrice = 0,
        maxPrice = 1000,
        limit = 6
      } = options;
      
      // Get recipient and their preferences
      const recipient = await storage.getRecipient(recipientId);
      if (!recipient) {
        throw new Error(`Recipient with ID ${recipientId} not found`);
      }
      
      const preferences = await storage.getPreferencesByRecipientId(recipientId);
      
      // Get available products within price range
      const allProducts = await storage.getProducts({
        // Add filters here if needed
      });
      
      // Filter products by price range
      const filteredProducts = allProducts.filter(product => {
        const price = product.price ? parseFloat(product.price) : 0;
        return price >= minPrice && price <= maxPrice;
      });
      
      if (filteredProducts.length === 0) {
        return []; // No products in range
      }
      
      // Format preferences for prompt
      const formattedPreferences = preferences.map(p => {
        const prefValue = typeof p.preferenceValue === 'object' && p.preferenceValue !== null
          ? (p.preferenceValue as any).value
          : p.preferenceValue;
        
        return `${p.preferenceType}: ${prefValue}`;
      }).join('\n');
      
      // Compose the prompt for OpenAI
      const prompt = `
        I need gift recommendations for someone with the following profile:
        
        Name: ${recipient.name}
        Relationship to me: ${recipient.relationship}
        Age: ${recipient.age || 'Unknown'}
        Gender: ${recipient.gender || 'Unknown'}
        
        Their preferences/interests:
        ${formattedPreferences || 'No specific preferences provided'}
        
        Additional context:
        ${mood ? `Mood of the gift: ${mood}` : ''}
        ${occasion ? `Occasion: ${occasion}` : ''}
        Price range: $${minPrice} - $${maxPrice}
        
        Please select the ${Math.min(limit, filteredProducts.length)} most suitable gifts from this list:
        ${filteredProducts.slice(0, 50).map((product, index) => 
          `${index + 1}. ${product.name} - $${product.price} - ${product.description || 'No description'}`
        ).join('\n')}
        
        For each gift, provide:
        1. The gift number from the list above
        2. A brief explanation (1-2 sentences) of why it's a good match for this person
        3. A reasoning score from 0 to 100 indicating how confident you are in this recommendation
        4. What aspect of the relationship makes this a good gift (e.g., "For a caring son")
        
        Return the response as a valid JSON array of objects, each with properties:
        - product_index: number from the list (1-indexed)
        - reason_text: brief explanation
        - reasoning_score: number from 0-100
        - relationship_context: aspect of relationship
      `;
      
      // Call OpenAI API
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        response_format: { type: "json_object" }
      });
      
      // Parse the response
      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("Empty response from OpenAI");
      }
      
      const parsedResponse = JSON.parse(content);
      const recommendations = parsedResponse.recommendations || [];
      
      // Map AI recommendations to products with additional context
      const aiRecommendations = recommendations.map((rec: any) => {
        const productIndex = parseInt(rec.product_index) - 1;
        const product = filteredProducts[productIndex];
        
        if (!product) {
          return null; // Skip invalid product indexes
        }
        
        return {
          ...product,
          reasonText: rec.reason_text,
          reasoning: rec.reason_text,
          relationshipContext: rec.relationship_context,
          mood,
          recommendationScore: (rec.reasoning_score / 100).toFixed(2),
          aiGenerated: true
        };
      }).filter(Boolean);
      
      return aiRecommendations;
    } catch (error) {
      console.error(`Error generating AI recommendations for recipient ${recipientId}:`, error);
      return [];
    }
  },
  
  /**
   * Sort recommendations by their relevance scores
   */
  sortRecommendationsByRelevance(recommendations: any[]): any[] {
    return recommendations.sort((a, b) => {
      // Calculate composite score from different recommendation engines
      const getCompositeScore = (rec: any) => {
        let score = 0;
        
        // AI recommendation score (0-1 range)
        if (rec.recommendationScore) {
          score += parseFloat(rec.recommendationScore) * 5; // Weight AI higher
        }
        
        // Content-based score
        if (rec.contentScore) {
          score += Math.min(rec.contentScore / 20, 1); // Normalize to 0-1 range
        }
        
        // Collaborative score
        if (rec.collaborativeScore) {
          score += rec.collaborativeScore * 2;
        }
        
        return score;
      };
      
      return getCompositeScore(b) - getCompositeScore(a);
    });
  }
};