import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();
const prisma = new PrismaClient();

// Get all messages between current user and another user
router.get('/:userId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Get messages where current user is either sender or receiver
    const messages = await prisma.directMessage.findMany({
      where: {
        OR: [
          // Messages sent by current user to the other user
          { senderId: currentUserId, receiverId: userId },
          // Messages received by current user from the other user
          { senderId: userId, receiverId: currentUserId }
        ]
      },
      orderBy: {
        createdAt: 'asc'
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Mark messages as read if current user is the receiver
    await prisma.directMessage.updateMany({
      where: {
        senderId: userId,
        receiverId: currentUserId,
        read: false
      },
      data: {
        read: true
      }
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// Get all conversations for the current user
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Get the list of users the current user has exchanged messages with
    const sentMessages = await prisma.directMessage.findMany({
      where: { senderId: currentUserId },
      select: { receiverId: true },
      distinct: ['receiverId']
    });

    const receivedMessages = await prisma.directMessage.findMany({
      where: { receiverId: currentUserId },
      select: { senderId: true },
      distinct: ['senderId']
    });

    // Combine unique user IDs
    const userIds = new Set<string>();
    sentMessages.forEach(msg => userIds.add(msg.receiverId));
    receivedMessages.forEach(msg => userIds.add(msg.senderId));

    // Get user details and latest message for each conversation
    const conversations = await Promise.all(
      Array.from(userIds).map(async (userId) => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, name: true, email: true }
        });

        const latestMessage = await prisma.directMessage.findFirst({
          where: {
            OR: [
              { senderId: currentUserId, receiverId: userId },
              { senderId: userId, receiverId: currentUserId }
            ]
          },
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            content: true,
            createdAt: true,
            senderId: true,
            read: true
          }
        });

        // Count unread messages
        const unreadCount = await prisma.directMessage.count({
          where: {
            senderId: userId,
            receiverId: currentUserId,
            read: false
          }
        });

        return {
          user,
          latestMessage,
          unreadCount
        };
      })
    );

    // Sort conversations by latest message time
    conversations.sort((a, b) => {
      if (!a.latestMessage || !b.latestMessage) return 0;
      return new Date(b.latestMessage.createdAt).getTime() - 
             new Date(a.latestMessage.createdAt).getTime();
    });

    return res.status(200).json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return res.status(500).json({ message: 'Failed to fetch conversations' });
  }
});

// Send a new message via HTTP (alternative to socket)
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user?.id;

    if (!senderId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'Receiver ID and content are required' });
    }

    const message = await prisma.directMessage.create({
      data: {
        senderId,
        receiverId,
        content
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ message: 'Failed to send message' });
  }
});

export default router;
