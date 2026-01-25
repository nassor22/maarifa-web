import express from 'express';
import { Op } from 'sequelize';
import Post from '../models/Post.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
  try {
    const { category, type, search, page = 1, limit = 20 } = req.query;
    
    let where = {};
    
    if (category) {
      where.category = category;
    }
    
    if (type) {
      where.type = type;
    }
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    const posts = await Post.findAll({
      where,
      include: [{
        model: User,
        as: 'author',
        attributes: ['username', 'email', 'isVerified', 'reputation']
      }],
      order: [['createdAt', 'DESC']],
      limit: limit * 1,
      offset: (page - 1) * limit
    });
    
    const count = await Post.count({ where });
    
    res.json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['username', 'email', 'isVerified', 'reputation']
        },
        {
          model: User,
          as: 'replyAuthor',
          through: { attributes: [] },
          attributes: ['username', 'email', 'isVerified', 'reputation']
        }
      ]
    });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Increment views
    post.views += 1;
    await post.save();
    
    res.json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create post
router.post('/', authenticate, async (req, res) => {
  try {
    const { type, title, content, category, tags } = req.body;
    
    const post = await Post.create({
      type,
      title,
      content,
      category,
      tags: tags || [],
      authorId: req.user.id
    });
    
    await post.reload({
      include: [{
        model: User,
        as: 'author',
        attributes: ['username', 'email', 'isVerified', 'reputation']
      }]
    });
    
    res.status(201).json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update post
router.put('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if user is the author
    if (post.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const { title, content, category, tags } = req.body;
    
    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    post.tags = tags || post.tags;
    post.updatedAt = new Date();
    
    await post.save();
    
    res.json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete post
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if user is the author
    if (post.authorId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    await post.destroy();
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Upvote post
router.post('/:id/upvote', authenticate, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const userId = req.user.id;
    
    // Remove from downvotes if exists
    post.downvotedBy = post.downvotedBy.filter(id => id !== userId);
    
    // Toggle upvote
    if (post.upvotedBy.includes(userId)) {
      post.upvotedBy = post.upvotedBy.filter(id => id !== userId);
    } else {
      post.upvotedBy.push(userId);
    }
    
    post.upvotes = post.upvotedBy.length;
    post.downvotes = post.downvotedBy.length;
    
    await post.save();
    
    res.json({ upvotes: post.upvotes, downvotes: post.downvotes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add reply
router.post('/:id/replies', authenticate, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const { content } = req.body;
    
    post.replies.push({
      author: req.user.id,
      content
    });
    
    await post.save();
    await post.reload({
      include: [{
        model: User,
        as: 'replyAuthor',
        through: { attributes: [] },
        attributes: ['username', 'email', 'isVerified', 'reputation']
      }]
    });
    
    res.status(201).json({ replies: post.replies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
