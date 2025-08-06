import express, { Response } from 'express';
import { register, login } from '../controllers/authController';
import { protect, authenticateToken } from '../middleware/authMiddleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface AuthenticatedRequest extends express.Request {
  userId?: string;
}

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, async (req, res: Response) => {
  try {
    // For development, return a mock user response regardless of authentication
    console.log('MOCK /me ENDPOINT');
    
    // Extract token from request if available
    const authHeader = req.headers.authorization;
    let mockUserId = `user_${Date.now()}`;
    
    // If we have a token, try to extract the userId from it
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        // This is a simplified approach - in reality, you'd verify the token properly
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        if (payload.userId) {
          mockUserId = payload.userId;
        }
      } catch (e) {
        // If token parsing fails, just use the default mockUserId
      }
    }
    
    return res.json({
      id: mockUserId,
      name: "Mock User",
      email: "mock@example.com",
      role: "seeker",
      _debug: {
        mock: true,
        message: "This is a mock /me endpoint response for development purposes",
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('[GET /me error]', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;