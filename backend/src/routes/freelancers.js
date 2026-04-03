import express from 'express';

const router = express.Router();

// Freelancers endpoints
router.post('/', (req, res) => {
  res.json({ message: 'Create freelancer profile' });
});

router.get('/', (req, res) => {
  res.json({ message: 'Get all freelancers' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get freelancer by ID' });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Update freelancer' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete freelancer' });
});

export default router;
