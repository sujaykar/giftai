import { storage } from '../storage';
import type { Recipient, Product, Recommendation } from '@shared/schema';

interface RelationshipDynamics {
  intimacyLevel: 'low' | 'medium' | 'high' | 'very_high';
  formalityLevel: 'casual' | 'formal' | 'professional';
  giftingFrequency: 'rare' | 'occasional' | 'frequent';
  budgetRange: 'budget' | 'moderate' | 'premium' | 'luxury';
  emotionalConnection: 'distant' | 'friendly' | 'close' | 'intimate';
  sharedInterests: string[];
  communicationStyle: 'direct' | 'thoughtful' | 'playful' | 'romantic';
}

interface GiftPairingResult {
  primaryGift: Product;
  complementaryGifts: Product[];
  pairingReason: string;
  relationshipInsight: string;
  totalValue: number;
  confidenceScore: number;
}

export class RelationshipAnalysisService {
  /**
   * Analyze relationship dynamics between user and recipient
   */
  static analyzeRelationshipDynamics(recipient: Recipient, userAge?: number): RelationshipDynamics {
    const relationship = recipient.relationship.toLowerCase();
    const age = recipient.age || 25;
    const ageDifference = userAge ? Math.abs(userAge - age) : 10;

    // Determine intimacy level based on relationship type
    let intimacyLevel: RelationshipDynamics['intimacyLevel'] = 'medium';
    if (['spouse', 'partner', 'boyfriend', 'girlfriend', 'fiance', 'fiancee'].includes(relationship)) {
      intimacyLevel = 'very_high';
    } else if (['parent', 'mother', 'father', 'child', 'son', 'daughter', 'sibling', 'brother', 'sister'].includes(relationship)) {
      intimacyLevel = 'high';
    } else if (['friend', 'best friend', 'close friend', 'roommate'].includes(relationship)) {
      intimacyLevel = 'medium';
    } else if (['colleague', 'boss', 'coworker', 'acquaintance', 'neighbor'].includes(relationship)) {
      intimacyLevel = 'low';
    }

    // Determine formality level
    let formalityLevel: RelationshipDynamics['formalityLevel'] = 'casual';
    if (['boss', 'manager', 'supervisor', 'client', 'teacher', 'professor'].includes(relationship)) {
      formalityLevel = 'professional';
    } else if (['grandparent', 'grandmother', 'grandfather', 'aunt', 'uncle'].includes(relationship)) {
      formalityLevel = 'formal';
    }

    // Determine emotional connection
    let emotionalConnection: RelationshipDynamics['emotionalConnection'] = 'friendly';
    if (intimacyLevel === 'very_high') {
      emotionalConnection = 'intimate';
    } else if (intimacyLevel === 'high') {
      emotionalConnection = 'close';
    } else if (intimacyLevel === 'low') {
      emotionalConnection = 'distant';
    }

    // Determine budget range based on relationship closeness
    let budgetRange: RelationshipDynamics['budgetRange'] = 'moderate';
    if (intimacyLevel === 'very_high') {
      budgetRange = 'premium';
    } else if (intimacyLevel === 'high') {
      budgetRange = 'moderate';
    } else if (intimacyLevel === 'low') {
      budgetRange = 'budget';
    }

    // Determine communication style
    let communicationStyle: RelationshipDynamics['communicationStyle'] = 'thoughtful';
    if (['spouse', 'partner', 'boyfriend', 'girlfriend'].includes(relationship)) {
      communicationStyle = 'romantic';
    } else if (['friend', 'best friend', 'sibling', 'brother', 'sister'].includes(relationship)) {
      communicationStyle = 'playful';
    } else if (['colleague', 'boss', 'coworker'].includes(relationship)) {
      communicationStyle = 'direct';
    }

    return {
      intimacyLevel,
      formalityLevel,
      giftingFrequency: intimacyLevel === 'very_high' ? 'frequent' : intimacyLevel === 'high' ? 'occasional' : 'rare',
      budgetRange,
      emotionalConnection,
      sharedInterests: [], // This would be populated from user data/preferences
      communicationStyle
    };
  }

  /**
   * Generate AI-powered gift pairings based on relationship dynamics
   */
  static async generateGiftPairings(
    userId: number,
    recipientId: number,
    occasion?: string,
    maxBudget?: number
  ): Promise<GiftPairingResult[]> {
    try {
      // Get recipient and their preferences
      const recipient = await storage.getRecipient(recipientId);
      if (!recipient) {
        throw new Error('Recipient not found');
      }

      const user = await storage.getUser(userId);
      const userAge = user ? 30 : undefined; // Default age if not available

      // Analyze relationship dynamics
      const dynamics = this.analyzeRelationshipDynamics(recipient, userAge);

      // Get recipient preferences
      const preferences = await storage.getPreferencesByRecipientId(recipientId);

      // Get available products
      const products = await storage.getProducts();

      // Filter products based on relationship dynamics and budget
      const suitableProducts = this.filterProductsByRelationship(products, dynamics, maxBudget);

      // Generate pairing combinations
      const pairings = this.generatePairingCombinations(suitableProducts, dynamics, occasion);

      // Score and rank pairings
      const rankedPairings = this.scoreAndRankPairings(pairings, dynamics, preferences, recipient);

      return rankedPairings.slice(0, 5); // Return top 5 pairings
    } catch (error) {
      console.error('Error generating gift pairings:', error);
      return [];
    }
  }

  /**
   * Filter products based on relationship dynamics
   */
  private static filterProductsByRelationship(
    products: Product[],
    dynamics: RelationshipDynamics,
    maxBudget?: number
  ): Product[] {
    return products.filter(product => {
      // Budget filter
      if (maxBudget && product.price > maxBudget) {
        return false;
      }

      // Relationship appropriateness filter
      const category = product.category?.toLowerCase() || '';
      
      // Filter out inappropriate items based on relationship
      if (dynamics.intimacyLevel === 'low') {
        // Avoid personal/intimate items for distant relationships
        if (['lingerie', 'jewelry', 'perfume', 'personal care'].some(cat => category.includes(cat))) {
          return false;
        }
      }

      if (dynamics.formalityLevel === 'professional') {
        // Stick to professional appropriate gifts
        if (['clothing', 'toys', 'games', 'humor'].some(cat => category.includes(cat))) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Generate pairing combinations
   */
  private static generatePairingCombinations(
    products: Product[],
    dynamics: RelationshipDynamics,
    occasion?: string
  ): Array<{ primary: Product; complementary: Product[] }> {
    const combinations: Array<{ primary: Product; complementary: Product[] }> = [];

    products.forEach(primaryProduct => {
      const complementaryProducts = this.findComplementaryProducts(
        primaryProduct,
        products,
        dynamics,
        occasion
      );

      if (complementaryProducts.length > 0) {
        combinations.push({
          primary: primaryProduct,
          complementary: complementaryProducts.slice(0, 3) // Max 3 complementary items
        });
      }
    });

    return combinations;
  }

  /**
   * Find complementary products for a primary gift
   */
  private static findComplementaryProducts(
    primaryProduct: Product,
    allProducts: Product[],
    dynamics: RelationshipDynamics,
    occasion?: string
  ): Product[] {
    const primaryCategory = primaryProduct.category?.toLowerCase() || '';
    const complementary: Product[] = [];

    // Define complementary relationships
    const complementaryMap: Record<string, string[]> = {
      'electronics': ['accessories', 'tech', 'gadgets'],
      'books': ['stationery', 'reading accessories', 'bookmarks'],
      'clothing': ['accessories', 'jewelry', 'shoes'],
      'beauty': ['skincare', 'makeup', 'accessories'],
      'home': ['decor', 'kitchen', 'organization'],
      'fitness': ['sports', 'health', 'nutrition'],
      'food': ['beverages', 'kitchen', 'dining'],
      'art': ['supplies', 'crafts', 'stationery']
    };

    // Find products in complementary categories
    const complementaryCategories = complementaryMap[primaryCategory] || [];
    
    allProducts.forEach(product => {
      if (product.id === primaryProduct.id) return;

      const productCategory = product.category?.toLowerCase() || '';
      
      // Check if product is in a complementary category
      if (complementaryCategories.some(cat => productCategory.includes(cat))) {
        complementary.push(product);
      }
      
      // Check for thematic connections based on occasion
      if (occasion) {
        const occasionLower = occasion.toLowerCase();
        if (product.description?.toLowerCase().includes(occasionLower) ||
            product.name?.toLowerCase().includes(occasionLower)) {
          complementary.push(product);
        }
      }
    });

    // Sort by price to create balanced combinations
    return complementary
      .sort((a, b) => a.price - b.price)
      .filter((product, index, array) => 
        array.findIndex(p => p.category === product.category) === index
      ); // Remove duplicates from same category
  }

  /**
   * Score and rank pairing combinations
   */
  private static scoreAndRankPairings(
    combinations: Array<{ primary: Product; complementary: Product[] }>,
    dynamics: RelationshipDynamics,
    preferences: any[],
    recipient: Recipient
  ): GiftPairingResult[] {
    return combinations.map(combo => {
      const totalValue = combo.primary.price + combo.complementary.reduce((sum, p) => sum + p.price, 0);
      
      // Calculate confidence score based on multiple factors
      let confidenceScore = 0.5; // Base score

      // Relationship appropriateness score
      if (dynamics.intimacyLevel === 'very_high' && totalValue > 100) confidenceScore += 0.2;
      if (dynamics.intimacyLevel === 'high' && totalValue > 50) confidenceScore += 0.15;
      if (dynamics.intimacyLevel === 'medium' && totalValue < 100) confidenceScore += 0.1;

      // Age appropriateness
      if (recipient.age) {
        const ageCategory = recipient.age < 18 ? 'teen' : recipient.age < 35 ? 'young_adult' : recipient.age < 55 ? 'adult' : 'senior';
        if (combo.primary.description?.toLowerCase().includes(ageCategory)) confidenceScore += 0.1;
      }

      // Gender appropriateness
      if (recipient.gender && combo.primary.description?.toLowerCase().includes(recipient.gender.toLowerCase())) {
        confidenceScore += 0.1;
      }

      // Preference matching
      if (preferences.length > 0) {
        const preferenceMatch = preferences.some(pref => 
          combo.primary.description?.toLowerCase().includes(pref.preferenceValue?.toString().toLowerCase())
        );
        if (preferenceMatch) confidenceScore += 0.15;
      }

      confidenceScore = Math.min(1.0, confidenceScore); // Cap at 1.0

      return {
        primaryGift: combo.primary,
        complementaryGifts: combo.complementary,
        pairingReason: this.generatePairingReason(combo, dynamics, recipient),
        relationshipInsight: this.generateRelationshipInsight(dynamics, recipient),
        totalValue,
        confidenceScore
      };
    }).sort((a, b) => b.confidenceScore - a.confidenceScore);
  }

  /**
   * Generate human-readable pairing reason
   */
  private static generatePairingReason(
    combo: { primary: Product; complementary: Product[] },
    dynamics: RelationshipDynamics,
    recipient: Recipient
  ): string {
    const relationship = recipient.relationship.toLowerCase();
    const primaryName = combo.primary.name;
    const complementaryNames = combo.complementary.map(p => p.name).join(', ');

    const reasons = [
      `Perfect for a ${relationship} who would appreciate ${primaryName.toLowerCase()}`,
      `${primaryName} pairs beautifully with ${complementaryNames} for a complete gift experience`,
      `This combination shows thoughtfulness and consideration for your ${relationship}`,
      `Ideal pairing that reflects the ${dynamics.emotionalConnection} bond you share`,
      `These items complement each other perfectly for someone special like your ${relationship}`
    ];

    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  /**
   * Generate relationship insight
   */
  private static generateRelationshipInsight(
    dynamics: RelationshipDynamics,
    recipient: Recipient
  ): string {
    const insights = [
      `Your ${dynamics.emotionalConnection} relationship suggests gifts that show ${dynamics.communicationStyle} thoughtfulness`,
      `Given your ${dynamics.intimacyLevel} intimacy level, this pairing strikes the perfect balance`,
      `For a ${recipient.relationship.toLowerCase()}, this combination respects your ${dynamics.formalityLevel} dynamic`,
      `This pairing reflects the special bond you share and your understanding of their preferences`
    ];

    return insights[Math.floor(Math.random() * insights.length)];
  }
}