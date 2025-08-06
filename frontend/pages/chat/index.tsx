import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { messageAPI } from '../../services/api';
import { DirectMessage, Conversation, User, ChatUser } from '../../types';
import { ChatMessage, ChatInput, UserListItem, ChatHeader } from '../../components/chat/ChatComponents';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const Chat = () => {
  const router = useRouter();
  const { userId } = router.query;
  const { user, isAuthenticated, loading } = useAuth();
  const { socket, isConnected, sendMessage: socketSendMessage, onlineUsers } = useSocket();
  
  const [activeUser, setActiveUser] = useState<ChatUser | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load conversations list
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await messageAPI.getConversations();
        setConversations(data);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
        toast.error('Failed to load conversations');
      }
    };

    if (isAuthenticated && user) {
      fetchConversations();
    }
  }, [isAuthenticated, user]);

  // Load messages when userId changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId || typeof userId !== 'string') return;
      
      setIsLoadingMessages(true);
      try {
        // Get chat messages
        const messagesData = await messageAPI.getChatHistory(userId);
        setMessages(messagesData);
        
        // Get user details
        const userInfo = conversations.find(conv => conv.user.id === userId)?.user;
        if (userInfo) {
          setActiveUser(userInfo);
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
  }, [isAuthenticated, userId, conversations]);

  // Set up socket listeners
  useEffect(() => {
    if (!socket) return;

    // Handle receiving messages
    const handleReceiveMessage = (message: DirectMessage) => {
      // Add to messages if from active chat
      if (userId === message.senderId || userId === message.receiverId) {
        setMessages(prev => [...prev, message]);
      }
      
      // Update conversations list
      setConversations(prev => {
        const updatedConversations = [...prev];
        const conversationIndex = updatedConversations.findIndex(
          conv => conv.user.id === message.senderId || conv.user.id === message.receiverId
        );
        
        if (conversationIndex !== -1) {
          // Update existing conversation
          updatedConversations[conversationIndex] = {
            ...updatedConversations[conversationIndex],
            latestMessage: {
              content: message.content,
              createdAt: message.createdAt,
              senderId: message.senderId,
              read: false
            },
            unreadCount: updatedConversations[conversationIndex].unreadCount + 1
          };
        } else {
          // TODO: Create new conversation if sender not in list
        }
        
        return updatedConversations;
      });
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
  }, [socket, userId]);

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
      
      // Update conversations list
      setConversations(prev => {
        const updatedConversations = [...prev];
        const conversationIndex = updatedConversations.findIndex(
          conv => conv.user.id === userId
        );
        
        if (conversationIndex !== -1) {
          updatedConversations[conversationIndex] = {
            ...updatedConversations[conversationIndex],
            latestMessage: {
              content,
              createdAt: new Date().toISOString(),
              senderId: user.id,
              read: false
            }
          };
        }
        
        return updatedConversations;
      });
      
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

  // Select a conversation
  const selectConversation = (conversationUserId: string) => {
    router.push(`/chat/${conversationUserId}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      <div className="flex flex-col md:flex-row h-[calc(100vh-200px)] bg-white rounded-lg shadow overflow-hidden">
        {/* Conversations sidebar */}
        <div className="w-full md:w-1/3 border-r border-gray-200 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Conversations</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No conversations yet
              </div>
            ) : (
              conversations.map((conversation) => (
                <UserListItem
                  key={conversation.user.id}
                  user={conversation.user}
                  lastMessage={conversation.latestMessage?.content}
                  timestamp={conversation.latestMessage ? formatDistanceToNow(new Date(conversation.latestMessage.createdAt), { addSuffix: true }) : undefined}
                  unreadCount={conversation.unreadCount}
                  isOnline={onlineUsers.has(conversation.user.id)}
                  isActive={userId === conversation.user.id}
                  onClick={() => selectConversation(conversation.user.id)}
                />
              ))
            )}
          </div>
        </div>
        
        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {!userId ? (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start chatting
            </div>
          ) : (
            <>
              {/* Chat header */}
              {activeUser && (
                <ChatHeader 
                  chatUser={activeUser} 
                  isOnline={onlineUsers.has(activeUser.id)}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
