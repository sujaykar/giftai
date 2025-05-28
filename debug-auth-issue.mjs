// Debug the specific authentication issue for karsujay@karinfinity.com
import bcrypt from 'bcrypt';

console.log('🔍 Debugging Authentication Issue for karsujay@karinfinity.com\n');

// Test the exact scenario from the logs
const testEmail = 'karsujay@karinfinity.com';
const testPassword = 'password123'; // Assuming this was the password used

console.log('Testing password hashing and verification process:');
console.log('Email:', testEmail);
console.log('Password to test:', testPassword);

// Simulate the registration process - hash the password
console.log('\n1️⃣ Registration Process:');
const hashedPassword = await bcrypt.hash(testPassword, 10);
console.log('Hashed password during registration:', hashedPassword);

// Simulate the login process - verify the password
console.log('\n2️⃣ Login Process:');
const isPasswordValid = await bcrypt.compare(testPassword, hashedPassword);
console.log('Password verification result:', isPasswordValid ? '✅ VALID' : '❌ INVALID');

// Test with different potential passwords
const commonPasswords = ['password', 'password123', 'Password123', 'test123', '123456'];

console.log('\n3️⃣ Testing Common Passwords:');
for (const pwd of commonPasswords) {
    const result = await bcrypt.compare(pwd, hashedPassword);
    console.log(`Password "${pwd}":`, result ? '✅ MATCH' : '❌ NO MATCH');
}

console.log('\n🎯 Debug Complete - Check if any password matches!');