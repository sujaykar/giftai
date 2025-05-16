import { Request, Response } from "express";
import { storage } from "../storage";
import { productTaggingService } from "../services/product-tagging-service";
import { collaborativeFilteringService } from "../services/collaborative-filtering-service";
import { hybridRecommendationService } from "../services/hybrid-recommendation-service";

export const hybridRecommendationController = {
  /**
   * Generate recommendations using the hybrid recommendation system
   */
  getHybridRecommendations: async (req: Request, res: Response) => {
    try {
      const { 
        userId, 
        recipientId, 
        includeAI = true,
        includeCollaborative = true,
        includeContentBased = true,
        limit = 10,
        mood,
        occasion,
        minPrice,
        maxPrice 
      } = req.body;
      
      // Validate required parameters
      if (!userId || !recipientId) {
        return res.status(400).json({ 
          error: "Missing required parameters: userId and recipientId are required" 
        });
      }
      
      // Get hybrid recommendations
      const recommendations = await storage.getHybridRecommendations(
        userId,
        recipientId,
        {
          limit,
          includeAI,
          includeCollaborative,
          includeContentBased,
          mood,
          occasion,
          minPrice,
          maxPrice
        }
      );
      
      return res.json({ recommendations });
    } catch (error) {
      console.error("Error generating hybrid recommendations:", error);
      return res.status(500).json({ 
        error: "Failed to generate hybrid recommendations" 
      });
    }
  },
  
  /**
   * Generate AI-based recommendations
   */
  getAIRecommendations: async (req: Request, res: Response) => {
    try {
      const { 
        userId, 
        recipientId, 
        mood,
        occasion,
        minPrice,
        maxPrice,
        limit = 6
      } = req.body;
      
      // Validate required parameters
      if (!userId || !recipientId) {
        return res.status(400).json({ 
          error: "Missing required parameters: userId and recipientId are required" 
        });
      }
      
      // Get AI recommendations
      const recommendations = await hybridRecommendationService.getAIRecommendations(
        userId,
        recipientId,
        {
          mood,
          occasion,
          minPrice,
          maxPrice,
          limit
        }
      );
      
      return res.json({ recommendations });
    } catch (error) {
      console.error("Error generating AI recommendations:", error);
      return res.status(500).json({ 
        error: "Failed to generate AI recommendations" 
      });
    }
  },
  
  /**
   * Generate content-based recommendations
   */
  getContentBasedRecommendations: async (req: Request, res: Response) => {
    try {
      const { 
        userId, 
        recipientId, 
        categories,
        tags,
        mood,
        occasion,
        minPrice,
        maxPrice,
        limit = 10
      } = req.body;
      
      // Validate required parameters
      if (!userId || !recipientId) {
        return res.status(400).json({ 
          error: "Missing required parameters: userId and recipientId are required" 
        });
      }
      
      // Get content-based recommendations
      const recommendations = await hybridRecommendationService.getContentBasedRecommendations(
        userId,
        recipientId,
        {
          categories,
          tags,
          mood,
          occasion,
          minPrice,
          maxPrice,
          limit
        }
      );
      
      return res.json({ recommendations });
    } catch (error) {
      console.error("Error generating content-based recommendations:", error);
      return res.status(500).json({ 
        error: "Failed to generate content-based recommendations" 
      });
    }
  },
  
  /**
   * Auto-generate tags for products
   */
  autoTagProducts: async (req: Request, res: Response) => {
    try {
      const { productId, allProducts = false } = req.body;
      
      if (!productId && !allProducts) {
        return res.status(400).json({ 
          error: "Either productId or allProducts flag must be provided" 
        });
      }
      
      let tags = [];
      
      if (allProducts) {
        // Auto-generate tags for all products
        const products = await storage.getProducts();
        
        // Process each product (batch in a real implementation)
        for (const product of products) {
          const productTags = await productTaggingService.generateProductTags(product.id);
          tags.push(...productTags);
        }
      } else {
        // Auto-generate tags for a specific product
        tags = await productTaggingService.generateProductTags(productId);
      }
      
      return res.json({ 
        success: true, 
        tags,
        count: tags.length
      });
    } catch (error) {
      console.error("Error auto-generating product tags:", error);
      return res.status(500).json({ 
        error: "Failed to auto-generate product tags" 
      });
    }
  },
  
  /**
   * Update user similarities for collaborative filtering
   */
  updateUserSimilarities: async (req: Request, res: Response) => {
    try {
      const { userId, allUsers = false } = req.body;
      
      if (!userId && !allUsers) {
        return res.status(400).json({ 
          error: "Either userId or allUsers flag must be provided" 
        });
      }
      
      let similarities = [];
      
      if (allUsers) {
        // Update similarities for all users
        similarities = await collaborativeFilteringService.updateAllUserSimilarities();
      } else {
        // Update similarities for a specific user
        similarities = await collaborativeFilteringService.calculateUserSimilarities(userId);
      }
      
      return res.json({ 
        success: true, 
        similarities,
        count: similarities.length
      });
    } catch (error) {
      console.error("Error updating user similarities:", error);
      return res.status(500).json({ 
        error: "Failed to update user similarities" 
      });
    }
  }
};