// Fix the login issue for karsujay@karinfinity.com
import bcrypt from 'bcrypt';

console.log('🔧 Fixing Login Issue...\n');

// The issue appears to be in password verification
// Let's test what might be happening during registration vs login

const testPassword = 'your_actual_password'; // Replace with the actual password you used
console.log('Testing password:', testPassword);

// Test current bcrypt process
const hashedPassword = await bcrypt.hash(testPassword, 10);
console.log('Newly hashed password:', hashedPassword);

const verification = await bcrypt.compare(testPassword, hashedPassword);
console.log('Verification result:', verification ? '✅ SUCCESS' : '❌ FAILED');

console.log('\n💡 The issue might be:');
console.log('1. Password stored during registration might be corrupted');
console.log('2. There might be encoding issues with the password');
console.log('3. The password field might not be storing correctly');

console.log('\n🎯 Solution: We can add a password reset option for your account');