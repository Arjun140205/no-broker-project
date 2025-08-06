import { useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import { User, LoginCredentials, RegisterData } from '../types';
import { useRouter } from 'next/router';

interface AuthHook {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  getUserFromToken: () => User | null;
  isAuthenticated: boolean;
}

export const useAuth = (): AuthHook => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  // Check if user is authenticated
  const checkAuth = useCallback(async () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
        setError(null);
      } catch (err: any) {
        console.error('Authentication check failed:', err);
        // If token is invalid, remove it
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        setError('Session expired. Please log in again.');
      } finally {
        setLoading(false);
      }
    }
  }, []);

  // Login function
  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.loginUser(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      // Router navigation is now handled in the page component
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setIsAuthenticated(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      await authAPI.registerUser(data);
      // After registration, log the user in automatically
      await login({ email: data.email, password: data.password });
      setIsAuthenticated(true);
      // Router navigation is now handled in the page component
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setIsAuthenticated(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
    router.push('/login');
  };

  // Get user from JWT token
  const getUserFromToken = (): User | null => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      try {
        // This is a simple way to extract user from token
        // In a real app, you might want to decode the JWT properly
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        
        return payload.user || null;
      } catch (err) {
        console.error('Failed to parse token:', err);
        return null;
      }
    }
    return null;
  };

  // Check authentication status when the component mounts
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuth,
    getUserFromToken,
    isAuthenticated
  };
};
