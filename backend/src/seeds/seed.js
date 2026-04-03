import bcryptjs from 'bcryptjs';
import sequelize from '../config/database.js';
import { User } from '../models/index.js';

const seed = async () => {
  try {
    await sequelize.authenticate();

    const existing = await User.findOne({ where: { email: 'admin@maarifahub.com' } });
    if (!existing) {
      const password = await bcryptjs.hash('Admin@123', 10);
      await User.create({
        username: 'admin',
        email: 'admin@maarifahub.com',
        password,
        role: 'admin',
        isVerified: true,
      });
      console.log('Seeded admin user');
    } else {
      console.log('Admin user already exists');
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
