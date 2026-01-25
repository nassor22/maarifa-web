import express from 'express';
import { Op } from 'sequelize';
import Freelancer from '../models/Freelancer.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all freelancers
router.get('/', async (req, res) => {
  try {
    const { search, category, availability, page = 1, limit = 20 } = req.query;
    
    let where = {};
    
    if (category) {
      where.category = category;
    }
    
    if (availability) {
      where.availability = availability;
    }
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { skills: { [Op.overlap]: [search] } }
      ];
    }
    
    const freelancers = await Freelancer.findAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'email', 'location', 'isVerified']
      }],
      order: [['rating', 'DESC'], ['completedProjects', 'DESC']],
      limit: limit * 1,
      offset: (page - 1) * limit
    });
    
    const count = await Freelancer.count({ where });
    
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
    const freelancer = await Freelancer.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username', 'email', 'location', 'isVerified', 'reputation']
        },
        {
          model: User,
          as: 'reviewer',
          through: { attributes: [] },
          attributes: ['username']
        }
      ]
    });
    
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
    
    let freelancer = await Freelancer.findOne({ where: { userId: req.user.id } });
    
    if (freelancer) {
      // Update existing
      freelancer.title = title || freelancer.title;
      freelancer.category = category || freelancer.category;
      freelancer.description = description || freelancer.description;
      freelancer.skills = skills || freelancer.skills;
      freelancer.hourlyRate = hourlyRate || freelancer.hourlyRate;
      freelancer.availability = availability || freelancer.availability;
      freelancer.portfolio = portfolio || freelancer.portfolio;
      freelancer.updatedAt = new Date();
      await freelancer.save();
    } else {
      // Create new
      freelancer = await Freelancer.create({
        userId: req.user.id,
        title,
        category,
        description,
        skills,
        hourlyRate,
        availability: availability || 'Available',
        portfolio: portfolio || []
      });
    }
    
    await freelancer.reload({
      include: [{
        model: User,
        as: 'user',
        attributes: ['username', 'email', 'location', 'isVerified']
      }]
    });
    
    res.json({ freelancer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add review
router.post('/:id/reviews', authenticate, async (req, res) => {
  try {
    const freelancer = await Freelancer.findByPk(req.params.id);
    
    if (!freelancer) {
      return res.status(404).json({ error: 'Freelancer not found' });
    }
    
    const { rating, comment } = req.body;
    
    // Check if user already reviewed
    const existingReview = freelancer.reviews.find(
      r => r.reviewer === req.user.id
    );
    
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this freelancer' });
    }
    
    freelancer.reviews.push({
      reviewer: req.user.id,
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
