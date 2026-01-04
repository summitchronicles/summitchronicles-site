import React from 'react';
import { cn } from '@/lib/utils';

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-auto-rows-[minmax(240px,auto)] gap-4',
        className
      )}
    >
      {children}
    </div>
  );
};

interface BentoItemProps {
  children: React.ReactNode;
  className?: string;
  span?: '1' | '2' | '3' | '4' | 'full';
  rowSpan?: '1' | '2';
}

export const BentoItem: React.FC<BentoItemProps> = ({
  children,
  className,
  span = '1',
  rowSpan = '1',
}) => {
  return (
    <div
      className={cn(
        'relative',
        {
          'col-span-1': span === '1',
          'md:col-span-2': span === '2',
          'md:col-span-3': span === '3',
          'md:col-span-4': span === '4',
          'col-span-1 md:col-span-full': span === 'full',
          'row-span-1': rowSpan === '1',
          'row-span-2': rowSpan === '2',
        },
        className
      )}
    >
      {children}
    </div>
  );
};
