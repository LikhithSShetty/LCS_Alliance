
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This is a mock implementation for demo purposes
// In a real app, this would connect to your backend
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('lectureUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('lectureUser');
      }
    }
    setIsLoading(false);
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (email === 'student@example.com' && password === 'password') {
        const userData: User = {
          id: '1',
          username: 'testuser',
          email: 'student@example.com',
          role: 'student'
        };
        
        setUser(userData);
        localStorage.setItem('lectureUser', JSON.stringify(userData));
      } else if (email === 'admin@example.com' && password === 'password') {
        const adminData: User = {
          id: '2',
          username: 'adminuser',
          email: 'admin@example.com',
          role: 'admin'
        };
        
        setUser(adminData);
        localStorage.setItem('lectureUser', JSON.stringify(adminData));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock register function
  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (!username || !email || !password) {
        throw new Error('All fields are required');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      // In a real app, you would send this to your backend
      const userData: User = {
        id: Math.random().toString(36).substring(2, 9),
        username,
        email,
        role: 'student'
      };
      
      setUser(userData);
      localStorage.setItem('lectureUser', JSON.stringify(userData));
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lectureUser');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        error
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
