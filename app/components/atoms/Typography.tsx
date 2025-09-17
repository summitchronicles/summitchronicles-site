import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

// Display Typography (Hero Headlines)
export const Display = ({
  children,
  className,
  as: Component = 'h1',
}: TypographyProps) => (
  <Component
    className={cn(
      'font-sans font-light text-display text-spa-charcoal leading-tight tracking-tight',
      className
    )}
  >
    {children}
  </Component>
);

export const DisplayLarge = ({
  children,
  className,
  as: Component = 'h1',
}: TypographyProps) => (
  <Component
    className={cn(
      'font-sans font-light text-display-lg text-spa-charcoal leading-tight tracking-tight',
      className
    )}
  >
    {children}
  </Component>
);

// Headings
export const H1 = ({
  children,
  className,
  as: Component = 'h1',
}: TypographyProps) => (
  <Component
    className={cn(
      'font-sans font-normal text-h1 text-spa-charcoal leading-tight',
      className
    )}
  >
    {children}
  </Component>
);

export const H1Large = ({
  children,
  className,
  as: Component = 'h1',
}: TypographyProps) => (
  <Component
    className={cn(
      'font-sans font-normal text-h1-lg text-spa-charcoal leading-tight',
      className
    )}
  >
    {children}
  </Component>
);

export const H2 = ({
  children,
  className,
  as: Component = 'h2',
}: TypographyProps) => (
  <Component
    className={cn(
      'font-sans font-normal text-2xl text-spa-charcoal leading-tight',
      className
    )}
  >
    {children}
  </Component>
);

export const H3 = ({
  children,
  className,
  as: Component = 'h3',
}: TypographyProps) => (
  <Component
    className={cn(
      'font-sans font-medium text-xl text-spa-charcoal leading-tight',
      className
    )}
  >
    {children}
  </Component>
);

export const H4 = ({
  children,
  className,
  as: Component = 'h4',
}: TypographyProps) => (
  <Component
    className={cn(
      'font-sans font-medium text-lg text-spa-charcoal leading-tight',
      className
    )}
  >
    {children}
  </Component>
);

// Body Text
export const Body = ({
  children,
  className,
  as: Component = 'p',
}: TypographyProps) => (
  <Component
    className={cn(
      'font-sans text-base text-spa-slate leading-relaxed',
      className
    )}
  >
    {children}
  </Component>
);

export const BodyLarge = ({
  children,
  className,
  as: Component = 'p',
}: TypographyProps) => (
  <Component
    className={cn(
      'font-sans text-lg text-spa-slate leading-relaxed',
      className
    )}
  >
    {children}
  </Component>
);

// Small Text
export const Small = ({
  children,
  className,
  as: Component = 'span',
}: TypographyProps) => (
  <Component className={cn('font-sans text-sm text-spa-slate', className)}>
    {children}
  </Component>
);

export const Caption = ({
  children,
  className,
  as: Component = 'span',
}: TypographyProps) => (
  <Component
    className={cn(
      'font-sans text-xs text-spa-slate uppercase tracking-wide',
      className
    )}
  >
    {children}
  </Component>
);

// Serif Typography for Premium Content
export const SeriaText = ({
  children,
  className,
  as: Component = 'p',
}: TypographyProps) => (
  <Component
    className={cn(
      'font-serif text-lg text-spa-charcoal leading-relaxed',
      className
    )}
  >
    {children}
  </Component>
);

export const SerifQuote = ({
  children,
  className,
  as: Component = 'blockquote',
}: TypographyProps) => (
  <Component
    className={cn(
      'font-serif text-xl text-spa-charcoal italic leading-relaxed border-l-4 border-summit-gold pl-6 my-6',
      className
    )}
  >
    {children}
  </Component>
);
