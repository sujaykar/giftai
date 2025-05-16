import { storage } from "../storage";
import { InsertRecommendation } from "@shared/schema";

// Simple rule-based recommendation engine for MVP
export async function generateRecommendations(
  userId: number,
  recipient: any,
  preferences: any[]
): Promise<InsertRecommendation[]> {
  // Extract and organize preferences
  const interestsPref = preferences.find(p => p.preferenceType === "interests");
  const giftPref = preferences.find(p => p.preferenceType === "gift_preferences");
  const ageRangePref = preferences.find(p => p.preferenceType === "age_range");
  
  // Extract actual values
  const interests = interestsPref?.preferenceValue || [];
  const giftPreferences = giftPref?.preferenceValue || {};
  const ageRange = ageRangePref?.preferenceValue || "";
  
  // Get budget range if available
  let minPrice = 0;
  let maxPrice = Infinity;
  
  if (giftPreferences.budget) {
    const budget = giftPreferences.budget;
    switch (budget) {
      case "under-25":
        minPrice = 0;
        maxPrice = 25;
        break;
      case "25-50":
        minPrice = 25;
        maxPrice = 50;
        break;
      case "50-100":
        minPrice = 50;
        maxPrice = 100;
        break;
      case "100-200":
        minPrice = 100;
        maxPrice = 200;
        break;
      case "200-500":
        minPrice = 200;
        maxPrice = 500;
        break;
      case "over-500":
        minPrice = 500;
        break;
    }
  }
  
  // Get all products that match the criteria
  const allProducts = await storage.getProducts();
  
  // Filter products
  const matchingProducts = allProducts.filter(product => {
    // Check price range
    const price = parseFloat(product.price.toString());
    if (price < minPrice || price > maxPrice) {
      return false;
    }
    
    // Calculate interest and tag matches
    const interestMatches = interests.length > 0 ? 
      interests.some((interest: string) => 
        product.tags.includes(interest.toLowerCase()) || 
        product.categories.includes(interest.toLowerCase())
      ) : true;
    
    return interestMatches;
  });
  
  // Sort by relevance (for MVP, simple scoring)
  const scoredProducts = matchingProducts.map(product => {
    let score = 1.0; // Base score
    
    // Add points for interest matches
    interests.forEach((interest: string) => {
      if (product.tags.includes(interest.toLowerCase())) score += 0.5;
      if (product.categories.includes(interest.toLowerCase())) score += 0.3;
    });
    
    // Penalize products that are very close to the price limits
    if (price => maxPrice * 0.95) score -= 0.1;
    
    return { product, score };
  });
  
  // Sort by score (descending)
  scoredProducts.sort((a, b) => b.score - a.score);
  
  // Take top 5 unique products
  const topProducts = scoredProducts.slice(0, 5);
  
  // Format as recommendations
  return topProducts.map(({ product, score }) => {
    // Generate simple reasoning based on matches
    let reasoning = "";
    const matchingInterests = interests.filter((interest: string) => 
      product.tags.includes(interest.toLowerCase()) || 
      product.categories.includes(interest.toLowerCase())
    );
    
    if (matchingInterests.length > 0) {
      reasoning = `Matches ${recipient.name}'s interest in ${matchingInterests.join(", ")}.`;
    } else {
      reasoning = `Selected based on ${recipient.name}'s preferences.`;
    }
    
    return {
      userId,
      recipientId: recipient.id,
      productId: product.id,
      recommendationScore: score,
      reasoning,
      status: "new"
    };
  });
}
