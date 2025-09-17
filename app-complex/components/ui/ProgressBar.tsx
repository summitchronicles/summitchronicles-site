'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showValue?: boolean;
  variant?:
    | 'default'
    | 'gradient'
    | 'altitude'
    | 'success'
    | 'warning'
    | 'danger';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  glow?: boolean;
  className?: string;
  backgroundColor?: string;
  foregroundColor?: string;
}

const variantConfig = {
  default: {
    background: 'var(--color-light-gray)',
    foreground: 'var(--color-alpine-blue)',
    glow: 'rgba(30, 58, 138, 0.3)',
  },
  gradient: {
    background: 'var(--color-light-gray)',
    foreground: 'var(--gradient-alpine)',
    glow: 'rgba(59, 130, 246, 0.3)',
  },
  altitude: {
    background: 'var(--color-light-gray)',
    foreground:
      'linear-gradient(90deg, var(--altitude-base) 0%, var(--altitude-summit) 100%)',
    glow: 'rgba(139, 92, 246, 0.3)',
  },
  success: {
    background: 'var(--color-light-gray)',
    foreground: 'var(--color-success-green)',
    glow: 'rgba(16, 185, 129, 0.3)',
  },
  warning: {
    background: 'var(--color-light-gray)',
    foreground: 'var(--color-warning-orange)',
    glow: 'rgba(245, 158, 11, 0.3)',
  },
  danger: {
    background: 'var(--color-light-gray)',
    foreground: 'var(--color-danger-red)',
    glow: 'rgba(239, 68, 68, 0.3)',
  },
};

const sizeConfig = {
  sm: { height: '0.5rem', textSize: 'text-xs' },
  md: { height: '0.75rem', textSize: 'text-sm' },
  lg: { height: '1rem', textSize: 'text-base' },
};

export default function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  variant = 'default',
  size = 'md',
  animated = true,
  glow = false,
  className = '',
  backgroundColor,
  foregroundColor,
}: ProgressBarProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const percentage = Math.min((value / max) * 100, 100);
  const config = variantConfig[variant];
  const sizeStyle = sizeConfig[size];

  // Animate the value counter
  useEffect(() => {
    if (!animated) {
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const increment = value / 60; // 60 frames for smooth animation

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16); // ~60fps

    return () => clearInterval(timer);
  }, [value, animated]);

  return (
    <div className={clsx('space-y-2', className)}>
      {/* Label and value */}
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && (
            <span
              className={clsx('font-medium text-charcoal', sizeStyle.textSize)}
            >
              {label}
            </span>
          )}
          {showValue && (
            <motion.span
              className={clsx(
                'font-semibold text-stoneGray',
                sizeStyle.textSize
              )}
              key={displayValue} // Re-trigger animation on value change
              initial={animated ? { scale: 1.2, opacity: 0.7 } : false}
              animate={animated ? { scale: 1, opacity: 1 } : false}
              transition={{ duration: 0.2 }}
            >
              {Math.round(displayValue)}
              {max === 100 ? '%' : `/${max}`}
            </motion.span>
          )}
        </div>
      )}

      {/* Progress container */}
      <div className="relative">
        {/* Background track */}
        <div
          className="progress-bar w-full overflow-hidden"
          style={{
            height: sizeStyle.height,
            backgroundColor: backgroundColor || config.background,
          }}
        >
          {/* Progress fill */}
          <motion.div
            className="progress-fill relative"
            style={{
              background: foregroundColor || config.foreground,
              height: '100%',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={
              animated
                ? {
                    duration: 1.2,
                    ease: [0.23, 1, 0.32, 1], // Mountain lift easing
                    delay: 0.2,
                  }
                : { duration: 0 }
            }
          >
            {/* Shimmer effect */}
            {animated && (
              <motion.div
                className="absolute inset-0 opacity-30"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                  width: '30px',
                }}
                animate={{
                  x: [-30, 300],
                  transition: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: 1.5,
                    repeatDelay: 2,
                  },
                }}
              />
            )}
          </motion.div>
        </div>

        {/* Glow effect */}
        {glow && percentage > 0 && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: `0 0 20px ${config.glow}`,
              borderRadius: 'inherit',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        )}

        {/* Pulse effect for completed progress */}
        {percentage >= 100 && animated && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: config.foreground,
              borderRadius: 'inherit',
            }}
            animate={{
              opacity: [0, 0.3, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </div>

      {/* Milestone markers (for altitude variant) */}
      {variant === 'altitude' && (
        <div className="flex justify-between text-xs text-stoneGray pt-1">
          <span>Base</span>
          <span>Mid</span>
          <span>Summit</span>
        </div>
      )}
    </div>
  );
}
