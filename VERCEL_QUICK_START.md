# Vercel Deployment Quick Start

Deploy MaarifaHub to Vercel in 5 minutes!

## Prerequisites

- GitHub account
- Vercel account (free signup at [vercel.com](https://vercel.com))
- MongoDB Atlas account (free tier)

## Step 1: Prepare Your Repository

```bash
# Ensure your code is pushed to GitHub
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 2: Create Vercel Project

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. Select your GitHub repository
4. Click **"Import"**

## Step 3: Configure Build Settings

Vercel will auto-detect:
- ✅ Framework: **Vite**
- ✅ Build Command: **npm run build**
- ✅ Output Directory: **dist**

If not auto-detected, set them in "Project Settings".

## Step 4: Set Environment Variables

In Vercel Dashboard → **Project Settings** → **Environment Variables**:

### Option A: Backend on Railway (Recommended)

```
Name: VITE_API_URL
Value: https://your-railway-app.up.railway.app/api
```

### Option B: Backend on Custom Server

```
Name: VITE_API_URL
Value: https://api.maarifahub.social/api
```

### Option C: Serverless Backend

```
Name: VITE_API_URL
Value: /api
```

## Step 5: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (usually 2-3 minutes)
3. Get your URL: `https://your-project.vercel.app`

🎉 **Frontend is now live!**

---

## Backend Deployment (Choose One)

### Option A: Railway (Easiest)

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Set root directory: `server`
5. Add environment variables:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/maarifahub
   JWT_SECRET=<generate with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))" >
   JWT_EXPIRE=7d
   CORS_ORIGIN=https://your-project.vercel.app
   ```
6. Deploy!
7. Copy Railway URL and update Vercel `VITE_API_URL`

### Option B: Render

1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Set build command: `npm install --prefix server && npm run build --prefix server`
5. Set start command: `npm run start:prod --prefix server`
6. Add environment variables (same as Railway above)
7. Deploy!

### Option C: Keep Existing Server

If you have an existing server running the API:

1. Make sure backend is accessible at: `https://your-api-domain.com/api`
2. Update Vercel environment variable:
   ```
   VITE_API_URL=https://your-api-domain.com/api
   ```
3. Redeploy on Vercel

---

## Connect Custom Domain

### Frontend Domain (maarifahub.social)

1. In Vercel Dashboard → **Project Settings** → **Domains**
2. Add Domain: `maarifahub.social`
3. Update DNS at your registrar:
   - Option A: Change nameservers to Vercel's (recommended)
   - Option B: Add CNAME record to `cname.vercel-dns.com`
4. Vercel auto-provisions SSL
5. Also add: `www.maarifahub.social`

### Backend Domain (api.maarifahub.social)

Configure at your backend hosting provider (Railway, Render, etc.)

---

## Test Deployment

```bash
# Test frontend
curl https://your-project.vercel.app

# Test API
curl https://your-api-url/api/health

# Test with frontend
# Visit https://your-project.vercel.app in browser
```

---

## Troubleshooting

### Build Fails

```bash
# Check build locally
npm run build

# If it fails, check:
npm install
```

### CORS Error

Make sure backend `CORS_ORIGIN` matches frontend URL:
```
CORS_ORIGIN=https://your-project.vercel.app
```

### API Not Responding

1. Test backend: `curl https://your-api-url/api/health`
2. Check CORS is configured correctly
3. Verify environment variables are set

---

## Useful Commands

```bash
# View deployment logs
vercel logs

# Redeploy
vercel deploy --prod

# View function metrics
vercel analytics

# Link local project
vercel link
```

---

**That's it! Your app is now deployed to Vercel. 🚀**

For more details, see [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
