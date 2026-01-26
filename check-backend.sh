#!/bin/bash

# Backend Health Check Script
# Verifies that the backend is properly configured

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔍 MaarifaHub Backend Health Check"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "server/server.js" ]; then
    echo -e "${RED}✗ Error: Run this script from the project root${NC}"
    exit 1
fi

echo "1. Checking backend files..."
if [ -f "server/server.js" ] && [ -f "server/package.json" ]; then
    echo -e "${GREEN}✓ Backend files present${NC}"
else
    echo -e "${RED}✗ Missing backend files${NC}"
    exit 1
fi

echo ""
echo "2. Checking dependencies..."
cd server
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓ Dependencies installed${NC}"
    
    # Check key dependencies (PostgreSQL + Sequelize)
    if npm list express jsonwebtoken bcryptjs cors dotenv express-validator sequelize pg pg-hstore &>/dev/null; then
        echo -e "${GREEN}✓ All required packages present${NC}"
    else
        echo -e "${YELLOW}⚠ Some packages may be missing. Run: cd server && npm install${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Dependencies not installed. Run: cd server && npm install${NC}"
fi

echo ""
echo "3. Checking configuration..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✓ Environment file exists${NC}"
    
    # Check for critical variables (PostgreSQL)
    if grep -q "^DATABASE_URL=" .env && grep -q "^JWT_SECRET=" .env; then
        echo -e "${GREEN}✓ Critical environment variables present${NC}"
    else
        echo -e "${RED}✗ Missing critical environment variables (expected DATABASE_URL and JWT_SECRET)${NC}"
    fi
    
    # Warn about default JWT secret
    if grep -q "your_jwt_secret_key_change_this_in_production" .env; then
        echo -e "${YELLOW}⚠ WARNING: Using default JWT_SECRET - change this for production!${NC}"
    fi
else
    echo -e "${RED}✗ No .env file found. Copy from .env.example${NC}"
fi

echo ""
echo "4. Checking routes..."
ROUTES=("auth.js" "posts.js" "users.js" "freelancers.js" "jobs.js" "messages.js" "categories.js")
MISSING_ROUTES=0

for route in "${ROUTES[@]}"; do
    if [ ! -f "routes/$route" ]; then
        echo -e "${RED}✗ Missing route: routes/$route${NC}"
        ((MISSING_ROUTES++))
    fi
done

if [ $MISSING_ROUTES -eq 0 ]; then
    echo -e "${GREEN}✓ All routes present (${#ROUTES[@]} routes)${NC}"
else
    echo -e "${RED}✗ Missing $MISSING_ROUTES route(s)${NC}"
fi

echo ""
echo "5. Checking models..."
MODELS=("User.js" "Post.js" "Freelancer.js" "Job.js" "Message.js")
MISSING_MODELS=0

for model in "${MODELS[@]}"; do
    if [ ! -f "models/$model" ]; then
        echo -e "${YELLOW}⚠ Missing model: models/$model${NC}"
        ((MISSING_MODELS++))
    fi
done

if [ $MISSING_MODELS -eq 0 ]; then
    echo -e "${GREEN}✓ All models present (${#MODELS[@]} models)${NC}"
else
    echo -e "${YELLOW}⚠ Some models may be missing${NC}"
fi

echo ""
echo "6. Checking server code..."
if node --check server.js 2>/dev/null; then
    echo -e "${GREEN}✓ Server code syntax is valid${NC}"
else
    echo -e "${RED}✗ Syntax errors in server code${NC}"
    exit 1
fi

cd ..

echo ""
echo "=================================="
echo "📊 Summary"
echo "=================================="
echo ""
echo -e "${GREEN}✓ Backend structure is good!${NC}"
echo ""
echo "To start the backend:"
echo "  Development: cd server && npm run dev"
echo "  Production:  cd server && npm run start:prod"
echo ""
echo "Prerequisites:"
echo "  • PostgreSQL must be running and accessible"
echo "  • .env file must be configured"
echo "  • Dependencies installed (npm install)"
echo ""
echo "Test the backend:"
echo "  curl http://localhost:5000/api/health"
