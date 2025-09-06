"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";

interface StatusIndicatorProps {
  status: 'active' | 'warning' | 'danger' | 'success' | 'info';
  text: string;
  pulse?: boolean;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const statusConfig = {
  active: {
    className: "status-active",
    icon: "⚡",
    color: "rgb(16, 185, 129)"
  },
  warning: {
    className: "status-warning", 
    icon: "⚠️",
    color: "rgb(245, 158, 11)"
  },
  danger: {
    className: "status-danger",
    icon: "🚨", 
    color: "rgb(239, 68, 68)"
  },
  success: {
    className: "status-active",
    icon: "✅",
    color: "rgb(16, 185, 129)"
  },
  info: {
    className: "bg-glacierBlue/10 text-glacierBlue border border-glacierBlue/20",
    icon: "ℹ️",
    color: "rgb(14, 165, 233)"
  }
};

export default function StatusIndicator({
  status,
  text,
  pulse = true,
  showIcon = true,
  size = 'md',
  className = ""
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm", 
    lg: "px-4 py-2 text-base"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.3, 
        ease: "easeOut",
        type: "spring",
        stiffness: 300
      }}
      className={clsx(
        "status-indicator inline-flex items-center rounded-full font-medium",
        "relative overflow-hidden backdrop-blur-sm",
        config.className,
        sizeClasses[size],
        className
      )}
    >
      {/* Pulsing dot indicator */}
      <motion.div
        className="absolute left-2 top-1/2 w-2 h-2 rounded-full"
        style={{ backgroundColor: config.color }}
        initial={{ scale: 0.8, opacity: 0.8 }}
        animate={pulse ? {
          scale: [0.8, 1.2, 0.8],
          opacity: [0.8, 1, 0.8]
        } : { scale: 0.8, opacity: 0.8 }}
        transition={pulse ? {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        } : undefined}
      />
      
      {/* Content with spacing for the dot */}
      <div className="ml-4 flex items-center space-x-1">
        {showIcon && (
          <motion.span
            initial={{ rotate: -10, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="flex-shrink-0"
          >
            {config.icon}
          </motion.span>
        )}
        <span>{text}</span>
      </div>
      
      {/* Subtle shimmer effect */}
      <motion.div
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`
        }}
        animate={{
          x: ['-100%', '100%'],
          opacity: [0, 0.5, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: Math.random() * 2 // Random delay for staggered effect
        }}
      />
    </motion.div>
  );
}