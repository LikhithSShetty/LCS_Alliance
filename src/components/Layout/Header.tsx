import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { LogOut, Menu, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/6c287f3a-c3f0-4df7-bd5f-a8608f03bc1e.png" 
            alt="LCS ALLIANCE UNIVERSITY Logo" 
            className="h-12 w-12"
          />
          <span className="font-bold text-xl text-primary-100">LCS ALLIANCE UNIVERSITY</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-text-100 hover:text-primary-100 transition-colors">
            Home
          </Link>
          <Link to="/classes" className="text-text-100 hover:text-primary-100 transition-colors">
            Classes
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard" className="text-text-100 hover:text-primary-100 transition-colors">
              Dashboard
            </Link>
          )}
        </nav>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full border-primary-100 text-primary-100">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {user?.username}
                </div>
                <div className="px-2 pb-1.5 text-xs text-muted-foreground">
                  {user?.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-red-500 cursor-pointer"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')}
                className="text-text-100 hover:text-primary-100"
              >
                Log in
              </Button>
              <Button 
                variant="default" 
                onClick={() => navigate('/register')}
                className="bg-primary-100 hover:bg-primary-200 text-white"
              >
                Sign up
              </Button>
            </>
          )}
          
          <Button variant="outline" size="icon" className="md:hidden border-primary-100 text-primary-100">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
