import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// With the authenticateToken middleware, we have both userId and user object
interface AuthenticatedRequest extends Request {
  userId?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

// Placeholder for getUserChats - implementation moved below

// 📩 1. POST /chat/:propertyId - Start or continue a chat between buyer and property owner
export const startOrContinueChat = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { propertyId } = req.params;

    if (!propertyId) {
      return res.status(400).json({ message: 'Property ID is required' });
    }

    // Check if property exists
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Prevent owner from chatting with themselves
    if (property.ownerId === req.userId) {
      return res.status(400).json({ message: 'You cannot start a chat with yourself for your own property' });
    }

    const buyerId = req.userId;
    const ownerId = property.ownerId;

    // Check if chat already exists
    let chat = await prisma.chat.findUnique({
      where: {
        buyerId_ownerId_propertyId: {
          buyerId,
          ownerId,
          propertyId,
        },
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            location: true,
            type: true,
          },
        },
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // If chat doesn't exist, create a new one
    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          buyerId,
          ownerId,
          propertyId,
        },
        include: {
          buyer: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          property: {
            select: {
              id: true,
              title: true,
              price: true,
              location: true,
              type: true,
            },
          },
          messages: {
            orderBy: { timestamp: 'desc' },
            take: 1,
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    }

    res.status(200).json({
      message: !chat.messages?.[0] ? 'New chat started' : 'Existing chat retrieved',
      chat,
    });
  } catch (error) {
    console.error('[START CHAT ERROR]', error);
    res.status(500).json({ message: 'Failed to start or continue chat', error: 'Internal server error' });
  }
};

// 💬 2. GET /chat - Get all chats involving the logged-in user
export const getUserChats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    // Validate pagination params
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ message: 'Invalid page number' });
    }
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 50) {
      return res.status(400).json({ message: 'Invalid limit (1-50)' });
    }

    const skip = (pageNum - 1) * limitNum;

    // Get all chats where user is either buyer or owner
    const [chats, totalCount] = await Promise.all([
      prisma.chat.findMany({
        where: {
          OR: [
            { buyerId: req.userId },
            { ownerId: req.userId },
          ],
        },
        skip,
        take: limitNum,
        orderBy: { updatedAt: 'desc' },
        include: {
          buyer: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          property: {
            select: {
              id: true,
              title: true,
              price: true,
              location: true,
              type: true,
            },
          },
          messages: {
            orderBy: { timestamp: 'desc' },
            take: 1,
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.chat.count({
        where: {
          OR: [
            { buyerId: req.userId },
            { ownerId: req.userId },
          ],
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);


    // Defensive: filter out chats with missing relations to avoid 500 errors
    const transformedChats = chats
      .filter(chat => chat && chat.property && chat.buyer && chat.owner)
      .map(chat => ({
        id: chat.id,
        property: chat.property,
        otherUser: chat.buyerId === req.userId ? chat.owner : chat.buyer,
        userRole: chat.buyerId === req.userId ? 'buyer' : 'owner',
        latestMessage: chat.messages[0] || null,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      }));

    res.json({
      chats: transformedChats,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    // Enhanced error logging for debugging
    console.error('[GET USER CHATS ERROR]', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Failed to fetch chats', error: error.message, stack: error.stack });
    } else {
      res.status(500).json({ message: 'Failed to fetch chats', error });
    }
  }
};

// 📨 3. POST /chat/:chatId/message - Send a message in a chat
export const sendMessage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { chatId } = req.params;
    const { content } = req.body;

    if (!chatId) {
      return res.status(400).json({ message: 'Chat ID is required' });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // Check if chat exists and user is part of it
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        property: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Verify user is part of this chat
    if (chat.buyerId !== req.userId && chat.ownerId !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to send messages in this chat' });
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        senderId: req.userId,
        chatId,
        propertyId: chat.propertyId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Update chat's updatedAt timestamp
    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    res.status(201).json({
      message: 'Message sent successfully',
      data: message,
    });
  } catch (error) {
    console.error('[SEND MESSAGE ERROR]', error);
    res.status(500).json({ message: 'Failed to send message', error: 'Internal server error' });
  }
};

// Get messages for a specific chat
export const getChatMessages = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { chatId } = req.params;
    const { page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    if (!chatId) {
      return res.status(400).json({ message: 'Chat ID is required' });
    }

    // Validate pagination params
    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({ message: 'Invalid page number' });
    }
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ message: 'Invalid limit (1-100)' });
    }

    // Check if chat exists and user is part of it
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Verify user is part of this chat
    if (chat.buyerId !== req.userId && chat.ownerId !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to view this chat' });
    }

    const skip = (pageNum - 1) * limitNum;

    const [messages, totalCount] = await Promise.all([
      prisma.message.findMany({
        where: { chatId },
        skip,
        take: limitNum,
        orderBy: { timestamp: 'desc' },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.message.count({ where: { chatId } }),
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      messages: messages.reverse(), // Reverse to show oldest first
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
    });
  } catch (error) {
    console.error('[GET CHAT MESSAGES ERROR]', error);
    res.status(500).json({ message: 'Failed to fetch messages', error: 'Internal server error' });
  }
};
