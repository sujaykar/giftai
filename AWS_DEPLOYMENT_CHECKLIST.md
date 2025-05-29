# AWS Amplify Deployment Checklist for GIFT AI

## ✅ Completed Preparations

### Database Setup
- [x] PostgreSQL database schema configured for AWS RDS
- [x] Demo user created (demo@giftai.com / Demo2024!)
- [x] 10 test users created (password: TestUser2024!)
- [x] 12 sample products with real product data
- [x] Sample recipients for demo user

### Code Cleanup
- [x] Removed all test files and unnecessary scripts
- [x] Database configuration optimized for AWS RDS
- [x] Google OAuth configured for production domains
- [x] Legal pages created (Privacy Policy & Terms of Service)

## 🔧 Environment Variables for AWS Amplify

Add these in your Amplify Console > Environment Variables:

```
DATABASE_URL=postgresql://username:password@your-rds-endpoint:5432/giftai
NODE_ENV=production
SESSION_SECRET=your-secure-random-string-here
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@giftsai.com
OPENAI_API_KEY=your-openai-api-key
```

## 🌐 Domain Configuration

### Google OAuth Redirect URIs
Update your Google Cloud Console with:
- Production: `https://giftsai.com/api/auth/google/callback`

### OAuth Consent Screen
- Privacy Policy URL: `https://giftsai.com/privacy`
- Terms of Service URL: `https://giftsai.com/terms`

## 🚀 Deployment Steps

1. **Connect Repository to AWS Amplify**
   - Link your GitHub/GitLab repository
   - Select main/master branch

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Start command: `npm start`
   - Node.js version: 18

3. **Add Environment Variables**
   - Copy all variables from checklist above

4. **Deploy Application**
   - Trigger initial deployment
   - Monitor build logs for errors

## ✅ Post-Deployment Verification

### Authentication Testing
- [ ] Demo login works (demo@giftai.com / Demo2024!)
- [ ] Google OAuth sign-in functions
- [ ] User registration creates new accounts
- [ ] Password reset emails are sent

### Core Features Testing
- [ ] AI recommendation system generates suggestions
- [ ] Recipients can be added and managed
- [ ] Product catalog displays correctly
- [ ] User dashboard shows personalized content

### Legal Compliance
- [ ] Privacy policy accessible at /privacy
- [ ] Terms of service accessible at /terms
- [ ] Both pages display correctly

## 🔧 Troubleshooting Common Issues

### Database Connection Errors
- Verify DATABASE_URL format and credentials
- Check RDS security groups allow Amplify connections
- Ensure SSL configuration matches RDS settings

### OAuth Issues
- Confirm redirect URIs match exactly in Google Console
- Verify client ID and secret are correct
- Check that consent screen is published

### AI Recommendations Not Working
- Verify OPENAI_API_KEY is set and valid
- Check API key has sufficient credits
- Review application logs for error messages

## 📊 Demo Data Summary

### Users Available for Testing
- **Demo User**: demo@giftai.com (Demo2024!)
- **Test Users**: 10 accounts with TestUser2024! password

### Sample Data Included
- 12 diverse products across multiple categories
- 3 recipients for demo user (Sister, Best Friend, Mother)
- Complete product catalog with images and descriptions

## 🔐 Security Considerations
- All passwords are properly hashed with bcrypt
- Session secrets are environment-specific
- API keys are secured in environment variables
- Database uses SSL in production

Your application is now ready for deployment to AWS Amplify!