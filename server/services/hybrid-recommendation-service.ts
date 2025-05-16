import { storage } from '../storage';
import { 
  User, 
  Recipient, 
  Product, 
  Recommendation,
  InsertRecommendation
} from '@shared/schema';
import { generateRelationshipBasedRecommendations } from './openai-service';
import { getCollaborativeRecommendations } from './collaborative-filtering-service';

interface HybridRecommendationOptions {
  limit?: number;
  includeAI?: boolean;
  includeCollaborative?: boolean; 
  includeContentBased?: boolean;
  mood?: string;
  occasion?: string;
  minPrice?: number;
  maxPrice?: number;
  categories?: string[];
  tags?: string[];
  ageRanges?: string[];
  genders?: string[];
}

/**
 * Generate content-based recommendations based on recipient preferences and product metadata
 */
export async function getContentBasedRecommendations(
  userId: number,
  recipientId: number,
  options: {
    limit?: number;
    mood?: string;
    occasion?: string;
    minPrice?: number;
    maxPrice?: number;
    categories?: string[];
  } = {}
): Promise<Product[]> {
  try {
    // Get recipient details
    const recipient = await storage.getRecipient(recipientId);
    if (!recipient) {
      throw new Error(`Recipient with id ${recipientId} not found`);
    }
    
    // Get recipient preferences
    const preferences = await storage.getPreferencesByRecipientId(recipientId);
    
    // Build filter criteria
    const filterCriteria: any = {
      // Price range filter
      ...(options.minPrice && { minPrice: options.minPrice }),
      ...(options.maxPrice && { maxPrice: options.maxPrice }),
      
      // Category filter
      ...(options.categories && options.categories.length > 0 && { 
        categories: options.categories 
      }),
      
      // Occasion filter
      ...(options.occasion && {
        occasions: [options.occasion]
      }),
      
      // Mood filter
      ...(options.mood && {
        moods: [options.mood]
      }),
      
      // Age appropriate
      ...(recipient.age && {
        ageRanges: [`${Math.floor(recipient.age / 10) * 10}s`]
      }),
      
      // Gender appropriate (if specified)
      ...(recipient.gender && {
        genders: [recipient.gender, 'unisex', 'any']
      }),
      
      // Relationship context
      relationship: recipient.relationship
    };
    
    // Extract interests from preferences
    const interests: string[] = [];
    preferences.forEach(pref => {
      if (pref.preferenceType === 'interest' || pref.preferenceType === 'hobby') {
        // Handle various preference value formats
        if (typeof pref.preferenceValue === 'string') {
          interests.push(pref.preferenceValue);
        } else if (typeof pref.preferenceValue === 'object' && pref.preferenceValue.value) {
          interests.push(pref.preferenceValue.value);
        }
      }
    });
    
    // Get all products
    const allProducts = await storage.getProducts();
    
    // Score products based on match criteria
    const scoredProducts = allProducts.map(product => {
      let score = 0;
      
      // Score based on price range
      if (options.minPrice && options.maxPrice) {
        const price = parseFloat(String(product.price));
        if (price >= options.minPrice && price <= options.maxPrice) {
          score += 5;
        }
      }
      
      // Score based on interests match
      if (interests.length > 0 && product.interests) {
        const matchingInterests = interests.filter(interest => 
          product.interests?.includes(interest)
        );
        score += matchingInterests.length * 10;
      }
      
      // Score based on category match
      if (options.categories && options.categories.length > 0 && product.categories) {
        const matchingCategories = options.categories.filter(category => 
          product.categories?.includes(category)
        );
        score += matchingCategories.length * 8;
      }
      
      // Score based on occasion match
      if (options.occasion && product.occasions) {
        if (product.occasions.includes(options.occasion)) {
          score += 12;
        }
      }
      
      // Score based on mood match
      if (options.mood && product.moods) {
        if (product.moods.includes(options.mood)) {
          score += 15;
        }
      }
      
      // Score based on relationship match
      if (recipient.relationship && product.relationships) {
        if (product.relationships.includes(recipient.relationship)) {
          score += 20;
        }
      }
      
      // Score based on age appropriateness
      if (recipient.age && product.ageRanges) {
        const ageGroup = `${Math.floor(recipient.age / 10) * 10}s`;
        if (product.ageRanges.includes(ageGroup)) {
          score += 8;
        }
      }
      
      // Score based on gender appropriateness
      if (recipient.gender && product.genders) {
        if (
          product.genders.includes(recipient.gender) || 
          product.genders.includes('unisex') || 
          product.genders.includes('any')
        ) {
          score += 5;
        }
      }
      
      return { product, score };
    });
    
    // Sort by score and take top results
    const limit = options.limit || 10;
    const topProducts = scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.product);
    
    return topProducts;
  } catch (error) {
    console.error(`Error getting content-based recommendations for recipient ${recipientId}:`, error);
    return [];
  }
}

/**
 * Generate AI-based recommendations using the OpenAI service
 */
export async function getAIRecommendations(
  userId: number,
  recipientId: number,
  options: {
    limit?: number;
    mood?: string;
    occasion?: string;
  } = {}
): Promise<Recommendation[]> {
  try {
    // Get recipient
    const recipient = await storage.getRecipient(recipientId);
    if (!recipient) {
      throw new Error(`Recipient with id ${recipientId} not found`);
    }
    
    // Get preferences
    const preferences = await storage.getPreferencesByRecipientId(recipientId);
    
    // Format interests from preferences
    const interests = preferences
      .filter(p => p.preferenceType === 'interest' || p.preferenceType === 'hobby')
      .map(p => {
        if (typeof p.preferenceValue === 'string') {
          return p.preferenceValue;
        } else if (typeof p.preferenceValue === 'object' && p.preferenceValue.value) {
          return p.preferenceValue.value;
        }
        return '';
      })
      .filter(Boolean);
    
    // Generate AI recommendations
    const aiSuggestions = await generateRelationshipBasedRecommendations({
      recipient: {
        name: recipient.name,
        age: recipient.age,
        gender: recipient.gender,
        relationship: recipient.relationship
      },
      interests,
      mood: options.mood,
      occasion: options.occasion
    });
    
    // Convert AI suggestions to Recommendations
    const recommendations: Recommendation[] = [];
    
    for (const suggestion of aiSuggestions) {
      // Either find existing product or create a new one
      let product: Product;
      
      // Try to find an existing product with the same name
      const existingProducts = await storage.getProducts({ 
        name: suggestion.product.name 
      });
      
      if (existingProducts.length > 0) {
        product = existingProducts[0];
      } else {
        // Create a new product if none exists
        product = await storage.createProduct({
          name: suggestion.product.name,
          description: suggestion.product.description,
          price: suggestion.product.price,
          category: suggestion.category,
          categories: [suggestion.category],
          occasions: options.occasion ? [options.occasion] : [],
          moods: options.mood ? [options.mood] : [],
          relationships: [recipient.relationship],
          imageUrl: suggestion.product.imageUrl || null,
          purchaseUrl: suggestion.product.purchaseUrl || null
        });
      }
      
      // Create recommendation
      const recommendation = await storage.createRecommendation({
        userId,
        recipientId,
        productId: product.id,
        relationshipContext: recipient.relationship,
        mood: options.mood || null,
        reasoning: suggestion.reasoning,
        reasonText: suggestion.reasonText,
        recommendationScore: '0.95',
        confidenceScore: '0.90',
        status: 'new'
      });
      
      recommendations.push(recommendation);
    }
    
    return recommendations;
  } catch (error) {
    console.error(`Error getting AI recommendations for recipient ${recipientId}:`, error);
    return [];
  }
}

/**
 * Get hybrid recommendations combining all recommendation methods
 */
export async function getHybridRecommendations(
  userId: number,
  recipientId: number,
  options: HybridRecommendationOptions = {}
): Promise<(Recommendation & { product: Product })[]> {
  try {
    const limit = options.limit || 10;
    const results: (Recommendation & { product: Product })[] = [];
    
    // 1. Get AI recommendations if enabled
    if (options.includeAI !== false) {
      const aiRecommendations = await getAIRecommendations(
        userId, 
        recipientId,
        {
          limit: Math.ceil(limit / 2),
          mood: options.mood,
          occasion: options.occasion
        }
      );
      
      // Get full recommendation objects with products
      for (const rec of aiRecommendations) {
        const product = await storage.getProduct(rec.productId);
        if (product) {
          results.push({ ...rec, product });
        }
      }
    }
    
    // 2. Get content-based recommendations if enabled
    if (options.includeContentBased !== false) {
      const contentBasedProducts = await getContentBasedRecommendations(
        userId,
        recipientId,
        {
          limit: Math.ceil(limit / 3),
          mood: options.mood,
          occasion: options.occasion,
          minPrice: options.minPrice,
          maxPrice: options.maxPrice,
          categories: options.categories
        }
      );
      
      // Convert to recommendations and add to results
      for (const product of contentBasedProducts) {
        // Check if this product is already in results
        const alreadyRecommended = results.some(r => r.productId === product.id);
        if (!alreadyRecommended) {
          // Create recommendation
          const recommendation = await storage.createRecommendation({
            userId,
            recipientId,
            productId: product.id,
            relationshipContext: null,
            mood: options.mood || null,
            reasoning: null,
            reasonText: "Matched based on recipient's preferences and interests",
            recommendationScore: '0.80',
            confidenceScore: '0.75',
            status: 'new'
          });
          
          results.push({ ...recommendation, product });
        }
      }
    }
    
    // 3. Get collaborative filtering recommendations if enabled
    if (options.includeCollaborative !== false) {
      const collaborativeProducts = await getCollaborativeRecommendations(
        userId,
        Math.ceil(limit / 4)
      );
      
      // Convert to recommendations and add to results
      for (const product of collaborativeProducts) {
        // Check if this product is already in results
        const alreadyRecommended = results.some(r => r.productId === product.id);
        if (!alreadyRecommended) {
          // Create recommendation
          const recommendation = await storage.createRecommendation({
            userId,
            recipientId,
            productId: product.id,
            relationshipContext: null,
            mood: null,
            reasoning: null,
            reasonText: "Recommended based on similar users' purchases",
            recommendationScore: '0.70',
            confidenceScore: '0.65',
            status: 'new'
          });
          
          results.push({ ...recommendation, product });
        }
      }
    }
    
    // Apply additional filters
    let filteredResults = [...results];
    
    // Price filter
    if (options.minPrice || options.maxPrice) {
      filteredResults = filteredResults.filter(result => {
        const price = parseFloat(String(result.product.price));
        if (options.minPrice && price < options.minPrice) return false;
        if (options.maxPrice && price > options.maxPrice) return false;
        return true;
      });
    }
    
    // Category filter
    if (options.categories && options.categories.length > 0) {
      filteredResults = filteredResults.filter(result => {
        if (!result.product.categories) return false;
        return options.categories!.some(category => 
          result.product.categories?.includes(category)
        );
      });
    }
    
    // Sort by recommendation score and take limited number
    return filteredResults
      .sort((a, b) => 
        parseFloat(String(b.recommendationScore)) - parseFloat(String(a.recommendationScore))
      )
      .slice(0, limit);
  } catch (error) {
    console.error(`Error getting hybrid recommendations for user ${userId} and recipient ${recipientId}:`, error);
    return [];
  }
}