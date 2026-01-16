import express from 'express';
import Freelancer from '../models/Freelancer.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all freelancers
router.get('/', async (req, res) => {
  try {
    const { search, category, availability, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (availability) {
      query.availability = availability;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const freelancers = await Freelancer.find(query)
      .populate('user', 'username email location isVerified')
      .sort({ rating: -1, completedProjects: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const count = await Freelancer.countDocuments(query);
    
    res.json({
      freelancers,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single freelancer
router.get('/:id', async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.params.id)
      .populate('user', 'username email location isVerified reputation')
      .populate('reviews.reviewer', 'username');
    
    if (!freelancer) {
      return res.status(404).json({ error: 'Freelancer not found' });
    }
    
    res.json({ freelancer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create/Update freelancer profile
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, category, description, skills, hourlyRate, availability, portfolio } = req.body;
    
    let freelancer = await Freelancer.findOne({ user: req.user._id });
    
    if (freelancer) {
      // Update existing
      freelancer.title = title || freelancer.title;
      freelancer.category = category || freelancer.category;
      freelancer.description = description || freelancer.description;
      freelancer.skills = skills || freelancer.skills;
      freelancer.hourlyRate = hourlyRate || freelancer.hourlyRate;
      freelancer.availability = availability || freelancer.availability;
      freelancer.portfolio = portfolio || freelancer.portfolio;
      freelancer.updatedAt = Date.now();
    } else {
      // Create new
      freelancer = new Freelancer({
        user: req.user._id,
        title,
        category,
        description,
        skills,
        hourlyRate,
        availability: availability || 'Available',
        portfolio: portfolio || []
      });
    }
    
    await freelancer.save();
    await freelancer.populate('user', 'username email location isVerified');
    
    res.json({ freelancer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add review
router.post('/:id/reviews', authenticate, async (req, res) => {
  try {
    const freelancer = await Freelancer.findById(req.params.id);
    
    if (!freelancer) {
      return res.status(404).json({ error: 'Freelancer not found' });
    }
    
    const { rating, comment } = req.body;
    
    // Check if user already reviewed
    const existingReview = freelancer.reviews.find(
      r => r.reviewer.toString() === req.user._id.toString()
    );
    
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this freelancer' });
    }
    
    freelancer.reviews.push({
      reviewer: req.user._id,
      rating,
      comment
    });
    
    // Update average rating
    const totalRating = freelancer.reviews.reduce((sum, r) => sum + r.rating, 0);
    freelancer.rating = totalRating / freelancer.reviews.length;
    
    await freelancer.save();
    
    res.status(201).json({ freelancer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
