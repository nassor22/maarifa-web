import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  participants: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'conversations',
});

export default Conversation;
