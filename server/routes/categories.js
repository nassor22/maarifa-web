import express from 'express';

const router = express.Router();

const categories = [
  { name: 'Health & Well-being', icon: 'heart', color: 'text-green-600', posts: 0 },
  { name: 'Finance & Business', icon: 'currency', color: 'text-blue-600', posts: 0 },
  { name: 'Education & Knowledge', icon: 'academic', color: 'text-purple-600', posts: 0 },
  { name: 'Technology', icon: 'computer', color: 'text-indigo-600', posts: 0 },
  { name: 'Law', icon: 'scale', color: 'text-red-600', posts: 0 },
  { name: 'Agriculture & Environment', icon: 'globe', color: 'text-green-500', posts: 0 },
  { name: 'Religion & Ethics', icon: 'book', color: 'text-amber-600', posts: 0 },
  { name: 'Community Development', icon: 'users', color: 'text-pink-600', posts: 0 },
  { name: 'Sports & Entertainment', icon: 'trophy', color: 'text-orange-600', posts: 0 }
];

router.get('/', (req, res) => {
  res.json({ categories });
});

export default router;
