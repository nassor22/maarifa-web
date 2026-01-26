# Netlify + Railway Deployment Guide

Complete guide for deploying MaarifaHub with **Netlify (Frontend)** and **Railway (Backend)**.

---

## 🎯 Overview

- **Frontend**: React app hosted on Netlify
- **Backend**: Node.js API hosted on Railway
- **Database**: PostgreSQL on Railway

---

## 📋 Prerequisites

- GitHub account with your repository
- Netlify account (free tier works)
- Railway account (free tier includes $5/month credit)

---

## Part 1: Deploy Backend to Railway

### Step 1: Create Railway Account & Project

1. Go to [railway.app](https://railway.app) and sign up
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway and select your `maarifaHub` repository
5. Railway will detect your Node.js backend

### Step 2: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database" → "PostgreSQL"**
3. Railway will automatically provision a Postgres instance
4. Copy the `DATABASE_URL` from the PostgreSQL service

### Step 3: Configure Backend Environment Variables

In your Railway backend service, add these variables:

```bash
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}  # Auto-linked from Postgres service
DB_SSL=true
JWT_SECRET=<generate-strong-secret>
JWT_EXPIRE=7d
PORT=5000
CORS_ORIGIN=https://your-netlify-site.netlify.app
```

**To generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 4: Configure Build & Deploy

Railway auto-detects `server/` directory. Set root directory:

1. Go to **Settings** → **Root Directory**
2. Set to: `/server`
3. Railway will use `package.json` from `server/` folder

Or add `railway.json` in `server/`:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Step 5: Deploy & Get URL

1. Railway will automatically deploy on push
2. Click **"Settings" → "Generate Domain"** to get your public URL
3. Your backend will be at: `https://your-project.up.railway.app`

**Test your backend:**
```bash
curl https://your-project.up.railway.app/api/health
```

Expected response:
```json
{"status":"ok","message":"MaarifaHub API is running"}
```

---

## Part 2: Deploy Frontend to Netlify

### Step 1: Create Netlify Site

1. Go to [netlify.com](https://netlify.com) and sign up
2. Click **"Add new site" → "Import an existing project"**
3. Connect to GitHub and select your `maarifaHub` repository
4. Configure build settings:

**Build settings:**
```
Build command:    npm run build
Publish directory: dist
Node version:     18.x
```

### Step 2: Configure Environment Variables

In Netlify Dashboard → **Site settings** → **Environment variables**:

Add:
```
VITE_API_URL=https://your-project.up.railway.app/api
```

**Replace `your-project.up.railway.app` with your actual Railway domain!**

### Step 3: Deploy

1. Click **"Deploy site"**
2. Netlify will build and deploy automatically
3. Your site will be at: `https://random-name.netlify.app`

### Step 4: Update Railway CORS

**Critical:** Update Railway backend `CORS_ORIGIN` to your Netlify domain:

In Railway backend environment variables:
```
CORS_ORIGIN=https://your-site.netlify.app
```

Or if using custom domain:
```
CORS_ORIGIN=https://maarifahub.social
```

---

## Part 3: Custom Domain (Optional)

### For Netlify Frontend

1. In Netlify: **Domain settings** → **Add custom domain**
2. Add your domain (e.g., `maarifahub.social`)
3. Update DNS with provided records
4. Netlify provides free SSL automatically

### For Railway Backend (Subdomain)

Option 1: Use Railway's generated domain (easiest)

Option 2: Custom subdomain (e.g., `api.maarifahub.social`):
1. In Railway: **Settings** → **Custom Domain**
2. Add `api.maarifahub.social`
3. Update DNS: `CNAME` → Railway provided target

**Then update:**
- Netlify `VITE_API_URL=https://api.maarifahub.social/api`
- Railway `CORS_ORIGIN=https://maarifahub.social`

---

## 🔍 Testing & Verification

### 1. Test Backend Directly

```bash
# Health check
curl https://your-railway-domain.up.railway.app/api/health

# Register test user
curl -X POST https://your-railway-domain.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123","role":"community_member"}'
```

### 2. Test Frontend → Backend Connection

1. Open browser DevTools (F12) → Network tab
2. Visit your Netlify site
3. Try to register/login
4. Check Network requests to `/api/*` endpoints
5. Verify requests go to Railway backend

### 3. Check CORS

If you see CORS errors:
- Verify `CORS_ORIGIN` in Railway matches your Netlify domain **exactly**
- Check for `http://` vs `https://`
- Check for trailing slash
- Railway backend must be redeployed after CORS changes

---

## 🔧 Environment Variables Reference

### Netlify (Frontend)

| Variable | Value | Example |
|----------|-------|---------|
| `VITE_API_URL` | Railway backend URL | `https://app.up.railway.app/api` |

### Railway (Backend)

| Variable | Value | Example |
|----------|-------|---------|
| `NODE_ENV` | `production` | `production` |
| `DATABASE_URL` | Auto from Postgres | `${{Postgres.DATABASE_URL}}` |
| `DB_SSL` | `true` | `true` |
| `JWT_SECRET` | Strong random key | `<64-char-hex>` |
| `JWT_EXPIRE` | Token expiry | `7d` |
| `PORT` | API port | `5000` |
| `CORS_ORIGIN` | Netlify domain | `https://yoursite.netlify.app` |

---

## 🚨 Troubleshooting

### Backend Not Responding

**Check Railway logs:**
```bash
railway logs
```

Or in Railway dashboard → **Deployments** → Click latest → **View Logs**

**Common issues:**
- Database connection failed → Check `DATABASE_URL` and `DB_SSL=true`
- Port binding error → Ensure `PORT=5000` is set

### CORS Errors

**Symptoms:** Browser console shows CORS policy error

**Fix:**
1. Check Railway `CORS_ORIGIN` matches Netlify URL exactly
2. Redeploy Railway backend after changing `CORS_ORIGIN`
3. Clear browser cache and retry

**Verify CORS:**
```bash
curl -H "Origin: https://yoursite.netlify.app" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS \
  https://your-railway-app.up.railway.app/api/auth/register -v
```

Should return `access-control-allow-origin` header.

### API Returns 404

**Check:**
- Netlify `VITE_API_URL` has `/api` suffix
- Example: `https://app.up.railway.app/api` ✅
- Not: `https://app.up.railway.app` ❌

### Frontend Shows Old API URL

**Fix:**
1. Update Netlify environment variable
2. Trigger new deploy: **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

---

## 📊 Monitoring

### Railway

- **Metrics:** Dashboard shows CPU, memory, network
- **Logs:** Real-time logs in dashboard or via CLI: `railway logs`
- **Alerts:** Configure under **Settings** → **Notifications**

### Netlify

- **Deploy logs:** Check build logs for errors
- **Function logs:** For serverless functions (if used)
- **Analytics:** Available on paid plans

---

## 💰 Costs

### Railway Free Tier
- $5/month usage credit
- Sufficient for small apps
- ~500 hours/month runtime

### Netlify Free Tier
- 100 GB bandwidth/month
- 300 build minutes/month
- Perfect for static sites

**Expected costs for hobby project:** $0-5/month

---

## 🔄 Continuous Deployment

Both platforms auto-deploy on git push:

**Workflow:**
1. Push code to GitHub `main` branch
2. Railway rebuilds backend automatically
3. Netlify rebuilds frontend automatically
4. Changes live in 2-5 minutes

**Disable auto-deploy:**
- Railway: **Settings** → Pause deployments
- Netlify: **Site settings** → **Build & deploy** → Stop builds

---

## 📚 Quick Commands

### Railway CLI

```bash
# Install
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# View logs
railway logs

# Set env var
railway variables set KEY=value

# Deploy
railway up
```

### Netlify CLI

```bash
# Install
npm install -g netlify-cli

# Login
netlify login

# Link site
netlify link

# Deploy
netlify deploy --prod
```

---

## ✅ Deployment Checklist

- [ ] Railway backend deployed and running
- [ ] PostgreSQL provisioned and connected
- [ ] Railway environment variables configured
- [ ] Backend health endpoint returns 200
- [ ] Netlify frontend deployed
- [ ] `VITE_API_URL` set in Netlify
- [ ] Frontend loads without errors
- [ ] Backend `CORS_ORIGIN` matches Netlify domain
- [ ] Can register/login from frontend
- [ ] API requests succeed in browser Network tab

---

## 🔗 Resources

- [Railway Documentation](https://docs.railway.app)
- [Netlify Documentation](https://docs.netlify.com)
- [PostgreSQL Migration Guide](./POSTGRESQL_MIGRATION.md)
- [API Documentation](./API_DOCUMENTATION.md)

---

## 💡 Pro Tips

1. **Use Railway's variables syntax:** `${{Postgres.DATABASE_URL}}` auto-links services
2. **Enable Netlify deploy previews** for PR reviews
3. **Set up staging environments:** Railway supports branch-based deploys
4. **Monitor logs** after first deploy to catch issues early
5. **Use Railway's CLI** for faster debugging
6. **Netlify environment variables** are build-time only (need redeploy to update)

---

Need help? Check the troubleshooting section or refer to platform docs!
