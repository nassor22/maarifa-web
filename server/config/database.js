import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

// Load environment variables before initializing Sequelize
dotenv.config();

const useSsl = process.env.DB_SSL === 'true' || (process.env.NODE_ENV === 'production' && process.env.DB_SSL !== 'false');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 2,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: useSsl ? {
      require: true,
      rejectUnauthorized: false
    } : false
  }
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected: Database authenticated successfully');
    
    // Sync models in development (use migrations in production)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database synchronized');
    }
  } catch (error) {
    console.error(`PostgreSQL connection failed: ${error.message}`);
    process.exit(1);
  }
};

export { sequelize, connectDB };
export default connectDB;
