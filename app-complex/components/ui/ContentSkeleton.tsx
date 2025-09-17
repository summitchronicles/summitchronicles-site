'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface ContentSkeletonProps {
  variant?: 'card' | 'text' | 'avatar' | 'chart' | 'button' | 'custom';
  lines?: number;
  width?: string | number;
  height?: string | number;
  className?: string;
  animate?: boolean;
  children?: React.ReactNode;
}

export default function ContentSkeleton({
  variant = 'text',
  lines = 3,
  width = '100%',
  height = 'auto',
  className = '',
  animate = true,
  children,
}: ContentSkeletonProps) {
  const baseClasses =
    'content-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200';

  const shimmerAnimation = animate
    ? {
        backgroundPosition: ['-200% 0', '200% 0'],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }
    : undefined;

  if (variant === 'custom' && children) {
    return (
      <motion.div
        className={clsx(baseClasses, className)}
        style={{ width, height }}
        animate={shimmerAnimation}
      >
        {children}
      </motion.div>
    );
  }

  if (variant === 'card') {
    return (
      <motion.div
        className={clsx(
          'p-6 rounded-xl border border-gray-200 space-y-4',
          className
        )}
        style={{ width, height }}
      >
        {/* Header with avatar and title */}
        <div className="flex items-center space-x-3">
          <motion.div
            className={clsx(baseClasses, 'w-12 h-12 rounded-full')}
            animate={shimmerAnimation}
          />
          <div className="flex-1 space-y-2">
            <motion.div
              className={clsx(baseClasses, 'h-4 w-3/4 rounded')}
              animate={shimmerAnimation}
            />
            <motion.div
              className={clsx(baseClasses, 'h-3 w-1/2 rounded')}
              animate={shimmerAnimation}
            />
          </div>
        </div>

        {/* Content lines */}
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <motion.div
              key={i}
              className={clsx(
                baseClasses,
                'h-3 rounded',
                i === lines - 1 ? 'w-2/3' : 'w-full'
              )}
              animate={shimmerAnimation}
              transition={
                shimmerAnimation?.transition
                  ? {
                      ...shimmerAnimation.transition,
                      delay: i * 0.1,
                    }
                  : undefined
              }
            />
          ))}
        </div>

        {/* Footer actions */}
        <div className="flex space-x-2 pt-2">
          <motion.div
            className={clsx(baseClasses, 'h-8 w-16 rounded-lg')}
            animate={shimmerAnimation}
          />
          <motion.div
            className={clsx(baseClasses, 'h-8 w-16 rounded-lg')}
            animate={shimmerAnimation}
          />
        </div>
      </motion.div>
    );
  }

  if (variant === 'avatar') {
    return (
      <motion.div
        className={clsx(baseClasses, 'rounded-full', className)}
        style={{ width: width || '3rem', height: height || '3rem' }}
        animate={shimmerAnimation}
      />
    );
  }

  if (variant === 'button') {
    return (
      <motion.div
        className={clsx(baseClasses, 'rounded-lg', className)}
        style={{
          width: width || '6rem',
          height: height || '2.5rem',
        }}
        animate={shimmerAnimation}
      />
    );
  }

  if (variant === 'chart') {
    return (
      <motion.div
        className={clsx(
          'space-y-4 p-4 rounded-xl border border-gray-200',
          className
        )}
        style={{ width, height: height || '300px' }}
      >
        {/* Chart title */}
        <motion.div
          className={clsx(baseClasses, 'h-4 w-1/3 rounded')}
          animate={shimmerAnimation}
        />

        {/* Chart bars */}
        <div className="flex items-end justify-between space-x-1 h-48">
          {Array.from({ length: 7 }).map((_, i) => (
            <motion.div
              key={i}
              className={clsx(baseClasses, 'w-8 rounded-t')}
              style={{
                height: `${20 + (i % 4) * 30}%`,
                minHeight: '20%',
              }}
              animate={shimmerAnimation}
              transition={
                shimmerAnimation?.transition
                  ? {
                      ...shimmerAnimation.transition,
                      delay: i * 0.1,
                    }
                  : undefined
              }
            />
          ))}
        </div>

        {/* Chart labels */}
        <div className="flex justify-between">
          {Array.from({ length: 7 }).map((_, i) => (
            <motion.div
              key={i}
              className={clsx(baseClasses, 'h-3 w-8 rounded')}
              animate={shimmerAnimation}
              transition={
                shimmerAnimation?.transition
                  ? {
                      ...shimmerAnimation.transition,
                      delay: i * 0.05,
                    }
                  : undefined
              }
            />
          ))}
        </div>
      </motion.div>
    );
  }

  // Default text variant
  return (
    <div className={clsx('space-y-2', className)} style={{ width }}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          className={clsx(
            baseClasses,
            'h-4 rounded',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
          style={{ height: height !== 'auto' ? height : undefined }}
          animate={shimmerAnimation}
          transition={
            shimmerAnimation?.transition
              ? {
                  ...shimmerAnimation.transition,
                  delay: i * 0.1,
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}
