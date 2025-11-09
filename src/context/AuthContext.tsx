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

// DEMO MODE - Set to true to bypass backend and use mock authentication
const DEMO_MODE = true;

// Mock users for demo
const MOCK_USERS = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@demo.com',
    password: 'admin',
    role: 'admin' as const,
  },
  {
    id: '2',
    username: 'student',
    email: 'student@demo.com',
    password: 'student',
    role: 'student' as const,
  },
];

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

  // Login function - DEMO MODE or calls backend API
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (DEMO_MODE) {
        // DEMO MODE - Mock login without backend
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        
        const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
        
        if (!mockUser) {
          throw new Error('Invalid credentials. Try: admin@demo.com / admin or student@demo.com / student');
        }

        const userData = {
          id: mockUser.id,
          username: mockUser.username,
          email: mockUser.email,
          role: mockUser.role,
        };
        
        const mockToken = btoa(`${mockUser.id}:${Date.now()}`);
        
        setToken(mockToken);
        setUser(userData);
        localStorage.setItem('lectureToken', mockToken);
        localStorage.setItem('lectureUser', JSON.stringify(userData));

        toast({
          title: "Login successful (Demo Mode)",
          description: `Welcome back, ${userData.username}!`,
        });
        
        return;
      }

      // REAL MODE - Use backend API
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

  // Register function - DEMO MODE or calls backend API
  const register = async (username: string, email: string, password: string, role: 'student' | 'admin' = 'student') => {
    setIsLoading(true);
    setError(null);

    try {
      if (DEMO_MODE) {
        // DEMO MODE - Mock registration without backend
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        
        const userData = {
          id: String(Date.now()),
          username,
          email,
          role,
        };
        
        const mockToken = btoa(`${userData.id}:${Date.now()}`);
        
        setToken(mockToken);
        setUser(userData);
        localStorage.setItem('lectureToken', mockToken);
        localStorage.setItem('lectureUser', JSON.stringify(userData));

        toast({
          title: "Registration successful (Demo Mode)",
          description: `Welcome, ${username}!`,
        });
        
        return;
      }

      // REAL MODE - Use backend API
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
        description: `Welcome, ${username}!`,
      });

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
