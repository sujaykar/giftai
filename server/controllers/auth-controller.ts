import { Request, Response } from 'express';
import passport from 'passport';
import { storage } from '../storage';
import { hashPassword, generateToken } from '../utils/auth';
import { encryptData, decryptData, PII_FIELDS } from '../utils/encryption';
import { InsertUser } from '@shared/schema';

export const authController = {
  /**
   * Register a new user with email and password
   */
  register: async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(encryptData(email));
      
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      
      // Hash password
      const hashedPassword = await hashPassword(password);
      
      // Create new user with encrypted PII
      const newUser: InsertUser = {
        email: encryptData(email),
        password: hashedPassword,
        firstName: encryptData(firstName),
        lastName: encryptData(lastName),
        phone: phone ? encryptData(phone) : null,
        role: 'user'
      };
      
      const user = await storage.createUser(newUser);
      
      // Generate token
      const token = generateToken(user);
      
      // Return user data with decrypted PII
      const decryptedUser = {
        ...user,
        email: decryptData(user.email),
        firstName: decryptData(user.firstName),
        lastName: decryptData(user.lastName),
        token
      };
      
      delete decryptedUser.password; // Don't send password back
      
      return res.status(201).json({ 
        message: 'User registered successfully', 
        user: decryptedUser 
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
  }
};