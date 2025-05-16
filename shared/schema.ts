import { pgTable, serial, text, uuid, varchar, timestamp, integer, decimal, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").notNull().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const insertUserSchema = createInsertSchema(users)
  .omit({ id: true, uuid: true, createdAt: true, updatedAt: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Recipients (friends/family) table
export const recipients = pgTable("recipients", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").notNull().defaultRandom(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: varchar("name", { length: 100 }).notNull(),
  relationship: varchar("relationship", { length: 50 }).notNull(),
  age: integer("age"),
  gender: varchar("gender", { length: 20 }),
  birthday: timestamp("birthday"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const insertRecipientSchema = createInsertSchema(recipients)
  .omit({ id: true, uuid: true, createdAt: true, updatedAt: true });

export type InsertRecipient = z.infer<typeof insertRecipientSchema>;
export type Recipient = typeof recipients.$inferSelect;

// Preferences table
export const preferences = pgTable("preferences", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").notNull().defaultRandom(),
  recipientId: integer("recipient_id").notNull().references(() => recipients.id),
  preferenceType: varchar("preference_type", { length: 50 }).notNull(),
  preferenceValue: jsonb("preference_value").notNull(),
  category: varchar("category", { length: 100 }),
  importance: integer("importance"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const insertPreferenceSchema = createInsertSchema(preferences)
  .omit({ id: true, uuid: true, createdAt: true, updatedAt: true });

export type InsertPreference = z.infer<typeof insertPreferenceSchema>;
export type Preference = typeof preferences.$inferSelect;

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").notNull().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }),
  imageUrl: text("image_url"),
  purchaseUrl: text("purchase_url"),
  sourceUrl: text("source_url"),
  currency: varchar("currency", { length: 3 }).default("USD"),
  sourceSite: varchar("source_site", { length: 50 }),
  
  // Enhanced categorization fields
  category: varchar("category", { length: 100 }),
  categories: text("categories").array(), // Main product categories
  occasions: text("occasions").array(), // Appropriate occasions (birthday, anniversary, etc.)
  moods: text("moods").array(), // Gift moods (romantic, fun, thoughtful, etc.)
  ageRanges: text("age_ranges").array(), // Appropriate age ranges
  genders: text("genders").array(), // Appropriate genders
  relationships: text("relationships").array(), // Appropriate relationship types
  interests: text("interests").array(), // Related interests
  tags: text("tags").array(), // General purpose tags
  
  // Additional metadata
  metadata: jsonb("metadata"),
  isActive: boolean("is_active").default(true),
  lastScrapedAt: timestamp("last_scraped_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const insertProductSchema = createInsertSchema(products)
  .omit({ id: true, uuid: true, lastScrapedAt: true, createdAt: true, updatedAt: true });

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// Recommendations table
export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").notNull().defaultRandom(),
  userId: integer("user_id").notNull().references(() => users.id),
  recipientId: integer("recipient_id").notNull().references(() => recipients.id),
  productId: integer("product_id").notNull().references(() => products.id),
  recommendationScore: decimal("recommendation_score", { precision: 4, scale: 2 }),
  confidenceScore: decimal("confidence_score", { precision: 4, scale: 2 }),
  reasoning: text("reasoning"),
  reasonText: text("reason_text"),
  relationshipContext: varchar("relationship_context", { length: 50 }),
  mood: varchar("mood", { length: 30 }),
  status: varchar("status", { length: 20 }).notNull().default("new"),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
  notifiedAt: timestamp("notified_at")
});

export const insertRecommendationSchema = createInsertSchema(recommendations)
  .omit({ id: true, uuid: true, generatedAt: true, notifiedAt: true });

export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type Recommendation = typeof recommendations.$inferSelect;

// Special dates/occasions table
export const occasions = pgTable("occasions", {
  id: serial("id").primaryKey(),
  uuid: uuid("uuid").notNull().defaultRandom(),
  recipientId: integer("recipient_id").notNull().references(() => recipients.id),
  name: varchar("name", { length: 100 }).notNull(),
  date: timestamp("date").notNull(),
  isRecurring: boolean("is_recurring").notNull().default(false),
  status: varchar("status", { length: 20 }).notNull().default("not_started"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
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
