import { Request, Response } from "express";
import { storage } from "../storage";
import { insertUserSchema } from "@shared/schema";
import { hashPassword } from "../utils/password-utils";

export const authController = {
  // Register a new user
  register: async (req: Request, res: Response) => {
    try {
      // Validate request body
      const result = insertUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid user data", 
          errors: result.error.errors 
        });
      }
      
      const { email, password, firstName, lastName } = req.body;
      
      // Check if email already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }
      
      // Hash password
      const hashedPassword = await hashPassword(password);
      
      // Create user
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        firstName,
        lastName
      });
      
      // Don't send password in response
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error("Register error:", error);
      return res.status(500).json({ message: "Failed to register user" });
    }
  },
  
  // Login user
  login: (req: Request, res: Response) => {
    try {
      // If we reach here, passport has already authenticated the user
      // and attached the user object to the request
      if (!req.user) {
        return res.status(401).json({ message: "Authentication failed" });
      }
      
      // Don't send password in response
      const { password, ...userWithoutPassword } = req.user as any;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Failed to login" });
    }
  },
  
  // Logout user
  logout: (req: Request, res: Response) => {
    req.logout(function(err) {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Failed to logout" });
      }
      
      res.status(200).json({ message: "Logged out successfully" });
    });
  },
  
  // Get current authenticated user
  getCurrentUser: (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Don't send password in response
      const { password, ...userWithoutPassword } = req.user as any;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Get current user error:", error);
      return res.status(500).json({ message: "Failed to get current user" });
    }
  }
};
