import { sequelize } from '../config/database.js';
import User from './User.js';
import Post from './Post.js';
import Job from './Job.js';
import Freelancer from './Freelancer.js';
import { Message, Conversation } from './Message.js';
import Session from './Session.js';
import LoginAttempt from './LoginAttempt.js';

// Define relationships
// User has many Posts
User.hasMany(Post, { foreignKey: 'authorId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

// User has many Jobs posted
User.hasMany(Job, { foreignKey: 'postedById', as: 'jobsPosted' });
Job.belongsTo(User, { foreignKey: 'postedById', as: 'postedBy' });

// User has one Freelancer profile
User.hasOne(Freelancer, { foreignKey: 'userId', as: 'freelancerProfile' });
Freelancer.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User has many Sessions
User.hasMany(Session, { foreignKey: 'userId', as: 'sessions' });
Session.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Conversation has many Messages
Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });

// User sends many Messages
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

export {
  sequelize,
  User,
  Post,
  Job,
  Freelancer,
  Message,
  Conversation,
  Session,
  LoginAttempt
};
