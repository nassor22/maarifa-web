import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Freelancer = sequelize.define('Freelancer', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  hourlyRate: {
    type: DataTypes.JSONB,
    defaultValue: { currency: 'USD' },
  },
  availability: {
    type: DataTypes.ENUM('Available', 'Busy', 'Not Available'),
    defaultValue: 'Available',
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0,
  },
  reviews: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  completedProjects: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  portfolio: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
}, {
  timestamps: true,
  tableName: 'freelancers',
});

export default Freelancer;
