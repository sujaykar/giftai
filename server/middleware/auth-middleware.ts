import { Request, Response, NextFunction } from 'express';
import { verifyToken, getUserIdFromToken } from '../utils/auth';
import { storage } from '../storage';
import { decryptPII } from '../utils/encryption';

/**
 * Middleware to verify JWT token authentication
 */
export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No authentication token provided' });
    }
    
    // Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No authentication token provided' });
    }
    
    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    
    // Get user from token
    const userId = decoded.id;
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Decrypt PII fields
    const userWithDecryptedPII = decryptPII(user);
    
    // Attach user to request object
    req.user = userWithDecryptedPII;
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

/**
 * Middleware to check if user is logged in (session-based)
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  res.status(401).json({ message: 'User not authenticated' });
};

/**
 * Middleware to check if user is an admin
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  
  const user = req.user as any;
  
  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  next();
};