'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

interface IconProps {
  size?: number;
  className?: string;
  color?: string;
  animateOnScroll?: boolean;
  variant?: 'stroke' | 'fill' | 'mixed';
}

// Base animation variants
const createPathVariants = (delay = 0) => ({
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
  },
});

const createFillVariants = (delay = 0) => ({
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
});

// Hook for scroll animation
function useScrollAnimation(animateOnScroll: boolean) {
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

  return { controls, ref };
}

// Climbing Rope Icon
export function ClimbingRope({
  size = 24,
  className = '',
  color = '#1e3a8a',
  animateOnScroll = true,
}: IconProps) {
  const { controls, ref } = useScrollAnimation(animateOnScroll);

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main rope */}
      <motion.path
        d="M8 2 Q10 4 8 6 Q6 8 8 10 Q10 12 8 14 Q6 16 8 18 Q10 20 8 22"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        variants={createPathVariants(0)}
        initial="hidden"
        animate={controls}
      />

      {/* Carabiners */}
      <motion.ellipse
        cx="8"
        cy="6"
        rx="1.5"
        ry="1"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        variants={createPathVariants(0.5)}
        initial="hidden"
        animate={controls}
      />

      <motion.ellipse
        cx="8"
        cy="14"
        rx="1.5"
        ry="1"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        variants={createPathVariants(0.7)}
        initial="hidden"
        animate={controls}
      />

      {/* Knots */}
      <motion.circle
        cx="8"
        cy="10"
        r="1.5"
        fill={color}
        variants={createFillVariants(1)}
        initial="hidden"
        animate={controls}
      />
    </svg>
  );
}

// Ice Axe Icon
export function IceAxe({
  size = 24,
  className = '',
  color = '#334155',
  animateOnScroll = true,
}: IconProps) {
  const { controls, ref } = useScrollAnimation(animateOnScroll);

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Handle */}
      <motion.line
        x1="12"
        y1="4"
        x2="12"
        y2="20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        variants={createPathVariants(0)}
        initial="hidden"
        animate={controls}
      />

      {/* Adze */}
      <motion.path
        d="M8 6 L16 6 L15 4 L9 4 Z"
        stroke={color}
        strokeWidth="1.5"
        fill={color}
        variants={createFillVariants(0.5)}
        initial="hidden"
        animate={controls}
      />

      {/* Pick */}
      <motion.path
        d="M12 6 L18 8 L17 10 L12 8"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        variants={createPathVariants(0.7)}
        initial="hidden"
        animate={controls}
      />

      {/* Spike */}
      <motion.path
        d="M10 20 L12 22 L14 20"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={createPathVariants(0.9)}
        initial="hidden"
        animate={controls}
      />
    </svg>
  );
}

// Compass Icon
export function Compass({
  size = 24,
  className = '',
  color = '#fbbf24',
  animateOnScroll = true,
}: IconProps) {
  const { controls, ref } = useScrollAnimation(animateOnScroll);

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer circle */}
      <motion.circle
        cx="12"
        cy="12"
        r="9"
        stroke={color}
        strokeWidth="2"
        variants={createPathVariants(0)}
        initial="hidden"
        animate={controls}
      />

      {/* Cardinal directions */}
      <motion.line
        x1="12"
        y1="5"
        x2="12"
        y2="7"
        stroke={color}
        strokeWidth="2"
        variants={createPathVariants(0.3)}
        initial="hidden"
        animate={controls}
      />

      <motion.line
        x1="19"
        y1="12"
        x2="17"
        y2="12"
        stroke={color}
        strokeWidth="2"
        variants={createPathVariants(0.4)}
        initial="hidden"
        animate={controls}
      />

      <motion.line
        x1="12"
        y1="19"
        x2="12"
        y2="17"
        stroke={color}
        strokeWidth="2"
        variants={createPathVariants(0.5)}
        initial="hidden"
        animate={controls}
      />

      <motion.line
        x1="5"
        y1="12"
        x2="7"
        y2="12"
        stroke={color}
        strokeWidth="2"
        variants={createPathVariants(0.6)}
        initial="hidden"
        animate={controls}
      />

      {/* Compass needle */}
      <motion.path
        d="M12 8 L10 12 L12 16 L14 12 Z"
        fill={color}
        variants={createFillVariants(1)}
        initial="hidden"
        animate={controls}
      />

      {/* Center point */}
      <motion.circle
        cx="12"
        cy="12"
        r="1"
        fill={color}
        variants={createFillVariants(1.2)}
        initial="hidden"
        animate={controls}
      />
    </svg>
  );
}

// Tent Icon
export function Tent({
  size = 24,
  className = '',
  color = '#16a34a',
  animateOnScroll = true,
}: IconProps) {
  const { controls, ref } = useScrollAnimation(animateOnScroll);

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Tent body */}
      <motion.path
        d="M4 20 L12 8 L20 20 Z"
        stroke={color}
        strokeWidth="2"
        fill="none"
        variants={createPathVariants(0)}
        initial="hidden"
        animate={controls}
      />

      {/* Tent entrance */}
      <motion.path
        d="M8 20 L12 14 L16 20"
        stroke={color}
        strokeWidth="1.5"
        variants={createPathVariants(0.5)}
        initial="hidden"
        animate={controls}
      />

      {/* Ground stakes */}
      <motion.line
        x1="4"
        y1="20"
        x2="2"
        y2="18"
        stroke={color}
        strokeWidth="1.5"
        variants={createPathVariants(0.8)}
        initial="hidden"
        animate={controls}
      />

      <motion.line
        x1="20"
        y1="20"
        x2="22"
        y2="18"
        stroke={color}
        strokeWidth="1.5"
        variants={createPathVariants(0.9)}
        initial="hidden"
        animate={controls}
      />

      {/* Guy lines */}
      <motion.line
        x1="8"
        y1="16"
        x2="6"
        y2="18"
        stroke={color}
        strokeWidth="1"
        strokeDasharray="2,1"
        variants={createPathVariants(1)}
        initial="hidden"
        animate={controls}
      />

      <motion.line
        x1="16"
        y1="16"
        x2="18"
        y2="18"
        stroke={color}
        strokeWidth="1"
        strokeDasharray="2,1"
        variants={createPathVariants(1.1)}
        initial="hidden"
        animate={controls}
      />
    </svg>
  );
}

// Summit Flag Icon
export function SummitFlag({
  size = 24,
  className = '',
  color = '#dc2626',
  animateOnScroll = true,
}: IconProps) {
  const { controls, ref } = useScrollAnimation(animateOnScroll);

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Flag pole */}
      <motion.line
        x1="6"
        y1="4"
        x2="6"
        y2="20"
        stroke={color}
        strokeWidth="2"
        variants={createPathVariants(0)}
        initial="hidden"
        animate={controls}
      />

      {/* Flag */}
      <motion.path
        d="M6 4 L18 4 L16 8 L18 12 L6 12 Z"
        stroke={color}
        strokeWidth="1.5"
        fill={color}
        fillOpacity="0.3"
        variants={createFillVariants(0.5)}
        initial="hidden"
        animate={controls}
      />

      {/* Wind lines */}
      <motion.path
        d="M18 6 Q22 6 20 8"
        stroke={color}
        strokeWidth="1"
        variants={createPathVariants(1)}
        initial="hidden"
        animate={controls}
      />

      <motion.path
        d="M18 10 Q22 10 20 12"
        stroke={color}
        strokeWidth="1"
        variants={createPathVariants(1.2)}
        initial="hidden"
        animate={controls}
      />
    </svg>
  );
}
