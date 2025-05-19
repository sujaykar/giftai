import crypto from 'crypto';
import { User } from '@shared/schema';

// If not set, generate a default key for development
// In production, this should be a secure environment variable
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-development-encryption-key-32chars';
const ENCRYPTION_IV = process.env.ENCRYPTION_IV || crypto.randomBytes(16).toString('hex').slice(0, 16);

// Fields that should be encrypted (PII - Personally Identifiable Information)
export const PII_FIELDS = ['email', 'firstName', 'lastName', 'phone', 'address'];

/**
 * Encrypt sensitive data using AES-256-CBC
 * @param data String data to encrypt
 * @returns Encrypted data as string
 */
export function encryptData(data: string): string {
  if (!data) return data;
  
  try {
    const cipher = crypto.createCipheriv(
      'aes-256-cbc', 
      Buffer.from(ENCRYPTION_KEY), 
      Buffer.from(ENCRYPTION_IV)
    );
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    // Return original data if encryption fails to prevent data loss
    return data;
  }
}

/**
 * Decrypt sensitive data
 * @param encryptedData Encrypted string to decrypt
 * @returns Decrypted data as string
 */
export function decryptData(encryptedData: string): string {
  if (!encryptedData) return encryptedData;
  
  try {
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc', 
      Buffer.from(ENCRYPTION_KEY), 
      Buffer.from(ENCRYPTION_IV)
    );
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    // Return original data if decryption fails
    return encryptedData;
  }
}

/**
 * Encrypt PII fields in an object
 * @param obj Object containing PII fields
 * @returns Object with encrypted PII fields
 */
export function encryptPII<T extends Record<string, any>>(obj: T): T {
  if (!obj) return obj;
  
  const result = { ...obj };
  
  PII_FIELDS.forEach(field => {
    if (field in result && typeof result[field] === 'string') {
      result[field] = encryptData(result[field]) as any;
    }
  });
  
  return result;
}

/**
 * Decrypt PII fields in an object
 * @param obj Object containing encrypted PII fields
 * @returns Object with decrypted PII fields
 */
export function decryptPII<T extends Record<string, any>>(obj: T): T {
  if (!obj) return obj;
  
  const result = { ...obj };
  
  PII_FIELDS.forEach(field => {
    if (field in result && typeof result[field] === 'string') {
      result[field] = decryptData(result[field]) as any;
    }
  });
  
  return result;
}

/**
 * Decrypt user PII fields for client response
 * @param user User object with encrypted PII
 * @returns User object with decrypted PII
 */
export function prepareUserForClient(user: User): Omit<User, 'password'> & { token?: string } {
  // Create a new object without the password
  const { password, ...userWithoutPassword } = user;
  
  // Decrypt PII fields
  const decryptedUser = decryptPII(userWithoutPassword);
  
  return decryptedUser;
}