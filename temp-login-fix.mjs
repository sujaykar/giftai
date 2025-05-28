// Temporary fix to help karsujay@karinfinity.com login
console.log('🔧 Creating temporary login solution for karsujay@karinfinity.com');

// Test login with common password patterns
const testPasswords = [
  'password',
  'password123', 
  'Password123',
  'test123',
  '12345678',
  'karsu123',
  'karsujay123'
];

console.log('\n📋 Potential passwords to try:');
testPasswords.forEach((pwd, index) => {
  console.log(`${index + 1}. ${pwd}`);
});

console.log('\n💡 To fix this immediately:');
console.log('1. Try the password reset feature with your email: karsujay@karinfinity.com');
console.log('2. Or use one of the passwords above that you might have used');
console.log('3. I can also create a direct login bypass for your account');

console.log('\n🎯 Quick Solution: Use the "Forgot Password" link on the login page!');