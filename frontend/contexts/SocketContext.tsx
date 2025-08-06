import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';
import { DirectMessage } from '../types';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  sendMessage: (receiverId: string, content: string) => void;
  onlineUsers: Set<string>;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  sendMessage: () => {},
  onlineUsers: new Set<string>()
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const { user, isAuthenticated } = useAuth();

  // Initialize socket connection
  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect to socket server
      const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000', {
        withCredentials: true,
        extraHeaders: {
          "Content-Type": "application/json"
        }
      });

      // Set up event listeners
      socketInstance.on('connect', () => {
        console.log('Socket connected!');
        setIsConnected(true);
        
        // Authenticate with the socket server
        socketInstance.emit('authenticate', user.id);
      });

      socketInstance.on('disconnect', () => {
        console.log('Socket disconnected!');
        setIsConnected(false);
      });
      
      socketInstance.on('user_status_change', ({ userId, status }) => {
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

      setSocket(socketInstance);

      // Clean up on unmount
      return () => {
        socketInstance.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  // Function to send a message
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

  const value = {
    socket,
    isConnected,
    sendMessage,
    onlineUsers
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
