import { 
  User, InsertUser, 
  Recipient, InsertRecipient, 
  Preference, InsertPreference,
  Product, InsertProduct,
  Recommendation, InsertRecommendation,
  Occasion, InsertOccasion,
  NotificationLog, InsertNotificationLog,
  ProductTag, InsertProductTag,
  PurchaseHistory, InsertPurchaseHistory,
  UserSimilarity, InsertUserSimilarity
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  getUserByFacebookId(facebookId: string): Promise<User | undefined>;
  getUserByAppleId(appleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;

  // Recipient methods
  getRecipient(id: number): Promise<Recipient | undefined>;
  getRecipientByUuid(uuid: string): Promise<Recipient | undefined>;
  getRecipientsByUserId(userId: number): Promise<Recipient[]>;
  createRecipient(recipient: InsertRecipient): Promise<Recipient>;
  updateRecipient(id: number, updates: Partial<Recipient>): Promise<Recipient | undefined>;
  deleteRecipient(id: number): Promise<boolean>;

  // Preference methods
  getPreferencesByRecipientId(recipientId: number): Promise<Preference[]>;
  createPreference(preference: InsertPreference): Promise<Preference>;
  updatePreference(id: number, updates: Partial<Preference>): Promise<Preference | undefined>;
  deletePreference(id: number): Promise<boolean>;

  // Product methods
  getProduct(id: number): Promise<Product | undefined>;
  getProductByUuid(uuid: string): Promise<Product | undefined>;
  getProducts(filters?: Partial<Product>): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined>;

  // Recommendation methods
  getRecommendation(id: number): Promise<Recommendation | undefined>;
  getRecommendationByUuid(uuid: string): Promise<Recommendation | undefined>;
  getRecommendationsByUserId(userId: number): Promise<Recommendation[]>;
  getRecommendationsByRecipientId(recipientId: number): Promise<Recommendation[]>;
  getRecommendationsWithProducts(userId: number): Promise<(Recommendation & { product: Product })[]>;
  createRecommendation(recommendation: InsertRecommendation): Promise<Recommendation>;
  updateRecommendation(id: number, updates: Partial<Recommendation>): Promise<Recommendation | undefined>;

  // Occasion methods
  getOccasion(id: number): Promise<Occasion | undefined>;
  getOccasionsByRecipientId(recipientId: number): Promise<Occasion[]>;
  getUpcomingOccasionsByUserId(userId: number): Promise<(Occasion & { recipient: Recipient })[]>;
  createOccasion(occasion: InsertOccasion): Promise<Occasion>;
  updateOccasion(id: number, updates: Partial<Occasion>): Promise<Occasion | undefined>;
  deleteOccasion(id: number): Promise<boolean>;

  // Notification methods
  createNotificationLog(log: InsertNotificationLog): Promise<NotificationLog>;
  getNotificationLogsByUserId(userId: number): Promise<NotificationLog[]>;
  
  // Product Tags methods
  getProductTags(productId: number): Promise<ProductTag[]>;
  getProductTagsByType(productId: number, tagType: string): Promise<ProductTag[]>;
  createProductTag(tag: InsertProductTag): Promise<ProductTag>;
  createProductTags(tags: InsertProductTag[]): Promise<ProductTag[]>;
  updateProductTag(id: number, updates: Partial<ProductTag>): Promise<ProductTag | undefined>;
  deleteProductTag(id: number): Promise<boolean>;
  autoGenerateProductTags(productId: number): Promise<ProductTag[]>;
  
  // Purchase History methods
  getPurchaseHistory(userId: number): Promise<PurchaseHistory[]>;
  getPurchaseHistoryByProduct(productId: number): Promise<PurchaseHistory[]>;
  getPurchaseHistoryByRecipient(recipientId: number): Promise<PurchaseHistory[]>;
  createPurchaseRecord(purchase: InsertPurchaseHistory): Promise<PurchaseHistory>;
  updatePurchaseRecord(id: number, updates: Partial<PurchaseHistory>): Promise<PurchaseHistory | undefined>;
  getProductRecommendationsBasedOnPurchaseHistory(userId: number): Promise<Product[]>;
  
  // User Similarity methods
  getSimilarUsers(userId: number, limit?: number): Promise<UserSimilarity[]>;
  updateUserSimilarity(userId: number, similarUserId: number, score: number): Promise<UserSimilarity>;
  calculateUserSimilarities(userId: number): Promise<UserSimilarity[]>;
  getCollaborativeFilteringRecommendations(userId: number): Promise<Product[]>;
  
  // Hybrid Recommendation methods
  getHybridRecommendations(
    userId: number, 
    recipientId: number, 
    options?: {
      limit?: number,
      includeAI?: boolean,
      includeCollaborative?: boolean,
      includeContentBased?: boolean,
      mood?: string,
      occasion?: string,
      minPrice?: number,
      maxPrice?: number
    }
  ): Promise<(Recommendation & { product: Product })[]>;
  
  // User Feedback methods for reinforcement learning
  createUserFeedback(feedback: InsertUserFeedback): Promise<UserFeedback>;
  getUserFeedbackHistory(userId: number): Promise<UserFeedback[]>;
  getFeedbackForProduct(productId: number): Promise<UserFeedback[]>;
  getFeedbackByType(userId: number, feedbackType: string): Promise<UserFeedback[]>;
  
  // Product Classification methods
  createProductClassification(classification: InsertProductClassification): Promise<ProductClassification>;
  getProductClassification(productId: number): Promise<ProductClassification | undefined>;
  updateProductClassification(productId: number, updates: Partial<ProductClassification>): Promise<ProductClassification | undefined>;
  getProductsNeedingClassification(limit?: number): Promise<Product[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private recipients: Map<number, Recipient>;
  private preferences: Map<number, Preference>;
  private products: Map<number, Product>;
  private recommendations: Map<number, Recommendation>;
  private occasions: Map<number, Occasion>;
  private notificationLogs: Map<number, NotificationLog>;
  private productTags: Map<number, ProductTag>;
  private purchaseHistory: Map<number, PurchaseHistory>;
  private userSimilarity: Map<number, UserSimilarity>;

  // Additional indexes for faster lookups
  private usersByEmail: Map<string, number>; // email -> userId
  private usersByResetToken: Map<string, number>; // resetToken -> userId
  private usersByGoogleId: Map<string, number>; // googleId -> userId
  private usersByFacebookId: Map<string, number>; // facebookId -> userId
  private usersByAppleId: Map<string, number>; // appleId -> userId

  private currentIds: {
    users: number;
    recipients: number;
    preferences: number;
    products: number;
    recommendations: number;
    occasions: number;
    notificationLogs: number;
    productTags: number;
    purchaseHistory: number;
    userSimilarity: number;
  };

  constructor() {
    this.users = new Map();
    this.recipients = new Map();
    this.preferences = new Map();
    this.products = new Map();
    this.recommendations = new Map();
    this.occasions = new Map();
    this.notificationLogs = new Map();
    this.productTags = new Map();
    this.purchaseHistory = new Map();
    this.userSimilarity = new Map();
    
    // Initialize lookup indexes
    this.usersByEmail = new Map();
    this.usersByResetToken = new Map();
    this.usersByGoogleId = new Map();
    this.usersByFacebookId = new Map();
    this.usersByAppleId = new Map();

    this.currentIds = {
      users: 1,
      recipients: 1,
      preferences: 1,
      products: 1,
      recommendations: 1,
      occasions: 1,
      notificationLogs: 1,
      productTags: 1,
      purchaseHistory: 1,
      userSimilarity: 1
    };

    // Initialize with sample product data for MVP
    this.seedProducts();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const userId = this.usersByEmail.get(email);
    if (userId) {
      return this.users.get(userId);
    }
    // Fallback to iterating if the index is not yet populated
    return Array.from(this.users.values()).find(user => user.email === email);
  }
  
  async getUserByResetToken(token: string): Promise<User | undefined> {
    const userId = this.usersByResetToken.get(token);
    if (userId) {
      return this.users.get(userId);
    }
    // Fallback to iterating if the index is not yet populated
    return Array.from(this.users.values()).find(user => user.resetPasswordToken === token);
  }
  
  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const userId = this.usersByGoogleId.get(googleId);
    if (userId) {
      return this.users.get(userId);
    }
    // Fallback to iterating if the index is not yet populated
    return Array.from(this.users.values()).find(user => user.googleId === googleId);
  }
  
  async getUserByFacebookId(facebookId: string): Promise<User | undefined> {
    const userId = this.usersByFacebookId.get(facebookId);
    if (userId) {
      return this.users.get(userId);
    }
    // Fallback to iterating if the index is not yet populated
    return Array.from(this.users.values()).find(user => user.facebookId === facebookId);
  }
  
  async getUserByAppleId(appleId: string): Promise<User | undefined> {
    const userId = this.usersByAppleId.get(appleId);
    if (userId) {
      return this.users.get(userId);
    }
    // Fallback to iterating if the index is not yet populated
    return Array.from(this.users.values()).find(user => user.appleId === appleId);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    
    // Set default values for social fields if not provided
    const user: User = {
      ...userData,
      id,
      uuid: crypto.randomUUID(),
      role: userData.role || 'user',
      phone: userData.phone || null,
      address: userData.address || null,
      googleId: userData.googleId || null,
      facebookId: userData.facebookId || null,
      appleId: userData.appleId || null,
      profileImageUrl: userData.profileImageUrl || null,
      isVerified: userData.isVerified || false,
      verificationToken: userData.verificationToken || null,
      resetPasswordToken: userData.resetPasswordToken || null,
      resetPasswordExpires: userData.resetPasswordExpires || null,
      lastLogin: userData.lastLogin || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.users.set(id, user);
    
    // Update indexes
    this.usersByEmail.set(user.email, id);
    
    if (user.resetPasswordToken) {
      this.usersByResetToken.set(user.resetPasswordToken, id);
    }
    
    if (user.googleId) {
      this.usersByGoogleId.set(user.googleId, id);
    }
    
    if (user.facebookId) {
      this.usersByFacebookId.set(user.facebookId, id);
    }
    
    if (user.appleId) {
      this.usersByAppleId.set(user.appleId, id);
    }
    
    return user;
  }
  
  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    
    if (!user) {
      return undefined;
    }
    
    // Update the user object
    const updatedUser: User = {
      ...user,
      ...updates,
      updatedAt: new Date()
    };
    
    this.users.set(id, updatedUser);
    
    // Update indexes if needed fields changed
    if (updates.email && updates.email !== user.email) {
      this.usersByEmail.delete(user.email);
      this.usersByEmail.set(updatedUser.email, id);
    }
    
    if (updates.resetPasswordToken !== undefined) {
      if (user.resetPasswordToken) {
        this.usersByResetToken.delete(user.resetPasswordToken);
      }
      
      if (updates.resetPasswordToken) {
        this.usersByResetToken.set(updates.resetPasswordToken, id);
      }
    }
    
    if (updates.googleId !== undefined) {
      if (user.googleId) {
        this.usersByGoogleId.delete(user.googleId);
      }
      
      if (updates.googleId) {
        this.usersByGoogleId.set(updates.googleId, id);
      }
    }
    
    if (updates.facebookId !== undefined) {
      if (user.facebookId) {
        this.usersByFacebookId.delete(user.facebookId);
      }
      
      if (updates.facebookId) {
        this.usersByFacebookId.set(updates.facebookId, id);
      }
    }
    
    if (updates.appleId !== undefined) {
      if (user.appleId) {
        this.usersByAppleId.delete(user.appleId);
      }
      
      if (updates.appleId) {
        this.usersByAppleId.set(updates.appleId, id);
      }
    }
    
    return updatedUser;
  }
  
  async deleteUser(id: number): Promise<boolean> {
    const user = this.users.get(id);
    
    if (!user) {
      return false;
    }
    
    // Remove from indexes
    this.usersByEmail.delete(user.email);
    
    if (user.resetPasswordToken) {
      this.usersByResetToken.delete(user.resetPasswordToken);
    }
    
    if (user.googleId) {
      this.usersByGoogleId.delete(user.googleId);
    }
    
    if (user.facebookId) {
      this.usersByFacebookId.delete(user.facebookId);
    }
    
    if (user.appleId) {
      this.usersByAppleId.delete(user.appleId);
    }
    
    // Remove the user
    this.users.delete(id);
    
    return true;
  }

  // Recipient methods
  async getRecipient(id: number): Promise<Recipient | undefined> {
    return this.recipients.get(id);
  }

  async getRecipientByUuid(uuid: string): Promise<Recipient | undefined> {
    return Array.from(this.recipients.values()).find(recipient => recipient.uuid === uuid);
  }

  async getRecipientsByUserId(userId: number): Promise<Recipient[]> {
    return Array.from(this.recipients.values()).filter(recipient => recipient.userId === userId);
  }

  async createRecipient(recipientData: InsertRecipient): Promise<Recipient> {
    const id = this.currentIds.recipients++;
    const recipient: Recipient = {
      ...recipientData,
      id,
      uuid: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.recipients.set(id, recipient);
    return recipient;
  }

  async updateRecipient(id: number, updates: Partial<Recipient>): Promise<Recipient | undefined> {
    const recipient = this.recipients.get(id);
    if (!recipient) return undefined;

    const updatedRecipient: Recipient = {
      ...recipient,
      ...updates,
      updatedAt: new Date(),
    };
    this.recipients.set(id, updatedRecipient);
    return updatedRecipient;
  }

  async deleteRecipient(id: number): Promise<boolean> {
    return this.recipients.delete(id);
  }

  // Preference methods
  async getPreferencesByRecipientId(recipientId: number): Promise<Preference[]> {
    return Array.from(this.preferences.values()).filter(pref => pref.recipientId === recipientId);
  }

  async createPreference(preferenceData: InsertPreference): Promise<Preference> {
    const id = this.currentIds.preferences++;
    const preference: Preference = {
      ...preferenceData,
      id,
      uuid: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.preferences.set(id, preference);
    return preference;
  }

  async updatePreference(id: number, updates: Partial<Preference>): Promise<Preference | undefined> {
    const preference = this.preferences.get(id);
    if (!preference) return undefined;

    const updatedPreference: Preference = {
      ...preference,
      ...updates,
      updatedAt: new Date(),
    };
    this.preferences.set(id, updatedPreference);
    return updatedPreference;
  }

  async deletePreference(id: number): Promise<boolean> {
    return this.preferences.delete(id);
  }

  // Product methods
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductByUuid(uuid: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(product => product.uuid === uuid);
  }

  async getProducts(filters?: Partial<Product>): Promise<Product[]> {
    let products = Array.from(this.products.values());

    if (filters) {
      products = products.filter(product => {
        return Object.entries(filters).every(([key, value]) => {
          if (key === 'categories' || key === 'tags') {
            // For arrays, check if there's any overlap
            return (product[key as keyof Product] as any[]).some(item => 
              (value as any[]).includes(item)
            );
          }
          return product[key as keyof Product] === value;
        });
      });
    }

    return products;
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const id = this.currentIds.products++;
    const product: Product = {
      ...productData,
      id,
      uuid: crypto.randomUUID(),
      lastScrapedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;

    const updatedProduct: Product = {
      ...product,
      ...updates,
      updatedAt: new Date(),
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  // Recommendation methods
  async getRecommendation(id: number): Promise<Recommendation | undefined> {
    return this.recommendations.get(id);
  }

  async getRecommendationByUuid(uuid: string): Promise<Recommendation | undefined> {
    return Array.from(this.recommendations.values()).find(rec => rec.uuid === uuid);
  }

  async getRecommendationsByUserId(userId: number): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values()).filter(rec => rec.userId === userId);
  }

  async getRecommendationsByRecipientId(recipientId: number): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values()).filter(rec => rec.recipientId === recipientId);
  }

  async getRecommendationsWithProducts(userId: number): Promise<(Recommendation & { product: Product })[]> {
    const recommendations = await this.getRecommendationsByUserId(userId);
    return recommendations.map(rec => {
      const product = this.products.get(rec.productId);
      if (!product) throw new Error(`Product not found for recommendation ${rec.id}`);
      return { ...rec, product };
    });
  }

  async createRecommendation(recommendationData: InsertRecommendation): Promise<Recommendation> {
    const id = this.currentIds.recommendations++;
    const recommendation: Recommendation = {
      ...recommendationData,
      id,
      uuid: crypto.randomUUID(),
      generatedAt: new Date(),
      notifiedAt: null,
    };
    this.recommendations.set(id, recommendation);
    return recommendation;
  }

  async updateRecommendation(id: number, updates: Partial<Recommendation>): Promise<Recommendation | undefined> {
    const recommendation = this.recommendations.get(id);
    if (!recommendation) return undefined;

    const updatedRecommendation: Recommendation = {
      ...recommendation,
      ...updates,
    };
    this.recommendations.set(id, updatedRecommendation);
    return updatedRecommendation;
  }

  // Occasion methods
  async getOccasion(id: number): Promise<Occasion | undefined> {
    return this.occasions.get(id);
  }

  async getOccasionsByRecipientId(recipientId: number): Promise<Occasion[]> {
    return Array.from(this.occasions.values()).filter(occ => occ.recipientId === recipientId);
  }

  async getUpcomingOccasionsByUserId(userId: number): Promise<(Occasion & { recipient: Recipient })[]> {
    const recipients = await this.getRecipientsByUserId(userId);
    const recipientIds = recipients.map(r => r.id);
    
    const recipientsMap = new Map<number, Recipient>();
    recipients.forEach(r => recipientsMap.set(r.id, r));

    const now = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(now.getFullYear() + 1);

    const occasions = Array.from(this.occasions.values()).filter(occ => {
      const occDate = new Date(occ.date);
      return recipientIds.includes(occ.recipientId) && occDate >= now && occDate <= nextYear;
    });

    return occasions.map(occ => {
      const recipient = recipientsMap.get(occ.recipientId);
      if (!recipient) throw new Error(`Recipient not found for occasion ${occ.id}`);
      return { ...occ, recipient };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async createOccasion(occasionData: InsertOccasion): Promise<Occasion> {
    const id = this.currentIds.occasions++;
    const occasion: Occasion = {
      ...occasionData,
      id,
      uuid: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.occasions.set(id, occasion);
    return occasion;
  }

  async updateOccasion(id: number, updates: Partial<Occasion>): Promise<Occasion | undefined> {
    const occasion = this.occasions.get(id);
    if (!occasion) return undefined;

    const updatedOccasion: Occasion = {
      ...occasion,
      ...updates,
      updatedAt: new Date(),
    };
    this.occasions.set(id, updatedOccasion);
    return updatedOccasion;
  }

  async deleteOccasion(id: number): Promise<boolean> {
    return this.occasions.delete(id);
  }

  // Notification methods
  async createNotificationLog(logData: InsertNotificationLog): Promise<NotificationLog> {
    const id = this.currentIds.notificationLogs++;
    const log: NotificationLog = {
      ...logData,
      id,
      uuid: crypto.randomUUID(),
      sentAt: new Date(),
    };
    this.notificationLogs.set(id, log);
    return log;
  }

  async getNotificationLogsByUserId(userId: number): Promise<NotificationLog[]> {
    return Array.from(this.notificationLogs.values()).filter(log => log.userId === userId);
  }

  // Seed initial product data for the MVP
  private seedProducts() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "Smart Fitness Watch",
        description: "Track activities, monitor heart rate, and stay connected with this stylish smart watch.",
        sourceUrl: "https://www.amazon.com/example-smart-watch",
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
        price: 79.99,
        currency: "USD",
        sourceSite: "Amazon",
        categories: ["electronics", "fitness", "wearables"],
        tags: ["tech gadgets", "fitness tracking", "gift for him", "gift for her"],
        metadata: { brand: "TechFit", rating: 4.5, features: ["Heart rate monitor", "Step counter", "Sleep tracking"] },
        isActive: true
      },
      {
        name: "Premium Chef's Knife Set",
        description: "Professional-grade knives with ergonomic handles for precision cutting and cooking.",
        sourceUrl: "https://www.amazon.com/example-knife-set",
        imageUrl: "https://images.unsplash.com/photo-1593618998160-e34014e67546?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
        price: 129.99,
        currency: "USD",
        sourceSite: "Amazon",
        categories: ["kitchen", "cooking", "home"],
        tags: ["cooking", "kitchen tools", "gift for her", "gift for him"],
        metadata: { brand: "CulinArt", rating: 4.8, material: "Stainless steel", pieces: 6 },
        isActive: true
      },
      {
        name: "Complete Yoga Kit",
        description: "Premium yoga mat, blocks, strap, and carrying case for home practice or studio sessions.",
        sourceUrl: "https://www.amazon.com/example-yoga-kit",
        imageUrl: "https://pixabay.com/get/g3c4ead230bd8e57a0e0eb0088a901da4397f1f2fe2116ec53ff93c1a5f494e3b30ad577e3e6c1b98ec0ca58f97fbc957bc448bd9fb9afa4b35daf0fbf6f7c05c_1280.jpg",
        price: 89.50,
        currency: "USD",
        sourceSite: "Amazon",
        categories: ["fitness", "wellness", "yoga"],
        tags: ["yoga", "wellness", "fitness", "gift for her"],
        metadata: { brand: "ZenBalance", rating: 4.7, color: "Purple", material: "Eco-friendly TPE" },
        isActive: true
      },
      {
        name: "Gaming Headset Pro",
        description: "Immersive audio experience with noise-cancellation and comfort-focused design for long gaming sessions.",
        sourceUrl: "https://www.amazon.com/example-gaming-headset",
        imageUrl: "https://pixabay.com/get/g391240ee480f24621cc3034838b0360cf8fe9c5921214e3b5001a7ccfa1622a91853ed1c90a96e0308f18fc249a6a0b12c628287325f234ee2f2c0f87c0ea575_1280.jpg",
        price: 69.95,
        currency: "USD",
        sourceSite: "Amazon",
        categories: ["electronics", "gaming", "audio"],
        tags: ["gaming", "headphones", "gift for him", "tech gadgets"],
        metadata: { brand: "GameAudio", rating: 4.6, features: ["7.1 surround sound", "RGB lighting", "Detachable mic"] },
        isActive: true
      },
      {
        name: "Watercolor Artist Set",
        description: "Complete set with premium paints, brushes, and paper for creating beautiful watercolor art.",
        sourceUrl: "https://www.amazon.com/example-watercolor-set",
        imageUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
        price: 65.00,
        currency: "USD",
        sourceSite: "Amazon",
        categories: ["art", "crafts", "hobby"],
        tags: ["art", "painting", "creative", "gift for her"],
        metadata: { brand: "ArtisticBlend", rating: 4.9, pieces: 24, pigmentType: "Professional grade" },
        isActive: true
      },
      {
        name: "Classic Novel Collection",
        description: "Beautifully bound collection of classic literature in an elegant gift box.",
        sourceUrl: "https://www.amazon.com/example-book-collection",
        imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
        price: 75.00,
        currency: "USD",
        sourceSite: "Amazon",
        categories: ["books", "literature", "collection"],
        tags: ["reading", "books", "classics", "gift for her", "gift for him"],
        metadata: { publisher: "Heritage Press", rating: 4.7, volumes: 5, binding: "Hardcover" },
        isActive: true
      }
    ];

    sampleProducts.forEach(product => {
      this.createProduct(product);
    });
  }
}

export const storage = new MemStorage();
