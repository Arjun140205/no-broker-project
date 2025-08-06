import express from 'express';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Example protected route
router.get('/me', protect, (req, res) => {
  res.json({ message: 'You are authorized!', userId: (req as any).userId });
});

export default router;