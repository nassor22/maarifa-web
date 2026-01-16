#!/bin/bash

# MaarifaHub Deployment Script
# This script helps automate the deployment process

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}MaarifaHub Deployment Script${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if .env files exist
check_env_files() {
    echo "Checking environment files..."
    
    if [ ! -f ".env" ]; then
        print_warning "Frontend .env file not found"
        echo "Creating from .env.example..."
        cp .env.example .env
        print_warning "Please edit .env file with your configuration"
        exit 1
    else
        print_success "Frontend .env file found"
    fi
    
    if [ ! -f "server/.env" ]; then
        print_warning "Backend .env file not found"
        echo "Creating from server/.env.example..."
        cp server/.env.example server/.env
        print_warning "Please edit server/.env file with your configuration"
        exit 1
    else
        print_success "Backend .env file found"
    fi
}

# Build frontend
build_frontend() {
    echo ""
    echo "Building frontend..."
    npm install
    npm run deploy:build
    print_success "Frontend built successfully"
}

# Setup backend
setup_backend() {
    echo ""
    echo "Setting up backend..."
    cd server
    npm install --production
    cd ..
    print_success "Backend dependencies installed"
}

# Deploy with Docker
deploy_docker() {
    echo ""
    echo "Deploying with Docker..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    
    # Check for Docker environment file
    if [ ! -f ".env.docker" ]; then
        print_warning "Docker environment file not found"
        echo "Creating from .env.docker.example..."
        cp .env.docker.example .env.docker
        print_warning "Please edit .env.docker file with your configuration"
        exit 1
    fi
    
    echo "Starting containers..."
    docker-compose -f docker-compose.prod.yml up -d --build
    
    print_success "Docker containers started"
    echo ""
    echo "Waiting for services to be ready..."
    sleep 5
    
    # Check health
    if curl -s http://localhost:5000/api/health > /dev/null; then
        print_success "Backend API is running"
    else
        print_error "Backend API is not responding"
    fi
    
    if curl -s http://localhost > /dev/null; then
        print_success "Frontend is running"
    else
        print_error "Frontend is not responding"
    fi
}

# Deploy with PM2
deploy_pm2() {
    echo ""
    echo "Deploying with PM2..."
    
    if ! command -v pm2 &> /dev/null; then
        print_error "PM2 is not installed"
        echo "Install with: npm install -g pm2"
        exit 1
    fi
    
    # Build frontend
    build_frontend
    
    # Setup backend
    setup_backend
    
    # Start backend with PM2
    cd server
    pm2 delete maarifahub-api 2>/dev/null || true
    pm2 start server.js --name maarifahub-api
    pm2 save
    cd ..
    
    print_success "Backend started with PM2"
    
    echo ""
    print_warning "Don't forget to:"
    echo "  1. Configure Nginx to serve the frontend from ./dist"
    echo "  2. Setup SSL certificate"
    echo "  3. Configure firewall"
}

# Main menu
echo "Select deployment method:"
echo "1) Docker (Recommended)"
echo "2) PM2 + Nginx (VPS)"
echo "3) Build only"
echo "4) Check environment"
read -p "Enter choice [1-4]: " choice

case $choice in
    1)
        check_env_files
        deploy_docker
        ;;
    2)
        check_env_files
        deploy_pm2
        ;;
    3)
        build_frontend
        setup_backend
        print_success "Build complete. Files are in ./dist"
        ;;
    4)
        check_env_files
        print_success "Environment files are configured"
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}Deployment Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Next steps:"
echo "  - Frontend: http://localhost or https://yourdomain.com"
echo "  - Backend API: http://localhost:5000/api"
echo "  - Health check: http://localhost:5000/api/health"
echo ""
echo "For monitoring:"
echo "  Docker: docker-compose logs -f"
echo "  PM2: pm2 logs maarifahub-api"
