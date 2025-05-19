import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '@shared/schema';

// Environment variable for JWT secret - should be set in production
const JWT_SECRET = process.env.JWT_SECRET || 'gift-ai-default-jwt-secret-change-in-production';
const JWT_EXPIRY = '7d'; // Token expires in 7 days

/**
 * Hash a password using bcrypt
 * @param password Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

/**
 * Compare a password with a hashed password
 * @param password Plain text password
 * @param hashedPassword Hashed password from database
 * @returns Boolean indicating if passwords match
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Generate a JWT token for a user
 * @param user User object
 * @returns JWT token
 */
export const generateToken = (user: User): string => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role || 'user'
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
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