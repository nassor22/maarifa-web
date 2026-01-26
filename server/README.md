# MaarifaHub Backend Setup

## Prerequisites

1. **Node.js** (v18 or higher)
2. **PostgreSQL** (v14 or higher) or a managed Postgres service

## PostgreSQL Installation

### Ubuntu/Linux:
```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Create database and user
sudo -u postgres psql -c "CREATE USER maarifa WITH PASSWORD 'changeme';"
sudo -u postgres psql -c "CREATE DATABASE maarifahub OWNER maarifa;"
```

### macOS (Homebrew):
```bash
brew install postgresql@16
brew services start postgresql@16
# Create DB and user
createuser -s $(whoami) || true
createdb maarifahub || true
```

### Connection String
Local example:
```
DATABASE_URL=postgresql://maarifa:changeme@localhost:5432/maarifahub
```
Managed providers (Railway/Render/DO) often require SSL:
```
DATABASE_URL=postgresql://user:pass@host:5432/maarifahub
DB_SSL=true
```

## Setup Instructions

### 1. Install Server Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment Variables
Copy `server/.env.example` to `server/.env` and update:
```
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/maarifahub
DB_SSL=false
JWT_SECRET=<generate-secure-key>
JWT_EXPIRE=7d
CORS_ORIGIN=*
```

### 3. Start the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will run on http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)
- `POST /api/posts/:id/upvote` - Upvote post (protected)
- `POST /api/posts/:id/replies` - Add reply (protected)

### Freelancers
- `GET /api/freelancers` - Get all freelancers
- `GET /api/freelancers/:id` - Get single freelancer
- `POST /api/freelancers` - Create/Update freelancer profile (protected)
- `POST /api/freelancers/:id/reviews` - Add review (protected)

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (protected)
- `POST /api/jobs/:id/apply` - Apply for job (protected)

### Messages
- `GET /api/messages/conversations` - Get conversations (protected)
- `GET /api/messages/conversations/:id` - Get messages (protected)
- `POST /api/messages/conversations/:id/messages` - Send message (protected)
- `POST /api/messages/conversations` - Create conversation (protected)

### Users
- `GET /api/users/:username` - Get user profile
- `PUT /api/users/profile` - Update profile (protected)

### Categories
- `GET /api/categories` - Get all categories

## Testing the API

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "role": "community_member"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "testuser",
    "password": "password123"
  }'
```

## Frontend Setup

### 1. The frontend is already configured to use the API

### 2. Start the Frontend
```bash
# From the root directory
npm run dev
```

The frontend will run on http://localhost:5173 and connect to the backend API.

## Database Structure

Key tables managed via Sequelize:
- `users`, `posts`, `freelancers`, `jobs`, `messages`, `sessions`, etc.
Relations and indexes are created by Sequelize sync in development.

## Troubleshooting

### PostgreSQL Connection Issues
1. Ensure PostgreSQL is running: `sudo systemctl status postgresql`
2. Check service logs: `journalctl -u postgresql --since "1 hour ago"`
3. Test connection with psql:
  ```bash
  psql "postgresql://username:password@localhost:5432/maarifahub" -c "\dt"
  ```
4. If using a managed DB, set `DB_SSL=true` in `.env`.

### Port Already in Use
If port 5000 is taken, change the PORT in `.env` file

### CORS Issues
The server is configured to allow all origins in development. For production, update the CORS settings in `server.js`
