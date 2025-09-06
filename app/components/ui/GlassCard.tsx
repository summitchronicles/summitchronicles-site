"use client";

import { motion } from "framer-motion";
import { clsx } from "clsx";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover3D?: boolean;
  glowEffect?: boolean;
  elevation?: 1 | 2 | 3 | 4;
  variant?: 'light' | 'dark' | 'colored';
  accentColor?: string;
  onClick?: () => void;
  delay?: number;
}

export default function GlassCard({
  children,
  className = "",
  hover3D = false,
  glowEffect = false,
  elevation = 1,
  variant = 'light',
  accentColor,
  onClick,
  delay = 0
}: GlassCardProps) {
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20, 
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.23, 1, 0.32, 1]
      }
    }
  };

  const hoverVariants = {
    hover: {
      y: -8,
      scale: hover3D ? 1.02 : 1,
      rotateX: hover3D ? -5 : 0,
      rotateY: hover3D ? 5 : 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={clsx(
        // Base glass card styles
        "glass-card relative overflow-hidden",
        
        // Elevation styles
        `card-elevation-${elevation}`,
        
        // Variant styles
        variant === 'dark' && "glass-card-dark",
        variant === 'colored' && accentColor && "border-l-4",
        
        // 3D hover effect
        hover3D && "card-3d",
        
        // Interactive cursor
        onClick && "cursor-pointer",
        
        // Glow effect
        glowEffect && "relative",
        
        className
      )}
      style={{
        borderLeftColor: variant === 'colored' ? accentColor : undefined,
        perspective: hover3D ? 1000 : undefined
      }}
      onClick={onClick}
      {...hoverVariants}
    >
      {/* Glow effect overlay */}
      {glowEffect && (
        <motion.div
          className="absolute inset-0 opacity-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${accentColor || 'rgba(59, 130, 246, 0.3)'} 0%, transparent 70%)`,
            filter: 'blur(20px)',
          }}
          whileHover={{
            opacity: 0.5,
            scale: 1.1,
            transition: { duration: 0.3 }
          }}
        />
      )}
      
      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
          transform: 'translateX(-100%)'
        }}
        whileHover={{
          opacity: 1,
          transform: 'translateX(100%)',
          transition: { duration: 0.8, ease: "easeOut" }
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}