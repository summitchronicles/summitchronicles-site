'use client';

import { Suspense, lazy, useState, useEffect, useRef } from 'react';

// Lazy load the MeshGradient component - temporarily disabled
// const MeshGradient = lazy(() =>
//   import('@paper-design/shaders-react').then(module => ({
//     default: module.MeshGradient
//   }))
// )

interface InteractiveBackgroundProps {
  variant?: 'hero' | 'section' | 'subtle';
  className?: string;
}

export function InteractiveBackground({
  variant = 'subtle',
  className = '',
}: InteractiveBackgroundProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Delay loading slightly to ensure smooth transition
          setTimeout(() => setShouldLoad(true), 100);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  // Enhanced color configurations for different variants
  const getColors = () => {
    switch (variant) {
      case 'hero':
        return [
          '#1e3a8a', // alpine-blue-900
          '#fbbf24', // summit-gold-400
          '#0ea5e9', // glacier-500
          '#3b82f6', // alpine-blue-500
        ];
      case 'section':
        return [
          '#f8fafc', // spa-stone-50
          '#e2e8f0', // spa-stone-200
          '#bae6fd', // glacier-200
          '#dbeafe', // alpine-blue-100
        ];
      case 'subtle':
      default:
        return [
          '#f8fafc', // spa-stone-50
          '#f1f5f9', // spa-stone-100
          '#f0f9ff', // glacier-50
          '#ffffff', // pure white
        ];
    }
  };

  const getSettings = () => {
    switch (variant) {
      case 'hero':
        return {
          distortion: 0.8,
          swirl: 0.6,
          speed: 0.3,
        };
      case 'section':
        return {
          distortion: 0.5,
          swirl: 0.4,
          speed: 0.2,
        };
      case 'subtle':
      default:
        return {
          distortion: 0.3,
          swirl: 0.2,
          speed: 0.1,
        };
    }
  };

  const colors = getColors();
  const settings = getSettings();

  // Static fallback background for better performance
  const StaticBackground = () => (
    <div
      className="absolute inset-0"
      style={{
        background:
          variant === 'hero'
            ? 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #0ea5e9 100%)'
            : 'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(226, 232, 240, 0.6) 100%)',
        opacity: 0.6,
      }}
    />
  );

  return (
    <div ref={ref} className={`absolute inset-0 -z-10 ${className}`}>
      {/* Temporarily use static background while MeshGradient is disabled */}
      <StaticBackground />

      {/* Overlay to maintain readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(226, 232, 240, 0.6) 100%)',
        }}
      />
    </div>
  );
}
