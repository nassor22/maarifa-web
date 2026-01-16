import express from 'express';
import Job from '../models/Job.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all jobs
router.get('/', async (req, res) => {
  try {
    const { category, type, location, page = 1, limit = 20 } = req.query;
    
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    
    const jobs = await Job.find(query)
      .populate('postedBy', 'username email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const count = await Job.countDocuments(query);
    
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
    const job = await Job.findById(req.params.id)
      .populate('postedBy', 'username email');
    
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
    
    const job = new Job({
      title,
      company,
      location,
      type,
      category,
      description,
      requirements: requirements || [],
      salary,
      postedBy: req.user._id,
      expiresAt
    });
    
    await job.save();
    await job.populate('postedBy', 'username email');
    
    res.status(201).json({ job });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Apply for job
router.post('/:id/apply', authenticate, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    // Check if already applied
    const existingApplication = job.applications.find(
      app => app.applicant.toString() === req.user._id.toString()
    );
    
    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }
    
    const { coverLetter, resume } = req.body;
    
    job.applications.push({
      applicant: req.user._id,
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
