import { ImageProps } from 'next/image';

// Image optimization utilities for Peak Performance Summit Chronicles
export interface OptimizedImageConfig {
  quality?: number;
  priority?: boolean;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

// Predefined image configurations for different use cases
export const IMAGE_CONFIGS = {
  hero: {
    quality: 90,
    priority: true,
    sizes: '100vw',
    placeholder: 'blur' as const,
  },
  thumbnail: {
    quality: 80,
    priority: false,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    placeholder: 'blur' as const,
  },
  gallery: {
    quality: 85,
    priority: false,
    sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw',
    placeholder: 'blur' as const,
  },
  avatar: {
    quality: 90,
    priority: false,
    sizes: '(max-width: 768px) 96px, 128px',
    placeholder: 'blur' as const,
  },
  background: {
    quality: 75,
    priority: false,
    sizes: '100vw',
    placeholder: 'blur' as const,
  },
} as const;

// Generate blur placeholder for images
export const generateBlurDataURL = (
  width: number = 400,
  height: number = 300
): string => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f0f9ff;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#e0f2fe;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f8fafc;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
    </svg>
  `;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

// Get optimized image props for Next.js Image component
export const getOptimizedImageProps = (
  src: string,
  alt: string,
  width?: number,
  height?: number,
  config: keyof typeof IMAGE_CONFIGS = 'thumbnail',
  customConfig?: OptimizedImageConfig
): Partial<ImageProps> => {
  const baseConfig = IMAGE_CONFIGS[config];
  const finalConfig = { ...baseConfig, ...customConfig };

  return {
    src,
    alt,
    width,
    height,
    quality: finalConfig.quality,
    priority: finalConfig.priority,
    sizes: finalConfig.sizes,
    placeholder: finalConfig.placeholder,
    blurDataURL: finalConfig.blurDataURL || generateBlurDataURL(width, height),
    loading: finalConfig.priority ? 'eager' : 'lazy',
    style: {
      width: '100%',
      height: 'auto',
    },
  };
};

// Responsive image breakpoints
export const RESPONSIVE_BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  xl: 1536,
} as const;

// Generate responsive sizes string
export const generateResponsiveSizes = (
  breakpoints: Partial<Record<keyof typeof RESPONSIVE_BREAKPOINTS, string>>
): string => {
  const entries = Object.entries(breakpoints);
  const sizeQueries = entries.map(([key, size]) => {
    const breakpoint =
      RESPONSIVE_BREAKPOINTS[key as keyof typeof RESPONSIVE_BREAKPOINTS];
    return `(max-width: ${breakpoint}px) ${size}`;
  });

  // Default size (largest breakpoint)
  const defaultSize = entries[entries.length - 1][1];

  return [...sizeQueries, defaultSize].join(', ');
};

// Image format optimization
export const getOptimalImageFormat = (src: string): string => {
  // Check if we should serve WebP/AVIF based on browser support
  if (typeof window !== 'undefined') {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Check WebP support
    if (
      ctx &&
      canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
    ) {
      return 'webp';
    }

    // Check AVIF support
    if (
      ctx &&
      canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0
    ) {
      return 'avif';
    }
  }

  return 'jpeg';
};

// Image loading performance utilities
export class ImageLoadingManager {
  private static instance: ImageLoadingManager;
  private loadingImages: Set<string> = new Set();
  private loadedImages: Set<string> = new Set();
  private failedImages: Set<string> = new Set();

  static getInstance(): ImageLoadingManager {
    if (!this.instance) {
      this.instance = new ImageLoadingManager();
    }
    return this.instance;
  }

  preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.loadedImages.has(src)) {
        resolve();
        return;
      }

      if (this.failedImages.has(src)) {
        reject(new Error(`Image ${src} previously failed to load`));
        return;
      }

      if (this.loadingImages.has(src)) {
        // Already loading, wait for it
        const checkLoaded = () => {
          if (this.loadedImages.has(src)) {
            resolve();
          } else if (this.failedImages.has(src)) {
            reject(new Error(`Image ${src} failed to load`));
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
        return;
      }

      this.loadingImages.add(src);

      const img = new Image();
      img.onload = () => {
        this.loadingImages.delete(src);
        this.loadedImages.add(src);
        resolve();
      };
      img.onerror = () => {
        this.loadingImages.delete(src);
        this.failedImages.add(src);
        reject(new Error(`Failed to load image: ${src}`));
      };
      img.src = src;
    });
  }

  preloadImages(srcs: string[]): Promise<void[]> {
    return Promise.all(srcs.map((src) => this.preloadImage(src)));
  }

  isImageLoaded(src: string): boolean {
    return this.loadedImages.has(src);
  }

  isImageFailed(src: string): boolean {
    return this.failedImages.has(src);
  }

  clearCache(): void {
    this.loadingImages.clear();
    this.loadedImages.clear();
    this.failedImages.clear();
  }
}

// Lazy loading utilities
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver => {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };

  return new IntersectionObserver(callback, defaultOptions);
};

// Image optimization hooks for React components
export const useImagePreload = (src: string | string[]) => {
  const manager = ImageLoadingManager.getInstance();

  React.useEffect(() => {
    if (Array.isArray(src)) {
      manager.preloadImages(src);
    } else {
      manager.preloadImage(src);
    }
  }, [src, manager]);
};

// Progressive image loading component helper
export const useProgressiveImage = (src: string, placeholderSrc?: string) => {
  const [currentSrc, setCurrentSrc] = React.useState(placeholderSrc || '');
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setCurrentSrc(src);
      setLoading(false);
    };
    img.onerror = () => {
      setError(true);
      setLoading(false);
    };
    img.src = src;
  }, [src]);

  return { src: currentSrc, loading, error };
};

// Asset compression utilities
export const getCompressedAssetUrl = (
  url: string,
  quality: number = 80,
  format: 'webp' | 'avif' | 'jpeg' = 'webp'
): string => {
  // This would integrate with your CDN or image optimization service
  // For now, return the original URL
  // In production, you might use something like Cloudinary, ImageKit, etc.

  if (url.includes('unsplash.com')) {
    // Unsplash URL optimization
    const params = new URLSearchParams({
      q: quality.toString(),
      fm: format,
      auto: 'format,compress',
    });
    return `${url}&${params.toString()}`;
  }

  return url;
};

// React import
import React from 'react';
