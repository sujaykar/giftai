import { storage } from '../storage';
import crypto from 'crypto';
import { EmailService } from './email-service';

export const verificationService = {
  /**
   * Generate a verification code (6 digits)
   */
  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  /**
   * Generate a unique verification token
   */
  generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
  },

  /**
   * Send verification code via email using SendGrid
   */
  async sendVerificationEmail(email: string, code: string): Promise<boolean> {
    try {
      // Log the code for debugging
      console.log(`VERIFICATION CODE for ${email}: ${code}`);
      
      // Send actual email via SendGrid with verification code
      return await EmailService.sendVerificationCode(email, code);
    } catch (error) {
      console.error('Error sending verification email:', error);
      return false;
    }
  },

  /**
   * Send verification code via SMS
   * In a production environment, you would integrate with Twilio, etc.
   */
  async sendVerificationSMS(phone: string, code: string): Promise<boolean> {
    try {
      // In a production app, you would send an actual SMS here
      console.log(`VERIFICATION CODE for ${phone}: ${code}`);
      
      // Since we don't have SMS sending configured, we'll simulate success
      return true;
    } catch (error) {
      console.error('Error sending verification SMS:', error);
      return false;
    }
  },

  /**
   * Verify a user's code with their stored token/code
   */
  async verifyCode(userId: number, code: string): Promise<boolean> {
    try {
      const user = await storage.getUser(userId);
      
      if (!user || !user.verificationCode) {
        return false;
      }
      
      // Check if the code matches
      return user.verificationCode === code;
    } catch (error) {
      console.error('Error verifying code:', error);
      return false;
    }
  }
};