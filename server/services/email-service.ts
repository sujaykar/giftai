import { MailService } from '@sendgrid/mail';
import crypto from 'crypto';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailVerificationData {
  email: string;
  verificationToken: string;
  name?: string;
}

export class EmailService {
  static async sendVerificationEmail(data: EmailVerificationData): Promise<boolean> {
    const verificationUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/api/auth/verify-email?token=${data.verificationToken}&email=${encodeURIComponent(data.email)}`;
    
    const emailContent = {
      to: data.email,
      from: process.env.FROM_EMAIL || 'noreply@giftai.com',
      subject: 'Verify Your GIFT AI Account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your GIFT AI Account</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 32px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #ec4899; font-size: 32px; margin: 0; font-weight: bold;">
                ✨ GIFT AI
              </h1>
            </div>
            
            <!-- Main Content -->
            <div style="text-align: center;">
              <h2 style="color: #1f2937; font-size: 24px; margin-bottom: 16px;">
                Welcome to GIFT AI${data.name ? `, ${data.name}` : ''}!
              </h2>
              
              <p style="color: #6b7280; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                Thank you for joining GIFT AI! To complete your registration and start finding perfect gifts with AI, please verify your email address.
              </p>
              
              <div style="margin: 32px 0;">
                <a href="${verificationUrl}" 
                   style="background-color: #ec4899; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
                  Verify Email Address
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="color: #ec4899; font-size: 14px; word-break: break-all;">
                ${verificationUrl}
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
              
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                This verification link will expire in 24 hours. If you didn't create an account with GIFT AI, you can safely ignore this email.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to GIFT AI${data.name ? `, ${data.name}` : ''}!
        
        Thank you for joining GIFT AI! To complete your registration and start finding perfect gifts with AI, please verify your email address.
        
        Verify your email by clicking this link: ${verificationUrl}
        
        This verification link will expire in 24 hours. If you didn't create an account with GIFT AI, you can safely ignore this email.
      `
    };

    try {
      await mailService.send(emailContent);
      console.log(`Verification email sent to ${data.email}`);
      return true;
    } catch (error) {
      console.error('SendGrid email error:', error);
      return false;
    }
  }

  static async sendVerificationCode(email: string, code: string): Promise<boolean> {
    const emailContent = {
      to: email,
      from: process.env.FROM_EMAIL || 'noreply@giftai.com',
      subject: 'Your GIFT AI Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email - GIFT AI</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 32px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #ec4899; font-size: 32px; margin: 0; font-weight: bold;">
                ✨ GIFT AI
              </h1>
            </div>
            
            <h2 style="color: #1f2937; font-size: 24px; margin-bottom: 16px;">Verify Your Email Address</h2>
            
            <p style="color: #6b7280; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
              Thank you for signing up for GIFT AI! To complete your registration, please use the verification code below:
            </p>
            
            <div style="text-align: center; margin: 32px 0;">
              <div style="background-color: #fdf2f8; border: 2px solid #ec4899; border-radius: 8px; padding: 20px; display: inline-block;">
                <div style="color: #ec4899; font-size: 32px; font-weight: bold; font-family: monospace; letter-spacing: 4px;">
                  ${code}
                </div>
              </div>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-bottom: 24px;">
              This verification code will expire in 15 minutes. If you didn't create an account with GIFT AI, you can safely ignore this email.
            </p>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; margin-top: 32px;">
              <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                This email was sent by GIFT AI. If you have any questions, please contact our support team.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        GIFT AI - Email Verification
        
        Thank you for signing up for GIFT AI!
        
        Your verification code is: ${code}
        
        This code will expire in 15 minutes. If you didn't create an account with GIFT AI, you can safely ignore this email.
      `
    };

    try {
      await mailService.send(emailContent);
      console.log(`Verification code email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('SendGrid verification email error:', error);
      return false;
    }
  }

  static generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  static async sendWelcomeEmail(email: string, name?: string): Promise<boolean> {
    const emailContent = {
      to: email,
      from: process.env.FROM_EMAIL || 'noreply@giftai.com',
      subject: 'Welcome to GIFT AI - Let\'s Find Perfect Gifts!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to GIFT AI</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; padding: 32px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #ec4899; font-size: 32px; margin: 0; font-weight: bold;">
                ✨ GIFT AI
              </h1>
            </div>
            
            <div style="text-align: center;">
              <h2 style="color: #1f2937; font-size: 24px; margin-bottom: 16px;">
                Welcome to GIFT AI${name ? `, ${name}` : ''}! 🎉
              </h2>
              
              <p style="color: #6b7280; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                Your email has been verified successfully! You're now ready to discover the perfect gifts for everyone on your list.
              </p>
              
              <div style="background-color: #fef3f2; border-left: 4px solid #ec4899; padding: 16px; margin: 24px 0; text-align: left;">
                <h3 style="color: #1f2937; margin: 0 0 8px 0; font-size: 16px;">Getting Started:</h3>
                <ul style="color: #6b7280; margin: 0; padding-left: 20px;">
                  <li>Add recipients you want to find gifts for</li>
                  <li>Tell us about their interests and preferences</li>
                  <li>Get AI-powered personalized recommendations</li>
                </ul>
              </div>
              
              <div style="margin: 32px 0;">
                <a href="${process.env.BASE_URL || 'http://localhost:5000'}/dashboard" 
                   style="background-color: #ec4899; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; font-size: 16px;">
                  Start Finding Gifts
                </a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    try {
      await mailService.send(emailContent);
      console.log(`Welcome email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('SendGrid welcome email error:', error);
      return false;
    }
  }
}