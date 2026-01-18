# Netlify Setup Completion Checklist

Your frontend is deployed! Now complete the setup to get everything working end-to-end.

## ✅ Frontend Deployment (DONE)

- [x] Push code to GitHub
- [x] Connect to Netlify
- [x] Auto-deploy configured
- [x] Frontend live at: `https://your-netlify-domain.netlify.app`

**View your site**: Check your Netlify dashboard for the live URL

---

## 🔄 Backend Deployment (NEXT)

### Step 1: Choose Backend Hosting

- [ ] **Railway** (Recommended)
  - [ ] Go to https://railway.app
  - [ ] Sign up with GitHub
  - [ ] Create new project from your GitHub repo
  - [ ] Set root directory: `server`
  - [ ] Add environment variables (see below)
  - [ ] Deploy
  - [ ] Copy API URL from Railway dashboard

- [ ] **Render**
  - [ ] Go to https://render.com
  - [ ] Sign up with GitHub
  - [ ] Create web service
  - [ ] Configure build/start commands
  - [ ] Add environment variables
  - [ ] Deploy
  - [ ] Copy API URL

- [ ] **Keep Existing Server**
  - [ ] Ensure backend is running
  - [ ] Get backend API URL
  - [ ] Skip to "Environment Variables" step

### Step 2: Add Backend Environment Variables

In your backend platform (Railway/Render/etc.), add:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/maarifahub
JWT_SECRET=<generate-with: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))" >
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-netlify-domain.netlify.app
```

**Important Notes:**
- Replace MONGODB_URI with your real MongoDB connection string
- Generate a strong JWT_SECRET (see command above)
- Set CORS_ORIGIN to your Netlify domain (check Netlify dashboard)

---

## 🌐 Frontend Environment Variables (REQUIRED)

In **Netlify Dashboard** → **Site Settings** → **Build & Deploy** → **Environment**:

### Add Variable:

```
VITE_API_URL = https://your-backend-url/api
```

Replace `your-backend-url` with:

- **If using Railway**: `your-project.up.railway.app`
- **If using Render**: `your-project.onrender.com`
- **If using custom server**: `api.yourdomain.com`

### Example:

```
VITE_API_URL = https://maarifahub-api.up.railway.app/api
```

### Steps:

1. Open Netlify dashboard
2. Click on your site
3. Go to **Site settings**
4. Click **Build & deploy**
5. Click **Environment**
6. Click **Edit variables**
7. Add the variable above
8. **Important**: Go to **Deployments** → Find latest → Click **Trigger deploy** or **Redeploy**

---

## 🧪 Test Integration

After setting environment variables and redeploying:

### Test 1: Check Environment Variable

```bash
# Visit your site in browser
# Open Developer Console (F12)
# In console, paste:
fetch('/').then(r => r.text()).then(console.log)
```

Should see HTML. If blank, check build.

### Test 2: Test API Connection

```bash
# In browser console:
fetch('https://your-backend-url/api/health')
  .then(r => r.json())
  .then(console.log)
```

Should show API response. If CORS error, check backend CORS_ORIGIN.

### Test 3: Test Full Feature

1. Go to your Netlify URL
2. Try to login/register
3. Check browser console for errors
4. Check Netlify function logs (if using serverless)

---

## 🌍 Custom Domain Setup (OPTIONAL but Recommended)

### Step 1: Register Domain

- [ ] Go to registrar (GoDaddy, Namecheap, etc.)
- [ ] Search for `maarifahub.social`
- [ ] Register for 1 year minimum
- [ ] Get domain confirmation email

### Step 2: Connect to Netlify

1. In Netlify: **Site settings** → **Domain management**
2. Click **Add domain**
3. Enter: `maarifahub.social`
4. Netlify shows DNS setup instructions
5. Choose one:

**Option A: Change Nameservers** (Recommended)
- Go to your registrar
- Change nameservers to Netlify's provided ones
- Wait 24 hours for DNS propagation
- Netlify auto-creates subdomain

**Option B: Add CNAME Record** (Faster)
- Go to your registrar's DNS settings
- Add CNAME record
- Point to: `your-site.netlify.app`
- Wait a few hours for propagation

### Step 3: Update Backend CORS

After domain is live:

In your backend platform, update:
```
CORS_ORIGIN=https://maarifahub.social
```

And if using API subdomain:
```
CORS_ORIGIN=https://maarifahub.social,https://api.maarifahub.social
```

---

## 📋 Final Verification Checklist

### Netlify Dashboard

- [ ] Site is live and accessible
- [ ] HTTPS working (green lock in browser)
- [ ] Deployments showing successful builds
- [ ] Environment variables set
- [ ] Build logs look good

### Backend Service

- [ ] Backend is running
- [ ] API endpoints responding
- [ ] Database connected
- [ ] Logs showing no errors
- [ ] CORS configured correctly

### Frontend Functionality

- [ ] Homepage loads
- [ ] No console errors
- [ ] Can navigate pages
- [ ] API calls working
- [ ] Authentication working
- [ ] Images loading
- [ ] Styles applied correctly

### Domain (if configured)

- [ ] Domain resolves to Netlify
- [ ] HTTPS certificate valid
- [ ] Both domain.com and www.domain.com work
- [ ] Redirects working

---

## 🚨 Troubleshooting

### Netlify Build Fails

**Check**:
1. Build logs in Netlify Deploys
2. Run locally: `npm run build`
3. Check all dependencies: `npm install`

### API Returns 404

**Check**:
1. Backend is running
2. Correct API URL in env variables
3. API endpoint exists on backend

### CORS Error in Console

**Check**:
1. Backend `CORS_ORIGIN` set to Netlify domain
2. Redeploy backend after changing CORS
3. Wait 5 minutes for changes to take effect

### Blank Page Load

**Check**:
1. Check build output in Netlify logs
2. Check browser console errors
3. Try hard refresh (Ctrl+Shift+R)
4. Clear browser cache

### 500 Error from API

**Check**:
1. Backend logs for errors
2. MongoDB connection string valid
3. Environment variables set in backend
4. Check database is accessible

---

## 📊 Monitor Your Deployment

### Netlify Analytics

- Dashboard → **Analytics**
- View traffic, bandwidth, response times

### View Deployments

- Dashboard → **Deploys**
- See build history and logs
- Click deployment to see details

### Check Functions (if using)

- Dashboard → **Functions**
- View execution logs
- Monitor performance

---

## 🎉 You're Almost Done!

**Remaining Tasks:**
1. Choose & deploy backend (~10 min)
2. Set environment variables (~3 min)
3. Test integration (~5 min)
4. Optional: Connect custom domain (~10 min)

**Total Time**: ~30 minutes

---

## Quick Commands

```bash
# Local testing
npm run build
npm run preview

# Check dependencies
npm list

# Install CLI
npm install -g netlify-cli

# Deploy locally
netlify deploy

# Deploy to production
netlify deploy --prod

# View logs
netlify logs
```

---

## Need Help?

- **Netlify Docs**: https://docs.netlify.com/
- **See NETLIFY_DEPLOYMENT.md**: Detailed setup guide
- **See DEPLOYMENT_COMPARISON.md**: Backend options comparison

---

**Status: Frontend ✅ | Backend ⏳ | Domain ⏳**

Next: Deploy your backend! Choose Railway (fastest) or Render (free tier available).
