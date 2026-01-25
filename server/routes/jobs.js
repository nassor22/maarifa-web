import express from 'express';
import { Op } from 'sequelize';
import Job from '../models/Job.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const { category, type, location, page = 1, limit = 20 } = req.query;
    
    let where = { isActive: true };
    
    if (category) {
      where.category = category;
    }
    
    if (type) {
      where.type = type;
    }
    
    if (location) {
      where.location = { [Op.iLike]: `%${location}%` };
    }
    
    const jobs = await Job.findAll({
      where,
      include: [{
        model: User,
        as: 'postedBy',
        attributes: ['username', 'email']
      }],
      order: [['createdAt', 'DESC']],
      limit: limit * 1,
      offset: (page - 1) * limit
    });
    
    const count = await Job.count({ where });
    
    res.json({
      jobs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'postedBy',
        attributes: ['username', 'email']
      }]
    });
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json({ job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create job
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, company, location, type, category, description, requirements, salary, expiresAt } = req.body;
    
    const job = await Job.create({
      title,
      company,
      location,
      type,
      category,
      description,
      requirements: requirements || [],
      salary,
      postedById: req.user.id,
      expiresAt
    });
    
    await job.reload({
      include: [{
        model: User,
        as: 'postedBy',
        attributes: ['username', 'email']
      }]
    });
    
    res.status(201).json({ job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Apply for job
router.post('/:id/apply', authenticate, async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    // Check if already applied
    const existingApplication = job.applications.find(
      app => app.applicant === req.user.id
    );
    
    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }
    
    const { coverLetter, resume } = req.body;
    
    job.applications.push({
      applicant: req.user.id,
      coverLetter,
      resume
    });
    
    await job.save();
    
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
