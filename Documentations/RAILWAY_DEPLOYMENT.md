# Railway Backend Deployment Guide

## Prerequisites
1. Railway account (https://railway.app)
2. MongoDB Atlas account or Railway MongoDB plugin
3. Git repository with your backend code

## Quick Deploy Steps

### Option 1: Deploy from GitHub (Recommended)

1. **Push your code to GitHub**
   ```bash
   cd server
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

2. **Create Railway Project**
   - Go to https://railway.app/new
   - Click "Deploy from GitHub repo"
   - Select your repository
   - Select the `server` folder as the root directory

3. **Add MongoDB Database**
   - In your Railway project, click "New"
   - Select "Database" → "Add MongoDB"
   - Railway will automatically provision a MongoDB instance

4. **Configure Environment Variables**
   - Go to your service settings → Variables
   - Add the following variables:
   
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=${{MongoDB.MONGO_URL}}  (Railway will auto-populate this)
   JWT_SECRET=<your-strong-jwt-secret-key>
   JWT_EXPIRE=7d
   CORS_ORIGIN=https://your-frontend-domain.com
   ```
   
   **Generate a secure JWT secret:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

5. **Deploy**
   - Railway will automatically build and deploy
   - Your API will be available at: `https://your-service.up.railway.app`

### Option 2: Deploy using Railway CLI

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Initialize Project**
   ```bash
   cd server
   railway init
   ```

4. **Add MongoDB**
   ```bash
   railway add --plugin mongodb
   ```

5. **Set Environment Variables**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set JWT_SECRET=your_jwt_secret
   railway variables set JWT_EXPIRE=7d
   railway variables set CORS_ORIGIN=https://your-frontend-domain.com
   ```

6. **Deploy**
   ```bash
   railway up
   ```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port (auto-assigned by Railway) | `5000` |
| `MONGODB_URI` | MongoDB connection string | `${{MongoDB.MONGO_URL}}` |
| `JWT_SECRET` | Secret key for JWT tokens | Generate with crypto |
| `JWT_EXPIRE` | JWT expiration time | `7d` |
| `CORS_ORIGIN` | Allowed frontend origin | `https://yourdomain.com` |

## Post-Deployment Configuration

### 1. Get Your API URL
```bash
railway domain
```
Or find it in Railway dashboard under your service settings.

### 2. Update Frontend Configuration
Update your frontend [src/services/api.js](../src/services/api.js) with the Railway URL:
```javascript
const API_URL = 'https://your-service.up.railway.app';
```

### 3. Configure Custom Domain (Optional)
1. Go to Railway project settings
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as shown

### 4. Test Your Deployment
```bash
# Health check
curl https://your-service.up.railway.app/api/health

# Test auth endpoint
curl https://your-service.up.railway.app/api/auth/register \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## Monitoring & Logs

### View Logs
```bash
railway logs
```

Or view in Railway dashboard under the "Deployments" tab.

### Monitor Resources
Railway provides automatic monitoring:
- CPU usage
- Memory usage
- Network traffic
- Deployment history

## Troubleshooting

### Build Failures
- Check build logs in Railway dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

### Connection Issues
- Verify MongoDB connection string is correct
- Check that CORS_ORIGIN matches your frontend URL
- Ensure JWT_SECRET is set

### Database Connection Errors
```bash
# Test MongoDB connection
railway run node -e "require('./config/database.js').default()"
```

## Automatic Deployments

Railway automatically deploys when you push to your connected GitHub branch:
```bash
git add .
git commit -m "Update backend"
git push origin main  # Automatic deployment triggered
```

## Scaling & Performance

Railway provides:
- Automatic vertical scaling
- Zero-downtime deployments
- Built-in SSL/TLS
- CDN integration
- Automatic health checks

## Cost Estimation

Railway Free Tier:
- $5 free credit per month
- Sufficient for development/small projects

Paid Plans:
- Pay-as-you-go pricing
- ~$5-20/month for typical backend
- Monitor usage in Railway dashboard

## Rollback

If you need to rollback to a previous deployment:
1. Go to Railway dashboard → Deployments
2. Find the working deployment
3. Click "Redeploy"

Or using CLI:
```bash
railway rollback
```

## Resources

- Railway Documentation: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Support: https://railway.app/help

## Next Steps

1. ✅ Backend deployed on Railway
2. 📝 Update frontend API URL
3. 🌐 Deploy frontend (Netlify recommended)
4. 🔒 Configure production environment variables
5. 🧪 Test all API endpoints
6. 📊 Set up monitoring and alerts
