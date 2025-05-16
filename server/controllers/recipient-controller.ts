import { Request, Response } from "express";
import { storage } from "../storage";
import { insertRecipientSchema, insertPreferenceSchema, insertOccasionSchema } from "@shared/schema";

export const recipientController = {
  // Get all recipients for the authenticated user
  getRecipients: async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      
      // Get recipients
      const recipients = await storage.getRecipientsByUserId(userId);
      
      // For each recipient, get their preferences and occasions
      const recipientsWithDetails = await Promise.all(
        recipients.map(async (recipient) => {
          const preferences = await storage.getPreferencesByRecipientId(recipient.id);
          const occasions = await storage.getOccasionsByRecipientId(recipient.id);
          const recommendations = await storage.getRecommendationsByRecipientId(recipient.id);
          
          return {
            ...recipient,
            preferences,
            occasions,
            recommendationsCount: recommendations.length
          };
        })
      );
      
      return res.status(200).json(recipientsWithDetails);
    } catch (error) {
      console.error("Get recipients error:", error);
      return res.status(500).json({ message: "Failed to get recipients" });
    }
  },
  
  // Get recipient by ID
  getRecipientById: async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const recipientId = parseInt(req.params.id);
      
      // Get recipient
      const recipient = await storage.getRecipient(recipientId);
      
      // Check if recipient exists and belongs to the user
      if (!recipient || recipient.userId !== userId) {
        return res.status(404).json({ message: "Recipient not found" });
      }
      
      return res.status(200).json(recipient);
    } catch (error) {
      console.error("Get recipient error:", error);
      return res.status(500).json({ message: "Failed to get recipient" });
    }
  },
  
  // Create a new recipient
  createRecipient: async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      
      // Extract core recipient data
      const { name, relationship, preferences = [] } = req.body;
      
      // Validate recipient data
      const result = insertRecipientSchema.safeParse({
        userId,
        name,
        relationship
      });
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid recipient data", 
          errors: result.error.errors 
        });
      }
      
      // Create recipient
      const recipient = await storage.createRecipient(result.data);
      
      // Create preferences if provided
      if (Array.isArray(preferences) && preferences.length > 0) {
        for (const pref of preferences) {
          const preferenceData = {
            recipientId: recipient.id,
            preferenceType: pref.preferenceType,
            preferenceValue: pref.preferenceValue
          };
          
          await storage.createPreference(preferenceData);
        }
      }
      
      return res.status(201).json(recipient);
    } catch (error) {
      console.error("Create recipient error:", error);
      return res.status(500).json({ message: "Failed to create recipient" });
    }
  },
  
  // Update a recipient
  updateRecipient: async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const recipientId = parseInt(req.params.id);
      
      // Get recipient
      const recipient = await storage.getRecipient(recipientId);
      
      // Check if recipient exists and belongs to the user
      if (!recipient || recipient.userId !== userId) {
        return res.status(404).json({ message: "Recipient not found" });
      }
      
      // Update recipient
      const { name, relationship } = req.body;
      const updatedRecipient = await storage.updateRecipient(recipientId, {
        name: name !== undefined ? name : recipient.name,
        relationship: relationship !== undefined ? relationship : recipient.relationship
      });
      
      return res.status(200).json(updatedRecipient);
    } catch (error) {
      console.error("Update recipient error:", error);
      return res.status(500).json({ message: "Failed to update recipient" });
    }
  },
  
  // Delete a recipient
  deleteRecipient: async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const recipientId = parseInt(req.params.id);
      
      // Get recipient
      const recipient = await storage.getRecipient(recipientId);
      
      // Check if recipient exists and belongs to the user
      if (!recipient || recipient.userId !== userId) {
        return res.status(404).json({ message: "Recipient not found" });
      }
      
      // Delete recipient - the storage implementation should handle cascade deletion
      // of associated preferences, occasions, and recommendations
      await storage.deleteRecipient(recipientId);
      
      return res.status(200).json({ message: "Recipient deleted successfully" });
    } catch (error) {
      console.error("Delete recipient error:", error);
      return res.status(500).json({ message: "Failed to delete recipient" });
    }
  },
  
  // Get preferences for a recipient
  getPreferences: async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const recipientId = parseInt(req.params.id);
      
      // Get recipient
      const recipient = await storage.getRecipient(recipientId);
      
      // Check if recipient exists and belongs to the user
      if (!recipient || recipient.userId !== userId) {
        return res.status(404).json({ message: "Recipient not found" });
      }
      
      // Get preferences
      const preferences = await storage.getPreferencesByRecipientId(recipientId);
      
      return res.status(200).json(preferences);
    } catch (error) {
      console.error("Get preferences error:", error);
      return res.status(500).json({ message: "Failed to get preferences" });
    }
  },
  
  // Create a preference for a recipient
  createPreference: async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const recipientId = parseInt(req.params.id);
      
      // Get recipient
      const recipient = await storage.getRecipient(recipientId);
      
      // Check if recipient exists and belongs to the user
      if (!recipient || recipient.userId !== userId) {
        return res.status(404).json({ message: "Recipient not found" });
      }
      
      // Validate preference data
      const { preferenceType, preferenceValue } = req.body;
      
      const result = insertPreferenceSchema.safeParse({
        recipientId,
        preferenceType,
        preferenceValue
      });
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid preference data", 
          errors: result.error.errors 
        });
      }
      
      // Check if this preference type already exists, if so update instead of create
      const existingPreferences = await storage.getPreferencesByRecipientId(recipientId);
      const existingPreference = existingPreferences.find(p => p.preferenceType === preferenceType);
      
      let preference;
      if (existingPreference) {
        preference = await storage.updatePreference(existingPreference.id, {
          preferenceValue
        });
      } else {
        preference = await storage.createPreference(result.data);
      }
      
      return res.status(201).json(preference);
    } catch (error) {
      console.error("Create preference error:", error);
      return res.status(500).json({ message: "Failed to create preference" });
    }
  },
  
  // Update a preference
  updatePreference: async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const preferenceId = parseInt(req.params.id);
      
      // Get the preference
      const preference = await storage.getPreferenceById(preferenceId);
      if (!preference) {
        return res.status(404).json({ message: "Preference not found" });
      }
      
      // Get the recipient to check ownership
      const recipient = await storage.getRecipient(preference.recipientId);
      if (!recipient || recipient.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this preference" });
      }
      
      // Update the preference
      const { preferenceValue } = req.body;
      const updatedPreference = await storage.updatePreference(preferenceId, {
        preferenceValue
      });
      
      return res.status(200).json(updatedPreference);
    } catch (error) {
      console.error("Update preference error:", error);
      return res.status(500).json({ message: "Failed to update preference" });
    }
  },
  
  // Get occasions for a recipient
  getOccasions: async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const recipientId = parseInt(req.params.id);
      
      // Get recipient
      const recipient = await storage.getRecipient(recipientId);
      
      // Check if recipient exists and belongs to the user
      if (!recipient || recipient.userId !== userId) {
        return res.status(404).json({ message: "Recipient not found" });
      }
      
      // Get occasions
      const occasions = await storage.getOccasionsByRecipientId(recipientId);
      
      return res.status(200).json(occasions);
    } catch (error) {
      console.error("Get occasions error:", error);
      return res.status(500).json({ message: "Failed to get occasions" });
    }
  },
  
  // Create an occasion for a recipient
  createOccasion: async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const recipientId = parseInt(req.params.id);
      
      // Get recipient
      const recipient = await storage.getRecipient(recipientId);
      
      // Check if recipient exists and belongs to the user
      if (!recipient || recipient.userId !== userId) {
        return res.status(404).json({ message: "Recipient not found" });
      }
      
      // Validate occasion data
      const { name, date, isRecurring, status } = req.body;
      
      const result = insertOccasionSchema.safeParse({
        recipientId,
        name,
        date,
        isRecurring,
        status
      });
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid occasion data", 
          errors: result.error.errors 
        });
      }
      
      // Create occasion
      const occasion = await storage.createOccasion(result.data);
      
      return res.status(201).json(occasion);
    } catch (error) {
      console.error("Create occasion error:", error);
      return res.status(500).json({ message: "Failed to create occasion" });
    }
  },
  
  // Update an occasion
  updateOccasion: async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const occasionId = parseInt(req.params.id);
      
      // Get the occasion
      const occasion = await storage.getOccasion(occasionId);
      if (!occasion) {
        return res.status(404).json({ message: "Occasion not found" });
      }
      
      // Get the recipient to check ownership
      const recipient = await storage.getRecipient(occasion.recipientId);
      if (!recipient || recipient.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this occasion" });
      }
      
      // Update the occasion
      const { name, date, isRecurring, status } = req.body;
      const updatedOccasion = await storage.updateOccasion(occasionId, {
        name: name !== undefined ? name : occasion.name,
        date: date !== undefined ? date : occasion.date,
        isRecurring: isRecurring !== undefined ? isRecurring : occasion.isRecurring,
        status: status !== undefined ? status : occasion.status
      });
      
      return res.status(200).json(updatedOccasion);
    } catch (error) {
      console.error("Update occasion error:", error);
      return res.status(500).json({ message: "Failed to update occasion" });
    }
  },
  
  // Delete an occasion
  deleteOccasion: async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      const occasionId = parseInt(req.params.id);
      
      // Get the occasion
      const occasion = await storage.getOccasion(occasionId);
      if (!occasion) {
        return res.status(404).json({ message: "Occasion not found" });
      }
      
      // Get the recipient to check ownership
      const recipient = await storage.getRecipient(occasion.recipientId);
      if (!recipient || recipient.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this occasion" });
      }
      
      // Delete the occasion
      await storage.deleteOccasion(occasionId);
      
      return res.status(200).json({ message: "Occasion deleted successfully" });
    } catch (error) {
      console.error("Delete occasion error:", error);
      return res.status(500).json({ message: "Failed to delete occasion" });
    }
  },
  
  // Get all upcoming occasions for the user
  getUpcomingOccasions: async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      
      // Get upcoming occasions with recipient info attached
      const upcomingOccasions = await storage.getUpcomingOccasionsByUserId(userId);
      
      return res.status(200).json(upcomingOccasions);
    } catch (error) {
      console.error("Get upcoming occasions error:", error);
      return res.status(500).json({ message: "Failed to get upcoming occasions" });
    }
  }
};
