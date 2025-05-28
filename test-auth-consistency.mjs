// Test to verify email encryption and password hashing consistency
import bcrypt from 'bcrypt';
import crypto from 'crypto';

console.log('🔐 Testing Authentication Consistency...\n');

// Test password hashing consistency
const testPassword = 'TestPassword123';
console.log('1️⃣ Testing Password Hashing:');
console.log('Original password:', testPassword);

// Hash the password (same as registration)
const hashedPassword = await bcrypt.hash(testPassword, 10);
console.log('Hashed password:', hashedPassword);

// Verify the password (same as login)
const isValid = await bcrypt.compare(testPassword, hashedPassword);
console.log('Password verification result:', isValid ? '✅ MATCH' : '❌ NO MATCH');

// Test with wrong password
const wrongPassword = 'WrongPassword123';
const isWrong = await bcrypt.compare(wrongPassword, hashedPassword);
console.log('Wrong password verification:', isWrong ? '❌ SECURITY ISSUE' : '✅ CORRECTLY REJECTED');

console.log('\n2️⃣ Testing Email Encryption:');
const testEmail = 'test@example.com';
console.log('Original email:', testEmail);

// Simulate encryption (same as registration)
const ENCRYPTION_KEY = crypto.scryptSync('default-development-encryption-key', 'salt', 32);
const ENCRYPTION_IV = crypto.randomBytes(16);

function encryptData(data) {
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, ENCRYPTION_IV);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

function decryptData(encryptedData) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, ENCRYPTION_IV);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

const encryptedEmail = encryptData(testEmail);
console.log('Encrypted email:', encryptedEmail);

const decryptedEmail = decryptData(encryptedEmail);
console.log('Decrypted email:', decryptedEmail);
console.log('Email consistency:', testEmail === decryptedEmail ? '✅ MATCH' : '❌ NO MATCH');

console.log('\n🎯 Authentication Consistency Test Complete!');