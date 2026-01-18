#!/bin/bash

# Railway Backend Deployment Script
# This script helps deploy the backend to Railway

set -e

echo "🚀 Railway Backend Deployment"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}Railway CLI not found. Installing...${NC}"
    npm install -g @railway/cli
fi

# Navigate to server directory
cd "$(dirname "$0")/server"

echo -e "${BLUE}Step 1: Login to Railway${NC}"
railway login

echo ""
echo -e "${BLUE}Step 2: Initialize Railway Project${NC}"
echo "If you already have a project, select it. Otherwise, create a new one."
railway init

echo ""
echo -e "${BLUE}Step 3: Link MongoDB Database${NC}"
echo "Choose one:"
echo "1. Add Railway MongoDB plugin (Recommended)"
echo "2. Use external MongoDB Atlas"
read -p "Enter choice (1 or 2): " db_choice

if [ "$db_choice" = "1" ]; then
    railway add --plugin mongodb
    echo -e "${GREEN}✓ MongoDB plugin added${NC}"
else
    read -p "Enter your MongoDB Atlas connection string: " mongodb_uri
    railway variables set MONGODB_URI="$mongodb_uri"
fi

echo ""
echo -e "${BLUE}Step 4: Configure Environment Variables${NC}"

# Set NODE_ENV
railway variables set NODE_ENV=production
echo -e "${GREEN}✓ NODE_ENV set to production${NC}"

# Set JWT_SECRET
echo ""
echo "Generated JWT Secret (save this securely):"
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
echo -e "${YELLOW}$JWT_SECRET${NC}"
railway variables set JWT_SECRET="$JWT_SECRET"
echo -e "${GREEN}✓ JWT_SECRET configured${NC}"

# Set JWT_EXPIRE
railway variables set JWT_EXPIRE=7d
echo -e "${GREEN}✓ JWT_EXPIRE set to 7d${NC}"

# Set CORS_ORIGIN
echo ""
read -p "Enter your frontend URL (e.g., https://maarifahub.netlify.app): " frontend_url
if [ -n "$frontend_url" ]; then
    railway variables set CORS_ORIGIN="$frontend_url"
    echo -e "${GREEN}✓ CORS_ORIGIN set to $frontend_url${NC}"
fi

echo ""
echo -e "${BLUE}Step 5: Deploy to Railway${NC}"
railway up

echo ""
echo -e "${GREEN}=============================="
echo "✅ Deployment Complete!"
echo "==============================${NC}"
echo ""
echo "Your API is now deployed! 🎉"
echo ""
echo "Next steps:"
echo "1. Get your API URL:"
echo -e "   ${BLUE}railway domain${NC}"
echo ""
echo "2. View logs:"
echo -e "   ${BLUE}railway logs${NC}"
echo ""
echo "3. Open Railway dashboard:"
echo -e "   ${BLUE}railway open${NC}"
echo ""
echo "4. Update your frontend API URL in src/services/api.js"
echo ""
echo -e "${YELLOW}Important: Save your JWT Secret securely!${NC}"
echo -e "JWT_SECRET: ${YELLOW}$JWT_SECRET${NC}"
