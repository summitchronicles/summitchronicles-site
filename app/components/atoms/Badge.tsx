import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'summit';
  size?: 'sm' | 'default' | 'lg';
}

export function Badge({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        // Base styles
        'border border-transparent',
        // Size variants
        {
          'text-xs px-2 py-0.5 rounded-full': size === 'sm',
          'text-xs px-2.5 py-0.5 rounded-full': size === 'default',
          'text-sm px-3 py-1 rounded-full': size === 'lg',
        },
        // Color variants
        {
          'bg-primary text-primary-foreground hover:bg-primary/80':
            variant === 'default',
          'bg-secondary text-secondary-foreground hover:bg-secondary/80':
            variant === 'secondary',
          'bg-destructive text-destructive-foreground hover:bg-destructive/80':
            variant === 'destructive',
          'text-foreground border-input bg-background hover:bg-accent hover:text-accent-foreground':
            variant === 'outline',
          'bg-alpine-blue text-white hover:bg-alpine-blue/80':
            variant === 'summit',
        },
        className
      )}
      {...props}
    />
  );
}
