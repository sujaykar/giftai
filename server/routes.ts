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
  // Full registration route with email verification
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      
      console.log('✅ REGISTRATION ATTEMPT with verification for:', email);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser && existingUser.isVerified) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      
      // Hash password
      const bcrypt = await import('bcrypt');
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Generate verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Create user with verification required
      const newUser = await storage.createUser({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        isVerified: false,
        verificationCode,
        role: 'user'
      });
      
      // Send verification email
      try {
        const { EmailService } = await import('./services/email-service');
        const emailSent = await EmailService.sendVerificationEmail({
          email: email,
          verificationToken: verificationCode,
          name: firstName
        });
        
        if (emailSent) {
          console.log('✅ VERIFICATION EMAIL SENT to:', email);
        } else {
          console.log('⚠️ EMAIL SENDING FAILED for:', email);
        }
      } catch (emailError) {
        console.error('Email service error:', emailError);
      }
      
      console.log('✅ USER REGISTERED (verification required):', email);
      
      res.status(201).json({
        message: 'Registration successful! Please check your email for verification code.',
        requiresVerification: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName
        }
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Error registering user' });
    }
  });
  
  // EMERGENCY LOGIN ROUTE - Direct authentication bypass
  app.post("/api/auth/emergency-login", async (req, res) => {
    console.log('🚨 EMERGENCY LOGIN ROUTE ACTIVATED');
    
    const { email, password } = req.body;
    console.log('🔍 Emergency login for:', email);
    
    try {
      // Direct access to storage
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        console.log('❌ No user found in emergency route');
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      console.log('✅ User found in emergency route:', user.id);
      
      // Direct password check
      const bcrypt = await import('bcrypt');
      const isValid = await bcrypt.compare(password, user.password);
      
      if (!isValid) {
        console.log('❌ Invalid password in emergency route');
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      console.log('✅ EMERGENCY LOGIN SUCCESS');
      
      // Set session manually with proper typing
      (req.session as any).userId = user.id;
      (req.session as any).user = user;
      
      res.json({
        message: 'Emergency login successful',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: user.isVerified
        }
      });
      
    } catch (error) {
      console.error('❌ Emergency login error:', error);
      res.status(500).json({ message: 'Emergency login failed' });
    }
  });
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
      
      // CRITICAL FIX: Comprehensive user lookup system
      console.log('🔍 CRITICAL: Starting user lookup for:', email);
      
      try {
        user = await storage.getUserByEmail(email);
        console.log('🔍 STORAGE RESULT:', user ? `FOUND USER ${user.id}` : 'NO USER FOUND');
        
        if (user) {
          console.log('✅ USER DETAILS:');
          console.log('  - ID:', user.id);
          console.log('  - Email:', user.email);
          console.log('  - Verified:', user.isVerified);
          console.log('  - Has Password:', !!user.password);
        } else {
          // EMERGENCY: Manual search through all users
          console.log('🚨 EMERGENCY: Searching all users manually...');
          // Since getUserByEmail has a fallback, let's force a manual check
          const allUsers = Array.from((storage as any).users?.values() || []);
          console.log('🔍 Total users in storage:', allUsers.length);
          
          for (const testUser of allUsers) {
            if (testUser.email === email) {
              console.log('✅ FOUND USER IN MANUAL SEARCH:', testUser.id);
              user = testUser;
              break;
            }
          }
          
          if (!user) {
            console.log('🔍 Checking for similar emails...');
            for (const testUser of allUsers) {
              console.log('  - Stored email:', testUser.email);
              if (testUser.email && testUser.email.toLowerCase() === email.toLowerCase()) {
                console.log('✅ FOUND USER WITH CASE DIFFERENCE:', testUser.id);
                user = testUser;
                break;
              }
            }
          }
        }
      } catch (error) {
        console.log('❌ CRITICAL ERROR in user lookup:', error);
      }
      
      // Method 3: Case variations
      if (!user) {
        const emailVariations = [
          email.toLowerCase(),
          email.toUpperCase(),
          email.trim(),
          email.trim().toLowerCase()
        ];
        
        for (const variation of emailVariations) {
          try {
            user = await storage.getUserByEmail(variation);
            if (user) {
              console.log('✅ FOUND: Email variation method -', variation);
              break;
            }
          } catch (e) {
            // Continue trying
          }
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
