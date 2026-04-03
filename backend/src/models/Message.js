import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  readBy: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: [],
  },
}, {
  timestamps: true,
  tableName: 'messages',
});

export default Message;
