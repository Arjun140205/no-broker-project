import express from 'express';
import { 
  createProperty, 
  getAllProperties, 
  getPropertyById, 
  getMyProperties, 
  deleteProperty 
} from '../controllers/propertyController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getAllProperties);              // GET /properties - Get all properties (public)

// Protected routes (authentication required)
router.post('/', authenticateToken, createProperty);      // POST /properties - Create property
router.get('/my-properties', authenticateToken, getMyProperties);  // GET /properties/my-properties - Get user's properties

// These need to be at the end to avoid conflicts with /my-properties
router.get('/:id', getPropertyById);            // GET /properties/:id - Get single property
router.delete('/:id', authenticateToken, deleteProperty); // DELETE /properties/:id - Delete property

export default router;
