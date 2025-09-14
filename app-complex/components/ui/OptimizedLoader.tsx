"use client";

import { motion } from "framer-motion";
import { memo } from "react";

interface OptimizedLoaderProps {
  size?: "sm" | "md" | "lg";
  variant?: "summit" | "expedition" | "minimal";
  className?: string;
}

const OptimizedLoader = memo(({ 
  size = "md", 
  variant = "summit",
  className = ""
}: OptimizedLoaderProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };

  const Summit = () => (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      {/* Mountain peaks */}
      <svg viewBox="0 0 48 48" className="w-full h-full">
        <motion.path
          d="M8 32 L16 16 L24 24 L32 8 L40 20 L48 32"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-summitGold"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
          }}
        />
        
        {/* Summit marker */}
        <motion.circle
          cx="32"
          cy="8"
          r="2"
          className="fill-summitGold"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
    </div>
  );

  const Expedition = () => (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      {/* Rotating compass */}
      <motion.div
        className="w-full h-full rounded-full border-2 border-alpineBlue/30 relative"
        animate={{ rotate: 360 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {/* North indicator */}
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-4 bg-summitGold rounded-full" />
        
        {/* Center dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-summitGold rounded-full"
          animate={{
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Direction lines */}
        {[0, 90, 180, 270].map((rotation, index) => (
          <motion.div
            key={rotation}
            className="absolute top-1/2 left-1/2 w-0.5 bg-alpineBlue/50"
            style={{
              height: size === "lg" ? "24px" : size === "md" ? "18px" : "12px",
              transformOrigin: "center top",
              transform: `translate(-50%, -50%) rotate(${rotation}deg)`
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  );

  const Minimal = () => (
    <div className={`${sizeClasses[size]} ${className}`}>
      <motion.div
        className="w-full h-full border-2 border-summitGold/30 border-t-summitGold rounded-full"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );

  const variants = {
    summit: Summit,
    expedition: Expedition,
    minimal: Minimal
  };

  const LoaderComponent = variants[variant];

  return <LoaderComponent />;
});

OptimizedLoader.displayName = "OptimizedLoader";

// Skeleton loading component for better UX
export const SkeletonLoader = memo(({ 
  lines = 3, 
  className = "",
  animate = true 
}: { 
  lines?: number; 
  className?: string;
  animate?: boolean;
}) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <motion.div
        key={index}
        className="h-4 bg-white/10 rounded-full"
        style={{ width: `${100 - (index * 15)}%` }}
        animate={animate ? {
          opacity: [0.3, 0.8, 0.3]
        } : {}}
        transition={animate ? {
          duration: 1.5,
          repeat: Infinity,
          delay: index * 0.2,
          ease: "easeInOut"
        } : {}}
      />
    ))}
  </div>
));

SkeletonLoader.displayName = "SkeletonLoader";

// Card skeleton for consistent loading states
export const CardSkeleton = memo(({ className = "" }: { className?: string }) => (
  <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 ${className}`}>
    <div className="flex items-center gap-4 mb-4">
      <motion.div
        className="w-12 h-12 bg-white/10 rounded-full"
        animate={{
          opacity: [0.3, 0.8, 0.3]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <div className="flex-1 space-y-2">
        <motion.div
          className="h-4 bg-white/10 rounded-full w-3/4"
          animate={{
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: 0.2,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="h-3 bg-white/10 rounded-full w-1/2"
          animate={{
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: 0.4,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
    <SkeletonLoader lines={3} />
  </div>
));

CardSkeleton.displayName = "CardSkeleton";

export default OptimizedLoader;