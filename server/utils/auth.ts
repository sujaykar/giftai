import jwt from 'jsonwebtoken';
import { User } from '@shared/schema';
import { hashPassword, comparePassword } from './password-utils';

// JWT secret key for token signing
// In production, this should be a secure environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'gift-ai-platform-development-jwt-secret';

/**
 * Generate a JWT token for a user
 * @param user User object
 * @returns JWT token
 */
export const generateToken = (user: User): string => {
  const payload = {
    id: user.id,
    uuid: user.uuid,
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d' // Token valid for 7 days
  });
};

/**
 * Verify a JWT token
 * @param token JWT token
 * @returns Decoded token payload or null if invalid
 */
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Extract user ID from JWT token
 * @param token JWT token
 * @returns User ID or null if invalid
 */
export const getUserIdFromToken = (token: string): number | null => {
  const decoded = verifyToken(token);
  return decoded ? decoded.id : null;
};

// Export these from password-utils for convenience
export { hashPassword, comparePassword };