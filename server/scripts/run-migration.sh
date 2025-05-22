#!/bin/bash

# Script to run database migrations for GIFT AI

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}===== GIFT AI Database Migration =====${NC}"
echo "This script will create and update your PostgreSQL database tables."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo -e "${RED}Error: DATABASE_URL environment variable is not set${NC}"
  echo "Please set your database connection string:"
  echo "export DATABASE_URL=postgresql://username:password@hostname:5432/database_name"
  exit 1
fi

# Create migrations directory if it doesn't exist
if [ ! -d "./drizzle" ]; then
  echo -e "${YELLOW}Creating migrations directory...${NC}"
  mkdir -p ./drizzle
fi

# Generate migration files
echo -e "${YELLOW}Generating migration files from schema...${NC}"
npx drizzle-kit generate:pg --schema=./shared/schema.ts --out=./drizzle

# Run the migration
echo -e "${YELLOW}Applying migrations to database...${NC}"
npm run db:push

echo -e "${GREEN}Migration completed!${NC}"
echo "Your database is now set up with all the required tables."