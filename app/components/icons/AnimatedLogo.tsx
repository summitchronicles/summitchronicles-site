'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

interface AnimatedLogoProps {
  size?: number;
  className?: string;
  variant?: 'standard' | 'detailed' | 'minimal';
  animateOnScroll?: boolean;
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export function AnimatedLogo({
  size = 40,
  className = '',
  variant = 'standard',
  animateOnScroll = true,
  colors = {
    primary: '#1e3a8a', // alpine-blue
    secondary: '#fbbf24', // summit-gold
    accent: '#334155', // spa-charcoal
  },
}: AnimatedLogoProps) {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (animateOnScroll && isInView) {
      controls.start('visible');
    } else if (!animateOnScroll) {
      controls.start('visible');
    }
  }, [controls, isInView, animateOnScroll]);

  // Animation variants for different elements
  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
    },
  };

  const fillVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
    },
  };

  const detailVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
    },
  };

  // Render different variants
  const renderStandardLogo = () => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main mountain peak */}
      <motion.path
        d="M20 80 L40 30 L50 45 L60 30 L80 80 Z"
        stroke={colors.primary}
        strokeWidth="2"
        fill="none"
        variants={pathVariants}
        initial="hidden"
        animate={controls}
      />

      {/* Secondary peak */}
      <motion.path
        d="M40 80 L50 45 L65 35 L80 80"
        stroke={colors.secondary}
        strokeWidth="1.5"
        fill="none"
        variants={pathVariants}
        initial="hidden"
        animate={controls}
      />

      {/* Summit point */}
      <motion.circle
        cx="50"
        cy="30"
        r="3"
        fill={colors.accent}
        variants={fillVariants}
        initial="hidden"
        animate={controls}
      />

      {/* Base line */}
      <motion.line
        x1="20"
        y1="80"
        x2="80"
        y2="80"
        stroke={colors.accent}
        strokeWidth="2"
        variants={pathVariants}
        initial="hidden"
        animate={controls}
      />

      {/* Climbing route (if detailed variant) */}
      {variant === 'detailed' && (
        <motion.path
          d="M25 75 Q35 60 45 50 Q55 40 65 35"
          stroke={colors.secondary}
          strokeWidth="1"
          strokeDasharray="2,2"
          fill="none"
          variants={detailVariants}
          initial="hidden"
          animate={controls}
        />
      )}
    </svg>
  );

  const renderDetailedLogo = () => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main mountain range */}
      <motion.path
        d="M10 85 L25 45 L35 60 L45 25 L55 40 L65 15 L75 35 L90 85 Z"
        stroke={colors.primary}
        strokeWidth="2"
        fill="none"
        variants={pathVariants}
        initial="hidden"
        animate={controls}
      />

      {/* Snow caps */}
      <motion.path
        d="M40 25 L45 15 L50 25 Z"
        fill={colors.secondary}
        variants={fillVariants}
        initial="hidden"
        animate={controls}
      />

      <motion.path
        d="M60 15 L65 8 L70 15 Z"
        fill={colors.secondary}
        variants={fillVariants}
        initial="hidden"
        animate={controls}
      />

      {/* Trees/forest */}
      <motion.path
        d="M15 80 L20 70 L25 80 M30 82 L35 72 L40 82 M50 81 L55 71 L60 81"
        stroke={colors.accent}
        strokeWidth="1.5"
        variants={detailVariants}
        initial="hidden"
        animate={controls}
      />

      {/* Climbing path */}
      <motion.path
        d="M20 80 Q30 65 40 50 Q50 35 60 25"
        stroke={colors.secondary}
        strokeWidth="1"
        strokeDasharray="3,2"
        fill="none"
        variants={detailVariants}
        initial="hidden"
        animate={controls}
      />

      {/* Climber figure */}
      <motion.circle
        cx="58"
        cy="27"
        r="1.5"
        fill={colors.accent}
        variants={fillVariants}
        initial="hidden"
        animate={controls}
      />
    </svg>
  );

  const renderMinimalLogo = () => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Simple triangle peak */}
      <motion.path
        d="M30 70 L50 30 L70 70 Z"
        stroke={colors.primary}
        strokeWidth="2"
        fill="none"
        variants={pathVariants}
        initial="hidden"
        animate={controls}
      />

      {/* Summit dot */}
      <motion.circle
        cx="50"
        cy="30"
        r="2"
        fill={colors.secondary}
        variants={fillVariants}
        initial="hidden"
        animate={controls}
      />
    </svg>
  );

  // Return appropriate variant
  switch (variant) {
    case 'detailed':
      return renderDetailedLogo();
    case 'minimal':
      return renderMinimalLogo();
    case 'standard':
    default:
      return renderStandardLogo();
  }
}
