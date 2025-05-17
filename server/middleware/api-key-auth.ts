import { Request, Response, NextFunction } from 'express';

// The API key for job scheduler authentication
// In a production environment, this would be stored securely (e.g., environment variable)
const API_KEYS = ['gift-ai-secret-api-key'];

/**
 * Middleware to authenticate API requests using an API key
 * This is used for scheduled jobs and other automated tasks
 */
export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.header('X-Api-Key');
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'API key is required'
    });
  }
  
  if (!API_KEYS.includes(apiKey)) {
    return res.status(401).json({
      success: false,
      message: 'Invalid API key'
    });
  }
  
  next();
};