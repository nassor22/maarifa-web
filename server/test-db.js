#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests PostgreSQL connection and Sequelize models
 */

import { connectDB, sequelize } from './config/database.js';
import { 
  User, 
  Post, 
  Job, 
  Freelancer, 
  Message, 
  Conversation, 
  Session, 
  LoginAttempt 
} from './models/index.js';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`)
};

async function testConnection() {
  console.log('\n📊 Testing PostgreSQL Database Connection\n');
  
  try {
    // Test 1: Database Connection
    log.info('Testing database connection...');
    await connectDB();
    log.success('Database connected successfully');
    
    // Test 2: Authentication
    log.info('Authenticating with PostgreSQL...');
    await sequelize.authenticate();
    log.success('Authentication successful');
    
    // Test 3: Check models
    log.info('Checking models...');
    const models = [User, Post, Job, Freelancer, Message, Conversation, Session, LoginAttempt];
    const modelNames = ['User', 'Post', 'Job', 'Freelancer', 'Message', 'Conversation', 'Session', 'LoginAttempt'];
    
    modelNames.forEach((name, index) => {
      if (models[index]) {
        log.success(`Model ${name} loaded`);
      } else {
        log.error(`Model ${name} not found`);
      }
    });
    
    // Test 4: Check tables
    log.info('Checking database tables...');
    const tables = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
      { type: sequelize.QueryTypes.SELECT }
    );
    
    if (tables.length === 0) {
      log.warn('No tables found - run sync or migrations');
    } else {
      log.success(`Found ${tables.length} tables:`);
      tables.forEach(table => {
        console.log(`  - ${table.table_name}`);
      });
    }
    
    // Test 5: Test a simple query
    log.info('Testing simple query...');
    const userCount = await User.count();
    log.success(`User count query successful: ${userCount} users`);
    
    // Summary
    console.log('\n' + '='.repeat(50));
    log.success('All tests passed! Database is ready.');
    console.log('='.repeat(50) + '\n');
    
    // Database info
    const dbVersion = await sequelize.query('SELECT version()', { 
      type: sequelize.QueryTypes.SELECT 
    });
    log.info(`PostgreSQL Version: ${dbVersion[0].version.split(' ')[0]} ${dbVersion[0].version.split(' ')[1]}`);
    log.info(`Database: ${sequelize.config.database}`);
    log.info(`Host: ${sequelize.config.host || 'from URL'}`);
    
    process.exit(0);
    
  } catch (error) {
    console.log('\n' + '='.repeat(50));
    log.error('Database test failed!');
    console.log('='.repeat(50) + '\n');
    
    log.error(`Error: ${error.message}`);
    
    if (error.original) {
      log.error(`Original error: ${error.original.message}`);
    }
    
    console.log('\n📋 Troubleshooting:\n');
    console.log('1. Check if PostgreSQL is running:');
    console.log('   sudo systemctl status postgresql');
    console.log('\n2. Verify DATABASE_URL in .env file');
    console.log('   Format: postgresql://username:password@host:port/database');
    console.log('\n3. Check if database exists:');
    console.log('   psql -U username -l');
    console.log('\n4. Create database if needed:');
    console.log('   psql -U postgres -c "CREATE DATABASE maarifahub;"');
    console.log('\n5. Check connection permissions:');
    console.log('   psql -U username -d maarifahub -c "SELECT 1;"');
    console.log('');
    
    process.exit(1);
  }
}

// Run tests
testConnection();
