# MaarifaHub - Real Database Implementation Guide

## Overview

Your MaarifaHub application now has a complete backend with real database support! Here's what has been implemented:

## 🏗️ Backend Architecture

### Technology Stack
- **Backend Framework**: Express.js (Node.js)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with bcryptjs for password hashing
- **Validation**: express-validator

### Database Schema

#### 1. Users Collection
- username, email, password (hashed)
- countryCode, phone
- role (community_member, verified_expert_individual, verified_expert_org, admin)
- reputation, isVerified
- bio, avatar, expertise, location

#### 2. Posts Collection
- type (question, information, opinion, knowledge)
- title, content, category
- author (reference to User)
- upvotes, downvotes, upvotedBy, downvotedBy
- replies (embedded array)
- views, tags, isResolved

#### 3. Freelancers Collection
- user (reference to User)
- title, category, description
- skills, hourlyRate, availability
- rating, reviews, completedProjects
- portfolio

#### 4. Jobs Collection
- title, company, location, type
- category, description, requirements
- salary, postedBy (reference to User)
- applications, isActive, expiresAt

#### 5. Messages & Conversations Collections
- Message: conversation, sender, content, readBy
- Conversation: participants, lastMessage

## 📁 Project Structure

```
maarifaHub/
├── server/                      # Backend directory
│   ├── server.js               # Main server file
│   ├── package.json            # Server dependencies
│   ├── .env                    # Environment variables
│   ├── README.md               # Server documentation
│   ├── setup.sh                # Setup script
│   ├── config/
│   │   └── database.js         # MongoDB connection
│   ├── models/
│   │   ├── User.js             # User model
│   │   ├── Post.js             # Post model
│   │   ├── Freelancer.js       # Freelancer model
│   │   ├── Job.js              # Job model
│   │   └── Message.js          # Message/Conversation models
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   ├── posts.js            # Post routes
│   │   ├── freelancers.js      # Freelancer routes
│   │   ├── jobs.js             # Job routes
│   │   ├── messages.js         # Message routes
│   │   ├── users.js            # User routes
│   │   └── categories.js       # Category routes
│   └── middleware/
│       └── auth.js             # Authentication middleware
├── src/
│   ├── services/
│   │   └── api.js              # Frontend API service
│   └── components/             # React components
├── .env                        # Frontend environment variables
└── package.json                # Frontend dependencies
```

## 🚀 Getting Started

### Step 1: Install MongoDB

**Ubuntu/Linux:**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongod
sudo systemctl enable mongod
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
Download from: https://www.mongodb.com/try/download/community

### Step 2: Setup Backend

```bash
# Navigate to server directory
cd server

# Run the setup script (Linux/macOS)
./setup.sh

# OR manually:
npm install
```

### Step 3: Start the Backend Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:5000`

### Step 4: Start the Frontend

```bash
# From the root directory
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🔌 API Integration

### Frontend API Service

A complete API service has been created at `src/services/api.js` with methods for:

```javascript
import api from './services/api'

// Authentication
await api.register({ username, email, password, ... })
await api.login({ usernameOrEmail, password })
await api.getCurrentUser()
api.logout()

// Posts
await api.getPosts({ category, type, search, page })
await api.getPost(id)
await api.createPost({ type, title, content, category })
await api.upvotePost(id)
await api.addReply(id, content)

// Freelancers
await api.getFreelancers({ search, category, availability })
await api.getFreelancer(id)
await api.createOrUpdateFreelancerProfile({ ... })

// Jobs
await api.getJobs({ category, type, location })
await api.createJob({ ... })
await api.applyForJob(id, { coverLetter, resume })

// Messages
await api.getConversations()
await api.sendMessage(conversationId, content)
```

### Example Usage in Components

```javascript
import { useEffect, useState } from 'react'
import api from '../services/api'

function Dashboard() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPosts() {
      try {
        const { posts } = await api.getPosts()
        setPosts(posts)
      } catch (error) {
        console.error('Failed to load posts:', error)
      } finally {
        setLoading(false)
      }
    }
    loadPosts()
  }, [])

  // ... rest of component
}
```

## 🔐 Authentication Flow

1. **Registration**: User signs up → Password hashed → JWT token issued
2. **Login**: Credentials verified → JWT token issued → Token stored in localStorage
3. **Protected Routes**: Token sent in Authorization header → Server verifies → Request processed
4. **Logout**: Token removed from localStorage

## 🧪 Testing the API

### Using curl

```bash
# Health check
curl http://localhost:5000/api/health

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usernameOrEmail": "testuser",
    "password": "password123"
  }'

# Get posts (replace TOKEN with actual token)
curl http://localhost:5000/api/posts \
  -H "Authorization: Bearer TOKEN"
```

### Using Browser DevTools

1. Open browser console on the frontend
2. The API service is available:
```javascript
// In browser console
const { default: api } = await import('./src/services/api.js')

// Register a user
await api.register({
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123'
})

// Get posts
const { posts } = await api.getPosts()
console.log(posts)
```

## 📊 Next Steps

### 1. Update Components to Use Real Data

Replace mock data and localStorage with API calls:

**Example - Dashboard.jsx:**
```javascript
import api from '../services/api'

// Replace this:
const [recentPosts, setRecentPosts] = useState(mockPosts)

// With this:
useEffect(() => {
  async function loadPosts() {
    const { posts } = await api.getPosts()
    setRecentPosts(posts)
  }
  loadPosts()
}, [])
```

### 2. Implement Authentication Context

Create a context to manage user authentication state across the app.

### 3. Add Loading and Error States

Handle loading states and errors gracefully in your components.

### 4. Implement Real-time Features

Consider adding Socket.io for real-time messages and notifications.

## 🔧 Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# View MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Restart MongoDB
sudo systemctl restart mongod
```

### Port Already in Use
Change the PORT in `server/.env`:
```
PORT=5001
```

### CORS Errors
The server is configured to allow all origins. If you still face issues, check the CORS configuration in `server/server.js`.

## 📝 Environment Variables

**Frontend (.env):**
```
VITE_API_URL=http://localhost:5000/api
```

**Backend (server/.env):**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/maarifahub
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
```

## 🎯 Features Implemented

✅ User authentication (register, login, JWT)
✅ Password hashing with bcryptjs
✅ Protected API routes
✅ Complete CRUD operations for posts
✅ Freelancer profiles and reviews
✅ Job listings and applications
✅ Messaging system
✅ User profiles
✅ Search and filtering
✅ Upvoting system
✅ Reply/comment system

## 🚀 Ready to Use!

Your application is now ready to work with real data. Start both servers and test the functionality:

1. **Start MongoDB**: `sudo systemctl start mongod`
2. **Start Backend**: `cd server && npm run dev`
3. **Start Frontend**: `npm run dev`
4. **Visit**: http://localhost:5173

The frontend will communicate with the backend, and all data will be stored in MongoDB!
