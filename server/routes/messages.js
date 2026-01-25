import express from 'express';
import { Op } from 'sequelize';
import { Message, Conversation } from '../models/Message.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get user conversations
router.get('/conversations', authenticate, async (req, res) => {
  try {
    const conversations = await Conversation.findAll({
      where: {
        participants: { [Op.contains]: [req.user.id] }
      },
      include: [
        {
          model: User,
          as: 'participants',
          attributes: ['username', 'email']
        },
        {
          model: Message,
          as: 'lastMessage'
        }
      ],
      order: [['updatedAt', 'DESC']]
    });
    
    res.json({ conversations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get messages in a conversation
router.get('/conversations/:id', authenticate, async (req, res) => {
  try {
    const conversation = await Conversation.findByPk(req.params.id);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    // Check if user is participant
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const messages = await Message.findAll({
      where: { conversationId: req.params.id },
      include: [{
        model: User,
        as: 'sender',
        attributes: ['username', 'email']
      }],
      order: [['createdAt', 'ASC']]
    });
    
    res.json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send message
router.post('/conversations/:id/messages', authenticate, async (req, res) => {
  try {
    const conversation = await Conversation.findByPk(req.params.id);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    // Check if user is participant
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const { content } = req.body;
    
    const message = await Message.create({
      conversationId: req.params.id,
      senderId: req.user.id,
      content,
      readBy: [req.user.id]
    });
    
    conversation.lastMessageId = message.id;
    conversation.updatedAt = new Date();
    await conversation.save();
    
    await message.reload({
      include: [{
        model: User,
        as: 'sender',
        attributes: ['username', 'email']
      }]
    });
    
    res.status(201).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create conversation
router.post('/conversations', authenticate, async (req, res) => {
  try {
    const { participantId } = req.body;
    
    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      where: {
        participants: { [Op.contains]: [req.user.id, participantId] }
      }
    });
    
    if (existingConversation) {
      return res.json({ conversation: existingConversation });
    }
    
    const conversation = await Conversation.create({
      participants: [req.user.id, participantId]
    });
    
    await conversation.reload({
      include: [{
        model: User,
        as: 'participants',
        attributes: ['username', 'email']
      }]
    });
    
    res.status(201).json({ conversation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
