import express from 'express';
import { 
  startOrContinueChat,
  getUserChats,
  sendMessage,
  getChatMessages
} from '../controllers/chatController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

// All chat routes require authentication
router.post('/:propertyId', authenticateToken, startOrContinueChat);  // POST /chat/:propertyId - Start or continue chat
router.get('/', authenticateToken, getUserChats);                     // GET /chat - Get all user chats
router.post('/:chatId/message', authenticateToken, sendMessage);     // POST /chat/:chatId/message - Send message
router.get('/:chatId/messages', authenticateToken, getChatMessages); // GET /chat/:chatId/messages - Get chat messages

export default router;
