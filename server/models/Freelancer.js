import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database.js';

class Freelancer extends Model {}

Freelancer.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  hourlyRate: {
    type: DataTypes.JSONB,
    defaultValue: {
      currency: 'USD'
    }
  },
  availability: {
    type: DataTypes.ENUM('Available', 'Busy', 'Not Available'),
    defaultValue: 'Available'
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  reviews: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  completedProjects: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  portfolio: {
    type: DataTypes.JSONB,
    defaultValue: []
  }
}, {
  sequelize,
  modelName: 'Freelancer',
  tableName: 'freelancers',
  timestamps: true
});

export default Freelancer;
