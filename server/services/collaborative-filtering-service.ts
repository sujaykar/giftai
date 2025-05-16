import { storage } from '../storage';
import { 
  User, 
  Product, 
  PurchaseHistory, 
  UserSimilarity, 
  InsertUserSimilarity
} from '@shared/schema';

/**
 * Calculate similarity between two users based on purchase history
 * Uses Jaccard similarity coefficient (intersection / union)
 */
export async function calculateUserSimilarity(
  userId: number, 
  otherUserId: number
): Promise<number> {
  try {
    // Get purchase history for both users
    const userPurchases = await storage.getPurchaseHistory(userId);
    const otherUserPurchases = await storage.getPurchaseHistory(otherUserId);
    
    if (userPurchases.length === 0 || otherUserPurchases.length === 0) {
      return 0; // Can't calculate similarity with no purchase data
    }
    
    // Get sets of product IDs purchased by each user
    const userProductIds = new Set(userPurchases.map(p => p.productId));
    const otherUserProductIds = new Set(otherUserPurchases.map(p => p.productId));
    
    // Calculate intersection 
    const intersection = new Set(
      [...userProductIds].filter(id => otherUserProductIds.has(id))
    );
    
    // Calculate union
    const union = new Set([...userProductIds, ...otherUserProductIds]);
    
    // Jaccard similarity: size of intersection / size of union
    const similarity = intersection.size / union.size;
    
    return similarity;
  } catch (error) {
    console.error(`Error calculating user similarity between ${userId} and ${otherUserId}:`, error);
    return 0;
  }
}

/**
 * Find similar users for a given user
 */
export async function findSimilarUsers(userId: number): Promise<UserSimilarity[]> {
  try {
    // Get all users except the current user
    const allUsers = await storage.getAllUsers();
    const otherUsers = allUsers.filter(user => user.id !== userId);
    
    const similarities: InsertUserSimilarity[] = [];
    
    // Calculate similarity with each other user
    for (const otherUser of otherUsers) {
      const similarityScore = await calculateUserSimilarity(userId, otherUser.id);
      
      // Only store significant similarities (adjust threshold as needed)
      if (similarityScore > 0.1) {
        similarities.push({
          userId,
          similarUserId: otherUser.id,
          similarityScore
        });
      }
    }
    
    // Store all similarities
    const storedSimilarities: UserSimilarity[] = [];
    for (const sim of similarities) {
      const stored = await storage.updateUserSimilarity(
        sim.userId,
        sim.similarUserId,
        sim.similarityScore
      );
      storedSimilarities.push(stored);
    }
    
    // Sort by similarity score (highest first)
    return storedSimilarities.sort((a, b) => 
      parseFloat(String(b.similarityScore)) - parseFloat(String(a.similarityScore))
    );
  } catch (error) {
    console.error(`Error finding similar users for user ${userId}:`, error);
    return [];
  }
}

/**
 * Get product recommendations based on similar users' purchases
 */
export async function getCollaborativeRecommendations(
  userId: number, 
  limit: number = 10
): Promise<Product[]> {
  try {
    // Get user's purchase history
    const userPurchases = await storage.getPurchaseHistory(userId);
    const purchasedProductIds = new Set(userPurchases.map(p => p.productId));
    
    // Get similar users
    const similarUsers = await storage.getSimilarUsers(userId, 10);
    
    if (similarUsers.length === 0) {
      return []; // No similar users found
    }
    
    // Create a weighted map of product recommendations
    // Products purchased by more similar users get higher scores
    const productScores = new Map<number, number>();
    
    for (const similarUser of similarUsers) {
      const similarity = parseFloat(String(similarUser.similarityScore));
      const similarUserPurchases = await storage.getPurchaseHistory(similarUser.similarUserId);
      
      for (const purchase of similarUserPurchases) {
        // Skip products the user has already purchased
        if (purchasedProductIds.has(purchase.productId)) {
          continue;
        }
        
        // Add or update score (weighted by similarity)
        const currentScore = productScores.get(purchase.productId) || 0;
        productScores.set(purchase.productId, currentScore + similarity);
      }
    }
    
    // Convert to array and sort by score
    const sortedProductIds = [...productScores.entries()]
      .sort((a, b) => b[1] - a[1]) // Sort by score descending
      .slice(0, limit) // Take only the top N products
      .map(entry => entry[0]); // Get just the product IDs
    
    // Retrieve the actual products
    const recommendations: Product[] = [];
    for (const productId of sortedProductIds) {
      const product = await storage.getProduct(productId);
      if (product) {
        recommendations.push(product);
      }
    }
    
    return recommendations;
  } catch (error) {
    console.error(`Error getting collaborative recommendations for user ${userId}:`, error);
    return [];
  }
}

/**
 * Update similarity scores for all users
 */
export async function updateAllUserSimilarities(): Promise<void> {
  try {
    const allUsers = await storage.getAllUsers();
    console.log(`Updating similarity scores for ${allUsers.length} users...`);
    
    for (const user of allUsers) {
      await findSimilarUsers(user.id);
    }
    
    console.log('User similarity update complete');
  } catch (error) {
    console.error('Error updating all user similarities:', error);
  }
}