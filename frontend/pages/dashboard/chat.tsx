import React, { useEffect, useState, useRef } from 'react';
import { chatAPI } from '../../services/api';
import { Chat as ChatType, Message, MessageFormData } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';

const Chat = () => {
  const [chats, setChats] = useState<ChatType[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const data = await chatAPI.getAllChats();
        setChats(data);
        
        // If there are chats, select the first one
        if (data.length > 0 && !activeChat) {
          setActiveChat(data[0].id);
        }
      } catch (err: any) {
        console.error('Error fetching chats:', err);
        setError('Failed to load chats. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchChats();
    }
  }, [user, activeChat]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChat) return;
      
      try {
        const data = await chatAPI.getChatMessages(activeChat);
        setMessages(data);
        scrollToBottom();
      } catch (err: any) {
        console.error('Error fetching messages:', err);
        // Error notification would go here
        // e.g., toast.error('Failed to load messages');
      }
    };

    if (activeChat) {
      fetchMessages();
    }
  }, [activeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || sendingMessage) return;

    const messageData: MessageFormData = {
      content: newMessage,
    };

    try {
      setSendingMessage(true);
      const sentMessage = await chatAPI.sendMessage(activeChat, messageData);
      setMessages([...messages, sentMessage]);
      setNewMessage('');
      scrollToBottom();
    } catch (err: any) {
      console.error('Error sending message:', err);
      // Error notification would go here
      // e.g., toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  if (authLoading || (loading && user)) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Chats</h1>
      
      {chats.length === 0 ? (
        <div className="text-center py-10 bg-white shadow rounded-lg">
          <p className="text-gray-500">You don't have any chats yet.</p>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row h-[70vh] bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Chat List Sidebar */}
          <div className="w-full md:w-1/3 bg-gray-50 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Conversations</h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {chats.map((chat) => (
                <li 
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`p-4 hover:bg-gray-100 cursor-pointer ${activeChat === chat.id ? 'bg-gray-100' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">
                      {chat.property?.title || 'Unknown Property'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {chat.user?.id === user.id ? 
                      `With ${chat.property?.owner?.name || 'owner'}` : 
                      `From ${chat.user?.name || 'user'}`}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Chat Messages */}
          <div className="w-full md:w-2/3 flex flex-col">
            {activeChat ? (
              <>
                {/* Message List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500">No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`max-w-xs mx-2 p-3 rounded-lg ${
                          message.senderId === user.id
                            ? 'bg-indigo-100 ml-auto'
                            : 'bg-gray-100 mr-auto'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(message.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Message Input */}
                <div className="border-t border-gray-200 p-4">
                  <form onSubmit={handleSendMessage} className="flex">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="submit"
                      disabled={sendingMessage || !newMessage.trim()}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-lg disabled:opacity-50"
                    >
                      {sendingMessage ? 'Sending...' : 'Send'}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Select a chat to start messaging</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
