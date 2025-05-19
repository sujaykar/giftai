import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as AppleStrategy } from 'passport-apple';
import { Strategy as LocalStrategy } from 'passport-local';

import { storage } from '../storage';
import { encryptData, decryptData, PII_FIELDS } from '../utils/encryption';
import { comparePassword } from '../utils/auth';
import { InsertUser } from '@shared/schema';

// Social login configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || '';
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || '';
const APPLE_CLIENT_ID = process.env.APPLE_CLIENT_ID || '';
const APPLE_TEAM_ID = process.env.APPLE_TEAM_ID || '';
const APPLE_KEY_ID = process.env.APPLE_KEY_ID || '';
const APPLE_PRIVATE_KEY = process.env.APPLE_PRIVATE_KEY || '';
const CALLBACK_URL = process.env.CALLBACK_URL || 'http://localhost:5000';

export const configurePassport = () => {
  // Serialize and deserialize user
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      // Decrypt PII fields for use in the application
      if (user) {
        const decryptedUser = {
          ...user,
          email: user.email ? decryptData(user.email) : null,
          firstName: user.firstName ? decryptData(user.firstName) : null,
          lastName: user.lastName ? decryptData(user.lastName) : null,
        };
        done(null, decryptedUser);
      } else {
        done(null, null);
      }
    } catch (error) {
      done(error, null);
    }
  });

  // Google Strategy
  if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          callbackURL: `${CALLBACK_URL}/api/auth/google/callback`,
          scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user exists
            let user = await storage.getUserByEmail(encryptData(profile.emails?.[0]?.value || ''));

            if (!user) {
              // Create new user
              const newUser: InsertUser = {
                email: encryptData(profile.emails?.[0]?.value || ''),
                password: '', // No password for social logins
                firstName: encryptData(profile.name?.givenName || ''),
                lastName: encryptData(profile.name?.familyName || ''),
                role: 'user',
                googleId: profile.id,
                profileImageUrl: profile.photos?.[0]?.value,
              };

              user = await storage.createUser(newUser);
            } else if (!user.googleId) {
              // Link Google account to existing user
              await storage.updateUser(user.id, { googleId: profile.id });
            }

            done(null, user);
          } catch (error) {
            done(error, false);
          }
        }
      )
    );
  }

  // Facebook Strategy
  if (FACEBOOK_APP_ID && FACEBOOK_APP_SECRET) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: FACEBOOK_APP_ID,
          clientSecret: FACEBOOK_APP_SECRET,
          callbackURL: `${CALLBACK_URL}/api/auth/facebook/callback`,
          profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user exists
            let user = await storage.getUserByEmail(encryptData(profile.emails?.[0]?.value || ''));

            if (!user) {
              // Create new user
              const newUser: InsertUser = {
                email: encryptData(profile.emails?.[0]?.value || ''),
                password: '', // No password for social logins
                firstName: encryptData(profile.name?.givenName || ''),
                lastName: encryptData(profile.name?.familyName || ''),
                role: 'user',
                facebookId: profile.id,
                profileImageUrl: profile.photos?.[0]?.value,
              };

              user = await storage.createUser(newUser);
            } else if (!user.facebookId) {
              // Link Facebook account to existing user
              await storage.updateUser(user.id, { facebookId: profile.id });
            }

            done(null, user);
          } catch (error) {
            done(error, false);
          }
        }
      )
    );
  }

  // Apple Strategy
  if (APPLE_CLIENT_ID && APPLE_TEAM_ID && APPLE_KEY_ID && APPLE_PRIVATE_KEY) {
    passport.use(
      new AppleStrategy(
        {
          clientID: APPLE_CLIENT_ID,
          teamID: APPLE_TEAM_ID,
          keyID: APPLE_KEY_ID,
          privateKeyString: APPLE_PRIVATE_KEY,
          callbackURL: `${CALLBACK_URL}/api/auth/apple/callback`,
          scope: ['name', 'email'],
        },
        async (req, accessToken, refreshToken, idToken, profile, done) => {
          try {
            const { email, name } = profile;
            
            // Check if user exists
            let user = await storage.getUserByEmail(encryptData(email || ''));

            if (!user) {
              // Create new user
              const newUser: InsertUser = {
                email: encryptData(email || ''),
                password: '', // No password for social logins
                firstName: name?.firstName ? encryptData(name.firstName) : '',
                lastName: name?.lastName ? encryptData(name.lastName) : '',
                role: 'user',
                appleId: idToken.sub,
              };

              user = await storage.createUser(newUser);
            } else if (!user.appleId) {
              // Link Apple account to existing user
              await storage.updateUser(user.id, { appleId: idToken.sub });
            }

            done(null, user);
          } catch (error) {
            done(error, false);
          }
        }
      )
    );
  }

  // Local Strategy (username/password)
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async (email, password, done) => {
        try {
          // Find user by email (need to encrypt it for comparison)
          const user = await storage.getUserByEmail(encryptData(email));
          
          if (!user) {
            return done(null, false, { message: 'User not found' });
          }

          // Check password
          const isPasswordValid = await comparePassword(password, user.password);
          
          if (!isPasswordValid) {
            return done(null, false, { message: 'Incorrect password' });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  return passport;
};