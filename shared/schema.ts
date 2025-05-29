import { pgTable, serial, text, uuid, varchar, timestamp, integer, decimal, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uuid: varchar("uuid", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  role: varchar("role", { length: 50 }).default("user"),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  
  // Social login providers
  googleId: varchar("google_id", { length: 255 }),
  facebookId: varchar("facebook_id", { length: 255 }),
  appleId: varchar("apple_id", { length: 255 }),
  
  // Profile data
  isVerified: boolean("is_verified").default(false),
  verificationCode: varchar("verification_code", { length: 10 }),
  resetPasswordToken: varchar("reset_password_token", { length: 255 }),
  resetPasswordExpires: timestamp("reset_password_expires"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, uuid: true, createdAt: true, updatedAt: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Recipients (friends/family) table
export const recipients = pgTable("recipients", {
  id: serial("id").primaryKey(),
  uuid: varchar("uuid", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  relationship: varchar("relationship", { length: 100 }).notNull(),
  age: integer("age"),
  gender: varchar("gender", { length: 20 }),
  birthday: timestamp("birthday"),
  photoUrl: text("photo_url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertRecipientSchema = createInsertSchema(recipients)
  .omit({ id: true, uuid: true, createdAt: true, updatedAt: true });

export type InsertRecipient = z.infer<typeof insertRecipientSchema>;
export type Recipient = typeof recipients.$inferSelect;

// Preferences table
export const preferences = pgTable("preferences", {
  id: serial("id").primaryKey(),
  uuid: varchar("uuid", { length: 255 }).notNull().unique(),
  recipientId: integer("recipient_id").notNull().references(() => recipients.id),
  preferenceType: varchar("preference_type", { length: 100 }).notNull(),
  preferenceValue: jsonb("preference_value").notNull(),
  category: varchar("category", { length: 100 }),
  importance: integer("importance"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertPreferenceSchema = createInsertSchema(preferences)
  .omit({ id: true, uuid: true, createdAt: true, updatedAt: true });

export type InsertPreference = z.infer<typeof insertPreferenceSchema>;
export type Preference = typeof preferences.$inferSelect;

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  uuid: varchar("uuid", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }),
  imageUrl: text("image_url"),
  sourceUrl: text("source_url"),
  currency: varchar("currency", { length: 10 }).default("USD"),
  sourceSite: varchar("source_site", { length: 100 }),
  categories: text("categories").array(),
  tags: text("tags").array(),
  metadata: jsonb("metadata"),
  availabilityStatus: varchar("availability_status", { length: 50 }).default("available"),
  externalId: varchar("external_id", { length: 255 }),
  externalUpdatedAt: timestamp("external_updated_at"),
  lastScrapedAt: timestamp("last_scraped_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertProductSchema = createInsertSchema(products)
  .omit({ id: true, uuid: true, lastScrapedAt: true, createdAt: true, updatedAt: true });

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Recommendations table
export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  uuid: varchar("uuid", { length: 255 }).notNull().unique(),
  userId: integer("user_id").notNull().references(() => users.id),
  recipientId: integer("recipient_id").notNull().references(() => recipients.id),
  productId: integer("product_id").notNull().references(() => products.id),
  status: varchar("status", { length: 50 }).default("pending"),
  recommendationScore: decimal("recommendation_score", { precision: 3, scale: 2 }),
  confidenceScore: decimal("confidence_score", { precision: 3, scale: 2 }),
  reasoning: text("reasoning"),
  occasion: varchar("occasion", { length: 100 }),
  budgetMin: decimal("budget_min", { precision: 10, scale: 2 }),
  budgetMax: decimal("budget_max", { precision: 10, scale: 2 }),
  mood: varchar("mood", { length: 50 }),
  generatedAt: timestamp("generated_at").defaultNow(),
  notifiedAt: timestamp("notified_at")
});

export const insertRecommendationSchema = createInsertSchema(recommendations)
  .omit({ id: true, uuid: true, generatedAt: true, notifiedAt: true });

export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type Recommendation = typeof recommendations.$inferSelect;

// Special dates/occasions table
export const occasions = pgTable("occasions", {
  id: serial("id").primaryKey(),
  uuid: varchar("uuid", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  date: timestamp("date").notNull(),
  recipientId: integer("recipient_id").notNull().references(() => recipients.id),
  status: varchar("status", { length: 50 }).default("upcoming"),
  isRecurring: boolean("is_recurring").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const insertOccasionSchema = createInsertSchema(occasions)
  .omit({ id: true, uuid: true, createdAt: true, updatedAt: true });

export type InsertOccasion = z.infer<typeof insertOccasionSchema>;
export type Occasion = typeof occasions.$inferSelect;

// Notification logs
export const notificationLogs = pgTable("notification_logs", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").notNull().defaultRandom(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: varchar("type", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  errorMessage: text("error_message")
});

export const insertNotificationLogSchema = createInsertSchema(notificationLogs)
  .omit({ id: true, uuid: true, sentAt: true });

export type InsertNotificationLog = z.infer<typeof insertNotificationLogSchema>;
export type NotificationLog = typeof notificationLogs.$inferSelect;

// Product Tags table (for more detailed tagging with source tracking)
export const productTags = pgTable("product_tags", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id),
  tagType: varchar("tag_type", { length: 50 }).notNull(), // 'category', 'occasion', 'mood', etc.
  tagValue: varchar("tag_value", { length: 100 }).notNull(),
  confidence: decimal("confidence", { precision: 4, scale: 3 }), // For auto-generated tags
  isAutoGenerated: boolean("is_auto_generated").default(false),
  source: varchar("source", { length: 50 }), // 'ai', 'manual', 'scraping', etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const insertProductTagSchema = createInsertSchema(productTags)
  .omit({ id: true, createdAt: true, updatedAt: true });

export type InsertProductTag = z.infer<typeof insertProductTagSchema>;
export type ProductTag = typeof productTags.$inferSelect;

// Purchase History table (for user-product associations)
export const purchaseHistory = pgTable("purchase_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull().references(() => products.id),
  recipientId: integer("recipient_id").references(() => recipients.id),
  occasionId: integer("occasion_id").references(() => occasions.id),
  purchaseDate: timestamp("purchase_date").defaultNow().notNull(),
  price: decimal("price", { precision: 10, scale: 2 }),
  isFavorited: boolean("is_favorited").default(false),
  rating: integer("rating"),
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const insertPurchaseHistorySchema = createInsertSchema(purchaseHistory)
  .omit({ id: true, createdAt: true, updatedAt: true });

export type InsertPurchaseHistory = z.infer<typeof insertPurchaseHistorySchema>;
export type PurchaseHistory = typeof purchaseHistory.$inferSelect;

// User Similarity table (for collaborative filtering)
export const userSimilarity = pgTable("user_similarity", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  similarUserId: integer("similar_user_id").notNull().references(() => users.id),
  similarityScore: decimal("similarity_score", { precision: 5, scale: 4 }).notNull(),
  lastCalculated: timestamp("last_calculated").defaultNow().notNull(),
});

export const insertUserSimilaritySchema = createInsertSchema(userSimilarity)
  .omit({ id: true, lastCalculated: true });

export type InsertUserSimilarity = z.infer<typeof insertUserSimilaritySchema>;
export type UserSimilarity = typeof userSimilarity.$inferSelect;

// User Feedback table for reinforcement learning
export const userFeedback = pgTable("user_feedback", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").notNull().defaultRandom(),
  userId: integer("user_id").notNull().references(() => users.id),
  recommendationId: integer("recommendation_id").references(() => recommendations.id),
  productId: integer("product_id").notNull().references(() => products.id),
  recipientId: integer("recipient_id").references(() => recipients.id),
  
  // Feedback signals
  feedbackType: varchar("feedback_type", { length: 20 }).notNull(), // like, dislike, view, click, purchase, share
  feedbackValue: decimal("feedback_value", { precision: 3, scale: 2 }).notNull(), // -1 to 1 scale
  contextType: varchar("context_type", { length: 50 }), // recommendation, search, browse
  
  // Detailed feedback reasons
  reasons: text("reasons").array(), // too_expensive, wrong_style, not_interesting, etc.
  alternativePreferences: jsonb("alternative_preferences"), // What they would prefer instead
  
  // Session context
  sessionId: varchar("session_id", { length: 100 }),
  deviceType: varchar("device_type", { length: 20 }),
  timeSpent: integer("time_spent"), // seconds spent viewing
  
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertUserFeedbackSchema = createInsertSchema(userFeedback)
  .omit({ id: true, uuid: true, createdAt: true });

export type InsertUserFeedback = z.infer<typeof insertUserFeedbackSchema>;
export type UserFeedback = typeof userFeedback.$inferSelect;

// Product Classification Enhancement table
export const productClassification = pgTable("product_classification", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id),
  
  // AI-generated classifications
  sentimentScore: decimal("sentiment_score", { precision: 3, scale: 2 }), // Emotional appeal (-1 to 1)
  practicalityScore: decimal("practicality_score", { precision: 3, scale: 2 }), // How practical (0 to 1)
  uniquenessScore: decimal("uniqueness_score", { precision: 3, scale: 2 }), // How unique (0 to 1)
  luxuryScore: decimal("luxury_score", { precision: 3, scale: 2 }), // How luxurious (0 to 1)
  giftabilityScore: decimal("giftability_score", { precision: 3, scale: 2 }), // Overall gift potential (0 to 1)
  
  // Personality fit scores
  personalityScores: jsonb("personality_scores"), // Scores for different personality types
  relationshipFit: jsonb("relationship_fit"), // Fit scores for different relationships
  occasionFit: jsonb("occasion_fit"), // Fit scores for different occasions
  
  // AI analysis
  aiDescription: text("ai_description"), // AI-generated description of gift appeal
  targetPersona: text("target_persona"), // Who this gift is perfect for
  giftingContext: text("gifting_context"), // When/why to give this gift
  
  // Classification metadata
  classificationModel: varchar("classification_model", { length: 50 }), // Which model generated this
  confidenceLevel: decimal("confidence_level", { precision: 3, scale: 2 }), // How confident the AI is
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const insertProductClassificationSchema = createInsertSchema(productClassification)
  .omit({ id: true, lastUpdated: true, createdAt: true });

export type InsertProductClassification = z.infer<typeof insertProductClassificationSchema>;
export type ProductClassification = typeof productClassification.$inferSelect;
