# MaarifaHub - Complete Deployment Guide

This guide provides step-by-step instructions for deploying MaarifaHub to production.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [Deployment Methods](#deployment-methods)
  - [Docker Deployment (Recommended)](#docker-deployment-recommended)
  - [Traditional VPS Deployment](#traditional-vps-deployment)
  - [Cloud Platform Deployment](#cloud-platform-deployment)
- [Post-Deployment](#post-deployment)
- [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

Before deploying, ensure you have:

- **Node.js 18+** and npm installed
- **MongoDB** database (local, MongoDB Atlas, or Docker)
- **Domain name** (optional but recommended)
- **SSL certificate** (for HTTPS - use Let's Encrypt for free)
- **Server** with at least 2GB RAM (for VPS deployment)
- **Docker & Docker Compose** (for containerized deployment)

---

## Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url> maarifahub
cd maarifahub

# Install dependencies
npm install
cd server && npm install && cd ..
```

### 2. Configure Environment Variables

```bash
# Frontend environment
cp .env.example .env
# Edit .env and set VITE_API_URL to your API URL

# Backend environment
cp server/.env.example server/.env
# Edit server/.env and configure:
# - MONGODB_URI
# - JWT_SECRET (generate a strong random key)
# - CORS_ORIGIN
```

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Build the Application

```bash
# Build frontend
npm run deploy:build

# The built files will be in the dist/ directory
```

---

## Environment Setup

### Frontend Environment Variables (.env)

```env
# API URL - Point to your backend API
VITE_API_URL=https://maarifahub.social/api

# App Configuration
VITE_APP_NAME=MaarifaHub
VITE_APP_VERSION=1.0.0
```

### Backend Environment Variables (server/.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/maarifahub?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secure_random_jwt_secret_key_here
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=https://maarifahub.social
```

---

## Deployment Methods

## Docker Deployment (Recommended)

Docker provides the easiest and most reliable deployment method.

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+

### Steps

1. **Configure Docker Environment**

```bash
cp .env.docker.example .env.docker
# Edit .env.docker with your configuration
```

2. **Update docker-compose.prod.yml**

Edit the `VITE_API_URL` to match your domain:
```yaml
environment:
  - VITE_API_URL=https://maarifahub.social/api
```

3. **Build and Run**

```bash
# For development/testing
docker-compose up -d

# For production
docker-compose -f docker-compose.prod.yml up -d
```

4. **Check Status**

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# Check specific service
docker-compose logs backend
```

5. **Access the Application**

- Frontend: http://localhost
- Backend: http://localhost:5000
- Health Check: http://localhost:5000/api/health

### Docker Management Commands

```bash
# Stop containers
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v

# Rebuild after code changes
docker-compose build
docker-compose up -d

# View container stats
docker stats
```

---

## Traditional VPS Deployment

Deploy to a Virtual Private Server (VPS) like DigitalOcean, AWS EC2, or Linode.

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Nginx
sudo apt install nginx -y

# Install MongoDB (optional if using Atlas)
# Follow: https://docs.mongodb.com/manual/installation/

# Install PM2 (Process Manager)
sudo npm install -g pm2
```

### 2. Deploy Backend

```bash
# Upload code to server
scp -r server/ user@your-server:/var/www/maarifahub/

# SSH into server
ssh user@your-server

# Navigate to backend directory
cd /var/www/maarifahub/server

# Install dependencies
npm ci --only=production

# Configure environment
cp .env.example .env
nano .env  # Edit with your settings

# Start with PM2
pm2 start server.js --name maarifahub-api
pm2 save
pm2 startup
```

### 3. Deploy Frontend

```bash
# Build locally
npm run deploy:build

# Upload to server
scp -r dist/ user@your-server:/var/www/maarifahub/frontend/

# Or build on server
cd /var/www/maarifahub
npm ci
npm run deploy:build
```

### 4. Configure Nginx

Create `/etc/nginx/sites-available/maarifahub`:

```nginx
# HTTP - Redirect to HTTPS
server {
    listen 80;
    server_name maarifahub.social www.maarifahub.social;
    return 301 https://$server_name$request_uri;
}

# HTTPS
server {
    listen 443 ssl http2;
    server_name maarifahub.social www.maarifahub.social;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/maarifahub.social/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/maarifahub.social/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Frontend
    root /var/www/maarifahub/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;

    # Client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
```

Enable and restart:

```bash
sudo ln -s /etc/nginx/sites-available/maarifahub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate
sudo certbot --nginx -d maarifahub.social -d www.maarifahub.social

# Auto-renewal is configured automatically
# Test renewal:
sudo certbot renew --dry-run
```

---

## Cloud Platform Deployment

### Vercel (Frontend Only)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel --prod
```

3. Configure environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your API URL

### Heroku (Backend)

1. Install Heroku CLI:
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

2. Create and deploy:
```bash
cd server
heroku login
heroku create maarifahub-api
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
git push heroku main
```

### Railway.app (Full Stack)

1. Push code to GitHub
2. Go to railway.app and create new project
3. Connect your GitHub repository
4. Configure environment variables
5. Deploy automatically

### DigitalOcean App Platform

1. Push code to GitHub
2. Create new app on DigitalOcean
3. Connect GitHub repository
4. Configure build and run commands
5. Set environment variables
6. Deploy

---

## Post-Deployment

### 1. Verify Deployment

```bash
# Check frontend
curl https://yourdomain.com

# Check backend health
curl https://maarifahub.social/api/health

# Expected response:
{
  "status": "ok",
  "message": "MaarifaHub API is running",
  "environment": "production",
  "timestamp": "2026-01-16T..."
}
```

### 2. Test Core Features

- User registration and login
- Create and view posts
- Freelancer listings
- Job postings
- Messaging system

### 3. Performance Optimization

```bash
# Check Nginx configuration
sudo nginx -t

# Monitor PM2 processes
pm2 monit

# View application logs
pm2 logs maarifahub-api
```

---

## Monitoring & Maintenance

### Application Monitoring

```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs maarifahub-api --lines 100

# Restart application
pm2 restart maarifahub-api

# View process info
pm2 info maarifahub-api
```

### Docker Monitoring

```bash
# Container stats
docker stats

# View logs
docker-compose logs -f --tail=100

# Restart services
docker-compose restart backend
```

### Database Backup

```bash
# MongoDB backup
mongodump --uri="mongodb://user:pass@host:27017/maarifahub" --out=/backup/

# Restore
mongorestore --uri="mongodb://user:pass@host:27017/maarifahub" /backup/maarifahub/
```

### Updates and Maintenance

```bash
# Pull latest code
git pull origin main

# Update dependencies
npm install
cd server && npm install

# Rebuild and restart
npm run deploy:build

# With Docker
docker-compose down
docker-compose build
docker-compose up -d

# With PM2
pm2 restart maarifahub-api
sudo systemctl reload nginx
```

### Security Checklist

- ✅ Strong JWT_SECRET configured
- ✅ HTTPS enabled with valid SSL certificate
- ✅ CORS properly configured
- ✅ Environment variables secured (not in git)
- ✅ MongoDB authentication enabled
- ✅ Firewall configured (UFW or cloud firewall)
- ✅ Regular backups scheduled
- ✅ Monitoring and logging in place
- ✅ Rate limiting implemented (if needed)
- ✅ Security headers configured in Nginx

### Troubleshooting

**Frontend not loading:**
- Check Nginx configuration
- Verify dist/ files are present
- Check browser console for errors
- Verify VITE_API_URL is correct

**Backend API errors:**
- Check PM2/Docker logs
- Verify MongoDB connection
- Check environment variables
- Test with: `curl localhost:5000/api/health`

**CORS errors:**
- Verify CORS_ORIGIN in backend .env
- Check Nginx proxy headers
- Ensure frontend URL matches CORS_ORIGIN

**Database connection issues:**
- Verify MONGODB_URI format
- Check MongoDB service is running
- Test connection: `mongosh <connection-string>`
- Check firewall rules

---

## Additional Resources

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Let's Encrypt](https://letsencrypt.org/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Docker Documentation](https://docs.docker.com/)

---

## Support

For issues or questions:
1. Check application logs
2. Review this documentation
3. Check the issue tracker
4. Contact support team

---

**Last Updated:** January 2026  
**Version:** 1.0.0
