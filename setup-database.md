# Setting Up Your GIFT AI PostgreSQL Database

This guide walks you through setting up your PostgreSQL database with all the tables needed for GIFT AI.

## Prerequisites
- You've created your PostgreSQL RDS database in AWS
- You have your database credentials (username, password, endpoint)
- You've set up your Lambda function and API Gateway

## Step 1: Set Your Database Connection String

First, set your database connection string as an environment variable:

```bash
export DATABASE_URL=postgresql://postgres:YourPassword@gift-ai-db.ctaas0sswh6h.us-east-1.rds.amazonaws.com:5432/postgres
```

Replace the connection string with your actual database credentials.

## Step 2: Run the Migration Script

Run the migration script to create all your tables:

```bash
./server/scripts/run-migration.sh
```

This script will:
1. Check that your DATABASE_URL is set
2. Generate SQL migration files based on your schema
3. Apply those migrations to your database

## Step 3: Verify Your Database Setup

After running the migration, connect to your database to verify all tables were created:

```bash
psql $DATABASE_URL -c "\dt"
```

You should see all your tables listed:
- users
- recipients
- preferences
- products
- recommendations
- occasions
- notification_logs
- product_tags
- purchase_history
- user_similarity
- sessions (for authentication)

## Running Migrations After Schema Changes

Whenever you update your schema in `shared/schema.ts`, simply rerun the migration script:

```bash
./server/scripts/run-migration.sh
```

The script is smart enough to only apply necessary changes to your database structure.

## AWS Amplify Deployment

For Amplify deployment, add these build commands to your amplify.yml:

```yaml
backend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
        - npm run db:push  # This runs the database migration
```

Make sure your DATABASE_URL environment variable is set in your Amplify environment.