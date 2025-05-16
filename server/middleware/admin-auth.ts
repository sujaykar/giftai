import { Request, Response, NextFunction } from "express";
import { storage } from "../storage";

// Middleware to check if a user is an admin
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const userId = (req.user as any)?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid user" });
    }
    
    const user = await storage.getUser(userId);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden - Admin access required" });
    }
    
    next();
  } catch (error) {
    console.error("Error in admin authentication:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};