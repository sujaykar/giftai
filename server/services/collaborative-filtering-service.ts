import { storage } from "../storage";

/**
 * Service for collaborative filtering recommendation system
 */
export const collaborativeFilteringService = {
  /**
   * Calculate Jaccard similarity between two users based on purchase history
   * Jaccard similarity = (size of intersection) / (size of union)
   */
  async calculateJaccardSimilarity(userId1: number, userId2: number): Promise<number> {
    try {
      // Get purchase history for both users
      const userPurchases1 = await storage.getPurchaseHistory(userId1);
      const userPurchases2 = await storage.getPurchaseHistory(userId2);
      
      // Extract product IDs purchased by each user
      const productIds1 = new Set(userPurchases1.map(p => p.productId));
      const productIds2 = new Set(userPurchases2.map(p => p.productId));
      
      // Calculate intersection and union
      const intersection = new Set([...productIds1].filter(x => productIds2.has(x)));
      
      // Union is the size of set1 + size of set2 - intersection
      const union = productIds1.size + productIds2.size - intersection.size;
      
      // Calculate Jaccard similarity
      if (union === 0) return 0; // No products purchased by either user
      
      return intersection.size / union;
    } catch (error) {
      console.error(`Error calculating similarity between users ${userId1} and ${userId2}:`, error);
      return 0;
    }
  },
  
  /**
   * Update similarities for all users
   */
  async updateAllUserSimilarities(): Promise<any[]> {
    try {
      // Get all users
      const users = await storage.getAllUsers();
      const similarities = [];
      
      // Calculate similarity for each pair of users
      for (let i = 0; i < users.length; i++) {
        const user1 = users[i];
        
        for (let j = i + 1; j < users.length; j++) {
          const user2 = users[j];
          
          // Skip self-comparison
          if (user1.id === user2.id) continue;
          
          // Calculate similarity
          const similarityScore = await this.calculateJaccardSimilarity(user1.id, user2.id);
          
          // Only store if there's some similarity
          if (similarityScore > 0) {
            // Store the similarity (bidirectionally)
            const similarity1 = await storage.updateUserSimilarity(user1.id, user2.id, similarityScore);
            const similarity2 = await storage.updateUserSimilarity(user2.id, user1.id, similarityScore);
            similarities.push(similarity1, similarity2);
          }
        }
      }
      
      return similarities;
    } catch (error) {
      console.error("Error updating all user similarities:", error);
      return [];
    }
  },
  
  /**
   * Calculate user similarities for a specific user
   */
  async calculateUserSimilarities(userId: number): Promise<any[]> {
    try {
      // Get all users except the target user
      const allUsers = await storage.getAllUsers();
      const otherUsers = allUsers.filter(user => user.id !== userId);
      
      const similarities = [];
      
      // Calculate similarity between target user and each other user
      for (const otherUser of otherUsers) {
        // Calculate similarity
        const similarityScore = await this.calculateJaccardSimilarity(userId, otherUser.id);
        
        // Only store if there's some similarity
        if (similarityScore > 0) {
          // Store the similarity (bidirectionally)
          const similarity = await storage.updateUserSimilarity(userId, otherUser.id, similarityScore);
          similarities.push(similarity);
        }
      }
      
      return similarities;
    } catch (error) {
      console.error(`Error calculating similarities for user ${userId}:`, error);
      return [];
    }
  },
  
  /**
   * Get product recommendations based on similar users' purchase history
   */
  async getCollaborativeRecommendations(userId: number, limit: number = 10): Promise<any[]> {
    try {
      // Get user's own purchase history
      const userPurchases = await storage.getPurchaseHistory(userId);
      const userProductIds = new Set(userPurchases.map(p => p.productId));
      
      // Get similar users
      const similarUsers = await storage.getSimilarUsers(userId, 5); // Get top 5 similar users
      
      if (similarUsers.length === 0) {
        return []; // No similar users found
      }
      
      // Create a map to accumulate product scores
      const productScores = new Map<number, number>();
      
      // For each similar user, get their purchases and weight by similarity
      for (const similarity of similarUsers) {
        const similarUserPurchases = await storage.getPurchaseHistory(similarity.similarUserId);
        
        // Only consider products the target user hasn't purchased yet
        const newProducts = similarUserPurchases.filter(p => !userProductIds.has(p.productId));
        
        for (const purchase of newProducts) {
          const currentScore = productScores.get(purchase.productId) || 0;
          productScores.set(purchase.productId, currentScore + parseFloat(similarity.similarityScore));
        }
      }
      
      // Sort products by score (descending)
      const sortedProducts = [...productScores.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit);
      
      // Get full product details
      const recommendedProducts = await Promise.all(
        sortedProducts.map(async ([productId, score]) => {
          const product = await storage.getProduct(productId);
          return {
            ...product,
            collaborativeScore: score,
          };
        })
      );
      
      return recommendedProducts;
    } catch (error) {
      console.error(`Error getting collaborative recommendations for user ${userId}:`, error);
      return [];
    }
  },
  
  /**
   * Utility method to get all users
   */
  async getAllUsers(): Promise<any[]> {
    // This would be implemented in a real system, for now we'll stub it
    // It would call storage.getAllUsers() in a real implementation
    try {
      // This is a placeholder - in a real system, you would have a proper implementation
      return await storage.getAllUsers();
    } catch (error) {
      console.error("Error getting all users:", error);
      return [];
    }
  }
};