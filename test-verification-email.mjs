// Test verification email sending directly
import { MailService } from '@sendgrid/mail';

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

async function testVerificationEmail() {
  console.log('📧 Testing Verification Email System...\n');
  
  const testVerificationEmail = {
    to: 'sujay_kar@yahoo.com',
    from: process.env.FROM_EMAIL,
    subject: 'Your GIFT AI Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #ec4899; text-align: center;">✨ GIFT AI</h1>
        <h2>Verify Your Email Address</h2>
        <p>Thank you for signing up for GIFT AI! Your verification code is:</p>
        <div style="text-align: center; margin: 32px 0;">
          <div style="background-color: #fdf2f8; border: 2px solid #ec4899; border-radius: 8px; padding: 20px; display: inline-block;">
            <div style="color: #ec4899; font-size: 32px; font-weight: bold; font-family: monospace; letter-spacing: 4px;">
              683193
            </div>
          </div>
        </div>
        <p style="color: #666; font-size: 14px;">This code expires in 15 minutes.</p>
      </div>
    `,
    text: 'GIFT AI Verification Code: 683193\n\nThis code expires in 15 minutes.'
  };
  
  try {
    console.log('Sending verification email to sujay_kar@yahoo.com...');
    const result = await mailService.send(testVerificationEmail);
    console.log('✅ Verification email sent successfully!');
    console.log('Status Code:', result[0].statusCode);
    
  } catch (error) {
    console.log('❌ Verification email failed:', error.response?.body || error.message);
  }
}

testVerificationEmail();