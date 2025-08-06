import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import authRoutes from './routes/authRoutes';
import propertyRoutes from './routes/propertyRoutes';
import chatRoutes from './routes/chatRoutes';
import bookingRoutes from './routes/bookingRoutes';
import messageRoutes from './routes/messageRoutes';
import config from './config/environment';
import { shouldUseMockResponses, createMockDebugInfo } from './utils/mockResponseUtil';

// Environment variables are loaded in config/environment.ts

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: config.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  }
});

// Initialize Prisma client
const prisma = new PrismaClient();

// Set port from environment config
const PORT = config.PORT || 4000;

// Detect if we should use mock data
const useMockData = shouldUseMockResponses();
if (useMockData) {
  console.log('🧪 Running in MOCK DATA MODE - database operations will be simulated');
} else {
  console.log('🔌 Running with LIVE DATABASE connections');
}

// Store online users: { userId: socketId }
const onlineUsers = new Map<string, string>();

// Enable CORS with specific options
app.use(cors({
  origin: config.CORS_ORIGIN || "http://localhost:3000", // Must match exactly, not wildcard
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Serve static files from the public directory
app.use(express.static('public'));

// Routes
app.use('/api/auth', authRoutes); // Auth routes for /register and /login
app.use('/api/properties', propertyRoutes); // Property routes
app.use('/api/chat', chatRoutes); // Chat routes
app.use('/api/book', bookingRoutes); // Booking routes
app.use('/api/messages', messageRoutes); // Direct messages routes

// Health check
app.get('/', (req: Request, res: Response) => {
  res.send('Estospaces backend is running!');
});

// Database connection test endpoint
app.get('/test-db', async (req: Request, res: Response) => {
  try {
    // Test raw query
    await prisma.$queryRaw`SELECT 1`;
    
    // Test property count
    const count = await prisma.property.count();
    
    return res.status(200).json({
      message: 'Database connection successful',
      propertyCount: count,
      databaseUrl: config.DATABASE_URL ? 'Configured' : 'Missing',
      mockDataMode: useMockData ? 'Enabled' : 'Disabled',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database test error:', error);
    
    if (shouldUseMockResponses()) {
      // If we're in mock mode, return a success response with mock data
      return res.status(200).json({
        message: 'Using mock data mode - database connection not required',
        propertyCount: 3, // Mock property count
        databaseUrl: config.DATABASE_URL ? 'Configured but not connected' : 'Missing',
        mockDataMode: 'Enabled',
        timestamp: new Date().toISOString(),
        _debug: createMockDebugInfo('Database connection test is using mock data')
      });
    } else {
      return res.status(500).json({
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack trace',
        mockDataMode: 'Disabled',
        timestamp: new Date().toISOString()
      });
    }
  }
});

// Optional: Get all users (for testing only — remove in production)
app.get('/users', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Socket.IO connection handling
io.on('connection', (socket: Socket) => {
  console.log(`New client connected: ${socket.id}`);
  
  // User authentication and storing online status
  socket.on('authenticate', (userId: string) => {
    if (userId) {
      console.log(`User ${userId} is now online with socket ${socket.id}`);
      onlineUsers.set(userId, socket.id);
      
      // Notify others that this user is online
      socket.broadcast.emit('user_status_change', { userId, status: 'online' });
    }
  });
  
  // Handle direct messages
  socket.on('send_message', async (messageData: { 
    senderId: string; 
    receiverId: string; 
    content: string;
  }) => {
    try {
      const { senderId, receiverId, content } = messageData;
      
      // Save message to database
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
      
      // If receiver is online, send them the message in real-time
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', message);
      }
      
      // Acknowledge message received and saved
      socket.emit('message_sent', { success: true, message });
      
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message_sent', { 
        success: false, 
        error: 'Failed to send message' 
      });
    }
  });
  
  // Handle typing indicators
  socket.on('typing', ({ senderId, receiverId }: { senderId: string; receiverId: string }) => {
    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user_typing', { userId: senderId });
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    
    // Find and remove the disconnected user
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} is now offline`);
        
        // Notify others that this user is offline
        socket.broadcast.emit('user_status_change', { userId, status: 'offline' });
        break;
      }
    }
  });
});

// Global error handler middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  
  if (shouldUseMockResponses()) {
    // If we're in mock mode, respond with a friendly error and indicate mock data mode
    res.status(500).json({
      message: 'An error occurred but mock data mode is enabled',
      mockDataMode: 'Enabled',
      originalPath: req.path,
      originalMethod: req.method,
      _debug: createMockDebugInfo('Error occurred but mock data mode is enabled')
    });
  } else {
    // In production, send a proper error response
    res.status(500).json({
      message: 'An unexpected error occurred',
      error: err instanceof Error ? err.message : String(err),
      mockDataMode: 'Disabled'
    });
  }
});

// Add diagnostic endpoint to check mock data status
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    mockDataMode: shouldUseMockResponses() ? 'Enabled' : 'Disabled',
    environment: config.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Export for testing purposes
export { app, onlineUsers };

// Function to start server with port handling
const startServer = (attemptPort: number, maxAttempts = 3, attempt = 1) => {
  httpServer.once('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️ Port ${attemptPort} is already in use, trying port ${attemptPort + 1}...`);
      
      if (attempt < maxAttempts) {
        // Try the next port
        startServer(attemptPort + 1, maxAttempts, attempt + 1);
      } else {
        console.error(`❌ Could not find an available port after ${maxAttempts} attempts.`);
        console.error('Please manually kill the process using this port or specify a different port in your .env file.');
        process.exit(1);
      }
    } else {
      // For other errors
      console.error(`❌ Server error:`, err);
      process.exit(1);
    }
  });

  httpServer.listen(attemptPort, () => {
    console.log(`🚀 Server ready on http://localhost:${attemptPort}`);
    console.log(`🔌 Socket.IO server initialized`);
    console.log(`🛠️ Environment: ${config.NODE_ENV}`);
    if (shouldUseMockResponses()) {
      console.log(`⚠️ Mock data mode ENABLED - database operations will return mock responses`);
    }
  });
};

// Start the server with initial port
startServer(Number(PORT));