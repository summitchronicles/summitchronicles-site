import { memo, useMemo, useCallback, useRef, useEffect } from 'react';

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!this.instance) {
      this.instance = new PerformanceMonitor();
    }
    return this.instance;
  }

  // Measure component render time
  measureRender(componentName: string, renderFn: () => void): void {
    const start = performance.now();
    renderFn();
    const end = performance.now();

    if (!this.metrics.has(componentName)) {
      this.metrics.set(componentName, []);
    }

    this.metrics.get(componentName)!.push(end - start);
  }

  // Get performance metrics for a component
  getMetrics(componentName: string): {
    average: number;
    min: number;
    max: number;
    count: number;
  } | null {
    const times = this.metrics.get(componentName);
    if (!times || times.length === 0) return null;

    return {
      average: times.reduce((sum, time) => sum + time, 0) / times.length,
      min: Math.min(...times),
      max: Math.max(...times),
      count: times.length,
    };
  }

  // Clear metrics
  clearMetrics(componentName?: string): void {
    if (componentName) {
      this.metrics.delete(componentName);
    } else {
      this.metrics.clear();
    }
  }

  // Get all metrics
  getAllMetrics(): Record<string, ReturnType<typeof this.getMetrics>> {
    const result: Record<string, ReturnType<typeof this.getMetrics>> = {};
    for (const [name] of this.metrics) {
      result[name] = this.getMetrics(name);
    }
    return result;
  }
}

// Performance-optimized React utilities
export const createMemoComponent = <T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  propsAreEqual?: (prevProps: T, nextProps: T) => boolean
) => {
  return memo(Component, propsAreEqual);
};

// Hook for expensive calculations
export const useExpensiveCalculation = <T>(
  calculation: () => T,
  dependencies: React.DependencyList
): T => {
  return useMemo(calculation, dependencies);
};

// Hook for stable callbacks
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  dependencies: React.DependencyList
): T => {
  return useCallback(callback, dependencies);
};

// Hook for performance monitoring
export const useRenderCount = (componentName: string): number => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} rendered ${renderCount.current} times`);
    }
  });

  return renderCount.current;
};

// Hook for debounced values
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => observer.unobserve(element);
  }, [elementRef, options]);

  return isIntersecting;
};

// Image optimization utilities
export const getOptimizedImageProps = (
  src: string,
  alt: string,
  width?: number,
  height?: number
) => ({
  src,
  alt,
  width,
  height,
  loading: 'lazy' as const,
  placeholder: 'blur' as const,
  blurDataURL: `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f0f0f0"/></svg>`
  ).toString('base64')}`,
  sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
});

// Bundle size utilities
export const dynamicImport = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options?: {
    loading?: React.ComponentType;
    error?: React.ComponentType<{ error: Error; retry: () => void }>;
  }
) => {
  return React.lazy(async () => {
    try {
      const importedModule = await importFn();
      return importedModule as { default: React.ComponentType<any> };
    } catch (error) {
      if (options?.error) {
        const ErrorComponent = options.error;
        return {
          default: () =>
            React.createElement(ErrorComponent, {
              error: error as Error,
              retry: () => window.location.reload(),
            }) as React.ReactElement,
        } as { default: React.ComponentType<any> };
      }
      throw error;
    }
  });
};

// Web Vitals monitoring
export interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

export const reportWebVitals = (metric: WebVitalsMetric): void => {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics service
    console.log('Web Vital:', metric);

    // Example: Send to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        value: Math.round(
          metric.name === 'CLS' ? metric.value * 1000 : metric.value
        ),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    }
  }
};

// Resource loading optimization
export const preloadResource = (
  href: string,
  as: 'script' | 'style' | 'font' | 'image'
): void => {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;

  if (as === 'font') {
    link.crossOrigin = 'anonymous';
  }

  document.head.appendChild(link);
};

// Memory leak prevention
export const useCleanup = (cleanup: () => void): void => {
  useEffect(() => {
    return cleanup;
  }, [cleanup]);
};

// Component-level performance tracking
export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => {
    const monitor = PerformanceMonitor.getInstance();
    const renderCount = useRenderCount(componentName);

    useEffect(() => {
      monitor.measureRender(componentName, () => {
        // Component rendered
      });
    });

    return React.createElement(Component, { ...props, ref } as any);
  });

  WrappedComponent.displayName = `withPerformanceTracking(${componentName})`;

  return WrappedComponent;
};

// React import
import React from 'react';
