import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class Post extends Model {}

Post.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  type: {
    type: DataTypes.ENUM('question', 'information', 'opinion', 'knowledge'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  authorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  upvotes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  downvotes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  upvotedBy: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: []
  },
  downvotedBy: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: []
  },
  replies: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  isResolved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'Post',
  tableName: 'posts',
  timestamps: true,
  indexes: [
    {
      type: 'FULLTEXT',
      name: 'posts_search_idx',
      fields: ['title', 'content']
    }
  ]
});

export default Post;
