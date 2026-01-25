import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import User from '../models/User.js';
import LoginAttempt from '../models/LoginAttempt.js';
import Session from '../models/Session.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Helper function to get client IP
const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.connection.remoteAddress ||
         req.socket.remoteAddress ||
         req.ip || 
         'unknown';
};

// Helper function to get user agent
const getUserAgent = (req) => {
  return req.headers['user-agent'] || 'unknown';
};

// Helper function to check rate limiting
const checkRateLimit = async (email, maxAttempts = 5, timeWindowMs = 15 * 60 * 1000) => {
  const recentAttempts = await LoginAttempt.count({
    where: {
      email: email.toLowerCase(),
      success: false,
      timestamp: { [Op.gt]: new Date(Date.now() - timeWindowMs) }
    }
  });
  
  return recentAttempts >= maxAttempts;
};

// Helper function to log login attempt
const logLoginAttempt = async (email, ipAddress, userAgent, success, reason) => {
  try {
    await LoginAttempt.create({
      email: email.toLowerCase(),
      ipAddress,
      userAgent,
      success,
      reason
    });
  } catch (error) {
    console.error('Error logging login attempt:', error);
  }
};

// Register
router.post('/register',
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Username must be between 3 and 30 characters')
      .matches(/^[a-zA-Z0-9_-]+$/)
      .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please enter a valid email')
      .isLength({ max: 255 })
      .withMessage('Email is too long'),
    body('password')
      .isLength({ min: 8, max: 128 })
      .withMessage('Password must be between 8 and 128 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('role')
      .optional()
      .isIn(['community_member', 'verified_expert_individual', 'verified_expert_org'])
      .withMessage('Invalid role'),
    body('phone')
      .optional()
      .trim()
      .matches(/^\+?[1-9]\d{1,14}$/)
      .withMessage('Invalid phone number'),
    body('countryCode')
      .optional()
      .trim()
      .matches(/^\+\d{1,3}$/)
      .withMessage('Invalid country code')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password, countryCode, phone, role } = req.body;

      // Check if user already exists
      let user = await User.findOne({ 
        where: {
          [Op.or]: [
            { email: email.toLowerCase() },
            { username: username.toLowerCase() }
          ]
        }
      });
      
      if (user) {
        const field = user.email === email.toLowerCase() ? 'email' : 'username';
        return res.status(409).json({ error: `This ${field} is already registered` });
      }

      // Check for spam registrations from same IP
      const recentRegistrations = await User.count({
        where: {
          createdAt: { [Op.gt]: new Date(Date.now() - 60 * 60 * 1000) }
        }
      });
      
      if (recentRegistrations > 100) {
        return res.status(429).json({ error: 'Too many registrations. Please try again later.' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      user = await User.create({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password: hashedPassword,
        countryCode: countryCode || '+254',
        phone: phone || null,
        role: role || 'community_member'
      });

      // Create JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      // Create session record
      await Session.create({
        userId: user.id,
        token,
        ipAddress: getClientIp(req),
        userAgent: getUserAgent(req),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          reputation: user.reputation,
          isVerified: user.isVerified
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Server error during registration' });
    }
  }
);

// Login
router.post('/login',
  [
    body('usernameOrEmail')
      .trim()
      .notEmpty()
      .withMessage('Username or email is required'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 1 })
      .withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { usernameOrEmail, password } = req.body;
      const ipAddress = getClientIp(req);
      const userAgent = getUserAgent(req);
      const emailLower = usernameOrEmail.toLowerCase();

      // Check rate limiting
      const isRateLimited = await checkRateLimit(emailLower);
      if (isRateLimited) {
        await logLoginAttempt(emailLower, ipAddress, userAgent, false, 'invalid_credentials');
        return res.status(429).json({ 
          error: 'Too many failed login attempts. Please try again in 15 minutes or reset your password.' 
        });
      }

      // Find user by email or username
      const user = await User.findOne({
        where: {
          [Op.or]: [
            { email: emailLower },
            { username: usernameOrEmail }
          ]
        }
      });

      if (!user) {
        await logLoginAttempt(emailLower, ipAddress, userAgent, false, 'invalid_email');
        return res.status(401).json({ 
          error: 'Invalid username/email or password' 
        });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        await logLoginAttempt(user.email, ipAddress, userAgent, false, 'invalid_credentials');
        return res.status(401).json({ 
          error: 'Invalid username/email or password' 
        });
      }

      // Create JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      // Create session record
      await Session.create({
        userId: user.id,
        token,
        ipAddress,
        userAgent,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      // Log successful login
      await logLoginAttempt(user.email, ipAddress, userAgent, true, 'success');

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          reputation: user.reputation,
          isVerified: user.isVerified
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Server error during login' });
    }
  }
);

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        reputation: req.user.reputation,
        isVerified: req.user.isVerified,
        bio: req.user.bio,
        location: req.user.location,
        expertise: req.user.expertise
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
