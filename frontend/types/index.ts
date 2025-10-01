// Types for the Estospaces application

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string; // Making phone optional to maintain compatibility
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address?: string;
  city: string;
  state: string;
  pincode?: string;
  type: 'flat' | 'house' | 'pg' | 'villa' | 'studio' | 'office';
  category: 'rent' | 'buy';
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  furnished: 'furnished' | 'semifurnished' | 'unfurnished';
  amenities: string[];
  images: string[];
  available: boolean;
  imageUrl?: string; // For backward compatibility
  ownerId: string;
  owner?: User;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  location: string;
  imageUrl?: string;
}

export interface Chat {
  id: string;
  propertyId: string;
  property?: Property;
  userId: string;
  user?: User;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface MessageFormData {
  content: string;
}

export interface Booking {
  id: string;
  propertyId: string;
  property?: Property;
  userId: string;
  user?: User;
  ownerId: string;
  owner?: User;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  paymentId?: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface DirectMessage {
  id: string;
  content: string;
  senderId: string;
  sender?: User;
  receiverId: string;
  receiver?: User;
  read: boolean;
  createdAt: string;
}

export interface ChatUser {
  id: string;
  name: string;
  email: string;
}

export interface Conversation {
  user: ChatUser;
  latestMessage: {
    content: string;
    createdAt: string;
    senderId: string;
    read: boolean;
  } | null;
  unreadCount: number;
}
