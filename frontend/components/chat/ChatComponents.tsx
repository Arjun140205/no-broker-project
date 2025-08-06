import React from 'react';
import { User, DirectMessage, ChatUser } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface MessageProps {
  message: DirectMessage;
}

const ChatMessage: React.FC<MessageProps> = ({ message }) => {
  const { user } = useAuth();
  const isCurrentUser = user && message.senderId === user.id;

  return (
    <div className={`flex w-full mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-lg ${isCurrentUser ? 'bg-indigo-600 text-white rounded-l-lg rounded-tr-lg' : 'bg-gray-200 text-gray-800 rounded-r-lg rounded-tl-lg'} px-4 py-2 shadow`}>
        <div className="flex flex-col">
          <p className="text-sm">{message.content}</p>
          <span className={`text-xs mt-1 ${isCurrentUser ? 'text-indigo-200' : 'text-gray-500'} self-end`}>
            {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
    </div>
  );
};

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onTyping: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onTyping }) => {
  const [message, setMessage] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    onTyping();
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={handleChange}
          placeholder="Type a message..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </form>
  );
};

interface UserListItemProps {
  user: ChatUser | User;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  isOnline?: boolean;
  isActive?: boolean;
  onClick: () => void;
}

const UserListItem: React.FC<UserListItemProps> = ({
  user,
  lastMessage,
  timestamp,
  unreadCount = 0,
  isOnline = false,
  isActive = false,
  onClick
}) => {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center p-3 cursor-pointer ${isActive ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
    >
      <div className="relative">
        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-semibold text-lg">
          {user.name.charAt(0).toUpperCase()}
        </div>
        {isOnline && (
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
        )}
      </div>
      <div className="flex-grow ml-3">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-900">{user.name}</h3>
          {timestamp && <span className="text-xs text-gray-500">{timestamp}</span>}
        </div>
        <div className="flex justify-between items-center">
          {lastMessage && (
            <p className="text-sm text-gray-600 truncate">{lastMessage}</p>
          )}
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-600 text-xs font-medium text-white">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

interface ChatHeaderProps {
  chatUser: User | ChatUser;
  isOnline?: boolean;
  isTyping?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chatUser, isOnline = false, isTyping = false }) => {
  return (
    <div className="flex items-center p-4 border-b border-gray-200 bg-white">
      <div className="relative">
        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 font-semibold">
          {chatUser.name.charAt(0).toUpperCase()}
        </div>
        {isOnline && (
          <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></div>
        )}
      </div>
      <div className="ml-3">
        <h3 className="font-medium text-gray-900">{chatUser.name}</h3>
        <p className="text-xs text-gray-500">
          {isTyping ? 'Typing...' : isOnline ? 'Online' : 'Offline'}
        </p>
      </div>
    </div>
  );
};

export { ChatMessage, ChatInput, UserListItem, ChatHeader };
