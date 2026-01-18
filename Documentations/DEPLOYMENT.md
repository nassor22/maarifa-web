# MaarifaHub Deployment Guide

## Prerequisites

- Node.js 18+ and npm
- Web server (Apache, Nginx)
- Domain name
- SSL certificate
- Backend server (for API)
- PostgreSQL database

## Frontend Deployment

### 1. Build the Application

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

This creates an optimized build in the `dist/` directory.

### 2. Deploy to Web Server

#### Option A: Nginx

1. **Build the app:**
```bash
npm run build
```

2. **Configure Nginx:**

Create `/etc/nginx/sites-available/maarifahub`:

```nginx
server {
    listen 80;
    server_name maarifahub.com www.maarifahub.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name maarifahub.com www.maarifahub.com;

    # SSL Configuration
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Root directory
    root /var/www/maarifahub/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy (if API is on same server)
    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

3. **Enable site and restart Nginx:**
```bash
sudo ln -s /etc/nginx/sites-available/maarifahub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Option B: Apache

1. **Build the app:**
```bash
npm run build
```

2. **Configure Apache:**

Create `/etc/apache2/sites-available/maarifahub.conf`:

```apache
<VirtualHost *:80>
    ServerName maarifahub.com
    ServerAlias www.maarifahub.com
    Redirect permanent / https://maarifahub.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName maarifahub.com
    ServerAlias www.maarifahub.com

    SSLEngine on
    SSLCertificateFile /path/to/ssl/certificate.crt
    SSLCertificateKeyFile /path/to/ssl/private.key

    DocumentRoot /var/www/maarifahub/dist
    
    <Directory /var/www/maarifahub/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Enable client-side routing
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    # Enable compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
    </IfModule>

    # Cache static assets
    <IfModule mod_expires.c>
        ExpiresActive On
        ExpiresByType image/jpg "access plus 1 year"
        ExpiresByType image/jpeg "access plus 1 year"
        ExpiresByType image/png "access plus 1 year"
        ExpiresByType image/gif "access plus 1 year"
        ExpiresByType text/css "access plus 1 month"
        ExpiresByType application/javascript "access plus 1 month"
        ExpiresByType application/font-woff "access plus 1 year"
        ExpiresByType application/font-woff2 "access plus 1 year"
    </IfModule>
</VirtualHost>
```

3. **Enable site and modules:**
```bash
sudo a2enmod rewrite ssl headers expires deflate
sudo a2ensite maarifahub
sudo apache2ctl configtest
sudo systemctl restart apache2
```

### 3. Deploy to Vercel (Alternative)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel --prod
```

3. **Configure custom domain in Vercel dashboard**

### 4. Deploy to Netlify (Alternative)

1. **Create `netlify.toml` in project root:**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "no-referrer-when-downgrade"
```

2. **Deploy:**
```bash
# Via Netlify CLI
npm install -g netlify-cli
netlify deploy --prod

# Or connect GitHub repo in Netlify dashboard
```

## Backend Deployment

### Django Setup (Recommended)

1. **Install dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

2. **Configure environment variables:**

Create `.env` file:
```env
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=api.maarifahub.com,maarifahub.com
DATABASE_URL=postgresql://user:password@localhost:5432/maarifahub
REDIS_URL=redis://localhost:6379/0
CORS_ALLOWED_ORIGINS=https://maarifahub.com
JWT_SECRET=your-jwt-secret
```

3. **Setup database:**
```bash
python manage.py migrate
python manage.py createsuperuser
```

4. **Collect static files:**
```bash
python manage.py collectstatic --noinput
```

5. **Run with Gunicorn:**
```bash
gunicorn maarifahub.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

6. **Setup systemd service:**

Create `/etc/systemd/system/maarifahub.service`:

```ini
[Unit]
Description=MaarifaHub API
After=network.target

[Service]
Type=notify
User=www-data
Group=www-data
RuntimeDirectory=gunicorn
WorkingDirectory=/var/www/maarifahub/backend
Environment="PATH=/var/www/maarifahub/backend/venv/bin"
ExecStart=/var/www/maarifahub/backend/venv/bin/gunicorn \
          --workers 4 \
          --bind unix:/run/gunicorn/maarifahub.sock \
          maarifahub.wsgi:application
ExecReload=/bin/kill -s HUP $MAINPID
KillMode=mixed
TimeoutStopSec=5
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable maarifahub
sudo systemctl start maarifahub
```

## Database Setup

### PostgreSQL

1. **Install PostgreSQL:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

2. **Create database and user:**
```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE maarifahub;
CREATE USER maarifahub_user WITH PASSWORD 'secure_password';
ALTER ROLE maarifahub_user SET client_encoding TO 'utf8';
ALTER ROLE maarifahub_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE maarifahub_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE maarifahub TO maarifahub_user;
\q
```

3. **Apply schema:**
```bash
# Use the DATABASE_SCHEMA.md to create tables
psql -U maarifahub_user -d maarifahub -f schema.sql
```

## CDN and Asset Optimization

### Cloudflare Setup (Recommended for Africa)

1. **Add site to Cloudflare**
2. **Update DNS records**
3. **Enable settings:**
   - Auto Minify (JS, CSS, HTML)
   - Brotli compression
   - Rocket Loader
   - Always Use HTTPS
   - Automatic HTTPS Rewrites

4. **Page Rules:**
   - Cache Level: Standard
   - Browser Cache TTL: 1 year (for static assets)
   - Edge Cache TTL: 1 month

## Monitoring and Logging

### Setup Monitoring

1. **Install PM2 for Node.js processes:**
```bash
npm install -g pm2
```

2. **Setup logging:**
```bash
# Application logs
tail -f /var/log/nginx/maarifahub-access.log
tail -f /var/log/nginx/maarifahub-error.log
```

3. **Health checks:**
Create endpoint `/api/health` that returns system status

## Backup Strategy

### Database Backups

```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR="/var/backups/maarifahub"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
pg_dump -U maarifahub_user maarifahub > "$BACKUP_DIR/db_backup_$TIMESTAMP.sql"

# Keep only last 30 days
find $BACKUP_DIR -name "db_backup_*.sql" -mtime +30 -delete
```

Add to crontab:
```bash
0 2 * * * /path/to/backup-script.sh
```

### File Backups

```bash
# Backup uploaded files
rsync -av /var/www/maarifahub/uploads/ /var/backups/maarifahub/uploads/
```

## Security Checklist

- [ ] HTTPS enabled everywhere
- [ ] SSL certificate installed and auto-renewing
- [ ] Firewall configured (only ports 80, 443, 22 open)
- [ ] Database not exposed to public internet
- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Regular security updates applied
- [ ] Backups automated and tested
- [ ] Monitoring and alerting setup
- [ ] Error logging configured
- [ ] API keys rotated regularly

## Performance Optimization

1. **Enable HTTP/2**
2. **Use CDN for static assets**
3. **Optimize images (WebP format)**
4. **Implement caching strategy**
5. **Database indexing** (see DATABASE_SCHEMA.md)
6. **Redis for session storage**
7. **Background job processing**

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer:** Nginx or AWS ELB
2. **Multiple app servers**
3. **Shared session storage** (Redis)
4. **Database replication** (Primary-Replica)
5. **Message queue** (RabbitMQ or Redis)

### Vertical Scaling

- Increase server resources as needed
- Monitor CPU, memory, disk usage
- Optimize database queries

## Rollback Plan

1. **Keep previous build:**
```bash
cp -r dist dist.backup
```

2. **Quick rollback:**
```bash
rm -rf dist
mv dist.backup dist
sudo systemctl restart nginx
```

## Support

For deployment issues, refer to:
- [System Architecture](./ARCHITECTURE.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Database Schema](./DATABASE_SCHEMA.md)
