// Direct SendGrid test
import { MailService } from '@sendgrid/mail';

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

const testEmail = {
  to: 'auntorag@gmail.com',
  from: process.env.FROM_EMAIL,
  subject: 'GIFT AI - Verification Code Test',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #ec4899;">🎁 GIFT AI</h1>
      <h2>Your Verification Code</h2>
      <div style="background: #fdf2f8; border: 2px solid #ec4899; padding: 20px; text-align: center; border-radius: 8px;">
        <div style="font-size: 32px; font-weight: bold; color: #ec4899; font-family: monospace;">998693</div>
      </div>
      <p>This is a test to verify email delivery to auntorag@gmail.com is working correctly.</p>
    </div>
  `,
  text: 'GIFT AI Verification Code: 998693'
};

console.log('Testing direct email to auntorag@gmail.com...');
try {
  const result = await mailService.send(testEmail);
  console.log('✅ Direct email sent successfully!', result[0].statusCode);
} catch (error) {
  console.error('❌ Direct email failed:', error.response?.body || error.message);
}