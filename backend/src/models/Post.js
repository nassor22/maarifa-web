import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM('question', 'information', 'opinion', 'knowledge'),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  upvotes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  downvotes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  upvotedBy: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: [],
  },
  downvotedBy: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: [],
  },
  replies: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  isResolved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
  tableName: 'posts',
});

export default Post;
