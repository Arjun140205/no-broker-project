import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { messageAPI } from '../../services/api';
import { DirectMessage } from '../../types';
import { ChatMessage, ChatInput, ChatHeader } from '../../components/chat/ChatComponents';
import toast from 'react-hot-toast';
import Link from 'next/link';

const ChatWithUser = () => {
  const router = useRouter();
  const { userId } = router.query;
  const { user, isAuthenticated, loading } = useAuth();
  const { socket, isConnected, sendMessage: socketSendMessage, onlineUsers } = useSocket();
  
  const [chatUser, setChatUser] = useState<any>(null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load messages when userId changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId || typeof userId !== 'string') return;
      
      setIsLoadingMessages(true);
      try {
        // Get chat messages
        const messagesData = await messageAPI.getChatHistory(userId);
        setMessages(messagesData);
        
        // Get user details if available in the messages
        const otherUser = messagesData.find(msg => 
          msg.senderId === userId || msg.receiverId === userId
        )?.sender;
        
        if (otherUser) {
          setChatUser(otherUser);
        } else {
          // If no messages yet, fetch user info another way
          // This would require a new API endpoint to fetch user by ID
          // For now, we'll just set minimal user info
          setChatUser({ id: userId, name: 'User' });
        }
        
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setIsLoadingMessages(false);
      }
    };

    if (isAuthenticated && userId) {
      fetchMessages();
    }
  }, [isAuthenticated, userId]);

  // Set up socket listeners
  useEffect(() => {
    if (!socket) return;

    // Handle receiving messages
    const handleReceiveMessage = (message: DirectMessage) => {
      // Add to messages if from active chat
      if (userId === message.senderId || userId === message.receiverId) {
        setMessages(prev => [...prev, message]);
        
        // If this is our first message and we don't have user info yet
        if (!chatUser && message.sender) {
          setChatUser(message.sender);
        }
      }
    };
    
    // Handle typing indicator
    const handleUserTyping = ({ userId: typingUserId }: { userId: string }) => {
      if (typingUserId === userId) {
        setIsTyping(true);
        
        // Clear existing timeout
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        
        // Set new timeout to clear typing indicator after 3 seconds
        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    socket.on('user_typing', handleUserTyping);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      socket.off('user_typing', handleUserTyping);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [socket, userId, chatUser]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Handle send message
  const handleSendMessage = async (content: string) => {
    if (!userId || !user) return;
    
    try {
      // Add optimistic message to UI
      const optimisticMessage: DirectMessage = {
        id: `temp-${Date.now()}`,
        content,
        senderId: user.id,
        receiverId: userId as string,
        read: false,
        createdAt: new Date().toISOString(),
        sender: user
      };
      
      setMessages(prev => [...prev, optimisticMessage]);
      
      // Send via socket if connected
      if (isConnected) {
        socketSendMessage(userId as string, content);
      } else {
        // Fallback to HTTP API if socket not connected
        await messageAPI.sendMessage(userId as string, content);
      }
      
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    }
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (!socket || !isConnected || !userId || !user) return;
    
    socket.emit('typing', {
      senderId: user.id,
      receiverId: userId
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <Link href="/chat" className="text-indigo-600 hover:text-indigo-500 flex items-center">
          <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to all conversations
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden h-[calc(100vh-200px)] flex flex-col">
        {/* Chat header */}
        {chatUser && (
          <ChatHeader 
            chatUser={chatUser} 
            isOnline={onlineUsers.has(chatUser.id)}
            isTyping={isTyping} 
          />
        )}
        
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {isLoadingMessages ? (
            <div className="flex justify-center items-center h-full">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full text-gray-500">
              No messages yet. Start the conversation!
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        
        {/* Message input */}
        <ChatInput onSendMessage={handleSendMessage} onTyping={handleTyping} />
      </div>
    </div>
  );
};

export default ChatWithUser;
