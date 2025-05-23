import { storage } from "../storage";
import type { InsertUserFeedback, UserFeedback, Product, Recipient } from "@shared/schema";

export const reinforcementLearningService = {
  /**
   * Record user feedback for reinforcement learning
   */
  async recordFeedback(feedbackData: {
    userId: number;
    productId: number;
    recipientId?: number;
    recommendationId?: number;
    feedbackType: string; // 'like' | 'dislike' | 'view' | 'click' | 'purchase' | 'share'
    reasons?: string[];
    alternativePreferences?: any;
    sessionId?: string;
    timeSpent?: number;
  }): Promise<any> {
    try {
      // Convert feedback type to numerical value
      const feedbackValue = this.getFeedbackValue(feedbackData.feedbackType);
      
      const feedback: InsertUserFeedback = {
        userId: feedbackData.userId,
        productId: feedbackData.productId,
        recipientId: feedbackData.recipientId,
        recommendationId: feedbackData.recommendationId,
        feedbackType: feedbackData.feedbackType,
        feedbackValue: feedbackValue,
        contextType: 'recommendation',
        reasons: feedbackData.reasons,
        alternativePreferences: feedbackData.alternativePreferences,
        sessionId: feedbackData.sessionId,
        timeSpent: feedbackData.timeSpent
      };

      const savedFeedback = await storage.createUserFeedback(feedback);

      // Trigger learning update
      await this.updateUserPreferencesFromFeedback(feedbackData.userId, savedFeedback);

      return {
        success: true,
        feedback: savedFeedback,
        message: "Feedback recorded and learning models updated"
      };
    } catch (error) {
      console.error("Error recording feedback:", error);
      throw error;
    }
  },

  /**
   * Convert feedback type to numerical value
   */
  getFeedbackValue(feedbackType: string): number {
    const feedbackScores = {
      'purchase': 1.0,     // Strongest positive signal
      'like': 0.8,         // Strong positive signal
      'share': 0.6,        // Moderate positive signal
      'click': 0.3,        // Weak positive signal
      'view': 0.1,         // Very weak positive signal
      'dislike': -0.8,     // Strong negative signal
      'hide': -0.5,        // Moderate negative signal
      'not_interested': -0.3 // Weak negative signal
    };
    
    return feedbackScores[feedbackType] || 0;
  },

  /**
   * Update user preferences based on feedback patterns
   */
  async updateUserPreferencesFromFeedback(userId: number, feedback: UserFeedback): Promise<void> {
    try {
      // Get the product that was rated
      const product = await storage.getProduct(feedback.productId);
      if (!product) return;

      // Get user's feedback history
      const userFeedbackHistory = await storage.getUserFeedbackHistory(userId);
      
      // Analyze patterns in user feedback
      const patterns = this.analyzeUserFeedbackPatterns(userFeedbackHistory, product);
      
      // Update user similarity scores based on feedback
      await this.updateUserSimilarityFromFeedback(userId, feedback, patterns);
      
      // Update product recommendation weights
      await this.updateProductWeights(userId, feedback, patterns);
      
    } catch (error) {
      console.error("Error updating user preferences from feedback:", error);
    }
  },

  /**
   * Analyze patterns in user feedback to extract preferences
   */
  analyzeUserFeedbackPatterns(feedbackHistory: UserFeedback[], currentProduct: Product): any {
    const patterns = {
      categoryPreferences: new Map<string, number>(),
      priceRangePreferences: new Map<string, number>(),
      brandPreferences: new Map<string, number>(),
      occasionPreferences: new Map<string, number>(),
      moodPreferences: new Map<string, number>(),
      negativeSignals: []
    };

    // Analyze feedback patterns
    for (const feedback of feedbackHistory) {
      const weight = parseFloat(feedback.feedbackValue.toString());
      
      // Get product for this feedback
      // Note: In real implementation, you'd join with products table
      // For now, we'll work with the current product
      if (feedback.productId === currentProduct.id) {
        // Category preferences
        if (currentProduct.category) {
          const current = patterns.categoryPreferences.get(currentProduct.category) || 0;
          patterns.categoryPreferences.set(currentProduct.category, current + weight);
        }

        // Price range preferences
        const priceRange = this.getPriceRange(parseFloat(currentProduct.price?.toString() || '0'));
        const currentPrice = patterns.priceRangePreferences.get(priceRange) || 0;
        patterns.priceRangePreferences.set(priceRange, currentPrice + weight);

        // Brand preferences
        if (currentProduct.brand) {
          const currentBrand = patterns.brandPreferences.get(currentProduct.brand) || 0;
          patterns.brandPreferences.set(currentProduct.brand, currentBrand + weight);
        }

        // Occasion and mood preferences
        if (currentProduct.occasions) {
          for (const occasion of currentProduct.occasions) {
            const currentOccasion = patterns.occasionPreferences.get(occasion) || 0;
            patterns.occasionPreferences.set(occasion, currentOccasion + weight);
          }
        }

        if (currentProduct.moods) {
          for (const mood of currentProduct.moods) {
            const currentMood = patterns.moodPreferences.get(mood) || 0;
            patterns.moodPreferences.set(mood, currentMood + weight);
          }
        }

        // Track negative signals
        if (weight < 0 && feedback.reasons) {
          patterns.negativeSignals.push({
            reasons: feedback.reasons,
            product: currentProduct,
            weight: Math.abs(weight)
          });
        }
      }
    }

    return patterns;
  },

  /**
   * Get price range category
   */
  getPriceRange(price: number): string {
    if (price < 25) return 'budget';
    if (price < 100) return 'mid-range';
    if (price < 500) return 'premium';
    return 'luxury';
  },

  /**
   * Update user similarity scores based on feedback
   */
  async updateUserSimilarityFromFeedback(userId: number, feedback: UserFeedback, patterns: any): Promise<void> {
    try {
      // Get users who liked/disliked the same product
      const similarFeedback = await storage.getFeedbackForProduct(feedback.productId);
      
      for (const otherFeedback of similarFeedback) {
        if (otherFeedback.userId === userId) continue;
        
        // Calculate feedback similarity
        const feedbackSimilarity = this.calculateFeedbackSimilarity(
          parseFloat(feedback.feedbackValue.toString()),
          parseFloat(otherFeedback.feedbackValue.toString())
        );
        
        // Update or create user similarity
        if (feedbackSimilarity > 0.1) { // Only update if there's meaningful similarity
          await storage.updateUserSimilarity(
            userId,
            otherFeedback.userId,
            feedbackSimilarity
          );
        }
      }
    } catch (error) {
      console.error("Error updating user similarity from feedback:", error);
    }
  },

  /**
   * Calculate similarity between two feedback values
   */
  calculateFeedbackSimilarity(feedback1: number, feedback2: number): number {
    // If both are positive or both are negative, they're similar
    if ((feedback1 > 0 && feedback2 > 0) || (feedback1 < 0 && feedback2 < 0)) {
      return 1 - Math.abs(feedback1 - feedback2) / 2; // Scale similarity 0-1
    }
    // If one is positive and one is negative, they're dissimilar
    return 0;
  },

  /**
   * Update product recommendation weights based on feedback
   */
  async updateProductWeights(userId: number, feedback: UserFeedback, patterns: any): Promise<void> {
    try {
      const product = await storage.getProduct(feedback.productId);
      if (!product) return;

      // Create or update a user-specific product preference record
      // This would help personalize future recommendations
      const preferenceUpdate = {
        userId: userId,
        productId: feedback.productId,
        preferenceScore: parseFloat(feedback.feedbackValue.toString()),
        lastUpdated: new Date()
      };

      // In a real implementation, you'd save this to a user_product_preferences table
      // For now, we'll update the recommendation scoring logic
      
    } catch (error) {
      console.error("Error updating product weights:", error);
    }
  },

  /**
   * Get personalized recommendations using reinforcement learning
   */
  async getPersonalizedRecommendations(
    userId: number,
    recipientId: number,
    options: {
      limit?: number;
      excludeDisliked?: boolean;
      boostLiked?: boolean;
    } = {}
  ): Promise<any[]> {
    try {
      const { limit = 10, excludeDisliked = true, boostLiked = true } = options;
      
      // Get user's feedback history
      const feedbackHistory = await storage.getUserFeedbackHistory(userId);
      
      // Get base recommendations
      let recommendations = await storage.getHybridRecommendations(userId, recipientId, { limit: limit * 2 });
      
      // Apply reinforcement learning adjustments
      recommendations = recommendations.map(rec => {
        let adjustedScore = parseFloat(rec.recommendationScore?.toString() || '0');
        
        // Find feedback for this product
        const productFeedback = feedbackHistory.filter(f => f.productId === rec.productId);
        
        if (productFeedback.length > 0) {
          // Calculate average feedback score
          const avgFeedback = productFeedback.reduce((sum, f) => 
            sum + parseFloat(f.feedbackValue.toString()), 0) / productFeedback.length;
          
          if (excludeDisliked && avgFeedback < -0.3) {
            // Heavily penalize disliked products
            adjustedScore *= 0.1;
          } else if (boostLiked && avgFeedback > 0.3) {
            // Boost liked products
            adjustedScore *= (1 + avgFeedback);
          } else {
            // Moderate adjustment for neutral feedback
            adjustedScore *= (1 + avgFeedback * 0.5);
          }
        }
        
        return {
          ...rec,
          originalScore: rec.recommendationScore,
          adjustedScore: adjustedScore,
          feedbackInfluence: productFeedback.length > 0
        };
      });
      
      // Sort by adjusted score and limit results
      recommendations.sort((a, b) => b.adjustedScore - a.adjustedScore);
      
      return recommendations.slice(0, limit);
      
    } catch (error) {
      console.error("Error getting personalized recommendations:", error);
      return [];
    }
  },

  /**
   * Get feedback insights for analytics
   */
  async getFeedbackInsights(userId: number): Promise<any> {
    try {
      const feedbackHistory = await storage.getUserFeedbackHistory(userId);
      
      const insights = {
        totalFeedback: feedbackHistory.length,
        positiveRatio: 0,
        negativeRatio: 0,
        topCategories: new Map<string, number>(),
        topReasons: new Map<string, number>(),
        averageEngagement: 0
      };
      
      let positiveCount = 0;
      let negativeCount = 0;
      let totalTimeSpent = 0;
      let timeSpentCount = 0;
      
      for (const feedback of feedbackHistory) {
        const value = parseFloat(feedback.feedbackValue.toString());
        
        if (value > 0) positiveCount++;
        if (value < 0) negativeCount++;
        
        if (feedback.timeSpent) {
          totalTimeSpent += feedback.timeSpent;
          timeSpentCount++;
        }
        
        if (feedback.reasons) {
          for (const reason of feedback.reasons) {
            const current = insights.topReasons.get(reason) || 0;
            insights.topReasons.set(reason, current + 1);
          }
        }
      }
      
      insights.positiveRatio = feedbackHistory.length > 0 ? positiveCount / feedbackHistory.length : 0;
      insights.negativeRatio = feedbackHistory.length > 0 ? negativeCount / feedbackHistory.length : 0;
      insights.averageEngagement = timeSpentCount > 0 ? totalTimeSpent / timeSpentCount : 0;
      
      return insights;
      
    } catch (error) {
      console.error("Error getting feedback insights:", error);
      return null;
    }
  }
};