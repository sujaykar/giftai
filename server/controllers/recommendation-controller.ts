import { Request, Response } from "express";
import { storage } from "../storage";
import { insertRecommendationSchema } from "@shared/schema";
import { generateRecommendations } from "../services/recommendation-service";
import { emailService } from "../services/email-service";
import { generateRelationshipBasedRecommendations, analyzeGiftForRelationship } from "../services/openai-service";
import crypto from 'crypto';

export const recommendationController = {
  // Generate recommendations based on relationship dynamics
  generateRelationshipRecommendations: async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const { relationship, recipientId, budget, mood } = req.body;
      
      if (!relationship || !recipientId || !budget) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Get recipient to check ownership
      const recipient = await storage.getRecipient(parseInt(recipientId));
      if (!recipient || recipient.userId !== userId) {
        return res.status(404).json({ message: "Recipient not found" });
      }
      
      // Get recipient preferences
      const preferences = await storage.getPreferencesByRecipientId(recipient.id);
      
      // Create recipient details object for the AI
      const recipientDetails = {
        age: recipient.age || "unknown",
        gender: recipient.gender || "unspecified",
        interests: preferences.map(p => p.category)
      };
      
      // Generate relationship-based recommendations
      const aiRecommendations = await generateRelationshipBasedRecommendations(
        relationship,
        recipientDetails,
        budget,
        mood
      );
      
      // Transform AI recommendations into product format and save them
      const savedRecommendations = [];
      for (const rec of aiRecommendations) {
        // Create product first
        const product = await storage.createProduct({
          name: rec.name,
          description: rec.description,
          price: rec.price,
          category: "Relationship",
          imageUrl: null,
          purchaseUrl: rec.purchaseLocation
        });
        
        // Create recommendation linked to the product
        const recommendation = await storage.createRecommendation({
          userId,
          recipientId: recipient.id,
          productId: product.id,
          status: "new",
          confidenceScore: "0.9",
          recommendationScore: "0.9",
          reasonText: rec.relationshipReasoning,
          relationshipContext: relationship,
          mood: mood || null
        });
        
        savedRecommendations.push({
          ...recommendation,
          product
        });
      }
      
      return res.status(201).json(savedRecommendations);
    } catch (error) {
      console.error("Generate relationship recommendations error:", error);
      return res.status(500).json({ message: "Failed to generate relationship-based recommendations" });
    }
  },
  
  // Analyze a gift for a specific relationship
  analyzeGiftForRelationship: async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const { productId, recipientId, relationship } = req.body;
      
      if (!productId || !recipientId || !relationship) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Get recipient to check ownership
      const recipient = await storage.getRecipient(parseInt(recipientId));
      if (!recipient || recipient.userId !== userId) {
        return res.status(404).json({ message: "Recipient not found" });
      }
      
      // Get product
      const product = await storage.getProduct(parseInt(productId));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Get recipient preferences
      const preferences = await storage.getPreferencesByRecipientId(recipient.id);
      
      // Create recipient details object for the AI
      const recipientDetails = {
        age: recipient.age || "unknown",
        gender: recipient.gender || "unspecified",
        interests: preferences.map(p => p.category)
      };
      
      // Analyze gift for relationship
      const analysis = await analyzeGiftForRelationship(
        product.name,
        product.description || "No description available",
        relationship,
        recipientDetails
      );
      
      return res.status(200).json(analysis);
    } catch (error) {
      console.error("Analyze gift for relationship error:", error);
      return res.status(500).json({ message: "Failed to analyze gift for relationship" });
    }
  },
  
  // Get all recommendations for the authenticated user
  getRecommendations: async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      
      // Get recommendations with product details
      const recommendations = await storage.getRecommendationsWithProducts(userId);
      
      // For each recommendation, get the recipient name for display
      const recommendationsWithRecipientNames = await Promise.all(
        recommendations.map(async (recommendation) => {
          const recipient = await storage.getRecipient(recommendation.recipientId);
          return {
            ...recommendation,
            recipientName: recipient ? recipient.name : "Unknown"
          };
        })
      );
      
      return res.status(200).json(recommendationsWithRecipientNames);
    } catch (error) {
      console.error("Get recommendations error:", error);
      return res.status(500).json({ message: "Failed to get recommendations" });
    }
  },
  
  // Get recommendations for a specific recipient
  getRecommendationsByRecipient: async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const recipientId = parseInt(req.params.id);
      
      // Get recipient to check ownership
      const recipient = await storage.getRecipient(recipientId);
      if (!recipient || recipient.userId !== userId) {
        return res.status(404).json({ message: "Recipient not found" });
      }
      
      // Get recommendations
      const recommendations = await storage.getRecommendationsByRecipientId(recipientId);
      
      // Add product details to each recommendation
      const recommendationsWithProducts = await Promise.all(
        recommendations.map(async (recommendation) => {
          const product = await storage.getProduct(recommendation.productId);
          return {
            ...recommendation,
            product
          };
        })
      );
      
      return res.status(200).json(recommendationsWithProducts);
    } catch (error) {
      console.error("Get recommendations by recipient error:", error);
      return res.status(500).json({ message: "Failed to get recommendations" });
    }
  },
  
  // Generate recommendations for a recipient
  generateRecommendations: async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const recipientId = parseInt(req.params.id);
      
      // Get recipient to check ownership
      const recipient = await storage.getRecipient(recipientId);
      if (!recipient || recipient.userId !== userId) {
        return res.status(404).json({ message: "Recipient not found" });
      }
      
      // Get recipient preferences
      const preferences = await storage.getPreferencesByRecipientId(recipientId);
      
      // Generate recommendations
      const recommendations = await generateRecommendations(userId, recipient, preferences);
      
      // Save recommendations to the database
      const savedRecommendations = [];
      for (const rec of recommendations) {
        const savedRec = await storage.createRecommendation(rec);
        savedRecommendations.push(savedRec);
      }
      
      // Create notification log
      if (savedRecommendations.length > 0) {
        await storage.createNotificationLog({
          userId,
          type: "new_recommendation_email",
          status: "sent",
          errorMessage: null
        });
        
        // Send notification email
        try {
          await emailService.sendRecommendationEmail(userId, recipient, savedRecommendations.length);
        } catch (error) {
          const emailError = error as Error;
          console.error("Failed to send recommendation email:", emailError);
          // Update notification log with error
          await storage.createNotificationLog({
            userId,
            type: "new_recommendation_email",
            status: "failed",
            errorMessage: emailError.message
          });
        }
      }
      
      return res.status(201).json(savedRecommendations);
    } catch (error) {
      console.error("Generate recommendations error:", error);
      return res.status(500).json({ message: "Failed to generate recommendations" });
    }
  },
  
  // Update recommendation status (e.g., viewed, approved, dismissed)
  updateRecommendationStatus: async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const recommendationId = parseInt(req.params.id);
      
      // Get recommendation
      const recommendation = await storage.getRecommendation(recommendationId);
      if (!recommendation) {
        return res.status(404).json({ message: "Recommendation not found" });
      }
      
      // Verify ownership
      if (recommendation.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this recommendation" });
      }
      
      // Validate status
      const { status } = req.body;
      if (!["new", "viewed", "approved", "dismissed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      // Update recommendation
      const updatedRecommendation = await storage.updateRecommendation(recommendationId, {
        status
      });
      
      return res.status(200).json(updatedRecommendation);
    } catch (error) {
      console.error("Update recommendation status error:", error);
      return res.status(500).json({ message: "Failed to update recommendation status" });
    }
  }
};
