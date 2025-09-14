import React from 'react';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

interface IconProps {
  name: keyof typeof LucideIcons;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 'md', className }) => {
  const IconComponent = LucideIcons[name] as React.ComponentType<LucideIcons.LucideProps>;
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  };

  return (
    <IconComponent 
      className={cn(sizeMap[size], 'text-current', className)} 
    />
  );
};

export { Icon };
export type { IconProps };