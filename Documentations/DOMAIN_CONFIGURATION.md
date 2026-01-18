# Domain Configuration: maarifahub.social

This document summarizes all the changes made to configure the MaarifaHub application for deployment with the domain `https://maarifahub.social/`.

## Overview

The application has been fully configured for production deployment at:
- **Frontend**: https://maarifahub.social
- **API**: https://maarifahub.social/api
- **Backend (internal)**: http://localhost:5000 (within Docker network)

## Files Updated

### 1. **Configuration Files** (.env files)

#### `.env` (Frontend)
```
VITE_API_URL=https://maarifahub.social/api
```
- Location: Root directory
- Purpose: Points the frontend application to the production API endpoint

#### `.env.example` (Frontend Template)
```
VITE_API_URL=https://maarifahub.social/api
```
- Location: Root directory
- Purpose: Example template for frontend configuration

#### `.env.docker.example` (Docker Environment Template)
```
CORS_ORIGIN=https://maarifahub.social
VITE_API_URL=https://maarifahub.social/api
```
- Purpose: Example for Docker environment variables

#### `server/.env.example` (Backend Template)
```
# CORS_ORIGIN=https://maarifahub.social
```
- Purpose: Example showing how to configure CORS for the backend

### 2. **Docker Compose Files**

#### `docker-compose.yml` (Development)
```yaml
environment:
  - CORS_ORIGIN=https://maarifahub.social
  - VITE_API_URL=https://maarifahub.social/api
```
- Updated CORS_ORIGIN from `*` to `https://maarifahub.social`
- Updated frontend API URL

#### `docker-compose.prod.yml` (Production)
```yaml
args:
  - VITE_API_URL=https://maarifahub.social/api
```
- Updated frontend build argument with production API URL

### 3. **Web Server Configuration**

#### `nginx.conf`
```nginx
server {
    listen 80;
    server_name maarifahub.social www.maarifahub.social;
    ...
}
```
- Updated `server_name` to accept both `maarifahub.social` and `www.maarifahub.social`
- Maintains HTTP on port 80 for Let's Encrypt HTTP-01 validation

### 4. **Documentation Files**

#### `DEPLOYMENT_GUIDE.md`
- Updated all example configuration values from `yourdomain.com` to `maarifahub.social`
- Updated VITE_API_URL examples: `https://maarifahub.social/api`
- Updated CORS_ORIGIN examples: `https://maarifahub.social`
- Updated nginx configuration with correct domain
- Updated SSL certificate paths: `/etc/letsencrypt/live/maarifahub.social/`
- Updated certbot command example
- Updated health check curl examples

#### `PRODUCTION_READY.md`
- Updated VITE_API_URL: `https://maarifahub.social/api`
- Updated CORS_ORIGIN: `https://maarifahub.social`

#### `DEPLOY_QUICK_REF.md`
- Updated VITE_API_URL: `https://maarifahub.social/api`
- Updated CORS_ORIGIN: `https://maarifahub.social`

#### `deploy.sh`
- Updated output message to show: `https://maarifahub.social`

## Deployment Checklist

Before deploying to production with the new domain, ensure:

- [ ] SSL/TLS certificates installed (via Let's Encrypt)
  ```bash
  sudo certbot --nginx -d maarifahub.social -d www.maarifahub.social
  ```

- [ ] DNS records point to your server
  - `maarifahub.social` → Your server IP
  - `www.maarifahub.social` → Your server IP

- [ ] Backend API environment variables set:
  ```bash
  CORS_ORIGIN=https://maarifahub.social
  JWT_SECRET=<generated-secret>
  MONGODB_URI=<your-database-uri>
  ```

- [ ] Frontend environment variables set:
  ```bash
  VITE_API_URL=https://maarifahub.social/api
  ```

- [ ] Test health endpoint:
  ```bash
  curl https://maarifahub.social/api/health
  ```

- [ ] Test frontend:
  ```bash
  curl https://maarifahub.social
  ```

## Key Features

✅ **HTTPS Support**: All traffic uses secure HTTPS protocol
✅ **CORS Security**: API only accepts requests from `https://maarifahub.social`
✅ **Domain Configuration**: Both `maarifahub.social` and `www.maarifahub.social` supported
✅ **Production Ready**: All endpoints configured for production deployment
✅ **Docker Support**: Both development and production Docker setups updated

## API Endpoints

All API endpoints are now accessible at:
- `https://maarifahub.social/api/health` - Health check
- `https://maarifahub.social/api/auth/*` - Authentication routes
- `https://maarifahub.social/api/posts/*` - Posts routes
- `https://maarifahub.social/api/users/*` - Users routes
- `https://maarifahub.social/api/freelancers/*` - Freelancers routes
- `https://maarifahub.social/api/jobs/*` - Jobs routes
- `https://maarifahub.social/api/messages/*` - Messages routes
- `https://maarifahub.social/api/categories/*` - Categories routes

## Development vs Production

### Development (docker-compose.yml)
- Frontend: `http://localhost`
- Backend: `http://localhost:5000`
- API: `http://localhost:5000/api`

### Production (docker-compose.prod.yml)
- Frontend: `https://maarifahub.social`
- Backend: `https://maarifahub.social/api`
- Internal API: `http://localhost:5000`

## Security Considerations

1. **CORS is restricted** to `https://maarifahub.social` in production
2. **HTTPS only** for production deployments
3. **SSL certificates** from Let's Encrypt (free)
4. **Security headers** configured in nginx
5. **JWT authentication** enabled for API endpoints

## Notes

- The domain `maarifahub.social` is used throughout all configurations
- All old references to `yourdomain.com`, `api.yourdomain.com`, or `localhost` have been replaced
- Development continues to use localhost for local testing
- Production deployment should use the domain configuration as outlined

---

**Last Updated**: January 18, 2026
**Domain**: https://maarifahub.social
