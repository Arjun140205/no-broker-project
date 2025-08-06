import express from 'express';
import { 
  createBookingRequest,
  getUserBookings,
  getOwnerBookings,
  acceptBooking,
  rejectBooking
} from '../controllers/bookingController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// All booking routes require authentication
router.post('/:propertyId', authenticateToken, createBookingRequest);    // POST /book/:propertyId - Create booking request
router.get('/', authenticateToken, getUserBookings);                     // GET /bookings - Get user's booking requests
router.get('/my-bookings', authenticateToken, getOwnerBookings);         // GET /bookings/my-bookings - Get received booking requests
router.patch('/:bookingId/accept', authenticateToken, acceptBooking);    // PATCH /book/:bookingId/accept - Accept booking
router.patch('/:bookingId/reject', authenticateToken, rejectBooking);    // PATCH /book/:bookingId/reject - Reject booking

export default router;
