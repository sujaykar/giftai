import { Request, Response } from 'express';
import { relationshipGiftService, RelationshipContext } from '../services/relationship-gift-service';

export const relationshipGiftController = {
  /**
   * Get gift suggestions based on relationship dynamics
   */
  async getRelationshipGiftSuggestions(req: Request, res: Response) {
    try {
      const { recipientId } = req.params;
      const userId = req.user?.id || 1; // Default to user 1 for testing
      
      // Extract relationship context from request body
      const relationshipContext: Partial<RelationshipContext> = req.body;
      
      // Get gift suggestions based on relationship
      const result = await relationshipGiftService.suggestGiftsForRelationship(
        Number(userId),
        Number(recipientId),
        relationshipContext
      );
      
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error in relationship gift suggestions:', error);
      return res.status(500).json({
        message: 'Failed to generate relationship-based gift suggestions',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  },
  
  /**
   * Analyze relationship context
   */
  async analyzeRelationship(req: Request, res: Response) {
    try {
      const { recipientId } = req.params;
      const userId = req.user?.id || 1; // Default to user 1 for testing
      
      // Get recipient
      const recipient = await relationshipGiftService.suggestGiftsForRelationship(
        Number(userId),
        Number(recipientId),
        {}
      );
      
      // Return only the relationship analysis
      return res.status(200).json({
        recipientId: recipientId,
        recipientName: recipient.recipient.name,
        relationshipType: recipient.recipient.relationship,
        analysis: recipient.relationshipAnalysis,
      });
    } catch (error) {
      console.error('Error analyzing relationship:', error);
      return res.status(500).json({
        message: 'Failed to analyze relationship',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
};