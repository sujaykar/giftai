#!/bin/bash

# Exit on error
set -e

echo "Building GIFT AI Platform for deployment..."

# Install dependencies
echo "Installing dependencies..."
npm ci

# Build client
echo "Building client..."
npm run build

# Create server dist directory
echo "Creating server dist directory..."
mkdir -p server/dist

# Build server
echo "Building server..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=server/dist

echo "Build completed successfully!"
echo "Frontend: client/dist"
echo "Backend: server/dist"