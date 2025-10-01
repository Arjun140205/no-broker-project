import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useSocket } from '../../contexts/SocketContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  Search,
  Paperclip,
  Smile,
  User,
  Crown,
  Circle,
  MessageCircle,
  Star,
  Shield
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  content: string;
  senderId: string;
  sender: {
    id: string;
    name: string;
  };
  createdAt: string;
}

interface ChatUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  online?: boolean;
  verified?: boolean;
}

interface Conversation {
  user: ChatUser;
  latestMessage: Message | null;
  unreadCount: number;
}

const ChatInterface: React.FC = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (socket && user) {
      // Authenticate with socket
      socket.emit('authenticate', user.id);

      // Listen for incoming messages
      socket.on('receive_message', (message: Message) => {
        setMessages(prev => [...prev, message]);
        updateConversationLatestMessage(message);
      });

      // Listen for typing indicators
      socket.on('user_typing', ({ userId }: { userId: string }) => {
        if (activeChat && userId === activeChat.id) {
          setTyping(activeChat.name);
          setTimeout(() => setTyping(null), 3000);
        }
      });

      // Listen for user status changes
      socket.on('user_status_change', ({ userId, status }: { userId: string; status: string }) => {
        setConversations(prev => prev.map(conv => 
          conv.user.id === userId 
            ? { ...conv, user: { ...conv.user, online: status === 'online' } }
            : conv
        ));
      });

      return () => {
        socket.off('receive_message');
        socket.off('user_typing');
        socket.off('user_status_change');
      };
    }
  }, [socket, user, activeChat]);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      // Mock conversations data
      const mockConversations: Conversation[] = [
        {
          user: {
            id: '1',
            name: 'John Smith',
            email: 'john@example.com',
            online: true,
            verified: true,
          },
          latestMessage: {
            id: '1',
            content: 'Is the property still available?',
            senderId: '1',
            sender: { id: '1', name: 'John Smith' },
            createdAt: new Date().toISOString(),
          },
          unreadCount: 2,
        },
        {
          user: {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            online: false,
            verified: true,
          },
          latestMessage: {
            id: '2',
            content: 'Thank you for the information!',
            senderId: '2',
            sender: { id: '2', name: 'Sarah Johnson' },
            createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          },
          unreadCount: 0,
        },
        {
          user: {
            id: '3',
            name: 'Mike Wilson',
            email: 'mike@example.com',
            online: true,
            verified: false,
          },
          latestMessage: {
            id: '3',
            content: 'Can we schedule a viewing?',
            senderId: '3',
            sender: { id: '3', name: 'Mike Wilson' },
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          unreadCount: 1,
        },
      ];
      setConversations(mockConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId: string) => {
    try {
      // Mock messages data
      const mockMessages: Message[] = [
        {
          id: '1',
          content: 'Hi! I\'m interested in your luxury apartment listing.',
          senderId: userId,
          sender: { id: userId, name: 'User' },
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          content: 'Hello! Thank you for your interest. I\'d be happy to help you with any questions.',
          senderId: user?.id || '',
          sender: { id: user?.id || '', name: user?.name || 'You' },
          createdAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          content: 'That would be great! I\'m available this weekend for a viewing.',
          senderId: userId,
          sender: { id: userId, name: 'User' },
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const updateConversationLatestMessage = (message: Message) => {
    setConversations(prev => prev.map(conv => 
      conv.user.id === message.senderId 
        ? { ...conv, latestMessage: message, unreadCount: conv.unreadCount + 1 }
        : conv
    ));
  };

  const selectChat = (chatUser: ChatUser) => {
    setActiveChat(chatUser);
    fetchMessages(chatUser.id);
    // Mark messages as read
    setConversations(prev => prev.map(conv => 
      conv.user.id === chatUser.id 
        ? { ...conv, unreadCount: 0 }
        : conv
    ));
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeChat || !socket) return;

    const messageData = {
      senderId: user?.id,
      receiverId: activeChat.id,
      content: newMessage.trim(),
    };

    try {
      socket.emit('send_message', messageData);
      
      // Add message immediately
      const tempMessage: Message = {
        id: Date.now().toString(),
        content: newMessage.trim(),
        senderId: user?.id || '',
        sender: { id: user?.id || '', name: user?.name || 'You' },
        createdAt: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');
      updateConversationLatestMessage(tempMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  const handleTyping = () => {
    if (socket && activeChat) {
      socket.emit('typing', { senderId: user?.id, receiverId: activeChat.id });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="loading-shimmer w-64 h-8 rounded"></div>
      </div>
    );
  }

  return (
    <div className="h-[600px] flex bg-background rounded-xl border border-border overflow-hidden">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-border">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Messages
            </h2>
            <Button size="sm" variant="ghost" className="p-0">
              <Search className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-y-auto h-full">
          {conversations.map((conversation) => (
            <motion.div
              key={conversation.user.id}
              whileHover={{ backgroundColor: 'rgba(var(--primary), 0.05)' }}
              onClick={() => selectChat(conversation.user)}
              className={`p-4 cursor-pointer border-b border-border/50 ${
                activeChat?.id === conversation.user.id ? 'bg-primary/10' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white">
                    <User className="w-6 h-6" />
                  </div>
                  {conversation.user.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-foreground truncate">{conversation.user.name}</h3>
                      {conversation.user.verified && (
                        <Shield className="w-3 h-3 text-blue-500" />
                      )}
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs text-white">{conversation.unreadCount}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {conversation.latestMessage?.content || 'No messages yet'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {conversation.latestMessage && format(new Date(conversation.latestMessage.createdAt), 'HH:mm')}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border glass-effect">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white">
                      <User className="w-5 h-5" />
                    </div>
                    {activeChat.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border border-white"></div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{activeChat.name}</h3>
                      {activeChat.verified && (
                        <Shield className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {activeChat.online ? 'Online' : 'Last seen recently'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm" variant="ghost" className="glass-effect border-0">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="glass-effect border-0">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="glass-effect border-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === user?.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'glass-effect border border-border'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.senderId === user?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}>
                        {format(new Date(message.createdAt), 'HH:mm')}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="glass-effect border border-border px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-1">
                      <Circle className="w-2 h-2 fill-current animate-bounce" style={{ animationDelay: '0s' }} />
                      <Circle className="w-2 h-2 fill-current animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <Circle className="w-2 h-2 fill-current animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{typing} is typing...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border glass-effect">
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="ghost" className="glass-effect border-0">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      handleTyping();
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newMessage.trim()) {
                        sendMessage();
                      }
                    }}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 glass-effect border-0"
                  >
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="btn-premium"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;