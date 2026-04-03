import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import './models/index.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import postRoutes from './routes/posts.js';
import jobRoutes from './routes/jobs.js';
import messageRoutes from './routes/messages.js';
import freelancerRoutes from './routes/freelancers.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
let dbStatus = 'disconnected';

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/freelancers', freelancerRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: dbStatus,
  });
});

// Simple browser landing page
app.get('/', (req, res) => {
  res.status(200).send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>MaarifaHub Backend</title>
    <style>
      body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif; margin: 0; background: #0f172a; color: #e2e8f0; }
      .wrap { max-width: 820px; margin: 48px auto; padding: 24px; }
      .card { background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.25); }
      h1 { margin: 0 0 8px; font-size: 28px; }
      p { margin: 8px 0; color: #cbd5f5; }
      code { background: #0b1220; padding: 2px 6px; border-radius: 6px; }
      a { color: #60a5fa; text-decoration: none; }
      .grid { display: grid; gap: 12px; margin-top: 16px; }
      .item { background: #0b1220; border: 1px solid #1f2937; padding: 12px; border-radius: 10px; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="card">
        <h1>MaarifaHub Backend</h1>
        <p>Status: <strong>Running</strong></p>
        <p>Health check: <a href="/api/health">/api/health</a></p>
        <div class="grid">
          <div class="item"><code>POST /api/auth/register</code></div>
          <div class="item"><code>POST /api/auth/login</code></div>
          <div class="item"><code>GET /api/users</code></div>
          <div class="item"><code>GET /api/posts</code></div>
          <div class="item"><code>GET /api/jobs</code></div>
          <div class="item"><code>GET /api/freelancers</code></div>
        </div>
      </div>
    </div>
  </body>
</html>`);
});

// Server start (always starts)
app.listen(PORT, () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
  console.log(`API: http://0.0.0.0:${PORT}/api`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  if (!process.env.JWT_SECRET) {
    console.warn('JWT_SECRET is not set. Auth endpoints will fail until it is configured.');
  }
});

// Database sync (non-blocking)
const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    dbStatus = 'connected';
    console.log('PostgreSQL Connected: Database authenticated successfully');

    await sequelize.sync({ alter: true });
    console.log('Database synchronized');
  } catch (error) {
    dbStatus = 'error';
    console.error('Unable to connect to the database:', error);
  }
};

connectDatabase();

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

export default app;
