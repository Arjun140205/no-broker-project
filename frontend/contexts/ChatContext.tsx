import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';
import api from '../services/api';

interface Chat {
  id: string;
  buyerId: string;
  ownerId: string;
  propertyId: string;
  property: {
    title: string;
  };
  buyer: {
    name: string;
  };
  owner: {
    name: string;
  };
  messages: Array<{
    content: string;
    createdAt: string;
  }>;
}

interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  loading: boolean;
  error: string | null;
  setActiveChat: (chat: Chat | null) => void;
  startChat: (propertyId: string, ownerId: string) => Promise<void>;
  loadChats: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { socket } = useSocket();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      socket.on('chatUpdated', handleChatUpdate);
      return () => {
        socket.off('chatUpdated', handleChatUpdate);
      };
    }
  }, [socket]);

  const handleChatUpdate = (updatedChat: Chat) => {
    setChats(prevChats => {
      const chatIndex = prevChats.findIndex(chat => chat.id === updatedChat.id);
      if (chatIndex === -1) {
        return [...prevChats, updatedChat];
      }
      const newChats = [...prevChats];
      newChats[chatIndex] = updatedChat;
      return newChats;
    });
  };

  const loadChats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/chat');
      setChats(response.data);
    } catch (err) {
      setError('Failed to load chats');
      console.error('Error loading chats:', err);
    } finally {
      setLoading(false);
    }
  };

  const startChat = async (propertyId: string, ownerId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post(`/api/chat/${propertyId}`);
      const newChat = response.data;
      setChats(prev => [...prev, newChat]);
      setActiveChat(newChat);
    } catch (err) {
      setError('Failed to start chat');
      console.error('Error starting chat:', err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    chats,
    activeChat,
    loading,
    error,
    setActiveChat,
    startChat,
    loadChats
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
