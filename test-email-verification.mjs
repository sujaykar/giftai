import { EmailService } from './server/services/email-service.js';

async function testEmailVerification() {
  console.log('🧪 Testing email verification system...');
  
  try {
    const testData = {
      email: 'test@example.com',
      verificationToken: 'test-token-123',
      name: 'Test User'
    };
    
    const emailSent = await EmailService.sendVerificationEmail(testData);
    
    if (emailSent) {
      console.log('✅ Email verification test SUCCESSFUL!');
      console.log('📧 Verification email would be sent to:', testData.email);
    } else {
      console.log('❌ Email verification test FAILED');
    }
    
  } catch (error) {
    console.error('❌ Email verification error:', error.message);
    
    if (error.message.includes('SENDGRID_API_KEY')) {
      console.log('💡 SendGrid API key issue - please verify your SENDGRID_API_KEY');
    } else if (error.message.includes('FROM_EMAIL')) {
      console.log('💡 FROM_EMAIL issue - please verify your FROM_EMAIL setting');
    } else {
      console.log('💡 Check your SendGrid configuration and API key permissions');
    }
  }
}

testEmailVerification();