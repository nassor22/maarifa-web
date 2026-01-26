# PostgreSQL Migration Guide

This document provides instructions for migrating from MongoDB to PostgreSQL for the MaarifaHub backend.

## Overview

The backend has been updated to use PostgreSQL with Sequelize ORM instead of MongoDB with Mongoose. All models have been converted to Sequelize models with appropriate data types and relationships.

## What Changed

### Dependencies
- **Removed**: `mongoose`, `mongodb`
- **Added**: `sequelize`, `pg`, `pg-hstore`

### Models
All models have been converted from Mongoose schemas to Sequelize models:
- `User.js` - User accounts with authentication
- `Post.js` - Community posts (questions, information, opinions, knowledge)
- `Job.js` - Job postings
- `Freelancer.js` - Freelancer profiles
- `Message.js` - Messages and conversations
- `Session.js` - User sessions
- `LoginAttempt.js` - Login attempt tracking

### Database Configuration
- MongoDB connection string (`MONGODB_URI`) replaced with PostgreSQL connection string (`DATABASE_URL`)
- Format: `postgresql://username:password@host:port/database`

### Data Type Conversions
- MongoDB ObjectId → PostgreSQL UUID (with uuid-ossp extension)
- MongoDB Arrays → PostgreSQL ARRAY type
- MongoDB embedded documents → PostgreSQL JSONB type
- MongoDB text indexes → PostgreSQL full-text search indexes

## Installation Steps

### 1. Install PostgreSQL

#### On Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

#### On macOS:
```bash
brew install postgresql@16
brew services start postgresql@16
```

#### On Windows:
Download from [PostgreSQL Official Website](https://www.postgresql.org/download/windows/)

### 2. Create Database

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE maarifahub;
CREATE USER admin WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE maarifahub TO admin;

# Exit PostgreSQL
\q
```

### 3. Update Environment Variables

Copy the example file and update it:
```bash
cd server
cp .env.example .env
```

Edit `.env` and set:
```
DATABASE_URL=postgresql://admin:your_secure_password@localhost:5432/maarifahub
```

### 4. Install Dependencies

```bash
cd server
npm install
```

### 5. Run Database Migration

You can either:

**Option A: Use SQL script (recommended for production)**
```bash
psql -U admin -d maarifahub -f migrations/init.sql
```

**Option B: Use Sequelize auto-sync (only for development)**
The application will automatically sync the schema when `NODE_ENV=development` on first run.

### 6. Start the Server

```bash
npm start
```

## Docker Deployment

The docker-compose files have been updated to use PostgreSQL instead of MongoDB.

### Local Development:
```bash
docker-compose up -d
```

### Digital Ocean Deployment:
```bash
docker-compose -f docker-compose.digitalocean.yml up -d
```

## Data Migration

If you have existing data in MongoDB that needs to be migrated:

### 1. Export from MongoDB

```bash
# Export all collections
mongoexport --db=maarifahub --collection=users --out=users.json
mongoexport --db=maarifahub --collection=posts --out=posts.json
mongoexport --db=maarifahub --collection=jobs --out=jobs.json
mongoexport --db=maarifahub --collection=freelancers --out=freelancers.json
mongoexport --db=maarifahub --collection=messages --out=messages.json
mongoexport --db=maarifahub --collection=conversations --out=conversations.json
mongoexport --db=maarifahub --collection=sessions --out=sessions.json
mongoexport --db=maarifahub --collection=loginattempts --out=loginattempts.json
```

### 2. Transform and Import to PostgreSQL

You'll need to create a custom migration script to:
1. Transform MongoDB ObjectIds to UUIDs
2. Convert embedded documents to JSONB
3. Map field names (e.g., `author` → `authorId`)
4. Handle date formats

Example Node.js script structure:
```javascript
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { User, Post } from './server/models/index.js';

async function migrateData() {
  // Read MongoDB exports
  const users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
  const posts = JSON.parse(fs.readFileSync('posts.json', 'utf8'));
  
  // Create ID mapping
  const userIdMap = {};
  
  // Migrate users
  for (const user of users) {
    const newId = uuidv4();
    userIdMap[user._id] = newId;
    
    await User.create({
      id: newId,
      username: user.username,
      email: user.email,
      password: user.password, // Already hashed
      // ... map other fields
    });
  }
  
  // Migrate posts
  for (const post of posts) {
    await Post.create({
      id: uuidv4(),
      title: post.title,
      content: post.content,
      authorId: userIdMap[post.author],
      // ... map other fields
    });
  }
}

migrateData();
```

## Model Relationships

Sequelize relationships are defined in `server/models/index.js`:

- User → Posts (one-to-many)
- User → Jobs (one-to-many)
- User → Freelancer Profile (one-to-one)
- User → Sessions (one-to-many)
- User → Messages (one-to-many)
- Conversation → Messages (one-to-many)

## Query Changes

### Before (Mongoose):
```javascript
// Find user by email
const user = await User.findOne({ email });

// Find posts by author
const posts = await Post.find({ author: userId }).populate('author');

// Create post
const post = new Post({ title, content, author: userId });
await post.save();
```

### After (Sequelize):
```javascript
// Find user by email
const user = await User.findOne({ where: { email } });

// Find posts by author with user details
const posts = await Post.findAll({ 
  where: { authorId: userId },
  include: [{ model: User, as: 'author' }]
});

// Create post
const post = await Post.create({ title, content, authorId: userId });
```

## Important Notes

1. **UUIDs**: All primary keys now use UUIDs instead of MongoDB ObjectIds
2. **Timestamps**: Sequelize automatically handles `createdAt` and `updatedAt`
3. **JSONB**: Complex nested structures (like replies, reviews, portfolio) are stored as JSONB
4. **Arrays**: PostgreSQL native arrays are used for simple lists (tags, skills, expertise)
5. **Full-text search**: PostgreSQL full-text search replaces MongoDB text indexes

## Troubleshooting

### Connection Issues
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -U admin -d maarifahub -c "SELECT version();"
```

### Permission Errors
```sql
-- Grant all privileges on schema
GRANT ALL ON SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin;
```

### SSL Connection Required
For production databases (Railway, Heroku, etc.), ensure SSL is enabled:
```
DATABASE_URL=postgresql://user:pass@host:port/db?sslmode=require
```

## Resources

- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [PostgreSQL vs MongoDB](https://www.postgresql.org/about/)

## Rollback

If you need to rollback to MongoDB:

1. Restore from backup
2. Checkout previous commit: `git checkout <previous-commit>`
3. Reinstall dependencies: `npm install`
4. Update .env with MongoDB connection string
5. Restart server
