import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import authenticate from '../middleware/authenticate.js';

const router = express.Router();

router.post('/', authenticate, createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);

export default router;
