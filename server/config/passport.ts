import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as AppleStrategy } from 'passport-apple';
import { storage } from '../storage';
import { comparePassword, hashPassword } from '../utils/auth';
import { encryptData, decryptData } from '../utils/encryption';
import { User, InsertUser } from '@shared/schema';

export const configurePassport = () => {
  // Serialize and deserialize user
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      
      if (!user) {
        return done(null, false);
      }
      
      // Decrypt sensitive fields before sending to client
      const userForClient = {
        ...user,
        email: decryptData(user.email),
        firstName: decryptData(user.firstName),
        lastName: decryptData(user.lastName),
        phone: user.phone ? decryptData(user.phone) : null,
        address: user.address ? decryptData(user.address) : null,
      };
      
      done(null, userForClient);
    } catch (error) {
      done(error, false);
    }
  });

  // Local Strategy (email & password)
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          console.log('🔍 LocalStrategy called with email:', email);
          // Try both encrypted and non-encrypted email lookup for compatibility
          let user;
          
          // First try plain text email lookup
          console.log('🔍 Step 1: Trying plain text email lookup...');
          user = await storage.getUserByEmail(email);
          console.log('🔍 Plain text result:', user ? 'Found user!' : 'No user found');
          
          // If not found, try encrypted email lookup
          if (!user) {
            try {
              console.log('🔍 Step 2: Trying encrypted email lookup...');
              const encryptedEmail = encryptData(email);
              console.log('🔍 Encrypted email:', encryptedEmail);
              user = await storage.getUserByEmail(encryptedEmail);
              console.log('🔍 Encrypted result:', user ? 'Found user!' : 'No user found');
            } catch (encryptError) {
              console.log('⚠️ Encryption failed:', encryptError.message);
            }
          }

          if (!user) {
            return done(null, false, { message: 'Invalid email or password' });
          }

          // Verify password with debugging
          console.log('🔍 Login attempt for:', email);
          console.log('🔍 User found with ID:', user.id);
          console.log('🔍 Stored password hash exists:', !!user.password);
          
          const isMatch = await comparePassword(password, user.password);
          console.log('🔍 Password verification result:', isMatch);
          
          if (!isMatch) {
            console.log('❌ Password verification failed for:', email);
            return done(null, false, { message: 'Invalid email or password' });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Google OAuth Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: '/api/auth/google/callback',
          scope: ['profile', 'email']
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user already exists with this Google ID
            let user = await storage.getUserByGoogleId(profile.id);
            
            if (user) {
              // Update login time
              await storage.updateUser(user.id, { lastLogin: new Date() });
              return done(null, user);
            }
            
            // Check if user exists with the same email
            const email = profile.emails && profile.emails[0]?.value;
            
            if (email) {
              const encryptedEmail = encryptData(email);
              const existingUser = await storage.getUserByEmail(encryptedEmail);
              
              if (existingUser) {
                // Link Google ID to existing account
                user = await storage.updateUser(existingUser.id, { 
                  googleId: profile.id,
                  lastLogin: new Date(),
                  profileImageUrl: profile.photos?.[0]?.value || existingUser.profileImageUrl
                });
                return done(null, user);
              }
            }
            
            // Create new user if not exists
            const newUser: InsertUser = {
              email: encryptData(email || `google_${profile.id}@example.com`),
              firstName: encryptData(profile.name?.givenName || 'Google'),
              lastName: encryptData(profile.name?.familyName || 'User'),
              password: await hashPassword(Math.random().toString(36).slice(2)),
              googleId: profile.id,
              profileImageUrl: profile.photos?.[0]?.value,
              isVerified: true,
              role: 'user'
            };
            
            user = await storage.createUser(newUser);
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  }

  // Facebook OAuth Strategy
  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL: '/api/auth/facebook/callback',
          profileFields: ['id', 'emails', 'name', 'picture.type(large)']
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user already exists with this Facebook ID
            let user = await storage.getUserByFacebookId(profile.id);
            
            if (user) {
              // Update login time
              await storage.updateUser(user.id, { lastLogin: new Date() });
              return done(null, user);
            }
            
            // Check if user exists with the same email
            const email = profile.emails && profile.emails[0]?.value;
            
            if (email) {
              const encryptedEmail = encryptData(email);
              const existingUser = await storage.getUserByEmail(encryptedEmail);
              
              if (existingUser) {
                // Link Facebook ID to existing account
                user = await storage.updateUser(existingUser.id, { 
                  facebookId: profile.id,
                  lastLogin: new Date(),
                  profileImageUrl: profile.photos?.[0]?.value || existingUser.profileImageUrl
                });
                return done(null, user);
              }
            }
            
            // Create new user if not exists
            const newUser: InsertUser = {
              email: encryptData(email || `facebook_${profile.id}@example.com`),
              firstName: encryptData(profile.name?.givenName || 'Facebook'),
              lastName: encryptData(profile.name?.familyName || 'User'),
              password: await hashPassword(Math.random().toString(36).slice(2)),
              facebookId: profile.id,
              profileImageUrl: profile.photos?.[0]?.value,
              isVerified: true,
              role: 'user'
            };
            
            user = await storage.createUser(newUser);
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  }

  // Apple Sign-in Strategy
  if (process.env.APPLE_CLIENT_ID && process.env.APPLE_TEAM_ID && process.env.APPLE_KEY_ID && process.env.APPLE_PRIVATE_KEY) {
    passport.use(
      new AppleStrategy(
        {
          clientID: process.env.APPLE_CLIENT_ID,
          teamID: process.env.APPLE_TEAM_ID,
          keyID: process.env.APPLE_KEY_ID,
          privateKeyLocation: process.env.APPLE_PRIVATE_KEY,
          callbackURL: '/api/auth/apple/callback',
          scope: ['name', 'email']
        },
        async (req, accessToken, refreshToken, idToken, profile, done) => {
          try {
            // Profile from Apple is minimal, we need to extract from idToken
            const appleId = profile.id;
            
            // Check if user already exists with this Apple ID
            let user = await storage.getUserByAppleId(appleId);
            
            if (user) {
              // Update login time
              await storage.updateUser(user.id, { lastLogin: new Date() });
              return done(null, user);
            }
            
            // Extract email from profile
            const email = profile.email;
            
            if (email) {
              const encryptedEmail = encryptData(email);
              const existingUser = await storage.getUserByEmail(encryptedEmail);
              
              if (existingUser) {
                // Link Apple ID to existing account
                user = await storage.updateUser(existingUser.id, { 
                  appleId: appleId,
                  lastLogin: new Date()
                });
                return done(null, user);
              }
            }
            
            // Apple might only provide name on first sign-in
            const firstName = req.body?.firstName || req.body?.user?.name?.firstName || 'Apple';
            const lastName = req.body?.lastName || req.body?.user?.name?.lastName || 'User';
            
            // Create new user if not exists
            const newUser: InsertUser = {
              email: encryptData(email || `apple_${appleId}@example.com`),
              firstName: encryptData(firstName),
              lastName: encryptData(lastName),
              password: await hashPassword(Math.random().toString(36).slice(2)),
              appleId: appleId,
              isVerified: true,
              role: 'user'
            };
            
            user = await storage.createUser(newUser);
            return done(null, user);
          } catch (error) {
            return done(error);
          }
        }
      )
    );
  }
};