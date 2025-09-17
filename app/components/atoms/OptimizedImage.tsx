'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  fill?: boolean;
  sizes?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  loading?: 'lazy' | 'eager';
  onLoadingComplete?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 85,
  fill = false,
  sizes,
  objectFit = 'cover',
  objectPosition = 'center',
  placeholder = 'blur',
  blurDataURL,
  loading = 'lazy',
  onLoadingComplete,
  onError,
  ...props
}) => {
  // Generate blur data URL for placeholder if not provided
  const defaultBlurDataURL = `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g"><stop stop-color="#f8fafc" offset="20%"/><stop stop-color="#e2e8f0" offset="50%"/><stop stop-color="#f1f5f9" offset="70%"/></linearGradient></defs><rect width="${width || 400}" height="${height || 300}" fill="url(#g)"/></svg>`
  ).toString('base64')}`;

  const imageProps = {
    src,
    alt,
    className: cn(
      'transition-all duration-500 ease-out',
      'hover:scale-105 hover:shadow-spa-medium',
      className
    ),
    priority,
    quality,
    loading: priority ? ('eager' as const) : loading,
    placeholder:
      blurDataURL || placeholder === 'blur'
        ? ('blur' as const)
        : ('empty' as const),
    blurDataURL:
      blurDataURL || (placeholder === 'blur' ? defaultBlurDataURL : undefined),
    onLoadingComplete,
    onError,
    ...props,
  };

  if (fill) {
    return (
      <div className="relative overflow-hidden">
        <Image
          {...imageProps}
          fill
          sizes={
            sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          }
          style={{
            objectFit,
            objectPosition,
          }}
        />
      </div>
    );
  }

  if (!width || !height) {
    console.warn(
      'OptimizedImage: width and height should be provided when not using fill prop'
    );
    return (
      <div className="relative overflow-hidden">
        <Image
          {...imageProps}
          fill
          sizes={
            sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          }
          style={{
            objectFit,
            objectPosition,
          }}
        />
      </div>
    );
  }

  return (
    <Image
      {...imageProps}
      width={width}
      height={height}
      sizes={sizes}
      style={{
        objectFit,
        objectPosition,
      }}
    />
  );
};

export { OptimizedImage };
export type { OptimizedImageProps };
