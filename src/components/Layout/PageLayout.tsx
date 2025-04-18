import React, { ReactNode } from 'react';
import { Header } from './Header';

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

export const PageLayout = ({ children, className = '' }: PageLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      <footer className="border-t py-4">
        <div className="container flex items-center justify-between">
          <p className="text-sm text-muted-foreground">© 2024 LCS Alliance. All rights reserved.</p>
          <nav className="flex gap-4">
            <a href="#" className="text-sm hover:underline">
              Terms
            </a>
            <a href="#" className="text-sm hover:underline">
              Privacy
            </a>
            <a href="#" className="text-sm hover:underline">
              Contact
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
};
