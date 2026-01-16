# MaarifaHub - Quick Deployment Reference

## 🚀 Three Ways to Deploy

### 1️⃣ Docker (Easiest - Recommended)
```bash
# Setup
cp .env.docker.example .env.docker
# Edit .env.docker with your settings

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose logs -f
```

### 2️⃣ Automated Script
```bash
# Run checklist first
./pre-deploy-check.sh

# Deploy
./deploy.sh
# Choose option 1 (Docker) or 2 (PM2)
```

### 3️⃣ Manual Build & Deploy
```bash
# Configure
cp .env.example .env
cp server/.env.example server/.env

# Build
npm run deploy:build

# Deploy files to your server
scp -r dist/ user@server:/var/www/maarifahub/
```

---

## 📋 Essential Commands

### Development
```bash
npm run dev              # Start frontend dev server
cd server && npm run dev # Start backend dev server
```

### Production Build
```bash
npm run deploy:build     # Build optimized frontend
npm run serve           # Preview production build
```

### Backend
```bash
npm run start:prod      # Start production server
```

### Docker
```bash
docker-compose up -d                           # Start containers
docker-compose down                            # Stop containers
docker-compose logs -f                         # View logs
docker-compose -f docker-compose.prod.yml up -d # Production deploy
```

### PM2 (VPS Deployment)
```bash
pm2 start server/server.js --name maarifahub-api
pm2 logs maarifahub-api
pm2 restart maarifahub-api
pm2 stop maarifahub-api
```

---

## 🔧 Configuration Files

### Frontend (.env)
```env
VITE_API_URL=https://api.yourdomain.com/api
```

### Backend (server/.env)
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@host/maarifahub
JWT_SECRET=<generate-secure-key>
CORS_ORIGIN=https://yourdomain.com
```

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🔍 Health Checks

```bash
# Backend API
curl http://localhost:5000/api/health

# Expected response:
# {"status":"ok","message":"MaarifaHub API is running"}

# Frontend
curl http://localhost/
```

---

## 🆘 Troubleshooting

### Build Errors
```bash
# Clear and reinstall
rm -rf node_modules dist
npm install
npm run deploy:build
```

### API Not Responding
```bash
# Check logs
docker-compose logs backend  # Docker
pm2 logs maarifahub-api     # PM2

# Test connection
curl http://localhost:5000/api/health
```

### Database Connection Issues
```bash
# Verify MongoDB is running
mongosh <your-connection-string>

# Check server logs for connection errors
```

### CORS Errors
- Check VITE_API_URL in frontend .env
- Verify CORS_ORIGIN in server/.env
- Ensure both match your domain

---

## 📚 Documentation

- **[PRODUCTION_READY.md](PRODUCTION_READY.md)** - Overview & checklist
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - Complete step-by-step guide
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - API reference

---

## ✅ Pre-Deployment Checklist

Run automated check:
```bash
./pre-deploy-check.sh
```

Manual checklist:
- [ ] Environment files configured (.env, server/.env)
- [ ] JWT_SECRET changed from default
- [ ] MongoDB connection configured
- [ ] NODE_ENV=production set
- [ ] CORS_ORIGIN set to your domain
- [ ] Build completes without errors
- [ ] Health check endpoint responds
- [ ] SSL certificate configured (for production)

---

## 🎯 Quick Start Flow

1. **Check requirements**: `./pre-deploy-check.sh`
2. **Configure**: Edit .env files
3. **Deploy**: `./deploy.sh` or use Docker
4. **Verify**: Check health endpoints
5. **Monitor**: View logs and test features

---

## 🔗 Default URLs

- **Frontend Dev**: http://localhost:5173
- **Backend Dev**: http://localhost:5000
- **Frontend Prod**: http://localhost or your domain
- **Backend Prod**: http://localhost:5000 or your API domain
- **Health Check**: /api/health

---

## 💡 Tips

- Use Docker for consistent deployments
- Always run pre-deploy-check.sh first
- Keep .env files secure (never commit)
- Use strong, unique JWT_SECRET
- Enable HTTPS in production
- Set up regular database backups
- Monitor logs after deployment

---

**Need help?** See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.
