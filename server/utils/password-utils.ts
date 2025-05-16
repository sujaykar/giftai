import crypto from "crypto";
import { promisify } from "util";

const pbkdf2 = promisify(crypto.pbkdf2);

// Number of iterations for PBKDF2
const ITERATIONS = 10000;
// Length of the derived key
const KEY_LENGTH = 64;
// Hash algorithm to use
const DIGEST = "sha512";
// Salt length
const SALT_LENGTH = 16;

/**
 * Hashes a password using PBKDF2 with a random salt
 */
export async function hashPassword(password: string): Promise<string> {
  // Generate a random salt
  const salt = crypto.randomBytes(SALT_LENGTH).toString("hex");
  
  // Hash the password with the salt
  const derivedKey = await pbkdf2(
    password,
    salt,
    ITERATIONS,
    KEY_LENGTH,
    DIGEST
  );
  
  // Return the salt and derivedKey concatenated
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Compares a password with a stored hash
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  // Extract the salt from the stored hash
  const [salt, storedKey] = hashedPassword.split(":");
  
  // Hash the provided password with the stored salt
  const derivedKey = await pbkdf2(
    password,
    salt,
    ITERATIONS,
    KEY_LENGTH,
    DIGEST
  );
  
  // Compare the newly derived key with the stored key
  return crypto.timingSafeEqual(
    Buffer.from(storedKey, "hex"),
    derivedKey
  );
}
