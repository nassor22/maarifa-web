# Route Query Updates - Mongoose to Sequelize

This document outlines the necessary changes to update route files from Mongoose queries to Sequelize queries.

## Common Query Pattern Changes

### 1. Finding Records

#### Mongoose:
```javascript
// Find one
const user = await User.findOne({ email });
const user = await User.findOne({ email }).select('-password');

// Find by ID
const post = await Post.findById(id);

// Find many
const posts = await Post.find({ category: 'tech' });
const posts = await Post.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit);

// Count
const count = await Post.countDocuments(query);
```

#### Sequelize:
```javascript
// Find one
const user = await User.findOne({ where: { email } });
const user = await User.findOne({ 
  where: { email },
  attributes: { exclude: ['password'] }
});

// Find by ID (primary key)
const post = await Post.findByPk(id);

// Find many
const posts = await Post.findAll({ where: { category: 'tech' } });
const posts = await Post.findAll({
  where: query,
  order: [['createdAt', 'DESC']],
  offset: skip,
  limit: limit
});

// Count
const count = await Post.count({ where: query });
```

### 2. Creating Records

#### Mongoose:
```javascript
// Method 1
const user = new User({ username, email, password });
await user.save();

// Method 2
const user = await User.create({ username, email, password });
```

#### Sequelize:
```javascript
// Only one method
const user = await User.create({ username, email, password });
```

### 3. Updating Records

#### Mongoose:
```javascript
// Update and save
user.bio = 'New bio';
await user.save();

// Update one
await User.updateOne({ _id: id }, { bio: 'New bio' });

// Find and update
const user = await User.findByIdAndUpdate(id, { bio: 'New bio' }, { new: true });
```

#### Sequelize:
```javascript
// Update instance
user.bio = 'New bio';
await user.save();

// Update with where clause
await User.update({ bio: 'New bio' }, { where: { id } });

// Find, update, and return
const user = await User.findByPk(id);
user.bio = 'New bio';
await user.save();
```

### 4. Deleting Records

#### Mongoose:
```javascript
await Post.deleteOne({ _id: id });
await Post.findByIdAndDelete(id);
```

#### Sequelize:
```javascript
await Post.destroy({ where: { id } });
// Or with instance
await post.destroy();
```

### 5. Populate (Relationships)

#### Mongoose:
```javascript
// Single populate
const post = await Post.findById(id).populate('author', 'username email');

// Multiple populates
const post = await Post.findById(id)
  .populate('author', 'username email')
  .populate('replies.author', 'username');

// After query
await post.populate('author', 'username email');
```

#### Sequelize:
```javascript
// Include associations
const post = await Post.findByPk(id, {
  include: [{
    model: User,
    as: 'author',
    attributes: ['username', 'email']
  }]
});

// Nested includes (for JSONB fields, you'll need to handle differently)
// Since replies are JSONB, you'd need to fetch and populate manually

// After query - use reload with include
await post.reload({
  include: [{
    model: User,
    as: 'author',
    attributes: ['username', 'email']
  }]
});
```

### 6. Field Selection

#### Mongoose:
```javascript
// Select specific fields
const user = await User.findOne({ email }).select('username email');

// Exclude fields
const user = await User.findOne({ email }).select('-password');
```

#### Sequelize:
```javascript
// Select specific attributes
const user = await User.findOne({ 
  where: { email },
  attributes: ['username', 'email']
});

// Exclude attributes
const user = await User.findOne({ 
  where: { email },
  attributes: { exclude: ['password'] }
});
```

### 7. Complex Queries

#### Mongoose:
```javascript
// Text search
const posts = await Post.find({ $text: { $search: searchTerm } });

// Greater than / less than
const recentAttempts = await LoginAttempt.countDocuments({
  email,
  timestamp: { $gt: new Date(Date.now() - timeWindow) }
});

// In array
const jobs = await Job.find({ type: { $in: ['Full-time', 'Part-time'] } });

// All in array
const conversations = await Conversation.find({
  participants: { $all: [userId] }
});
```

#### Sequelize:
```javascript
import { Op } from 'sequelize';

// Full-text search (PostgreSQL specific)
const posts = await Post.findAll({
  where: {
    [Op.or]: [
      sequelize.literal(`to_tsvector('english', title || ' ' || content) @@ plainto_tsquery('english', '${searchTerm}')`)
    ]
  }
});

// Greater than / less than
const recentAttempts = await LoginAttempt.count({
  where: {
    email,
    timestamp: { [Op.gt]: new Date(Date.now() - timeWindow) }
  }
});

// In array
const jobs = await Job.findAll({
  where: { type: { [Op.in]: ['Full-time', 'Part-time'] } }
});

// Array contains (PostgreSQL)
const conversations = await Conversation.findAll({
  where: {
    participants: { [Op.contains]: [userId] }
  }
});
```

## Specific File Updates

### auth.js

**Lines to update:**

1. Line 27 - `countDocuments` → `count`
```javascript
// Before
const recentAttempts = await LoginAttempt.countDocuments({
  email: email.toLowerCase(),
  success: false,
  timestamp: { $gt: new Date(Date.now() - timeWindowMs) }
});

// After
import { Op } from 'sequelize';
const recentAttempts = await LoginAttempt.count({
  where: {
    email: email.toLowerCase(),
    success: false,
    timestamp: { [Op.gt]: new Date(Date.now() - timeWindowMs) }
  }
});
```

2. Lines 96-98 - `findOne`
```javascript
// Before
let user = await User.findOne({ 
  $or: [{ email: email.toLowerCase() }, { username: username }] 
});

// After
let user = await User.findOne({ 
  where: {
    [Op.or]: [
      { email: email.toLowerCase() },
      { username: username }
    ]
  }
});
```

3. Line 109 - `countDocuments`
```javascript
// Before
const recentRegistrations = await User.countDocuments({
  createdAt: { $gt: new Date(Date.now() - 3600000) }
});

// After
const recentRegistrations = await User.count({
  where: {
    createdAt: { [Op.gt]: new Date(Date.now() - 3600000) }
  }
});
```

### posts.js

**Lines to update:**

1. `find` → `findAll` with includes
```javascript
// Before
const posts = await Post.find(query)
  .populate('author', 'username email isVerified reputation')
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);

// After
const posts = await Post.findAll({
  where: query,
  include: [{
    model: User,
    as: 'author',
    attributes: ['username', 'email', 'isVerified', 'reputation']
  }],
  order: [['createdAt', 'DESC']],
  offset: skip,
  limit: limit
});
```

2. Field references: `author` → `authorId`

### jobs.js

Similar patterns to posts.js - replace `find` with `findAll`, use `include` for populate, change `postedBy` to `postedById`.

### freelancers.js

1. Replace `user` reference field with `userId`
2. For nested populates in JSONB (reviews.reviewer), you'll need to manually fetch and hydrate

### messages.js

Complex updates needed:
- `find` → `findAll`
- Array queries for participants
- JSONB handling

## Key Differences to Remember

1. **Field Names**: 
   - MongoDB: `author`, `postedBy`, `user` (ObjectId)
   - PostgreSQL: `authorId`, `postedById`, `userId` (UUID)

2. **Primary Keys**:
   - MongoDB: `_id`
   - PostgreSQL: `id`

3. **Operators**:
   - MongoDB: `$gt`, `$lt`, `$in`, `$or`, `$and`
   - Sequelize: `Op.gt`, `Op.lt`, `Op.in`, `Op.or`, `Op.and`

4. **Embedded Documents**:
   - MongoDB: Direct access to nested objects/arrays
   - PostgreSQL: JSONB fields require special handling

5. **Timestamps**:
   - Sequelize auto-handles `createdAt` and `updatedAt`

## Migration Priority

1. **High Priority** (breaks functionality):
   - auth.js - User authentication
   - users.js - User operations
   
2. **Medium Priority** (main features):
   - posts.js - Community posts
   - jobs.js - Job listings
   
3. **Lower Priority** (secondary features):
   - freelancers.js
   - messages.js

## Testing Checklist

After updating each route file:
- [ ] User registration works
- [ ] User login works  
- [ ] Creating records works
- [ ] Reading/listing records works
- [ ] Updating records works
- [ ] Deleting records works
- [ ] Relationships/includes work
- [ ] Search functionality works
- [ ] Pagination works
