import { Request, Response } from 'express';
import passport from 'passport';
import { storage } from '../storage';
import { hashPassword, generateToken } from '../utils/auth';
import { encryptData, decryptData, PII_FIELDS } from '../utils/encryption';
import { InsertUser } from '@shared/schema';
import { verificationService } from '../services/verification-service';
import { EmailService } from '../services/email-service';

export const authController = {
  /**
   * Register a new user with email and password
   */
  register: async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(encryptData(email));
      
      if (existingUser && existingUser.isVerified) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      
      // If user exists but is not verified, allow resending verification
      if (existingUser && !existingUser.isVerified) {
        const verificationCode = verificationService.generateVerificationCode();
        await storage.updateUser(existingUser.id, { verificationCode });
        
        // Send verification code via email
        const emailSent = await verificationService.sendVerificationEmail(email, verificationCode);
        
        return res.status(201).json({
          message: 'Verification code resent. Please check your email.',
          requiresVerification: true,
          userId: existingUser.id
        });
      }
      
      // Hash password
      const hashedPassword = await hashPassword(password);
      
      // Generate verification code and token
      const verificationCode = verificationService.generateVerificationCode();
      const verificationToken = verificationService.generateVerificationToken();
      
      // Create new user with encrypted PII
      const newUser: InsertUser = {
        email: encryptData(email),
        password: hashedPassword,
        firstName: encryptData(firstName),
        lastName: encryptData(lastName),
        phone: phone ? encryptData(phone) : null,
        isVerified: false,
        verificationCode,
        verificationToken,
        role: 'user'
      };
      
      const user = await storage.createUser(newUser);
      
      // Send verification code via email (use plain email, not encrypted)
      const emailSent = await verificationService.sendVerificationEmail(
        email,
        verificationCode
      );
      
      // Optionally send verification via SMS as well
      let smsSent = false;
      if (phone) {
        smsSent = await verificationService.sendVerificationSMS(
          decryptData(user.phone as string),
          verificationCode
        );
      }
      
      // Generate token
      const token = generateToken(user);
      
      // Return user data with decrypted PII
      const decryptedUser = {
        ...user,
        email: decryptData(user.email),
        firstName: decryptData(user.firstName),
        lastName: decryptData(user.lastName),
        phone: user.phone ? decryptData(user.phone) : null,
        token
      };
      
      // Don't send password or verification info back
      delete decryptedUser.password;
      delete decryptedUser.verificationCode;
      
      return res.status(201).json({ 
        message: 'User registered successfully. Please check your email or phone for a verification code.', 
        user: decryptedUser,
        requireVerification: true,
        verificationSent: {
          email: emailSent,
          sms: smsSent
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ message: 'Error registering user' });
    }
  },
  
  /**
   * Login a user with email and password
   */
  login: async (req: Request, res: Response) => {
    passport.authenticate('local', { session: false }, (err: any, user: any, info: any) => {
      if (err) {
        return res.status(500).json({ message: 'Authentication error' });
      }
      
      if (!user) {
        return res.status(401).json({ message: info.message || 'Authentication failed' });
      }
      
      // Generate token
      const token = generateToken(user);
      
      // Update last login time
      storage.updateUser(user.id, { lastLogin: new Date() })
        .catch(error => console.error('Error updating last login:', error));
      
      // Decrypt PII fields for response
      const decryptedUser = {
        ...user,
        email: decryptData(user.email),
        firstName: decryptData(user.firstName),
        lastName: decryptData(user.lastName),
        token
      };
      
      delete decryptedUser.password; // Don't send password back
      
      return res.json({ 
        message: 'Login successful', 
        user: decryptedUser 
      });
    })(req, res);
  },
  
  /**
   * Logout the current user
   */
  logout: (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Error logging out' });
      }
      
      res.json({ message: 'Logout successful' });
    });
  },

  /**
   * Get the current authenticated user
   */
  getCurrentUser: async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // User is already decrypted by deserializeUser
    const user = req.user;
    delete (user as any).password; // Don't send password back
    
    return res.json({ user });
  },
  
  // Social login routes
  googleAuth: passport.authenticate('google', { scope: ['profile', 'email'] }),
  
  googleCallback: (req: Request, res: Response) => {
    passport.authenticate('google', { session: true }, (err, user) => {
      if (err || !user) {
        return res.redirect('/login?error=google-auth-failed');
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.redirect('/login?error=login-failed');
        }
        
        // Update last login time
        storage.updateUser(user.id, { lastLogin: new Date() })
          .catch(error => console.error('Error updating last login:', error));
        
        return res.redirect('/dashboard');
      });
    })(req, res);
  },
  
  facebookAuth: passport.authenticate('facebook', { scope: ['email', 'public_profile'] }),
  
  facebookCallback: (req: Request, res: Response) => {
    passport.authenticate('facebook', { session: true }, (err, user) => {
      if (err || !user) {
        return res.redirect('/login?error=facebook-auth-failed');
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.redirect('/login?error=login-failed');
        }
        
        // Update last login time
        storage.updateUser(user.id, { lastLogin: new Date() })
          .catch(error => console.error('Error updating last login:', error));
        
        return res.redirect('/dashboard');
      });
    })(req, res);
  },
  
  appleAuth: passport.authenticate('apple'),
  
  appleCallback: (req: Request, res: Response) => {
    passport.authenticate('apple', { session: true }, (err, user) => {
      if (err || !user) {
        return res.redirect('/login?error=apple-auth-failed');
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.redirect('/login?error=login-failed');
        }
        
        // Update last login time
        storage.updateUser(user.id, { lastLogin: new Date() })
          .catch(error => console.error('Error updating last login:', error));
        
        return res.redirect('/dashboard');
      });
    })(req, res);
  },
  
  /**
   * Request a password reset email
   */
  requestPasswordReset: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      // Find user by email
      const user = await storage.getUserByEmail(encryptData(email));
      
      if (!user) {
        // Still return success to prevent email enumeration
        return res.json({ message: 'If your email is registered, you will receive a password reset link' });
      }
      
      // Generate reset token
      const resetToken = Math.random().toString(36).slice(2) + Date.now().toString(36);
      const resetExpires = new Date();
      resetExpires.setHours(resetExpires.getHours() + 1); // Token valid for 1 hour
      
      // Update user with reset token
      await storage.updateUser(user.id, {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires
      });
      
      // In a real application, send an email with reset link
      // For development, just return the token
      return res.json({ 
        message: 'If your email is registered, you will receive a password reset link',
        // Remove in production:
        debug: { resetToken, email: decryptData(user.email) }
      });
    } catch (error) {
      console.error('Password reset request error:', error);
      return res.status(500).json({ message: 'Error processing request' });
    }
  },
  
  /**
   * Reset password with token
   */
  resetPassword: async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;
      
      // Find user by reset token
      const user = await storage.getUserByResetToken(token);
      
      if (!user || !user.resetPasswordExpires) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }
      
      // Check if token is expired
      if (new Date() > new Date(user.resetPasswordExpires)) {
        return res.status(400).json({ message: 'Reset token has expired' });
      }
      
      // Hash new password
      const hashedPassword = await hashPassword(newPassword);
      
      // Update user with new password and clear reset token
      await storage.updateUser(user.id, {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      });
      
      return res.json({ message: 'Password reset successful' });
    } catch (error) {
      console.error('Password reset error:', error);
      return res.status(500).json({ message: 'Error resetting password' });
    }
  },
  
  /**
   * Verify account with code
   */
  verifyAccount: async (req: Request, res: Response) => {
    try {
      const { email, verificationCode } = req.body;
      
      if (!email || !verificationCode) {
        return res.status(400).json({ message: 'Verification code is required to verify your email' });
      }
      
      // Find user by email
      const user = await storage.getUserByEmail(encryptData(email));
      
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      
      // Verify the code
      const isValid = await verificationService.verifyCode(user.id, verificationCode);
      
      if (!isValid) {
        return res.status(400).json({ message: 'Invalid verification code' });
      }
      
      // Update user to mark as verified and clear verification data
      await storage.updateUser(user.id, {
        isVerified: true,
        verificationCode: null,
        verificationToken: null
      });
      
      // Send welcome email
      try {
        // Use dynamic import for ESM
        const emailServiceModule = await import('../services/email-service.js');
        
        // Send welcome email with decrypted first name
        const email = decryptData(user.email);
        const firstName = decryptData(user.firstName);
        
        await emailServiceModule.emailService.sendWelcomeEmail(email, firstName);
      } catch (emailError) {
        console.error('Error sending welcome email:', emailError);
        // Continue even if welcome email fails
      }
      
      return res.json({ 
        message: 'Account verified successfully',
        verified: true
      });
    } catch (error) {
      console.error('Account verification error:', error);
      return res.status(500).json({ message: 'Error verifying account' });
    }
  },

  /**
   * Send password reset email
   */
  forgotPassword: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
      
      // Find user by email
      const user = await storage.getUserByEmail(encryptData(email));
      
      if (!user) {
        // Don't reveal if user exists or not for security
        return res.json({ message: 'If an account with that email exists, we\'ve sent a password reset link.' });
      }
      
      // Generate reset token
      const resetToken = verificationService.generateVerificationToken();
      const resetExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      
      // Save reset token to user
      await storage.updateUser(user.id, {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpiry
      });
      
      // Send reset email
      try {
        const resetUrl = `${req.protocol}://${req.get('host')}/reset-password?token=${resetToken}`;
        await EmailService.sendPasswordResetEmail(email, resetUrl, decryptData(user.firstName));
        
        return res.json({ 
          message: 'Password reset email sent! Check your inbox for reset instructions.' 
        });
      } catch (emailError) {
        console.error('Error sending reset email:', emailError);
        return res.status(500).json({ message: 'Failed to send reset email' });
      }
      
    } catch (error) {
      console.error('Forgot password error:', error);
      return res.status(500).json({ message: 'Error processing password reset request' });
    }
  },

  /**
   * Reset password with token
   */
  resetPassword: async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ message: 'Reset token and new password are required' });
      }
      
      // Find user by reset token
      const user = await storage.getUserByResetToken(token);
      
      if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }
      
      // Hash new password
      const hashedPassword = await hashPassword(newPassword);
      
      // Update user password and clear reset token
      await storage.updateUser(user.id, {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null
      });
      
      return res.json({ 
        message: 'Password reset successful! You can now log in with your new password.' 
      });
      
    } catch (error) {
      console.error('Reset password error:', error);
      return res.status(500).json({ message: 'Error resetting password' });
    }
  }
};