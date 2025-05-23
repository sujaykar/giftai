import OpenAI from "openai";
import { storage } from "../storage";
import type { Product, InsertProductClassification } from "@shared/schema";

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

export const productClassificationService = {
  /**
   * Analyze and classify a product using AI for enhanced recommendations
   */
  async classifyProduct(productId: number): Promise<any> {
    try {
      const product = await storage.getProduct(productId);
      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }

      // Create comprehensive prompt for product analysis
      const prompt = `
        Analyze this product for gift recommendation purposes:

        Product: ${product.name}
        Description: ${product.description || 'No description'}
        Category: ${product.category || 'Uncategorized'}
        Price: $${product.price} ${product.currency}
        Brand: ${product.brand || 'Unknown'}
        Existing Tags: ${product.tags?.join(', ') || 'None'}
        Occasions: ${product.occasions?.join(', ') || 'None'}
        Moods: ${product.moods?.join(', ') || 'None'}
        Age Ranges: ${product.ageRanges?.join(', ') || 'None'}
        Genders: ${product.genders?.join(', ') || 'None'}
        Relationships: ${product.relationships?.join(', ') || 'None'}
        Interests: ${product.interests?.join(', ') || 'None'}

        Please provide a comprehensive analysis in JSON format with the following structure:
        {
          "sentimentScore": number (-1 to 1, emotional appeal),
          "practicalityScore": number (0 to 1, how practical/useful),
          "uniquenessScore": number (0 to 1, how unique/special),
          "luxuryScore": number (0 to 1, how luxurious/premium),
          "giftabilityScore": number (0 to 1, overall gift potential),
          "personalityScores": {
            "creative": number (0 to 1),
            "practical": number (0 to 1),
            "adventurous": number (0 to 1),
            "intellectual": number (0 to 1),
            "social": number (0 to 1),
            "traditional": number (0 to 1),
            "tech_savvy": number (0 to 1),
            "artistic": number (0 to 1)
          },
          "relationshipFit": {
            "romantic_partner": number (0 to 1),
            "family_member": number (0 to 1),
            "close_friend": number (0 to 1),
            "colleague": number (0 to 1),
            "acquaintance": number (0 to 1),
            "parent": number (0 to 1),
            "child": number (0 to 1),
            "sibling": number (0 to 1)
          },
          "occasionFit": {
            "birthday": number (0 to 1),
            "anniversary": number (0 to 1),
            "holiday": number (0 to 1),
            "graduation": number (0 to 1),
            "wedding": number (0 to 1),
            "achievement": number (0 to 1),
            "apology": number (0 to 1),
            "just_because": number (0 to 1)
          },
          "aiDescription": "string (2-3 sentence description of gift appeal)",
          "targetPersona": "string (ideal recipient description)",
          "giftingContext": "string (when and why to give this gift)",
          "confidenceLevel": number (0 to 1, AI confidence in analysis)
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert gift consultant and product analyst. Analyze products for their gift-giving potential across multiple dimensions. Be precise with numerical scores and provide insightful descriptions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3 // Lower temperature for more consistent analysis
      });

      const analysis = JSON.parse(response.choices[0].message.content!);

      // Store the classification
      const classificationData: InsertProductClassification = {
        productId: productId,
        sentimentScore: analysis.sentimentScore,
        practicalityScore: analysis.practicalityScore,
        uniquenessScore: analysis.uniquenessScore,
        luxuryScore: analysis.luxuryScore,
        giftabilityScore: analysis.giftabilityScore,
        personalityScores: analysis.personalityScores,
        relationshipFit: analysis.relationshipFit,
        occasionFit: analysis.occasionFit,
        aiDescription: analysis.aiDescription,
        targetPersona: analysis.targetPersona,
        giftingContext: analysis.giftingContext,
        classificationModel: "gpt-4o",
        confidenceLevel: analysis.confidenceLevel
      };

      await storage.createProductClassification(classificationData);

      return {
        success: true,
        classification: analysis,
        message: `Product ${product.name} classified successfully`
      };

    } catch (error) {
      console.error(`Error classifying product ${productId}:`, error);
      throw error;
    }
  },

  /**
   * Batch classify multiple products
   */
  async batchClassifyProducts(productIds: number[]): Promise<any> {
    const results = [];
    const errors = [];

    for (const productId of productIds) {
      try {
        const result = await this.classifyProduct(productId);
        results.push({ productId, ...result });
        
        // Add small delay to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        errors.push({ productId, error: error.message });
      }
    }

    return {
      success: true,
      results,
      errors,
      totalProcessed: results.length,
      totalErrors: errors.length
    };
  },

  /**
   * Get enhanced product data with classification
   */
  async getEnhancedProduct(productId: number): Promise<any> {
    try {
      const product = await storage.getProduct(productId);
      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }

      const classification = await storage.getProductClassification(productId);
      
      return {
        ...product,
        classification: classification || null,
        isClassified: !!classification
      };
    } catch (error) {
      console.error(`Error getting enhanced product ${productId}:`, error);
      throw error;
    }
  },

  /**
   * Re-classify product if classification is outdated
   */
  async refreshClassificationIfNeeded(productId: number, maxAgeHours: number = 168): Promise<any> {
    try {
      const classification = await storage.getProductClassification(productId);
      
      if (!classification) {
        // No classification exists, create one
        return await this.classifyProduct(productId);
      }

      const ageInHours = (Date.now() - new Date(classification.lastUpdated).getTime()) / (1000 * 60 * 60);
      
      if (ageInHours > maxAgeHours) {
        // Classification is outdated, refresh it
        return await this.classifyProduct(productId);
      }

      return {
        success: true,
        classification,
        message: "Classification is up to date",
        ageInHours
      };
    } catch (error) {
      console.error(`Error refreshing classification for product ${productId}:`, error);
      throw error;
    }
  }
};