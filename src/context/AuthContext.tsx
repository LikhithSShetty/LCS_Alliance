import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User } from '@/types';
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, role?: 'student' | 'admin') => Promise<void>;
  logout: () => void;
  error: string | null;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the API base URL using Vite's import.meta.env
// Ensure VITE_API_BASE_URL is defined in your root .env file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check localStorage for existing session on initial load
  useEffect(() => {
    setIsLoading(true);
    try {
      const storedToken = localStorage.getItem('lectureToken');
      const storedUser = localStorage.getItem('lectureUser');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      // Clear potentially corrupted data
      localStorage.removeItem('lectureToken');
      localStorage.removeItem('lectureUser');
      console.error("Error loading auth state from localStorage", e);
    }
    setIsLoading(false);
  }, []);

  // Check if user is an admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Login function - calls backend API
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use the /api/auth prefix
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // On success, store token and user, update state
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('lectureToken', data.token);
      localStorage.setItem('lectureUser', JSON.stringify(data.user));

      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.username}!`,
      });

    } catch (error) {
      const errorMessage = (error as Error).message;
      setError(errorMessage);
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
      // Clear any potentially leftover state/storage on failure
      setToken(null);
      setUser(null);
      localStorage.removeItem('lectureToken');
      localStorage.removeItem('lectureUser');
    } finally {
      setIsLoading(false);
    }
  };

  // Register function - calls backend API
  const register = async (username: string, email: string, password: string, role: 'student' | 'admin' = 'student') => {
    setIsLoading(true);
    setError(null);

    try {
      // Use the /api/auth prefix
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // On success, store token and user, update state
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('lectureToken', data.token);
      localStorage.setItem('lectureUser', JSON.stringify(data.user));

      toast({
        title: "Registration successful",
        description: `Welcome, ${username}! Please log in.`, // Or log in directly
      });
      // Optionally log the user in directly after registration
      // await login(email, password); // Uncomment if direct login is desired

    } catch (error) {
      const errorMessage = (error as Error).message;
      setError(errorMessage);
      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      });
      // Clear any potentially leftover state/storage on failure
      setToken(null);
      setUser(null);
      localStorage.removeItem('lectureToken');
      localStorage.removeItem('lectureUser');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function - clears state and localStorage
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('lectureToken');
    localStorage.removeItem('lectureUser');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!token && !!user, // Check for both token and user
        isLoading,
        token,
        login,
        register,
        logout,
        error,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
