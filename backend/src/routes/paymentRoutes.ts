import express from 'express';
import { createOrder, verifyPayment, getPaymentDetails } from '../controllers/paymentController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// All payment routes require authentication
router.post('/create-order', authenticateToken, createOrder);
router.post('/verify', authenticateToken, verifyPayment);
router.get('/:bookingId', authenticateToken, getPaymentDetails);

export default router;