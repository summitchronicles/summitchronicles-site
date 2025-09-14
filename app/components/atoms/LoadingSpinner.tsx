import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className={cn(
        'animate-spin rounded-full border-2 border-spa-cloud border-t-alpine-blue',
        sizes[size]
      )}></div>
    </div>
  );
};

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'md',
  className
}) => {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center space-y-4 py-12',
      className
    )}>
      <LoadingSpinner size={size} />
      <p className="text-spa-slate text-sm font-medium">{message}</p>
    </div>
  );
};

export { LoadingSpinner, LoadingState };
export type { LoadingSpinnerProps, LoadingStateProps };