import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { 
  AuthResponse, 
  Booking, 
  Chat, 
  LoginCredentials, 
  Message, 
  MessageFormData, 
  Property, 
  PropertyFormData, 
  RegisterData, 
  User
} from '../types';

// Create axios instance with base URL
const api: AxiosInstance = axios.create({
  baseURL: typeof window !== 'undefined' ? 
    (window as any)?.process?.env?.NEXT_PUBLIC_API_URL || 'http://localhost:4001' : 
    'http://localhost:4001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include JWT token in all requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage if we're on the client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API Services
export const authAPI = {
  // Register a new user
  register: async (data: RegisterData & { role: string }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    return response.data;
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/api/auth/me');
    return response.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Legacy method for backward compatibility
  registerUser: async (data: RegisterData): Promise<User> => {
    const response = await api.post<User>('/api/auth/register', data);
    return response.data;
  },

  // Legacy method for backward compatibility
  loginUser: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/login', credentials);
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  }
};

// Property API Services
export const propertyAPI = {
  // Get all properties
  getAllProperties: async (): Promise<Property[]> => {
    try {
      const response = await api.get('/api/properties');
      
      // Check if response data has a properties array
      if (response.data && response.data.properties && Array.isArray(response.data.properties)) {
        return response.data.properties;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.error('API did not return properties in expected format:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      return [];
    }
  },

  // Get user's properties
  getMyProperties: async (): Promise<Property[]> => {
    try {
      const response = await api.get('/api/properties/my-properties');
      
      // Check if response data has a properties array
      if (response.data && response.data.properties && Array.isArray(response.data.properties)) {
        return response.data.properties;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.error('API did not return properties in expected format:', response.data);
        return [];
      }
    } catch (error) {
      console.error('Error fetching user properties:', error);
      return [];
    }
  },

  // Get single property by ID
  getPropertyById: async (id: string): Promise<Property> => {
    const response = await api.get<Property>(`/api/properties/${id}`);
    return response.data;
  },

  // Create new property
  createProperty: async (data: PropertyFormData): Promise<Property> => {
    const response = await api.post<Property>('/api/properties', data);
    return response.data;
  },

  // Update property
  updateProperty: async (id: string, data: Partial<PropertyFormData>): Promise<Property> => {
    const response = await api.put<Property>(`/api/properties/${id}`, data);
    return response.data;
  },

  // Delete property
  deleteProperty: async (id: string): Promise<void> => {
    await api.delete(`/api/properties/${id}`);
  }
};

// Chat API Services
export const chatAPI = {
  // Start or continue a chat about a property
  startChat: async (propertyId: string): Promise<Chat> => {
    const response = await api.post<Chat>(`/api/chat/${propertyId}`);
    return response.data;
  },

  // Get all chats for current user
  getAllChats: async (): Promise<Chat[]> => {
    const response = await api.get<Chat[]>('/api/chat');
    return response.data;
  },

  // Send a message in a chat
  sendMessage: async (chatId: string, messageData: MessageFormData): Promise<Message> => {
    const response = await api.post<Message>(`/api/chat/${chatId}/message`, messageData);
    return response.data;
  },

  // Get messages from a specific chat
  getChatMessages: async (chatId: string): Promise<Message[]> => {
    const response = await api.get<Message[]>(`/api/chat/${chatId}/messages`);
    return response.data;
  }
};

// Booking API Services
export const bookingAPI = {
  // Send a booking request for a property
  sendBookingRequest: async (propertyId: string): Promise<Booking> => {
    const response = await api.post<Booking>(`/api/book/${propertyId}`);
    return response.data;
  },

  // Get bookings made by the current user
  getMyBookings: async (): Promise<Booking[]> => {
    const response = await api.get<Booking[]>('/api/book');
    return response.data;
  },

  // Get bookings received as a property owner
  getReceivedBookings: async (): Promise<Booking[]> => {
    const response = await api.get<Booking[]>('/api/book/my-bookings');
    return response.data;
  },

  // Accept a booking request
  acceptBooking: async (bookingId: string): Promise<void> => {
    await api.patch(`/api/book/${bookingId}/accept`);
  },

  // Reject a booking request
  rejectBooking: async (bookingId: string): Promise<void> => {
    await api.patch(`/api/book/${bookingId}/reject`);
  }
};

// Direct messages API Services
export const messageAPI = {
  // Get all conversations for the current user
  getConversations: async (): Promise<any[]> => {
    const response = await api.get('/api/messages');
    return response.data;
  },

  // Get chat history with a specific user
  getChatHistory: async (userId: string): Promise<any[]> => {
    const response = await api.get(`/api/messages/${userId}`);
    return response.data;
  },

  // Send a message via HTTP (alternative to socket)
  sendMessage: async (receiverId: string, content: string): Promise<any> => {
    const response = await api.post('/api/messages', { receiverId, content });
    return response.data;
  }
};

export default api;
