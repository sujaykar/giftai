# AWS Amplify Deployment Guide for GIFT AI

## Prerequisites
- AWS Account with Amplify access
- PostgreSQL database in AWS RDS
- Domain configured (giftsai.com)
- Google OAuth client configured

## Environment Variables Required in AWS Amplify

Add these environment variables in your Amplify console:

### Database Configuration
```
DATABASE_URL=postgresql://username:password@your-rds-endpoint:5432/giftai
NODE_ENV=production
```

### Authentication
```
SESSION_SECRET=your-secure-session-secret-here
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
```

### Email Configuration
```
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@giftsai.com
```

### AI Configuration
```
OPENAI_API_KEY=your-openai-api-key
```

## Database Setup

1. **Connect to your AWS RDS PostgreSQL instance**
2. **Run the database setup script:**
   ```bash
   node setup-production-data.mjs
   ```

## Google OAuth Configuration

Update your Google Cloud Console OAuth client with these redirect URIs:
- `https://giftsai.com/api/auth/google/callback`

Update OAuth consent screen with:
- Privacy Policy URL: `https://giftsai.com/privacy`
- Terms of Service URL: `https://giftsai.com/terms`

## Build Configuration

The `amplify.yml` file is already configured for your project:
- Node.js version: 18
- Build command: `npm run build`
- Start command: `npm start`

## Post-Deployment Steps

1. **Verify database connection** by checking Amplify logs
2. **Test authentication** with demo credentials:
   - Email: demo@giftai.com
   - Password: Demo2024!
3. **Test Google OAuth** sign-in flow
4. **Verify AI recommendations** are working

## Demo Credentials

### Main Demo Account
- Email: demo@giftai.com
- Password: Demo2024!

### Test User Accounts (all use password: TestUser2024!)
- alice.johnson@example.com
- bob.smith@example.com
- carol.davis@example.com
- david.wilson@example.com
- emma.brown@example.com
- frank.taylor@example.com
- grace.anderson@example.com
- henry.thomas@example.com
- iris.jackson@example.com
- jack.white@example.com

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL format
- Check RDS security groups allow connections from Amplify
- Ensure SSL configuration is correct

### Authentication Issues
- Verify all environment variables are set
- Check Google OAuth redirect URIs match exactly
- Ensure SESSION_SECRET is set and secure

### AI Recommendations Not Working
- Verify OPENAI_API_KEY is set correctly
- Check API key has sufficient credits
- Review application logs for errors

## Security Checklist
- [ ] All environment variables are set
- [ ] SESSION_SECRET is secure and unique
- [ ] Database credentials are secure
- [ ] Google OAuth client is properly configured
- [ ] API keys are valid and have appropriate permissions