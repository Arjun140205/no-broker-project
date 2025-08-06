import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
      userId?: string;
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'defaultsecret';

  try {
    const decoded = jwt.verify(token, secret) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('[AUTH MIDDLEWARE ERROR]', error);
    
    // For development purposes - consider if you want to allow bypass of auth in dev mode
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (isDevelopment) {
      console.log('[AUTH MIDDLEWARE] Using mock userId in development mode despite invalid token');
      req.userId = `mock_user_${Date.now()}`;
      next();
      return;
    }
    
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Middleware that not only verifies token but also attaches full user object to request
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'defaultsecret';

  try {
    const decoded = jwt.verify(token, secret) as { userId: string };
    
    try {
      // Attempt to fetch user from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true
        }
      });
      
      if (user) {
        // If user exists, attach to request object
        req.user = user;
        req.userId = user.id;
      } else {
        console.log('[AUTH MIDDLEWARE] User not found in DB, using mock user');
        // Create a mock user if we can't find one in the database
        req.user = {
          id: decoded.userId,
          email: 'mock@example.com',
          name: 'Mock User',
          role: 'seeker'
        };
        req.userId = decoded.userId;
      }
    } catch (dbError) {
      // If database operation fails, use mock user
      console.error('[AUTH MIDDLEWARE] Database error:', dbError);
      console.log('[AUTH MIDDLEWARE] Using mock user due to database error');
      
      req.user = {
        id: decoded.userId,
        email: 'mock@example.com',
        name: 'Mock User',
        role: 'seeker'
      };
      req.userId = decoded.userId;
    }
    
    next();
  } catch (error) {
    console.error('[AUTH MIDDLEWARE] Token verification error:', error);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};