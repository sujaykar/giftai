import { eq, and } from "drizzle-orm";
import { db } from "./db";
import { 
  users, recipients, preferences, products, recommendations, occasions,
  type User, type InsertUser,
  type Recipient, type InsertRecipient,
  type Preference, type InsertPreference,
  type Product, type InsertProduct,
  type Recommendation, type InsertRecommendation,
  type Occasion, type InsertOccasion
} from "@shared/schema";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  getUserByFacebookId(facebookId: string): Promise<User | undefined>;
  getUserByAppleId(appleId: string): Promise<User | undefined>;
  createUser(userData: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;

  // Recipient operations
  getRecipient(id: number): Promise<Recipient | undefined>;
  getRecipientByUuid(uuid: string): Promise<Recipient | undefined>;
  getRecipientsByUserId(userId: number): Promise<Recipient[]>;
  createRecipient(recipientData: InsertRecipient): Promise<Recipient>;
  updateRecipient(id: number, updates: Partial<Recipient>): Promise<Recipient | undefined>;
  deleteRecipient(id: number): Promise<boolean>;

  // Preference operations
  getPreferencesByRecipientId(recipientId: number): Promise<Preference[]>;
  createPreference(preferenceData: InsertPreference): Promise<Preference>;
  updatePreference(id: number, updates: Partial<Preference>): Promise<Preference | undefined>;
  deletePreference(id: number): Promise<boolean>;

  // Product operations
  getProduct(id: number): Promise<Product | undefined>;
  getProductByUuid(uuid: string): Promise<Product | undefined>;
  getProducts(filters?: Partial<Product>): Promise<Product[]>;
  createProduct(productData: InsertProduct): Promise<Product>;
  updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined>;

  // Recommendation operations
  getRecommendation(id: number): Promise<Recommendation | undefined>;
  getRecommendationByUuid(uuid: string): Promise<Recommendation | undefined>;
  getRecommendationsByUserId(userId: number): Promise<Recommendation[]>;
  getRecommendationsByRecipientId(recipientId: number): Promise<Recommendation[]>;
  getRecommendationsWithProducts(userId: number): Promise<(Recommendation & { product: Product })[]>;
  createRecommendation(recommendationData: InsertRecommendation): Promise<Recommendation>;
  updateRecommendation(id: number, updates: Partial<Recommendation>): Promise<Recommendation | undefined>;

  // Occasion operations
  getOccasion(id: number): Promise<Occasion | undefined>;
  getOccasionsByRecipientId(recipientId: number): Promise<Occasion[]>;
  getUpcomingOccasionsByUserId(userId: number): Promise<(Occasion & { recipient: Recipient })[]>;
  createOccasion(occasionData: InsertOccasion): Promise<Occasion>;
  updateOccasion(id: number, updates: Partial<Occasion>): Promise<Occasion | undefined>;
  deleteOccasion(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.resetPasswordToken, token));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  }

  async getUserByFacebookId(facebookId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.facebookId, facebookId));
    return user;
  }

  async getUserByAppleId(appleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.appleId, appleId));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        uuid: uuidv4(),
        password: hashedPassword,
      })
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount > 0;
  }

  // Recipient operations
  async getRecipient(id: number): Promise<Recipient | undefined> {
    const [recipient] = await db.select().from(recipients).where(eq(recipients.id, id));
    return recipient;
  }

  async getRecipientByUuid(uuid: string): Promise<Recipient | undefined> {
    const [recipient] = await db.select().from(recipients).where(eq(recipients.uuid, uuid));
    return recipient;
  }

  async getRecipientsByUserId(userId: number): Promise<Recipient[]> {
    return db.select().from(recipients).where(eq(recipients.userId, userId));
  }

  async createRecipient(recipientData: InsertRecipient): Promise<Recipient> {
    const [recipient] = await db
      .insert(recipients)
      .values({
        ...recipientData,
        uuid: uuidv4(),
      })
      .returning();
    return recipient;
  }

  async updateRecipient(id: number, updates: Partial<Recipient>): Promise<Recipient | undefined> {
    const [recipient] = await db
      .update(recipients)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(recipients.id, id))
      .returning();
    return recipient;
  }

  async deleteRecipient(id: number): Promise<boolean> {
    const result = await db.delete(recipients).where(eq(recipients.id, id));
    return result.rowCount > 0;
  }

  // Preference operations
  async getPreferencesByRecipientId(recipientId: number): Promise<Preference[]> {
    return db.select().from(preferences).where(eq(preferences.recipientId, recipientId));
  }

  async createPreference(preferenceData: InsertPreference): Promise<Preference> {
    const [preference] = await db
      .insert(preferences)
      .values({
        ...preferenceData,
        uuid: uuidv4(),
      })
      .returning();
    return preference;
  }

  async updatePreference(id: number, updates: Partial<Preference>): Promise<Preference | undefined> {
    const [preference] = await db
      .update(preferences)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(preferences.id, id))
      .returning();
    return preference;
  }

  async deletePreference(id: number): Promise<boolean> {
    const result = await db.delete(preferences).where(eq(preferences.id, id));
    return result.rowCount > 0;
  }

  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductByUuid(uuid: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.uuid, uuid));
    return product;
  }

  async getProducts(filters?: Partial<Product>): Promise<Product[]> {
    if (!filters) {
      return db.select().from(products).where(eq(products.isActive, true));
    }
    
    // Build where conditions based on filters
    const conditions = [];
    if (filters.category) conditions.push(eq(products.category, filters.category));
    if (filters.isActive !== undefined) conditions.push(eq(products.isActive, filters.isActive));
    
    if (conditions.length === 0) {
      return db.select().from(products);
    }
    
    return db.select().from(products).where(and(...conditions));
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values({
        ...productData,
        uuid: uuidv4(),
      })
      .returning();
    return product;
  }

  async updateProduct(id: number, updates: Partial<Product>): Promise<Product | undefined> {
    const [product] = await db
      .update(products)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  // Recommendation operations
  async getRecommendation(id: number): Promise<Recommendation | undefined> {
    const [recommendation] = await db.select().from(recommendations).where(eq(recommendations.id, id));
    return recommendation;
  }

  async getRecommendationByUuid(uuid: string): Promise<Recommendation | undefined> {
    const [recommendation] = await db.select().from(recommendations).where(eq(recommendations.uuid, uuid));
    return recommendation;
  }

  async getRecommendationsByUserId(userId: number): Promise<Recommendation[]> {
    return db.select().from(recommendations).where(eq(recommendations.userId, userId));
  }

  async getRecommendationsByRecipientId(recipientId: number): Promise<Recommendation[]> {
    return db.select().from(recommendations).where(eq(recommendations.recipientId, recipientId));
  }

  async getRecommendationsWithProducts(userId: number): Promise<(Recommendation & { product: Product })[]> {
    const result = await db
      .select()
      .from(recommendations)
      .innerJoin(products, eq(recommendations.productId, products.id))
      .where(eq(recommendations.userId, userId));

    return result.map(row => ({
      ...row.recommendations,
      product: row.products
    }));
  }

  async createRecommendation(recommendationData: InsertRecommendation): Promise<Recommendation> {
    const [recommendation] = await db
      .insert(recommendations)
      .values({
        ...recommendationData,
        uuid: uuidv4(),
      })
      .returning();
    return recommendation;
  }

  async updateRecommendation(id: number, updates: Partial<Recommendation>): Promise<Recommendation | undefined> {
    const [recommendation] = await db
      .update(recommendations)
      .set(updates)
      .where(eq(recommendations.id, id))
      .returning();
    return recommendation;
  }

  // Occasion operations
  async getOccasion(id: number): Promise<Occasion | undefined> {
    const [occasion] = await db.select().from(occasions).where(eq(occasions.id, id));
    return occasion;
  }

  async getOccasionsByRecipientId(recipientId: number): Promise<Occasion[]> {
    return db.select().from(occasions).where(eq(occasions.recipientId, recipientId));
  }

  async getUpcomingOccasionsByUserId(userId: number): Promise<(Occasion & { recipient: Recipient })[]> {
    const result = await db
      .select()
      .from(occasions)
      .innerJoin(recipients, eq(occasions.recipientId, recipients.id))
      .where(and(
        eq(recipients.userId, userId),
        eq(occasions.status, "upcoming")
      ));

    return result.map(row => ({
      ...row.occasions,
      recipient: row.recipients
    }));
  }

  async createOccasion(occasionData: InsertOccasion): Promise<Occasion> {
    const [occasion] = await db
      .insert(occasions)
      .values({
        ...occasionData,
        uuid: uuidv4(),
      })
      .returning();
    return occasion;
  }

  async updateOccasion(id: number, updates: Partial<Occasion>): Promise<Occasion | undefined> {
    const [occasion] = await db
      .update(occasions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(occasions.id, id))
      .returning();
    return occasion;
  }

  async deleteOccasion(id: number): Promise<boolean> {
    const result = await db.delete(occasions).where(eq(occasions.id, id));
    return result.rowCount > 0;
  }
}