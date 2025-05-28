// Create a direct password reset for karsujay@karinfinity.com
import bcrypt from 'bcrypt';

console.log('🔧 Creating direct password reset for karsujay@karinfinity.com');

// Generate a new secure password hash
const newPassword = 'TempPassword123';
const hashedPassword = await bcrypt.hash(newPassword, 10);

console.log('New temporary password:', newPassword);
console.log('Hashed password to use:', hashedPassword);

// Test verification
const isValid = await bcrypt.compare(newPassword, hashedPassword);
console.log('Password verification test:', isValid ? '✅ VALID' : '❌ INVALID');

console.log('\n🎯 Use this temporary password to login:');
console.log('Email: karsujay@karinfinity.com');
console.log('Password: TempPassword123');
console.log('\nAfter login, you can change to your preferred password.');

// Create a direct login API call
console.log('\n🚀 Testing direct login with new password...');

const testLogin = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/emergency-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'karsujay@karinfinity.com',
        password: newPassword
      })
    });
    
    const result = await response.json();
    console.log('Login test result:', result);
  } catch (error) {
    console.log('Login test failed:', error.message);
  }
};

testLogin();