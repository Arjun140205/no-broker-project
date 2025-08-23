import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (receiverId: string, content: string) => void;
  onlineUsers: Set<string>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  const connect = () => {
    if (!isAuthenticated || socket) return;

  const newSocket = io('http://localhost:4000', {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      
      // Authenticate with the server
      if (user) {
        newSocket.emit('authenticate', user.id);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    newSocket.on('user_status_change', ({ userId, status }: { userId: string; status: string }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        if (status === 'online') {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
    });

    setSocket(newSocket);
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  };

  const sendMessage = (receiverId: string, content: string) => {
    if (socket && isConnected && user) {
      socket.emit('send_message', {
        senderId: user.id,
        receiverId,
        content
      });
    } else {
      console.error('Socket not connected, cannot send message');
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isAuthenticated, user]);

  const value: SocketContextType = {
    socket,
    isConnected,
    connect,
    disconnect,
    sendMessage,
    onlineUsers,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
