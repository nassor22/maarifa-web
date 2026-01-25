import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class LoginAttempt extends Model {}

LoginAttempt.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  ipAddress: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  userAgent: {
    type: DataTypes.TEXT
  },
  success: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  reason: {
    type: DataTypes.ENUM('invalid_credentials', 'invalid_email', 'account_locked', 'success', 'other'),
    defaultValue: 'other'
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'LoginAttempt',
  tableName: 'login_attempts',
  timestamps: false,
  indexes: [
    {
      fields: ['email', 'timestamp']
    },
    {
      fields: ['ipAddress', 'timestamp']
    }
  ]
});

export default LoginAttempt;
