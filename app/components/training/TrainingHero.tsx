import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

interface TrainingHeroProps {
  readinessScore: number;
}

export const TrainingHero: React.FC<TrainingHeroProps> = ({
  readinessScore = 85,
}) => {
  // Calculate circumference for SVG circle
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (readinessScore / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center text-center"
    >
      <div className="relative w-64 h-64 mb-8 flex items-center justify-center">
        {/* Outer Ring */}
        <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
          {/* Track */}
          <circle
            cx="128"
            cy="128"
            r={radius}
            className="stroke-gray-800"
            strokeWidth="2"
            fill="transparent"
          />
          {/* Progress */}
          <motion.circle
            cx="128"
            cy="128"
            r={radius}
            className="stroke-summit-gold-400"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>

        {/* Inner Content - Simplified */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">
            Readiness
          </span>
          <div className="text-7xl font-oswald font-bold text-white tracking-tight">
            {readinessScore}
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-gray-500 mt-1">
            Percent
          </span>
        </div>
      </div>

      {/* Protocol Badge - Outside Circle */}
      <div className="flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-summit-gold-500/10 border border-summit-gold-500/20">
        <div className="w-2 h-2 rounded-full bg-summit-gold-500 animate-pulse" />
        <span className="text-xs font-mono text-summit-gold-400 uppercase tracking-wider">
          Rehabilitation Protocol Active
        </span>
      </div>

      <h1 className="text-6xl md:text-7xl font-light tracking-tight text-white mb-2">
        THE LAB
      </h1>
      <p className="text-gray-300 font-light tracking-widest uppercase text-sm">
        Rehabilitation & Performance Data
      </p>
    </motion.div>
  );
};
