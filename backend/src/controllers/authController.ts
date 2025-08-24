
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).json({ message: 'Request body is missing' });
  }
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: 'Missing required fields', required: ['name', 'email', 'password', 'role'] });
  }
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    // Create user
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role },
    });
    // Generate JWT
    const token = generateToken(user.id);
    return res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Registration failed', error: err instanceof Error ? err.message : String(err) });
  }
};

export const login = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).json({ message: 'Request body is missing' });
  }
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing required fields', required: ['email', 'password'] });
  }
  try {
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    // Generate JWT
    const token = generateToken(user.id);
    return res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed', error: err instanceof Error ? err.message : String(err) });
  }
};

// Simple logout controller for stateless JWT (client just deletes token)
export const logout = async (req: Request, res: Response) => {
  return res.status(200).json({ message: 'Logged out successfully' });
};

// Get current user from JWT
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // userId should be set by auth middleware
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    console.error('Get current user error:', err);
    res.status(500).json({ message: 'Failed to get current user', error: err instanceof Error ? err.message : String(err) });
  }
};