// Test password reset email delivery
import { MailService } from '@sendgrid/mail';

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

const testResetEmail = {
  to: 'karsujay@gmail.com',
  from: process.env.FROM_EMAIL,
  subject: 'Reset Your GIFT AI Password - Test',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #ec4899;">🎁 GIFT AI</h1>
      <h2>Reset Your Password</h2>
      <p>This is a test of the password reset email system.</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="https://example.com/reset" style="background-color: #ec4899; color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
          Reset Your Password
        </a>
      </div>
      <p>If you received this, the password reset email system is working correctly!</p>
    </div>
  `,
  text: 'GIFT AI Password Reset Test - If you receive this, the system is working!'
};

console.log('Testing password reset email to karsujay@gmail.com...');
console.log('FROM_EMAIL:', process.env.FROM_EMAIL);

try {
  const result = await mailService.send(testResetEmail);
  console.log('✅ Password reset email sent successfully!', result[0].statusCode);
} catch (error) {
  console.error('❌ Password reset email failed:', error.response?.body || error.message);
}