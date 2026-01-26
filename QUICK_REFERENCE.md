# Quick Reference: Mongoose to Sequelize

## Essential Imports
```javascript
import { Op } from 'sequelize';
import { sequelize } from '../config/database.js';
```

## Quick Conversions

### Find Operations
| Mongoose | Sequelize |
|----------|-----------|
| `Model.findById(id)` | `Model.findByPk(id)` |
| `Model.findOne({ email })` | `Model.findOne({ where: { email } })` |
| `Model.find({ status: 'active' })` | `Model.findAll({ where: { status: 'active' } })` |
| `Model.countDocuments(query)` | `Model.count({ where: query })` |

### Create Operations
| Mongoose | Sequelize |
|----------|-----------|
| `new Model(data); await model.save()` | `await Model.create(data)` |
| `await Model.create(data)` | `await Model.create(data)` ✅ |

### Update Operations
| Mongoose | Sequelize |
|----------|-----------|
| `model.field = value; await model.save()` | `model.field = value; await model.save()` ✅ |
| `Model.updateOne({ _id: id }, data)` | `Model.update(data, { where: { id } })` |

### Delete Operations
| Mongoose | Sequelize |
|----------|-----------|
| `Model.deleteOne({ _id: id })` | `Model.destroy({ where: { id } })` |
| `await model.remove()` | `await model.destroy()` |

### Populate/Include
| Mongoose | Sequelize |
|----------|-----------|
| `.populate('author', 'username email')` | `include: [{ model: User, as: 'author', attributes: ['username', 'email'] }]` |

### Operators
| Mongoose | Sequelize |
|----------|-----------|
| `{ age: { $gt: 18 } }` | `{ age: { [Op.gt]: 18 } }` |
| `{ age: { $gte: 18 } }` | `{ age: { [Op.gte]: 18 } }` |
| `{ age: { $lt: 65 } }` | `{ age: { [Op.lt]: 65 } }` |
| `{ age: { $lte: 65 } }` | `{ age: { [Op.lte]: 65 } }` |
| `{ status: { $in: ['active', 'pending'] } }` | `{ status: { [Op.in]: ['active', 'pending'] } }` |
| `{ $or: [{ a: 1 }, { b: 2 }] }` | `{ [Op.or]: [{ a: 1 }, { b: 2 }] }` |
| `{ $and: [{ a: 1 }, { b: 2 }] }` | `{ [Op.and]: [{ a: 1 }, { b: 2 }] }` |

### Field Names
| MongoDB | PostgreSQL |
|---------|-----------|
| `_id` | `id` |
| `author` (ObjectId) | `authorId` (UUID) |
| `postedBy` (ObjectId) | `postedById` (UUID) |
| `user` (ObjectId) | `userId` (UUID) |

### Select/Exclude Fields
| Mongoose | Sequelize |
|----------|-----------|
| `.select('username email')` | `attributes: ['username', 'email']` |
| `.select('-password')` | `attributes: { exclude: ['password'] }` |

### Sort/Order
| Mongoose | Sequelize |
|----------|-----------|
| `.sort({ createdAt: -1 })` | `order: [['createdAt', 'DESC']]` |
| `.sort({ name: 1, age: -1 })` | `order: [['name', 'ASC'], ['age', 'DESC']]` |

### Pagination
| Mongoose | Sequelize |
|----------|-----------|
| `.skip(10).limit(20)` | `offset: 10, limit: 20` |

## Complete Examples

### Authentication
```javascript
// Mongoose
const user = await User.findOne({ email }).select('-password');

// Sequelize
const user = await User.findOne({ 
  where: { email },
  attributes: { exclude: ['password'] }
});
```

### List with Population
```javascript
// Mongoose
const posts = await Post.find({ category: 'tech' })
  .populate('author', 'username email')
  .sort({ createdAt: -1 })
  .skip(0)
  .limit(10);

// Sequelize
const posts = await Post.findAll({
  where: { category: 'tech' },
  include: [{
    model: User,
    as: 'author',
    attributes: ['username', 'email']
  }],
  order: [['createdAt', 'DESC']],
  offset: 0,
  limit: 10
});
```

### Complex Query
```javascript
// Mongoose
const attempts = await LoginAttempt.countDocuments({
  email,
  success: false,
  timestamp: { $gt: new Date(Date.now() - 900000) }
});

// Sequelize
const attempts = await LoginAttempt.count({
  where: {
    email,
    success: false,
    timestamp: { [Op.gt]: new Date(Date.now() - 900000) }
  }
});
```

### Or Condition
```javascript
// Mongoose
const user = await User.findOne({
  $or: [{ email: value }, { username: value }]
});

// Sequelize
const user = await User.findOne({
  where: {
    [Op.or]: [{ email: value }, { username: value }]
  }
});
```

### Array Operations
```javascript
// Mongoose - Check if array contains all values
const conv = await Conversation.find({
  participants: { $all: [userId] }
});

// Sequelize - PostgreSQL array contains
const conv = await Conversation.findAll({
  where: {
    participants: { [Op.contains]: [userId] }
  }
});
```

### Text Search
```javascript
// Mongoose
const posts = await Post.find({ 
  $text: { $search: 'keyword' } 
});

// Sequelize (PostgreSQL)
const posts = await Post.findAll({
  where: sequelize.literal(
    `to_tsvector('english', title || ' ' || content) @@ plainto_tsquery('english', '${keyword}')`
  )
});
```

## Pro Tips

1. **Always import Op**: `import { Op } from 'sequelize';`
2. **Use `where` clause**: Sequelize requires explicit `where` for conditions
3. **Include for relations**: Use `include` array for eager loading
4. **Attributes for fields**: Use `attributes` to select/exclude fields
5. **Order is an array**: `order: [['field', 'ASC']]` not just a string
6. **findByPk for IDs**: More explicit than findOne with id
7. **Count not countDocuments**: `Model.count()` not `countDocuments()`
8. **Destroy not delete**: `Model.destroy()` not `deleteOne()`

## Common Mistakes

❌ `Model.find({ status: 'active' })`  
✅ `Model.findAll({ where: { status: 'active' } })`

❌ `Model.findOne({ email })`  
✅ `Model.findOne({ where: { email } })`

❌ `{ age: { $gt: 18 } }`  
✅ `{ age: { [Op.gt]: 18 } }`

❌ `.populate('author')`  
✅ `include: [{ model: User, as: 'author' }]`

❌ `model._id`  
✅ `model.id`

❌ `{ author: userId }`  
✅ `{ authorId: userId }`
