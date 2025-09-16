import React from 'react';
import { Header } from '../organisms/Header';
import { Footer } from '../organisms/Footer';
import { cn } from '@/lib/utils';

interface DefaultLayoutProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ 
  children, 
  className,
  maxWidth = '7xl',
  padding = 'lg'
}) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  const paddingClasses = {
    none: '',
    sm: 'px-2 sm:px-4',
    md: 'px-4 sm:px-6',
    lg: 'px-4 sm:px-6 lg:px-8',
  };

  return (
    <div className="min-h-screen bg-spa-stone flex flex-col">
      {/* Skip link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-alpine-blue text-white px-4 py-2 rounded-lg font-medium z-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-alpine-blue"
      >
        Skip to main content
      </a>
      <Header />
      
      {/* Main content with proper spacing for fixed header */}
      <main 
        id="main-content"
        className={cn(
          'flex-1 pt-16', // pt-16 accounts for fixed header height
          className
        )}>
        <div className={cn(
          'mx-auto',
          maxWidthClasses[maxWidth],
          paddingClasses[padding]
        )}>
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export { DefaultLayout };
export type { DefaultLayoutProps };