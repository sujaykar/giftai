import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export const emailService = {
  /**
   * Send verification email with code
   */
  async sendVerificationEmail(
    to: string, 
    verificationCode: string
  ): Promise<boolean> {
    try {
      const msg = {
        to,
        from: 'karsujay@gmail.com', // Use the same email used to create SendGrid account
        subject: 'Verify Your GIFT AI Account',
        text: `Your GIFT AI verification code is: ${verificationCode}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f06292; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">GIFT AI</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
              <h2>Verify Your Account</h2>
              <p>Thank you for registering with GIFT AI. Please use the following code to verify your account:</p>
              <div style="background-color: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0;">
                <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px;">${verificationCode}</span>
              </div>
              <p>This code will expire in 30 minutes.</p>
              <p>If you did not create an account with GIFT AI, please ignore this email.</p>
            </div>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #757575;">
              <p>&copy; ${new Date().getFullYear()} GIFT AI. All rights reserved.</p>
            </div>
          </div>
        `
      };

      await sgMail.send(msg);
      console.log(`Verification email sent to ${to}`);
      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      return false;
    }
  },

  /**
   * Send a welcome email after account verification
   */
  async sendWelcomeEmail(
    to: string, 
    firstName: string
  ): Promise<boolean> {
    try {
      const msg = {
        to,
        from: 'karsujay@gmail.com', // Use the same email used to create SendGrid account
        subject: 'Welcome to GIFT AI!',
        text: `Welcome to GIFT AI, ${firstName}!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f06292; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">GIFT AI</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
              <h2>Welcome to GIFT AI!</h2>
              <p>Hi ${firstName},</p>
              <p>Thank you for joining GIFT AI. We're excited to help you find perfect gifts for your loved ones!</p>
              <p>With GIFT AI, you can:</p>
              <ul>
                <li>Get personalized gift recommendations</li>
                <li>Save ideas for upcoming occasions</li>
                <li>Track your gift budget</li>
                <li>And much more!</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://giftai.com/dashboard" style="background-color: #f06292; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Go to Dashboard</a>
              </div>
            </div>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #757575;">
              <p>&copy; ${new Date().getFullYear()} GIFT AI. All rights reserved.</p>
            </div>
          </div>
        `
      };

      await sgMail.send(msg);
      console.log(`Welcome email sent to ${to}`);
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  },

  /**
   * Send a password reset email
   */
  async sendPasswordResetEmail(
    to: string, 
    resetToken: string
  ): Promise<boolean> {
    try {
      const resetUrl = `https://giftai.com/reset-password?token=${resetToken}`;
      
      const msg = {
        to,
        from: 'karsujay@gmail.com', // Use the same email used to create SendGrid account
        subject: 'Reset Your GIFT AI Password',
        text: `Click the following link to reset your password: ${resetUrl}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f06292; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">GIFT AI</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
              <h2>Reset Your Password</h2>
              <p>You requested a password reset for your GIFT AI account. Click the button below to reset your password:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #f06292; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
              </div>
              <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
              <p>This link will expire in 1 hour.</p>
            </div>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #757575;">
              <p>&copy; ${new Date().getFullYear()} GIFT AI. All rights reserved.</p>
            </div>
          </div>
        `
      };

      await sgMail.send(msg);
      console.log(`Password reset email sent to ${to}`);
      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return false;
    }
  },

  /**
   * Send recommendation notification email
   */
  async sendRecommendationEmail(
    userId: number,
    recipient: any,
    recommendationCount: number
  ): Promise<boolean> {
    try {
      // Get user's email
      // Use dynamic import for ESM
      const storageModule = await import('../storage.js');
      const user = await storageModule.storage.getUser(userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Decrypt user email
      // Use dynamic import for ESM
      const encryptionModule = await import('../utils/encryption.js');
      const userEmail = encryptionModule.decryptData(user.email);
      const recipientName = encryptionModule.decryptData(recipient.name);
      
      const msg = {
        to: userEmail,
        from: 'karsujay@gmail.com', // Use the same email used to create SendGrid account
        subject: `New Gift Recommendations for ${recipientName}`,
        text: `We've found ${recommendationCount} new gift ideas for ${recipientName}!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #f06292; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">GIFT AI</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
              <h2>New Gift Recommendations!</h2>
              <p>We've found ${recommendationCount} new gift ideas for ${recipientName}!</p>
              <p>Our AI-powered recommendation engine has analyzed ${recipientName}'s preferences and found some great gift suggestions.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://giftai.com/recommendations" style="background-color: #f06292; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Recommendations</a>
              </div>
            </div>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #757575;">
              <p>&copy; ${new Date().getFullYear()} GIFT AI. All rights reserved.</p>
            </div>
          </div>
        `
      };

      await sgMail.send(msg);
      console.log(`Recommendation email sent for recipient ${recipientName}`);
      return true;
    } catch (error) {
      console.error('Error sending recommendation email:', error);
      return false;
    }
  }
};