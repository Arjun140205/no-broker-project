import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  // Check if req.body exists
  if (!req.body) {
    return res.status(400).json({ message: 'Request body is missing' });
  }

  const { name, email, password, role } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ 
      message: 'Missing required fields', 
      required: ['name', 'email', 'password'],
      received: Object.keys(req.body)
    });
  }

  try {
    console.log('MOCK REGISTRATION', { name, email, role });
    
    // For development, return a mock successful registration response
    const mockUserId = `user_${Date.now()}`;
    const validRole = role === 'owner' || role === 'seeker' ? role : 'seeker';
    
    // Generate a real token using the mock userId
    const token = generateToken(mockUserId);
    
    return res.status(201).json({ 
      token, 
      user: { 
        id: mockUserId, 
        name, 
        email, 
        role: validRole 
      },
      _debug: {
        mock: true,
        message: "This is a mock registration response for development purposes",
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      message: 'Registration failed', 
      error: err instanceof Error ? err.message : String(err) 
    });
  }
};

export const login = async (req: Request, res: Response) => {
  // Check if req.body exists
  if (!req.body) {
    return res.status(400).json({ message: 'Request body is missing' });
  }

  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ 
      message: 'Missing required fields', 
      required: ['email', 'password'],
      received: Object.keys(req.body)
    });
  }

  try {
    console.log('MOCK LOGIN', { email });
    
    // For development, return a mock successful login response
    // In a real scenario, we would check credentials against the database
    const mockUserId = `user_${Date.now()}`;
    const mockName = email.split('@')[0]; // Use part of email as mock name
    
    // Generate a real token using the mock userId
    const token = generateToken(mockUserId);
    
    return res.status(200).json({ 
      token, 
      user: { 
        id: mockUserId, 
        name: mockName, 
        email, 
        role: 'seeker' // Default role for mock login
      },
      _debug: {
        mock: true,
        message: "This is a mock login response for development purposes",
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      message: 'Login failed', 
      error: err instanceof Error ? err.message : String(err) 
    });
  }
};