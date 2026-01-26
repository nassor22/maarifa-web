import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import freelancerRoutes from './routes/freelancers.js';
import jobRoutes from './routes/jobs.js';
import messageRoutes from './routes/messages.js';
import categoryRoutes from './routes/categories.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Connect to PostgreSQL
connectDB();

// Middleware
// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Request logging in development
if (NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/freelancers', freelancerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/categories', categoryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'MaarifaHub API is running',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'MaarifaHub API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      posts: '/api/posts',
      users: '/api/users',
      freelancers: '/api/freelancers',
      jobs: '/api/jobs',
      messages: '/api/messages',
      categories: '/api/categories',
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      path: req.path
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Don't leak error details in production
  const errorMessage = NODE_ENV === 'production' 
    ? 'Internal Server Error' 
    : err.message || 'Internal Server Error';
  
  res.status(err.status || 500).json({
    error: {
      message: errorMessage,
      ...(NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

const server = app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`API: http://${HOST}:${PORT}/api`);
});

export default app;
