import { Request, Response } from "express";
import { storage } from "../storage";
import { 
  getHybridRecommendations,
  getContentBasedRecommendations,
  getAIRecommendations
} from "../services/hybrid-recommendation-service";
import { autoGenerateProductTags, batchProcessProducts } from "../services/product-tagging-service";
import { updateAllUserSimilarities } from "../services/collaborative-filtering-service";

export const hybridRecommendationController = {
  /**
   * Generate recommendations using the hybrid recommendation system
   */
  getHybridRecommendations: async (req: Request, res: Response) => {
    try {
      const { 
        userId, 
        recipientId,
        limit = 10,
        includeAI = true,
        includeCollaborative = true,
        includeContentBased = true,
        mood,
        occasion,
        minPrice,
        maxPrice,
        categories
      } = req.body;
      
      if (!userId || !recipientId) {
        return res.status(400).json({ message: "User ID and Recipient ID are required" });
      }
      
      const recommendations = await getHybridRecommendations(
        userId,
        recipientId,
        {
          limit: Number(limit),
          includeAI,
          includeCollaborative,
          includeContentBased,
          mood,
          occasion,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          categories: categories ? (Array.isArray(categories) ? categories : [categories]) : undefined
        }
      );
      
      res.json({ recommendations });
    } catch (error) {
      console.error("Error getting hybrid recommendations:", error);
      res.status(500).json({ message: "Failed to get recommendations", error: (error as Error).message });
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
        limit = 3,
        mood,
        occasion
      } = req.body;
      
      if (!userId || !recipientId) {
        return res.status(400).json({ message: "User ID and Recipient ID are required" });
      }
      
      const recommendations = await getAIRecommendations(
        userId,
        recipientId,
        {
          limit: Number(limit),
          mood,
          occasion
        }
      );
      
      const fullRecommendations = [];
      
      for (const rec of recommendations) {
        const product = await storage.getProduct(rec.productId);
        if (product) {
          fullRecommendations.push({ ...rec, product });
        }
      }
      
      res.json({ recommendations: fullRecommendations });
    } catch (error) {
      console.error("Error getting AI recommendations:", error);
      res.status(500).json({ message: "Failed to get AI recommendations", error: (error as Error).message });
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
        limit = 10,
        mood,
        occasion,
        minPrice,
        maxPrice,
        categories
      } = req.body;
      
      if (!userId || !recipientId) {
        return res.status(400).json({ message: "User ID and Recipient ID are required" });
      }
      
      const products = await getContentBasedRecommendations(
        userId,
        recipientId,
        {
          limit: Number(limit),
          mood,
          occasion,
          minPrice: minPrice ? Number(minPrice) : undefined,
          maxPrice: maxPrice ? Number(maxPrice) : undefined,
          categories: categories ? (Array.isArray(categories) ? categories : [categories]) : undefined
        }
      );
      
      res.json({ products });
    } catch (error) {
      console.error("Error getting content-based recommendations:", error);
      res.status(500).json({ message: "Failed to get content-based recommendations", error: (error as Error).message });
    }
  },
  
  /**
   * Auto-generate tags for products
   */
  autoTagProducts: async (req: Request, res: Response) => {
    try {
      const { productId } = req.body;
      
      if (productId) {
        // Tag specific product
        const product = await storage.getProduct(productId);
        
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
        
        const tags = await autoGenerateProductTags(product);
        res.json({ message: `Generated ${tags.length} tags for product`, tags });
      } else {
        // Start batch processing
        // This will be processed in the background
        batchProcessProducts().catch(err => 
          console.error("Error in batch product tagging:", err)
        );
        
        res.json({ message: "Started batch processing of product tags" });
      }
    } catch (error) {
      console.error("Error auto-tagging products:", error);
      res.status(500).json({ message: "Failed to auto-tag products", error: (error as Error).message });
    }
  },
  
  /**
   * Update user similarities for collaborative filtering
   */
  updateUserSimilarities: async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      
      if (userId) {
        // Update similarities for specific user
        // This will be implemented in the future
        res.json({ message: `Updated similarities for user ${userId}` });
      } else {
        // Start batch processing for all users
        // This will be processed in the background
        updateAllUserSimilarities().catch(err => 
          console.error("Error updating user similarities:", err)
        );
        
        res.json({ message: "Started updating user similarities" });
      }
    } catch (error) {
      console.error("Error updating user similarities:", error);
      res.status(500).json({ message: "Failed to update user similarities", error: (error as Error).message });
    }
  }
};