#!/bin/bash

# Pre-Deployment Verification Script
# Run this before deploying to production

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}MaarifaHub Deployment Checklist${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

check_pass() {
    echo -e "${GREEN}✓ $1${NC}"
}

check_fail() {
    echo -e "${RED}✗ $1${NC}"
    ((ERRORS++))
}

check_warn() {
    echo -e "${YELLOW}⚠ $1${NC}"
    ((WARNINGS++))
}

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 18 ]; then
    check_pass "Node.js version: $(node -v)"
else
    check_fail "Node.js version must be 18 or higher. Current: $(node -v)"
fi

# Check npm
echo ""
echo "Checking npm..."
if command -v npm &> /dev/null; then
    check_pass "npm is installed: $(npm -v)"
else
    check_fail "npm is not installed"
fi

# Check frontend .env
echo ""
echo "Checking frontend environment..."
if [ -f ".env" ]; then
    check_pass "Frontend .env file exists"
    
    if grep -q "VITE_API_URL=http://localhost" .env; then
        check_warn "VITE_API_URL still points to localhost. Update for production!"
    else
        check_pass "VITE_API_URL is configured"
    fi
else
    check_fail "Frontend .env file missing. Copy from .env.example"
fi

# Check backend .env
echo ""
echo "Checking backend environment..."
if [ -f "server/.env" ]; then
    check_pass "Backend .env file exists"
    
    if grep -q "your_jwt_secret_key_change_this_in_production" server/.env; then
        check_fail "JWT_SECRET is still default! Generate a secure key!"
    else
        check_pass "JWT_SECRET is configured"
    fi
    
    if grep -q "NODE_ENV=production" server/.env; then
        check_pass "NODE_ENV set to production"
    else
        check_warn "NODE_ENV not set to production"
    fi
    
    if grep -q "mongodb://localhost" server/.env; then
        check_warn "MongoDB URI points to localhost. Update for production if needed."
    fi
else
    check_fail "Backend .env file missing. Copy from server/.env.example"
fi

# Check dependencies
echo ""
echo "Checking dependencies..."
if [ -d "node_modules" ]; then
    check_pass "Frontend dependencies installed"
else
    check_warn "Frontend dependencies not installed. Run: npm install"
fi

if [ -d "server/node_modules" ]; then
    check_pass "Backend dependencies installed"
else
    check_warn "Backend dependencies not installed. Run: cd server && npm install"
fi

# Check for sensitive files in git
echo ""
echo "Checking git configuration..."
if [ -d ".git" ]; then
    if git check-ignore .env > /dev/null 2>&1; then
        check_pass ".env is in .gitignore"
    else
        check_fail ".env is NOT in .gitignore! Add it now!"
    fi
    
    if git check-ignore server/.env > /dev/null 2>&1; then
        check_pass "server/.env is in .gitignore"
    else
        check_fail "server/.env is NOT in .gitignore! Add it now!"
    fi
else
    check_warn "Not a git repository"
fi

# Check Docker (if using Docker deployment)
echo ""
echo "Checking Docker setup (optional)..."
if command -v docker &> /dev/null; then
    check_pass "Docker is installed: $(docker --version | cut -d' ' -f3 | cut -d',' -f1)"
    
    if command -v docker-compose &> /dev/null; then
        check_pass "Docker Compose is installed"
    else
        check_warn "Docker Compose not found (needed for Docker deployment)"
    fi
    
    if [ -f ".env.docker" ]; then
        check_pass "Docker environment file exists"
    else
        check_warn "Docker .env.docker missing (only needed for Docker deployment)"
    fi
else
    check_warn "Docker not installed (only needed for Docker deployment)"
fi

# Test build
echo ""
echo "Testing production build..."
if npm run deploy:build > /tmp/build.log 2>&1; then
    check_pass "Production build successful"
    
    if [ -d "dist" ]; then
        SIZE=$(du -sh dist | cut -f1)
        check_pass "Build output created: $SIZE"
    fi
else
    check_fail "Production build failed. Check /tmp/build.log"
fi

# Summary
echo ""
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}Summary${NC}"
echo -e "${BLUE}================================${NC}"

if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}$ERRORS error(s) found${NC}"
    echo -e "${RED}Please fix errors before deploying!${NC}"
fi

if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}$WARNINGS warning(s) found${NC}"
    echo -e "${YELLOW}Review warnings before deploying${NC}"
fi

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}All checks passed!${NC}"
    echo -e "${GREEN}You're ready to deploy! 🚀${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}No critical errors found${NC}"
    echo -e "${YELLOW}Review warnings before proceeding${NC}"
    exit 0
else
    exit 1
fi
