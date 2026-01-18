# Netlify Deployment Guide for MaarifaHub

## Quick Start with Netlify

You've already deployed to Netlify! Here's how to optimize your setup and configure your backend.

### Your Netlify Dashboard

Visit: https://app.netlify.com/sites

### Environment Variables Setup

1. Go to **Site Settings** → **Build & Deploy** → **Environment**
2. Add the following environment variables:

```
VITE_API_URL=your-backend-api-url
```

#### Backend API URL Options

**Option 1: Backend on Railway**
```
VITE_API_URL=https://your-railway-app.up.railway.app/api
```

**Option 2: Backend on Render**
```
VITE_API_URL=https://your-render-app.onrender.com/api
```

**Option 3: Backend on Custom Domain**
```
VITE_API_URL=https://api.maarifahub.social/api
```

---

## Netlify Features You're Now Using

✅ **Continuous Deployment** - Auto-deploy on git push
✅ **Automatic HTTPS** - Free SSL/TLS certificate
✅ **Edge Caching** - Global CDN for fast performance
✅ **Build Optimization** - Automatic minification & optimization
✅ **Netlify Functions** - Serverless functions support
✅ **Form Handling** - Built-in form submission
✅ **Analytics** - Basic traffic analytics
✅ **Deploy Previews** - Test PR changes before merging

---

## Your Deployment Status

### Frontend

- **Deployed on**: Netlify
- **URL**: Check your site settings for your Netlify domain
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Auto-deploys**: On push to main branch

### Backend Configuration Needed

Choose where to host your backend API:

| Service | Setup Time | Cost | Cold Start | Best For |
|---------|-----------|------|-----------|----------|
| **Railway** | 5 min | $5-50/mo | 1-2s | Recommended |
| **Render** | 5 min | Free-$25/mo | 2-3s | Good alternative |
| **Vercel** | 5 min | Free-$20/mo | <1s | If using both |
| **Heroku** | 5 min | Paid only | 5-10s | Legacy |
| **DigitalOcean** | 15 min | $6+/mo | None | Full control |

---

## Connect Custom Domain

### Add maarifahub.social to Netlify

1. Go to **Site Settings** → **Domain Settings** → **Custom Domains**
2. Click **Add Custom Domain**
3. Enter: `maarifahub.social`
4. Follow the DNS setup instructions:
   - Either change nameservers to Netlify's
   - Or add CNAME record to your DNS provider

### Steps:

1. **Buy domain** at your registrar (GoDaddy, Namecheap, etc.)

2. **Update DNS** at your registrar:
   - Option A: Change nameservers to Netlify
   - Option B: Add CNAME record pointing to your Netlify site

3. **Add subdomain for www**:
   - Netlify handles this automatically
   - Both `maarifahub.social` and `www.maarifahub.social` will work

4. **SSL Certificate**:
   - Netlify auto-provisions Let's Encrypt
   - HTTPS enabled automatically
   - Auto-renewing

---

## Backend Setup (Choose One)

### Option 1: Deploy Backend to Railway (Recommended)

1. Go to https://railway.app
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Set root directory: `server`
5. Add environment variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/maarifahub
   JWT_SECRET=<generate-strong-key>
   JWT_EXPIRE=7d
   CORS_ORIGIN=https://your-netlify-site.netlify.app
   ```
6. Railway will auto-deploy
7. Get your Railway URL from the dashboard
8. Update Netlify environment variable:
   ```
   VITE_API_URL=https://your-railway-app.up.railway.app/api
   ```

### Option 2: Deploy Backend to Render

1. Go to https://render.com
2. Click **New +** → **Web Service**
3. Select your GitHub repository
4. Set:
   - **Build Command**: `npm install --prefix server`
   - **Start Command**: `npm run start:prod --prefix server`
   - **Root Directory**: `.`
5. Add same environment variables as above
6. Deploy!
7. Update Netlify `VITE_API_URL` with Render URL

### Option 3: Keep Existing Backend Server

If you're running backend elsewhere (VPS, Docker, etc.):

1. Make sure backend is running and accessible
2. Update Netlify environment:
   ```
   VITE_API_URL=https://your-backend-url/api
   ```
3. Ensure backend has CORS configured for your Netlify domain

---

## Redeploy After Changes

### Automatic

- Push to main branch → Auto-deploys
- Netlify watches your GitHub repo

### Manual

1. Go to **Deploys** in Netlify
2. Click **Trigger deploy** → **Deploy site**

Or use Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

---

## Monitor Your Site

### Netlify Dashboard

- **Deploys**: View all deployments and build logs
- **Analytics**: Basic visitor stats
- **Functions**: Manage serverless functions
- **Forms**: Handle form submissions

### Build Logs

1. Go to **Deploys**
2. Click on a deployment
3. View **Deploy log** for full output

### Troubleshooting Builds

Check deployment logs for errors:
- Dependencies not installed
- Build command failed
- Missing environment variables

---

## Useful Commands

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy locally
netlify deploy

# Deploy to production
netlify deploy --prod

# View logs
netlify logs

# Show status
netlify status

# Link project
netlify link
```

---

## Your Project Git Workflow

```bash
# Branch for features
git checkout -b feature/my-feature

# Make changes
git add .
git commit -m "Add feature"

# Push to create preview
git push origin feature/my-feature

# Netlify auto-creates preview URL
# Share for testing

# Merge to main
git checkout main
git merge feature/my-feature
git push origin main

# Netlify auto-deploys to production
```

---

## Environment Setup for Netlify

### Required

- [ ] `VITE_API_URL` set in Netlify env vars
- [ ] Backend service running (Railway, Render, etc.)
- [ ] Backend `CORS_ORIGIN` configured for Netlify domain

### Optional

- [ ] Custom domain connected
- [ ] Analytics enabled
- [ ] Netlify Functions configured
- [ ] Form submission handling

---

## Cost Breakdown

| Service | Cost |
|---------|------|
| Netlify Frontend | Free ($20/mo if needed) |
| Railway Backend | $5-50/month |
| MongoDB Atlas | Free-$99/month |
| Custom Domain | $10-15/year |
| **Total** | **~$5-20/month** |

---

## Performance Tips

1. **Enable Asset Caching**
   - Already configured in netlify.toml
   - Static files cached for 1 year
   - HTML cached for 1 hour

2. **Optimize Images**
   - Use WebP format
   - Compress before upload
   - Use responsive images

3. **Code Splitting**
   - Vite already does this
   - Check build output for chunk sizes

4. **Monitor Bundle Size**
   ```bash
   npm run build
   # Check dist/ folder size
   ```

---

## Next Steps

1. **Configure Backend**
   - [ ] Choose hosting platform (Railway recommended)
   - [ ] Deploy backend
   - [ ] Get API URL
   - [ ] Update Netlify environment variables

2. **Test Integration**
   - [ ] Test API endpoints
   - [ ] Check browser console for errors
   - [ ] Verify CORS works

3. **Connect Custom Domain**
   - [ ] Register maarifahub.social
   - [ ] Update DNS settings
   - [ ] Verify SSL certificate

4. **Monitor Performance**
   - [ ] Check Netlify analytics
   - [ ] Monitor API response times
   - [ ] Review error logs

---

## Netlify vs Vercel Comparison

| Feature | Netlify | Vercel |
|---------|---------|--------|
| React Support | Excellent | Excellent |
| Vite Support | Good | Excellent |
| Ease of Use | Easy | Easy |
| Serverless Functions | Yes | Yes |
| Pricing | Free tier | Free tier |
| Custom Domain | Yes | Yes |
| Preview Deploys | Yes | Yes |
| Performance | Very Good | Excellent |
| **Best For** | **General use** | **High performance** |

Both are great choices! Netlify is perfect for your use case.

---

## Support

- **Netlify Docs**: https://docs.netlify.com/
- **Vite Docs**: https://vitejs.dev/
- **Railway Docs**: https://docs.railway.app/ (if using Railway)
- **Render Docs**: https://render.com/docs (if using Render)

---

**Status**: ✅ Frontend deployed on Netlify
**Next**: Deploy backend and configure API URL
