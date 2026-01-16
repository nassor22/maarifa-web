import express from 'express';
import { Message, Conversation } from '../models/Message.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get user conversations
router.get('/conversations', authenticate, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
      .populate('participants', 'username email')
      .populate('lastMessage')
      .sort({ updatedAt: -1 });
    
    res.json({ conversations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get messages in a conversation
router.get('/conversations/:id', authenticate, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    // Check if user is participant
    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const messages = await Message.find({ conversation: req.params.id })
      .populate('sender', 'username email')
      .sort({ createdAt: 1 });
    
    res.json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send message
router.post('/conversations/:id/messages', authenticate, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    // Check if user is participant
    if (!conversation.participants.includes(req.user._id)) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    const { content } = req.body;
    
    const message = new Message({
      conversation: req.params.id,
      sender: req.user._id,
      content,
      readBy: [req.user._id]
    });
    
    await message.save();
    
    conversation.lastMessage = message._id;
    conversation.updatedAt = Date.now();
    await conversation.save();
    
    await message.populate('sender', 'username email');
    
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
      participants: { $all: [req.user._id, participantId] }
    });
    
    if (existingConversation) {
      return res.json({ conversation: existingConversation });
    }
    
    const conversation = new Conversation({
      participants: [req.user._id, participantId]
    });
    
    await conversation.save();
    await conversation.populate('participants', 'username email');
    
    res.status(201).json({ conversation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
