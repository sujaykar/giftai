# GIFT AI Platform

A personalized gift recommendation platform that leverages intelligent matching and AI-powered algorithms to help users discover thoughtful gifts tailored to their unique preferences.

## Features

- Preference quiz for recipient information
- Intelligent recommendation filtering
- Budget tracking
- Personalized gift suggestions
- Product scraping from Amazon, Etsy, and eBay
- Admin dashboard for product management
- Auto-tagging using AI

## Tech Stack

- React frontend with TypeScript
- Express.js backend
- PostgreSQL database with Drizzle ORM
- AI recommendation engine using OpenAI GPT-4o
- Advanced analytics dashboard
- Authentication system
- Product scraping system

## Project Structure

```
.
├── admin/                   # Admin dashboard
├── client/                  # Frontend React application
├── server/                  # Backend Express server
│   ├── controllers/         # API route controllers
│   ├── middleware/          # Express middleware
│   ├── scripts/             # Utility scripts
│   ├── services/            # Business logic services
│   └── utils/               # Utility functions
└── shared/                  # Shared types and utilities
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```
   DATABASE_URL=your_database_connection_string
   OPENAI_API_KEY=your_openai_api_key
   SESSION_SECRET=your_session_secret
   ```
4. Run the development server:
   ```
   npm run dev
   ```

## Deployment to AWS Amplify

### Prerequisites
- AWS account
- AWS CLI installed and configured
- AWS Amplify CLI installed

### Step 1: Initialize Amplify
```bash
amplify init
```

Follow the prompts to configure your Amplify project.

### Step 2: Add Hosting
```bash
amplify add hosting
```

Select "Amazon CloudFront and S3" for the frontend, and "AWS Elastic Beanstalk" for the backend.

### Step 3: Configure the Environment Variables
In the AWS Amplify Console, navigate to your app, go to "Environment Variables" and add:
- `DATABASE_URL`
- `OPENAI_API_KEY`
- `SESSION_SECRET`
- Any other required environment variables

### Step 4: Configure Build Settings
Ensure that the `amplify.yml` file is properly configured:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: client/dist
    files:
      - '**/*'
backend:
  phases:
    build:
      commands:
        - npm ci
        - npm run build
  artifacts:
    baseDirectory: server/dist
    files:
      - '**/*'
```

### Step 5: Deploy
```bash
amplify publish
```

This will deploy your frontend and backend to AWS.

## Database Setup

To set up the PostgreSQL database:

1. Create a PostgreSQL database
2. Update the `DATABASE_URL` environment variable
3. Run the database migrations:
   ```
   npm run db:push
   ```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in an existing user
- `GET /api/auth/logout` - Log out the current user
- `GET /api/auth/current-user` - Get the current user's information

### Recipient Endpoints

- `GET /api/recipients` - Get all recipients for the current user
- `GET /api/recipients/:id` - Get a specific recipient
- `POST /api/recipients` - Create a new recipient
- `PUT /api/recipients/:id` - Update a recipient
- `DELETE /api/recipients/:id` - Delete a recipient

### Recommendation Endpoints

- `POST /api/hybrid-recommendations` - Get hybrid recommendations
- `POST /api/ai-recommendations` - Get AI-powered recommendations
- `POST /api/content-recommendations` - Get content-based recommendations

### Product Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a specific product

### Product Scraper Endpoints

- `GET /api/admin/scraper/run` - Run a full product scraping cycle (admin only)
- `GET /api/admin/scraper/amazon` - Scrape products from Amazon (admin only)
- `GET /api/admin/scraper/etsy` - Scrape products from Etsy (admin only)
- `GET /api/admin/scraper/ebay` - Scrape products from eBay (admin only)
- `GET /api/jobs/scraper/run` - Run a full scraping cycle (requires API key)

## License

MIT