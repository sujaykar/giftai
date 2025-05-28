// Create working demo user for immediate GIFT AI access
import bcrypt from 'bcrypt';

// Create a working user account that can login immediately
const demoUser = {
  id: 999,
  uuid: 'demo-uuid-999',
  email: 'demo@giftai.com',
  password: await bcrypt.hash('Demo123!', 10),
  firstName: 'Demo',
  lastName: 'User',
  role: 'user',
  isVerified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  phone: null,
  address: null,
  googleId: null,
  facebookId: null,
  appleId: null,
  profileImageUrl: null,
  verificationToken: null,
  resetPasswordToken: null,
  resetPasswordExpires: null,
  lastLogin: null
};

console.log('✅ Demo user created for immediate GIFT AI access:');
console.log('Email: demo@giftai.com');
console.log('Password: Demo123!');
console.log('');
console.log('This account will work immediately with your emergency login system.');
console.log('You can use this to access your GIFT AI dashboard right now!');

// Export for immediate use
export { demoUser };