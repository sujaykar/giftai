import { Request, Response } from "express";
import { reinforcementLearningService } from "../services/reinforcement-learning-service";
import { productClassificationService } from "../services/product-classification-service";

export const feedbackController = {
  /**
   * Record user feedback on recommendations
   */
  recordFeedback: async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const {
        productId,
        recipientId,
        recommendationId,
        feedbackType,
        reasons,
        alternativePreferences,
        sessionId,
        timeSpent
      } = req.body;

      if (!productId || !feedbackType) {
        return res.status(400).json({ 
          error: "Product ID and feedback type are required" 
        });
      }

      const result = await reinforcementLearningService.recordFeedback({
        userId,
        productId: parseInt(productId),
        recipientId: recipientId ? parseInt(recipientId) : undefined,
        recommendationId: recommendationId ? parseInt(recommendationId) : undefined,
        feedbackType,
        reasons,
        alternativePreferences,
        sessionId,
        timeSpent
      });

      return res.json(result);
    } catch (error) {
      console.error("Error recording feedback:", error);
      return res.status(500).json({ 
        error: "Failed to record feedback" 
      });
    }
  },

  /**
   * Get personalized recommendations using reinforcement learning
   */
  getPersonalizedRecommendations: async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const { recipientId, limit = 10, excludeDisliked = true, boostLiked = true } = req.body;

      if (!recipientId) {
        return res.status(400).json({ 
          error: "Recipient ID is required" 
        });
      }

      const recommendations = await reinforcementLearningService.getPersonalizedRecommendations(
        userId,
        parseInt(recipientId),
        { limit: parseInt(limit), excludeDisliked, boostLiked }
      );

      return res.json({ 
        recommendations,
        count: recommendations.length,
        userId,
        recipientId
      });
    } catch (error) {
      console.error("Error getting personalized recommendations:", error);
      return res.status(500).json({ 
        error: "Failed to get personalized recommendations" 
      });
    }
  },

  /**
   * Get user feedback insights for analytics
   */
  getFeedbackInsights: async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?.id;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const insights = await reinforcementLearningService.getFeedbackInsights(userId);

      return res.json({ 
        insights,
        userId
      });
    } catch (error) {
      console.error("Error getting feedback insights:", error);
      return res.status(500).json({ 
        error: "Failed to get feedback insights" 
      });
    }
  },

  /**
   * Classify a product using AI
   */
  classifyProduct: async (req: Request, res: Response) => {
    try {
      const { productId } = req.params;

      if (!productId) {
        return res.status(400).json({ 
          error: "Product ID is required" 
        });
      }

      const result = await productClassificationService.classifyProduct(parseInt(productId));

      return res.json(result);
    } catch (error) {
      console.error("Error classifying product:", error);
      return res.status(500).json({ 
        error: "Failed to classify product" 
      });
    }
  },

  /**
   * Get enhanced product data with classification
   */
  getEnhancedProduct: async (req: Request, res: Response) => {
    try {
      const { productId } = req.params;

      if (!productId) {
        return res.status(400).json({ 
          error: "Product ID is required" 
        });
      }

      const product = await productClassificationService.getEnhancedProduct(parseInt(productId));

      return res.json({ 
        product,
        productId: parseInt(productId)
      });
    } catch (error) {
      console.error("Error getting enhanced product:", error);
      return res.status(500).json({ 
        error: "Failed to get enhanced product data" 
      });
    }
  },

  /**
   * Batch classify multiple products
   */
  batchClassifyProducts: async (req: Request, res: Response) => {
    try {
      const { productIds } = req.body;

      if (!productIds || !Array.isArray(productIds)) {
        return res.status(400).json({ 
          error: "Product IDs array is required" 
        });
      }

      const results = await productClassificationService.batchClassifyProducts(
        productIds.map(id => parseInt(id))
      );

      return res.json(results);
    } catch (error) {
      console.error("Error batch classifying products:", error);
      return res.status(500).json({ 
        error: "Failed to batch classify products" 
      });
    }
  }
};