# Quick Setup: Netlify + Railway

**Frontend (Netlify) → Backend (Railway)**

## 🚀 5-Minute Setup

### 1. Deploy Backend (Railway)

```bash
cd server
railway login
railway init
railway add --database postgres
```

Set environment variables in Railway:
```
NODE_ENV=production
DATABASE_URL=${{Postgres.DATABASE_URL}}
DB_SSL=true
JWT_SECRET=<run: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))">
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-site.netlify.app
```

Get your Railway URL:
```bash
railway domain
```
Example: `https://backend-production-abc123.up.railway.app`

### 2. Deploy Frontend (Netlify)

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) → **New site from Git**
3. Select your repo
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

5. **Add environment variable:**
   - Go to **Site settings** → **Environment variables**
   - Add: `VITE_API_URL` = `https://your-railway-url.up.railway.app/api`

6. Deploy!

### 3. Update CORS

Go back to Railway and update:
```
CORS_ORIGIN=https://your-netlify-site.netlify.app
```

Redeploy Railway backend.

---

## ✅ Test

Visit your Netlify site and try to:
- [ ] Register a new user
- [ ] Login
- [ ] Create a post

Check browser DevTools → Network tab to confirm API calls work.

---

## 🔧 Common Issues

**CORS Error?**
- Railway `CORS_ORIGIN` must match Netlify domain exactly
- Redeploy Railway after changing CORS

**API 404?**
- Netlify `VITE_API_URL` must end with `/api`
- Trigger new Netlify deploy after env var change

**Backend 500?**
- Check Railway logs: `railway logs`
- Verify `DATABASE_URL` and `DB_SSL=true`

---

## 📖 Full Guide

See [NETLIFY_RAILWAY_SETUP.md](./NETLIFY_RAILWAY_SETUP.md) for complete instructions.
