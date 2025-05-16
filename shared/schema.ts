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
  description: text("description").notNull(),
  sourceUrl: text("source_url").notNull(),
  imageUrl: text("image_url").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  sourceSite: varchar("source_site", { length: 50 }).notNull(),
  categories: jsonb("categories").notNull(),
  tags: jsonb("tags").notNull(),
  metadata: jsonb("metadata").notNull(),
  isActive: boolean("is_active").notNull().default(true),
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
  recommendationScore: decimal("recommendation_score", { precision: 4, scale: 2 }).notNull(),
  reasoning: text("reasoning").notNull(),
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
