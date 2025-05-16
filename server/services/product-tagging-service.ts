import OpenAI from "openai";
import { storage } from "../storage";
import { InsertProductTag } from "@shared/schema";

// Initialize OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

/**
 * Service to handle automated product tagging and categorization
 */
export const productTaggingService = {
  /**
   * Generate tags for a product using AI analysis
   */
  async generateProductTags(productId: number): Promise<any[]> {
    try {
      // Get product details
      const product = await storage.getProduct(productId);
      
      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }
      
      // Generate standard tags based on product attributes
      const tags: InsertProductTag[] = [];
      
      // Auto-generate categories and tags using OpenAI
      const aiTags = await this.generateAITags(product);
      tags.push(...aiTags);
      
      // Save the tags
      const savedTags = await Promise.all(
        tags.map(tag => storage.createProductTag(tag))
      );
      
      return savedTags;
    } catch (error) {
      console.error(`Error generating product tags for product ID ${productId}:`, error);
      throw error;
    }
  },
  
  /**
   * Generate tags using AI analysis of product data
   */
  async generateAITags(product: any): Promise<InsertProductTag[]> {
    try {
      // Prepare the product data for analysis
      const productText = `
        Product Name: ${product.name}
        Description: ${product.description || 'Not provided'}
        Price: ${product.price || 'Not provided'}
        Categories: ${Array.isArray(product.categories) ? product.categories.join(', ') : 'None'}
      `;
      
      // Define tag types to generate
      const tagTypes = [
        'category',
        'occasion',
        'recipient_type',
        'age_group',
        'interest',
        'relationship',
        'personality',
        'mood',
        'seasonal',
        'material',
        'style'
      ];
      
      // Define the prompt for OpenAI
      const prompt = `
        Analyze this product and generate relevant tags for each tag type. 
        For each tag, assign a confidence score from 0.1 to 1.0 where 1.0 is highly confident.
        
        Product information:
        ${productText}
        
        Required output format:
        Return a valid JSON array with objects having these properties:
        - tag_type: The category from the list below
        - tag_value: The specific tag value
        - confidence_score: Your confidence in this tag (0.1-1.0)
        
        Tag types to generate:
        ${tagTypes.join(', ')}
        
        Notes:
        - Be precise and realistic with confidence scores
        - Only include highly relevant tags (confidence > 0.5)
        - For each tag_type, provide up to 3 tag values maximum
        - Don't invent information not implied by the product data
      `;
      
      // Call OpenAI API
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        response_format: { type: "json_object" }
      });
      
      // Parse the response
      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("Empty response from OpenAI");
      }
      
      const parsedResponse = JSON.parse(content);
      const aiTags = parsedResponse.tags || [];
      
      // Convert to product tag format
      return aiTags.map((tag: any) => ({
        productId: product.id,
        tagType: tag.tag_type,
        tagValue: tag.tag_value,
        confidenceScore: tag.confidence_score.toString(),
        source: 'ai',
        createdAt: new Date(),
        updatedAt: new Date()
      }));
    } catch (error) {
      console.error("Error generating AI tags:", error);
      return [];
    }
  },
  
  /**
   * Generate category tags for a product
   */
  async generateCategoryTags(product: any): Promise<InsertProductTag[]> {
    // Primary category
    const tags: InsertProductTag[] = [];
    
    if (product.categories && Array.isArray(product.categories)) {
      for (const category of product.categories) {
        tags.push({
          productId: product.id,
          tagType: 'category',
          tagValue: category,
          confidenceScore: '1.0', // Explicit category has high confidence
          source: 'system',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    
    return tags;
  },
  
  /**
   * Generate price-range tags for a product
   */
  async generatePriceRangeTags(product: any): Promise<InsertProductTag[]> {
    const tags: InsertProductTag[] = [];
    
    if (product.price) {
      const price = parseFloat(product.price);
      
      let priceRange = '';
      let confidenceScore = '1.0';
      
      if (price < 25) {
        priceRange = 'budget';
      } else if (price < 50) {
        priceRange = 'affordable';
      } else if (price < 100) {
        priceRange = 'mid-range';
      } else if (price < 250) {
        priceRange = 'premium';
      } else {
        priceRange = 'luxury';
      }
      
      tags.push({
        productId: product.id,
        tagType: 'price_range',
        tagValue: priceRange,
        confidenceScore,
        source: 'system',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    return tags;
  },
  
  /**
   * Verify product tags with human review
   */
  async verifyProductTag(tagId: number, isValid: boolean): Promise<any> {
    try {
      const tag = await storage.updateProductTag(tagId, {
        source: isValid ? 'verified' : 'rejected',
        updatedAt: new Date()
      });
      
      return tag;
    } catch (error) {
      console.error(`Error verifying tag ID ${tagId}:`, error);
      throw error;
    }
  },
  
  /**
   * Add a manual tag to a product
   */
  async addManualTag(productId: number, tagType: string, tagValue: string): Promise<any> {
    try {
      const tag = await storage.createProductTag({
        productId,
        tagType,
        tagValue,
        confidenceScore: '1.0', // Manual tags have full confidence
        source: 'manual',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      return tag;
    } catch (error) {
      console.error(`Error adding manual tag to product ID ${productId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get all tags for a product
   */
  async getProductTags(productId: number): Promise<any[]> {
    try {
      return await storage.getProductTags(productId);
    } catch (error) {
      console.error(`Error getting tags for product ID ${productId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get tags for a product by tag type
   */
  async getProductTagsByType(productId: number, tagType: string): Promise<any[]> {
    try {
      return await storage.getProductTagsByType(productId, tagType);
    } catch (error) {
      console.error(`Error getting ${tagType} tags for product ID ${productId}:`, error);
      throw error;
    }
  }
};