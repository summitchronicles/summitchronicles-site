import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangle' | 'circle';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangle',
  width,
  height,
  lines = 1,
}) => {
  const baseClasses = 'animate-pulse bg-spa-mist rounded';

  const variants = {
    text: 'h-4',
    rectangle: 'h-20',
    circle: 'rounded-full w-12 h-12',
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(baseClasses, variants.text)}
            style={{
              width: width || (index === lines - 1 ? '75%' : '100%'),
              height: height,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, variants[variant], className)}
      style={{
        width: variant === 'circle' ? undefined : width,
        height: variant === 'circle' ? undefined : height,
      }}
    />
  );
};

// Common skeleton patterns
const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={cn(
      'space-y-4 p-6 bg-white rounded-lg border border-spa-cloud',
      className
    )}
  >
    <div className="flex items-center space-x-4">
      <Skeleton variant="circle" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
    <Skeleton variant="text" lines={3} />
    <div className="flex space-x-2">
      <Skeleton variant="rectangle" width={80} height={32} />
      <Skeleton variant="rectangle" width={120} height={32} />
    </div>
  </div>
);

const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className,
}) => (
  <div className={cn('space-y-2', className)}>
    <Skeleton variant="text" lines={lines} />
  </div>
);

export { Skeleton, SkeletonCard, SkeletonText };
export type { SkeletonProps };
