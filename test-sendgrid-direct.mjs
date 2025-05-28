// Direct SendGrid test for password reset emails
import { MailService } from '@sendgrid/mail';

const mailService = new MailService();

async function testSendGridDirect() {
  console.log('🔍 Testing SendGrid Configuration...\n');
  
  // Check environment variables
  console.log('Environment Variables:');
  console.log('- SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'Set ✓' : 'Missing ❌');
  console.log('- FROM_EMAIL:', process.env.FROM_EMAIL || 'Missing ❌');
  
  if (!process.env.SENDGRID_API_KEY) {
    console.log('\n❌ SENDGRID_API_KEY is missing!');
    return;
  }
  
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
  
  // Test email with your domain configuration
  const testEmail = {
    to: 'karsujay@gmail.com',
    from: process.env.FROM_EMAIL || 'noreply@giftai.com',
    subject: 'GIFT AI Password Reset Test',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #ec4899; text-align: center;">✨ GIFT AI</h1>
        <h2>Password Reset Link</h2>
        <p>Hi! This is a test of your password reset email system.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="https://giftsai.com/reset-password?token=test123" 
             style="background-color: #ec4899; color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Reset Your Password
          </a>
        </div>
        <p><strong>Reset Link:</strong> https://giftsai.com/reset-password?token=test123</p>
        <p style="color: #666; font-size: 14px;">This link expires in 15 minutes for security.</p>
      </div>
    `,
    text: 'GIFT AI Password Reset\n\nReset your password: https://giftsai.com/reset-password?token=test123\n\nThis link expires in 15 minutes.'
  };
  
  try {
    console.log('\n📧 Sending test password reset email...');
    const result = await mailService.send(testEmail);
    console.log('✅ Email sent successfully!');
    console.log('Status Code:', result[0].statusCode);
    console.log('Reset Link Format: https://giftsai.com/reset-password?token=YOUR_TOKEN');
    
    console.log('\n🎯 Your password reset emails should now work!');
    console.log('Check your inbox (and spam folder) for the test email.');
    
  } catch (error) {
    console.log('❌ SendGrid Error:', error.response?.body || error.message);
    
    if (error.code === 401) {
      console.log('\n💡 Solution: Your SENDGRID_API_KEY might be invalid or expired.');
      console.log('Please verify your SendGrid API key is correct.');
    } else if (error.code === 403) {
      console.log('\n💡 Solution: Check your SendGrid account permissions and FROM_EMAIL verification.');
    }
  }
}

testSendGridDirect();