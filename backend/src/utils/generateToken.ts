import jwt from 'jsonwebtoken';

export const generateToken = (userId: string) => {
  const secret = process.env.JWT_SECRET || 'defaultsecret';
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};