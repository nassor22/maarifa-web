# MaarifaHub Backend Setup

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** (v5 or higher)

## MongoDB Installation

### Ubuntu/Linux:
```bash
# Import MongoDB GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -sc)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Windows:
Download and install from: https://www.mongodb.com/try/download/community

## Setup Instructions

### 1. Install Server Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment Variables
The `.env` file is already created. Update if needed:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/maarifahub
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
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

The following collections will be created automatically:
- `users` - User accounts
- `posts` - Community posts and questions
- `freelancers` - Freelancer profiles
- `jobs` - Job listings
- `messages` - Chat messages
- `conversations` - Chat conversations

## Troubleshooting

### MongoDB Connection Issues
1. Ensure MongoDB is running: `sudo systemctl status mongod`
2. Check MongoDB logs: `sudo tail -f /var/log/mongodb/mongod.log`
3. Verify connection string in `.env`

### Port Already in Use
If port 5000 is taken, change the PORT in `.env` file

### CORS Issues
The server is configured to allow all origins in development. For production, update the CORS settings in `server.js`
