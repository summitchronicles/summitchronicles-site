'use client';

import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { ReactNode, useState } from 'react';

interface MountainButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  rippleEffect?: boolean;
  glowOnHover?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export default function MountainButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  rippleEffect = true,
  glowOnHover = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
}: MountainButtonProps) {
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    if (rippleEffect) {
      const rect = e.currentTarget.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const newRipple = {
        id: Date.now(),
        x,
        y,
      };

      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) =>
          prev.filter((ripple) => ripple.id !== newRipple.id)
        );
      }, 600);
    }

    onClick?.();
  };

  const baseClasses = clsx(
    // Base button styles
    'btn-mountain relative inline-flex items-center justify-center',
    'font-semibold transition-all duration-300 focus:outline-none',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',

    // Size variants
    {
      'px-3 py-1.5 text-sm': size === 'sm',
      'px-4 py-2 text-sm': size === 'md',
      'px-6 py-3 text-base': size === 'lg',
      'px-8 py-4 text-lg': size === 'xl',
    },

    // Width
    fullWidth && 'w-full',

    // Variant styles
    {
      // Primary - Alpine Blue
      'bg-alpineBlue text-snowWhite shadow-lg hover:shadow-xl':
        variant === 'primary',
      'hover:bg-blue-700': variant === 'primary' && !disabled,

      // Secondary - Light with border
      'bg-snowWhite text-alpineBlue border-2 border-alpineBlue shadow-md':
        variant === 'secondary',
      'hover:bg-alpineBlue hover:text-snowWhite':
        variant === 'secondary' && !disabled,

      // Accent - Summit Gold
      'bg-summitGold text-charcoal shadow-lg hover:shadow-xl':
        variant === 'accent',
      'hover:bg-yellow-400': variant === 'accent' && !disabled,

      // Ghost - Transparent
      'bg-transparent text-alpineBlue hover:bg-alpineBlue hover:text-snowWhite':
        variant === 'ghost' && !disabled,
      'border border-alpineBlue': variant === 'ghost',

      // Gradient - Mountain gradient
      'bg-gradient-to-r from-alpineBlue to-glacierBlue text-snowWhite shadow-lg':
        variant === 'gradient',
      'hover:from-blue-700 hover:to-blue-500':
        variant === 'gradient' && !disabled,
    },

    className
  );

  return (
    <motion.button
      type={type}
      className={baseClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      whileHover={
        !disabled
          ? {
              scale: 1.02,
              y: -2,
              boxShadow: glowOnHover
                ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 20px rgba(59, 130, 246, 0.3)'
                : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            }
          : undefined
      }
      whileTap={!disabled ? { scale: 0.98, y: 0 } : undefined}
      animate={
        loading
          ? {
              opacity: [1, 0.7, 1],
              transition: { repeat: Infinity, duration: 1.5 },
            }
          : undefined
      }
    >
      {/* Ripple effects */}
      {rippleEffect && (
        <div className="absolute inset-0 overflow-hidden rounded-inherit">
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              className="absolute bg-white/30 rounded-full pointer-events-none"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: 0,
                height: 0,
              }}
              initial={{ width: 0, height: 0, opacity: 1 }}
              animate={{
                width: 300,
                height: 300,
                opacity: 0,
                transition: { duration: 0.6, ease: 'easeOut' },
              }}
            />
          ))}
        </div>
      )}

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 opacity-0 pointer-events-none rounded-inherit"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          transform: 'translateX(-100%)',
        }}
        whileHover={
          !disabled
            ? {
                opacity: 1,
                transform: 'translateX(100%)',
                transition: { duration: 0.8, ease: 'easeOut' },
              }
            : undefined
        }
      />

      {/* Content */}
      <div className="flex items-center space-x-2 relative z-10">
        {icon && iconPosition === 'left' && (
          <motion.span
            animate={loading ? { rotate: 360 } : undefined}
            transition={
              loading
                ? { repeat: Infinity, duration: 1, ease: 'linear' }
                : undefined
            }
          >
            {icon}
          </motion.span>
        )}

        <span className="relative">
          {loading ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="inline-flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Loading...
            </motion.span>
          ) : (
            children
          )}
        </span>

        {icon && iconPosition === 'right' && !loading && (
          <motion.span whileHover={{ x: 2 }} transition={{ duration: 0.2 }}>
            {icon}
          </motion.span>
        )}
      </div>
    </motion.button>
  );
}
