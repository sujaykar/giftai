import CryptoJS from 'crypto-js';

// Environment variable for encryption key - should be set in production
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'gift-ai-default-encryption-key-change-in-production';

/**
 * Encrypts sensitive user data (PII)
 * @param data Data to encrypt
 * @returns Encrypted string
 */
export const encryptData = (data: string): string => {
  if (!data) return data;
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
};

/**
 * Decrypts sensitive user data
 * @param encryptedData Encrypted string
 * @returns Decrypted data
 */
export const decryptData = (encryptedData: string): string => {
  if (!encryptedData) return encryptedData;
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

/**
 * Encrypt sensitive fields in an object
 * @param obj Object containing data to encrypt
 * @param fieldsToEncrypt Array of field names to encrypt
 * @returns New object with encrypted fields
 */
export const encryptFields = <T extends Record<string, any>>(
  obj: T, 
  fieldsToEncrypt: string[]
): T => {
  const result = { ...obj };
  
  fieldsToEncrypt.forEach(field => {
    if (result[field] && typeof result[field] === 'string') {
      result[field] = encryptData(result[field]);
    }
  });
  
  return result;
};

/**
 * Decrypt sensitive fields in an object
 * @param obj Object containing encrypted data
 * @param fieldsToDecrypt Array of field names to decrypt
 * @returns New object with decrypted fields
 */
export const decryptFields = <T extends Record<string, any>>(
  obj: T, 
  fieldsToDecrypt: string[]
): T => {
  const result = { ...obj };
  
  fieldsToDecrypt.forEach(field => {
    if (result[field] && typeof result[field] === 'string') {
      try {
        result[field] = decryptData(result[field]);
      } catch (error) {
        // If decryption fails, leave the field as is
        console.error(`Failed to decrypt field ${field}:`, error);
      }
    }
  });
  
  return result;
};

// List of PII fields that should be encrypted in the database
export const PII_FIELDS = ['email', 'firstName', 'lastName', 'phone', 'address'];