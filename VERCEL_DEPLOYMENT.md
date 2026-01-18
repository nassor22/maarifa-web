# Vercel Deployment Guide for MaarifaHub

This guide covers deploying MaarifaHub to Vercel with flexible backend configuration options.

## Table of Contents

1. [Frontend-Only Deployment](#frontend-only-deployment)
2. [Full Stack Deployment (API on External Server)](#full-stack-deployment)
3. [Serverless Backend Option](#serverless-backend-option)
4. [Environment Variables](#environment-variables)
5. [Custom Domain Setup](#custom-domain-setup)
6. [Troubleshooting](#troubleshooting)

---

## Frontend-Only Deployment

### Option 1: Deploy Frontend to Vercel (Recommended for Most Users)

This is the simplest approach. Deploy the frontend to Vercel and keep the backend on a traditional server or another platform.

#### Prerequisites

- [Vercel Account](https://vercel.com/signup)
- GitHub account with repository connected to Vercel
- Node.js 18+ installed locally

#### Steps

1. **Connect Repository to Vercel**
   ```bash
   # Push your code to GitHub
   git push origin main
   ```

   Visit [Vercel Dashboard](https://vercel.com/dashboard) and click "New Project"
   - Select your GitHub repository
   - Vercel will auto-detect it's a Vite project

2. **Configure Build Settings**

   Vercel should auto-detect:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

   If not, set them manually in project settings.

3. **Set Environment Variables**

   In Vercel Dashboard → Project Settings → Environment Variables, add:

   ```
   VITE_API_URL=https://your-api-domain.com/api
   ```

   **Important**: Replace `your-api-domain.com` with:
   - Your production API URL if backend is on a separate server
   - Or the Vercel URL if using serverless backend

4. **Deploy**

   Vercel automatically deploys when you push to main:
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push origin main
   ```

   Your app will be available at: `https://your-project.vercel.app`

#### Example Environment Configuration for Different Backends

**If backend is on Railway:**
```
VITE_API_URL=https://your-railway-backend.up.railway.app/api
```

**If backend is on Render:**
```
VITE_API_URL=https://your-render-backend.onrender.com/api
```

**If backend is on custom domain:**
```
VITE_API_URL=https://api.maarifahub.social/api
```

---

## Full Stack Deployment

### Deploy Frontend to Vercel + Backend to Separate Service

#### Backend Options

Choose one of these for backend hosting:

| Service | Cost | Best For | Setup |
|---------|------|----------|-------|
| **Railway** | $5-50/month | General purpose | Deploy from GitHub |
| **Render** | Free-$25/month | General purpose | Deploy from GitHub |
| **Heroku** | Paid (eco dynos) | Node.js apps | Push via Git |
| **DigitalOcean** | $6+/month | Full control | Docker container |
| **AWS EC2** | Variable | Enterprise | Docker/traditional |
| **Custom VPS** | $5+/month | Full control | Docker/traditional |

#### Step 1: Deploy Backend to Railway (Example)

1. **Create Railway Account** at [railway.app](https://railway.app)

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository

3. **Configure Environment Variables**

   In Railway project settings, add:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/maarifahub
   JWT_SECRET=your-secret-key
   JWT_EXPIRE=7d
   CORS_ORIGIN=https://your-project.vercel.app
   ```

   **Important**: Set `CORS_ORIGIN` to your Vercel frontend URL

4. **Set Root Directory** (if needed)
   - In Railway: Set root directory to `server`

5. **Deploy**
   - Railway will automatically detect Node.js and deploy

6. **Get Backend URL**
   - Your backend URL will be shown in Railway dashboard
   - Example: `https://your-railway-app.up.railway.app`

#### Step 2: Deploy Frontend to Vercel

1. **Set Frontend Environment Variable**

   In Vercel project settings, add:
   ```
   VITE_API_URL=https://your-railway-app.up.railway.app/api
   ```

2. **Trigger Deployment**
   ```bash
   git add .
   git commit -m "Update API URL for Vercel deployment"
   git push origin main
   ```

#### Step 3: Connect Custom Domain

See [Custom Domain Setup](#custom-domain-setup) section below.

---

## Serverless Backend Option

### Deploy Both Frontend and Backend to Vercel

Vercel supports serverless functions for Node.js. This allows you to host both frontend and backend in one Vercel project.

#### Setup Serverless Functions

1. **Create API Routes Directory**

   ```bash
   mkdir -p api
   ```

2. **Create Serverless Endpoint**

   Create `api/health.js`:
   ```javascript
   export default function handler(req, res) {
     res.status(200).json({ 
       status: 'ok', 
       message: 'MaarifaHub API is running'
     });
   }
   ```

3. **For Express Backend, Create `api/index.js`:**

   ```javascript
   import express from 'express';
   import cors from 'cors';
   import connectDB from '../server/config/database.js';
   import authRoutes from '../server/routes/auth.js';
   
   const app = express();
   
   // Middleware
   app.use(cors());
   app.use(express.json());
   
   // Connect to MongoDB
   connectDB();
   
   // Routes
   app.use('/api/auth', authRoutes);
   // ... add other routes
   
   export default app;
   ```

4. **Update vercel.json:**

   ```json
   {
     "projectName": "maarifahub",
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "env": {
       "VITE_API_URL": "@vite_api_url"
     },
     "functions": {
       "api/**/*.js": {
         "memory": 1024,
         "maxDuration": 60
       }
     }
   }
   ```

5. **Update Frontend API URL**

   In `.env` for Vercel:
   ```
   VITE_API_URL=/api
   ```

**Limitations:**
- Serverless functions have execution time limits (60 seconds)
- Cold starts can cause delays
- MongoDB connections in serverless are more complex
- Better for simple APIs, not heavy processing

---

## Environment Variables

### Frontend Variables (.env)

```env
# API Endpoint
VITE_API_URL=https://your-api-domain.com/api

# App Info
VITE_APP_NAME=MaarifaHub
VITE_APP_VERSION=1.0.0

# Optional: Analytics
# VITE_GOOGLE_ANALYTICS_ID=
# VITE_SENTRY_DSN=
```

### Backend Variables (in separate service)

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/maarifahub
JWT_SECRET=your-generated-secret-key
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-project.vercel.app
```

### Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## Custom Domain Setup

### Connect maarifahub.social to Vercel

1. **In Vercel Dashboard:**
   - Go to Project Settings → Domains
   - Click "Add Domain"
   - Enter: `maarifahub.social`

2. **Update DNS Records:**

   Point to Vercel's nameservers or CNAME:

   **Option A: Using Vercel Nameservers (Recommended)**
   - Change your domain registrar's nameservers to Vercel's:
     - `ns1.vercel-dns.com`
     - `ns2.vercel-dns.com`

   **Option B: Using CNAME Record**
   - Add CNAME record: `cname.vercel-dns.com`

3. **Add WWW Subdomain**
   - Also add: `www.maarifahub.social`
   - Vercel will auto-redirect www to non-www

4. **SSL Certificate**
   - Vercel automatically provisions Let's Encrypt certificate
   - Free and auto-renewing
   - HTTPS is enabled by default

### Connect Backend Domain

If backend is on custom domain (e.g., `api.maarifahub.social`):

1. **Deploy backend to your server/platform**
2. **Point domain to backend service**
3. **Update frontend VITE_API_URL:**
   ```
   VITE_API_URL=https://api.maarifahub.social/api
   ```

---

## Project Structure for Vercel

```
maarifaHub/
├── src/                      # Frontend React components
├── public/                   # Static assets
├── dist/                     # Build output (auto-generated)
├── api/                      # Serverless functions (optional)
├── server/                   # Backend Express app (for reference)
├── package.json              # Frontend dependencies
├── vite.config.js           # Vite configuration
├── vercel.json              # Vercel configuration
├── .vercelignore            # Files to exclude from Vercel
├── .env.example             # Environment template
└── VERCEL_DEPLOYMENT.md     # This file
```

---

## Deployment Workflow

### Local Development

```bash
# Install dependencies
npm install
npm install --prefix server

# Environment variables
cp .env.example .env
# Edit .env with local API URL

# Start development servers
npm run dev           # Frontend (port 5173)
npm run dev --prefix server   # Backend (port 5000)
```

### Staging/Testing (Vercel Preview)

Every push to a non-main branch creates a preview deployment:

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and push
git push origin feature/my-feature

# Vercel automatically creates preview URL
# Share: https://your-project-feature.vercel.app
```

### Production Deployment

```bash
# Merge to main (or your production branch)
git checkout main
git merge feature/my-feature
git push origin main

# Vercel automatically deploys to production
# Available at: https://maarifahub.social
```

---

## Monitoring and Logs

### Check Deployment Status

1. **Vercel Dashboard**
   - View real-time build logs
   - Check function execution logs
   - Monitor analytics

2. **View Logs Locally**
   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # View logs
   vercel logs

   # View function logs
   vercel logs --follow
   ```

### Monitor Performance

- Vercel Dashboard → Analytics
- Check Web Vitals
- Monitor API response times
- Review error logs

---

## Troubleshooting

### Build Fails with "Cannot find module"

**Problem**: Build fails during `npm run build`

**Solution**:
```bash
# Ensure package.json dependencies are correct
npm install

# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### CORS Errors in Frontend

**Problem**: API requests blocked due to CORS

**Solution**:
1. Check backend CORS configuration
2. Ensure `CORS_ORIGIN` environment variable matches frontend URL
3. For Vercel frontend: Set `CORS_ORIGIN=https://your-project.vercel.app`

### API URL Not Working

**Problem**: Frontend can't reach API

**Solution**:
1. Verify `VITE_API_URL` is set correctly in Vercel environment
2. Test API manually: `curl https://your-api-url/api/health`
3. Check backend is running and accessible
4. Verify firewall allows requests

### Cold Starts (Serverless Only)

**Problem**: First request to API is slow

**Solution**:
- Use external service for backend (Railway, Render, etc.)
- Or implement background workers to keep functions warm
- Consider keeping-alive requests from frontend

### Database Connection Issues

**Problem**: MongoDB connection fails in serverless

**Solution**:
1. Use MongoDB Atlas with IP whitelist: `0.0.0.0/0`
2. Increase connection timeout:
   ```javascript
   mongoose.connect(process.env.MONGODB_URI, {
     serverSelectionTimeoutMS: 5000,
     socketTimeoutMS: 45000,
   })
   ```
3. Consider using separate backend service instead

### Environment Variables Not Applied

**Problem**: VITE_API_URL still shows localhost

**Solution**:
1. Rebuild after updating environment variables
2. Go to Vercel Dashboard → Deployments
3. Click "Redeploy" on the latest deployment
4. Or push a new commit to trigger fresh build

---

## Recommended Setup

For optimal performance and reliability:

**Frontend**: Vercel
- Built for static/React apps
- Fast CDN
- Zero-configuration
- Preview deployments
- Free tier available

**Backend**: Railway or Render
- Always running
- Better for persistent connections
- Better for MongoDB connections
- Affordable ($5-15/month)
- Easy scaling

**Database**: MongoDB Atlas
- Free tier (512MB)
- Automatic backups
- Geographically distributed
- No server management

**Domain**: Your registrar + Vercel DNS
- Use Vercel's free DNS management
- HTTPS automatic
- Auto-renewing certificates

---

## Cost Breakdown

| Service | Cost | Notes |
|---------|------|-------|
| Vercel Frontend | Free-$20/month | Generous free tier |
| Railway Backend | $5-50/month | Depends on usage |
| MongoDB Atlas | Free-$99+/month | Free tier sufficient for MVP |
| Custom Domain | $10-15/year | Your registrar |
| **Total** | **$5+/month** | Can be free with tier limits |

---

## Next Steps

1. Choose deployment option:
   - [ ] Frontend on Vercel + Backend on Railway (Recommended)
   - [ ] Full Vercel (serverless backend)
   - [ ] Frontend on Vercel + Backend on custom domain

2. Set up services:
   - [ ] Vercel project created
   - [ ] Backend service configured
   - [ ] MongoDB Atlas cluster set up
   - [ ] Environment variables configured

3. Deploy:
   - [ ] Push code to GitHub
   - [ ] Verify builds complete
   - [ ] Test API endpoints
   - [ ] Connect custom domain

4. Monitor:
   - [ ] Check Vercel dashboard
   - [ ] Monitor backend service
   - [ ] Review error logs
   - [ ] Test user flows

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Railway Documentation](https://docs.railway.app/)
- [MongoDB Atlas Documentation](https://docs.mongodb.com/atlas/)

---

**Last Updated**: January 18, 2026
**Status**: Ready for Vercel Deployment
