import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authController } from "./controllers/auth-controller";
import { recipientController } from "./controllers/recipient-controller";
import { recommendationController } from "./controllers/recommendation-controller";
import { productController } from "./controllers/product-controller";
import { hybridRecommendationController } from "./controllers/hybrid-recommendation-controller";
import { relationshipGiftController } from "./controllers/relationship-gift-controller";
import { productScraperController } from "./controllers/product-scraper-controller";
import { feedbackController } from "./controllers/feedback-controller";
import { isAdmin } from "./middleware/admin-auth";
import { apiKeyAuth } from "./middleware/api-key-auth";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { hashPassword, comparePassword } from "./utils/password-utils";
import { configurePassport } from "./config/passport";
import { EmailService } from "./services/email-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session store
  const MemoryStoreSession = MemoryStore(session);
  
  app.use(
    session({
      cookie: { maxAge: 86400000 }, // 24 hours
      store: new MemoryStoreSession({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "gift-ai-secret",
    })
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Configure passport strategies
  configurePassport();

  // Passport configuration is handled in configurePassport()

  // Middleware to check if user is authenticated
  const isAuthenticated = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
  };

  // Auth routes
  app.post("/api/auth/register", authController.register);
  app.post("/api/auth/login", async (req, res) => {
    console.log('🚨 EMERGENCY LOGIN FIX - Direct authentication');
    
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
      }
      
      console.log('🔍 DIRECT AUTH: Looking for user:', email);
      
      // Direct user lookup with multiple methods
      let user = null;
      
      // Method 1: Direct email lookup
      try {
        user = await storage.getUserByEmail(email);
        if (user) console.log('✅ FOUND: Direct email method');
      } catch (e) {
        console.log('❌ Direct lookup failed');
      }
      
      // Method 2: Try encrypted email if direct fails
      if (!user) {
        try {
          const { encryptData } = await import('./utils/auth.js');
          const encryptedEmail = encryptData(email);
          user = await storage.getUserByEmail(encryptedEmail);
          if (user) console.log('✅ FOUND: Encrypted email method');
        } catch (e) {
          console.log('❌ Encrypted lookup failed');
        }
      }
      
      if (!user) {
        console.log('❌ NO USER FOUND for:', email);
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      console.log('✅ USER FOUND - ID:', user.id, 'Email stored as:', user.email);
      
      // Direct password verification
      const bcrypt = await import('bcrypt');
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      console.log('🔍 Password verification:', isValidPassword);
      
      if (!isValidPassword) {
        console.log('❌ INVALID PASSWORD for user:', user.id);
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      // Manual session creation (bypassing passport)
      req.session.userId = user.id;
      req.session.user = user;
      
      console.log('✅ EMERGENCY LOGIN SUCCESS for user:', user.id);
      
      // Return success response
      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: user.isVerified
        }
      });
      
    } catch (error) {
      console.error('❌ EMERGENCY LOGIN ERROR:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });
  app.post("/api/auth/logout", authController.logout);
  app.get("/api/auth/current-user", isAuthenticated, authController.getCurrentUser);
  app.post("/api/auth/verify", authController.verifyAccount);
  app.post("/api/auth/forgot-password", authController.forgotPassword);
  app.post("/api/auth/reset-password", authController.resetPassword);
  
  // Social Login Routes
  // Google
  app.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  app.get("/api/auth/google/callback", 
    passport.authenticate("google", { failureRedirect: "/" }),
    authController.googleCallback
  );
  
  // Facebook
  app.get("/api/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));
  app.get("/api/auth/facebook/callback", 
    passport.authenticate("facebook", { failureRedirect: "/" }),
    authController.facebookCallback
  );
  
  // Apple
  app.get("/api/auth/apple", passport.authenticate("apple"));
  app.get("/api/auth/apple/callback", 
    passport.authenticate("apple", { failureRedirect: "/" }),
    authController.appleCallback
  );

  // Recipient routes
  app.get("/api/recipients", isAuthenticated, recipientController.getRecipients);
  app.get("/api/recipients/:id", isAuthenticated, recipientController.getRecipientById);
  app.post("/api/recipients", isAuthenticated, recipientController.createRecipient);
  app.put("/api/recipients/:id", isAuthenticated, recipientController.updateRecipient);
  app.delete("/api/recipients/:id", isAuthenticated, recipientController.deleteRecipient);
  
  // Preference routes
  app.get("/api/recipients/:id/preferences", isAuthenticated, recipientController.getPreferences);
  app.post("/api/recipients/:id/preferences", isAuthenticated, recipientController.createPreference);
  app.put("/api/preferences/:id", isAuthenticated, recipientController.updatePreference);
  
  // Occasion routes
  app.get("/api/recipients/:id/occasions", isAuthenticated, recipientController.getOccasions);
  app.post("/api/recipients/:id/occasions", isAuthenticated, recipientController.createOccasion);
  app.put("/api/occasions/:id", isAuthenticated, recipientController.updateOccasion);
  app.delete("/api/occasions/:id", isAuthenticated, recipientController.deleteOccasion);
  app.get("/api/occasions/upcoming", isAuthenticated, recipientController.getUpcomingOccasions);
  
  // Recommendation routes
  app.get("/api/recommendations", isAuthenticated, recommendationController.getRecommendations);
  app.get("/api/recipients/:id/recommendations", isAuthenticated, recommendationController.getRecommendationsByRecipient);
  app.post("/api/recipients/:id/recommendations/generate", isAuthenticated, recommendationController.generateRecommendations);
  app.put("/api/recommendations/:id/status", isAuthenticated, recommendationController.updateRecommendationStatus);
  
  // Relationship-based recommendation routes
  app.post("/api/recommendations/relationship", isAuthenticated, recommendationController.generateRelationshipRecommendations);
  app.post("/api/recommendations/analyze-gift", isAuthenticated, recommendationController.analyzeGiftForRelationship);
  
  // Enhanced Recommendation System routes
  app.post("/api/hybrid-recommendations", isAuthenticated, hybridRecommendationController.getHybridRecommendations);
  app.post("/api/ai-recommendations", isAuthenticated, hybridRecommendationController.getAIRecommendations);
  app.post("/api/content-recommendations", isAuthenticated, hybridRecommendationController.getContentBasedRecommendations);
  app.post("/api/product-tags/auto-generate", isAuthenticated, hybridRecommendationController.autoTagProducts);
  app.post("/api/user-similarities/update", isAuthenticated, hybridRecommendationController.updateUserSimilarities);
  
  // Product routes
  app.get("/api/products", isAuthenticated, productController.getProducts);
  app.get("/api/products/:id", isAuthenticated, productController.getProductById);
  
  // Relationship-based gift suggestion routes
  app.post("/api/recipients/:recipientId/relationship-gifts", isAuthenticated, relationshipGiftController.getRelationshipGiftSuggestions);
  app.get("/api/recipients/:recipientId/relationship-analysis", isAuthenticated, relationshipGiftController.analyzeRelationship);
  
  // Product scraper routes - admin only
  app.get("/api/admin/scraper/run", isAdmin, productScraperController.runFullScraping);
  app.get("/api/admin/scraper/amazon", isAdmin, productScraperController.scrapeAmazonProducts);
  app.get("/api/admin/scraper/etsy", isAdmin, productScraperController.scrapeEtsyProducts);
  app.get("/api/admin/scraper/ebay", isAdmin, productScraperController.scrapeEbayProducts);
  
  // For scheduled jobs - needs API key auth
  app.get("/api/jobs/scraper/run", apiKeyAuth, productScraperController.runFullScraping);

  // Stats routes
  // Feedback and learning routes
  app.post("/api/feedback/record", isAuthenticated, feedbackController.recordFeedback);
  app.post("/api/feedback/personalized-recommendations", isAuthenticated, feedbackController.getPersonalizedRecommendations);
  app.get("/api/feedback/insights", isAuthenticated, feedbackController.getFeedbackInsights);
  app.post("/api/products/:productId/classify", isAuthenticated, feedbackController.classifyProduct);
  app.get("/api/products/:productId/enhanced", isAuthenticated, feedbackController.getEnhancedProduct);
  app.post("/api/products/batch-classify", isAuthenticated, feedbackController.batchClassifyProducts);

  app.get("/api/stats", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any).id;
      
      // Get recipients count
      const recipients = await storage.getRecipientsByUserId(userId);
      
      // Get recommendations count
      const recommendations = await storage.getRecommendationsByUserId(userId);
      
      // Get upcoming occasions count
      const upcomingOccasions = await storage.getUpcomingOccasionsByUserId(userId);
      
      // Calculate gifts purchased (recommendations with status "approved")
      const giftsPurchased = recommendations.filter(rec => rec.status === "approved").length;
      
      res.json({
        recipients: recipients.length,
        recommendations: recommendations.length,
        gifts_purchased: giftsPurchased,
        upcoming_events: upcomingOccasions.length
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
