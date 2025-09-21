import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'summit';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      asChild = false,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-alpine-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

    const variants = {
      primary:
        'bg-alpine-blue text-white hover:bg-blue-800 shadow-spa-soft hover:shadow-spa-medium',
      secondary:
        'bg-spa-mist text-spa-charcoal hover:bg-spa-cloud shadow-spa-soft hover:shadow-spa-medium',
      ghost: 'text-spa-slate hover:text-alpine-blue hover:bg-spa-stone',
      summit:
        'bg-summit-gold text-spa-charcoal hover:bg-yellow-500 shadow-spa-soft hover:shadow-spa-medium font-medium',
    };

    const sizes = {
      sm: 'h-11 px-4 text-base min-h-[44px]', // Mobile-optimized: 44px minimum touch target
      md: 'h-12 px-6 py-3 min-h-[48px]', // Mobile-optimized: 48px minimum touch target  
      lg: 'h-14 px-8 text-lg min-h-[56px]', // Mobile-optimized: 56px touch target
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        className: cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className,
          (children.props as any)?.className
        ),
        ...props,
      });
    }

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
