import express, { Response } from 'express';
import { register, login, logout, getCurrentUser } from '../controllers/authController';
import { protect, authenticateToken } from '../middleware/authMiddleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthenticatedRequest extends express.Request {
  userId?: string;
}

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticateToken, getCurrentUser);

export default router;