import User from './User.js';
import Post from './Post.js';
import Job from './Job.js';
import Freelancer from './Freelancer.js';
import Message from './Message.js';
import Conversation from './Conversation.js';

// Define associations
User.hasMany(Post, { foreignKey: 'authorId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

User.hasMany(Job, { foreignKey: 'postedById', as: 'jobsPosted' });
Job.belongsTo(User, { foreignKey: 'postedById', as: 'postedBy' });

User.hasOne(Freelancer, { foreignKey: 'userId', as: 'freelancerProfile' });
Freelancer.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });

export { User, Post, Job, Freelancer, Message, Conversation };
