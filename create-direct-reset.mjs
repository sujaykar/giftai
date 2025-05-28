// Direct password reset for your Yahoo account
import { MailService } from '@sendgrid/mail';

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

async function sendDirectPasswordReset() {
  console.log('📧 Sending direct password reset for sujay_kar@yahoo.com...\n');
  
  // Generate a simple reset token for testing
  const resetToken = 'test-reset-' + Date.now();
  const resetUrl = `https://giftsai.com/reset-password?token=${resetToken}`;
  
  const resetEmail = {
    to: 'sujay_kar@yahoo.com',
    from: process.env.FROM_EMAIL,
    subject: 'Reset Your GIFT AI Password - Direct Link',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #ec4899; text-align: center;">✨ GIFT AI</h1>
        <h2>Reset Your Password</h2>
        <p>Hi! Here's your direct password reset link for your GIFT AI account.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}" 
             style="background-color: #ec4899; color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
            Reset Your Password
          </a>
        </div>
        <p><strong>Reset Link:</strong> ${resetUrl}</p>
        <p style="color: #666; font-size: 14px;">This is a direct reset link to help you access your account.</p>
        <p style="color: #666; font-size: 14px;"><strong>Temporary Solution:</strong> You can also try creating a new account with a different email if this continues to have issues.</p>
      </div>
    `,
    text: `GIFT AI Password Reset\n\nReset your password: ${resetUrl}\n\nThis is a direct reset link to help you access your account.`
  };
  
  try {
    const result = await mailService.send(resetEmail);
    console.log('✅ Direct password reset email sent successfully!');
    console.log('Status Code:', result[0].statusCode);
    console.log('Check your Yahoo inbox for the reset link.');
    
  } catch (error) {
    console.log('❌ Failed to send email:', error.response?.body || error.message);
  }
}

sendDirectPasswordReset();