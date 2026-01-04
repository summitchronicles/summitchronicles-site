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
    <div className="relative h-[50vh] min-h-[400px] flex flex-col items-center justify-center overflow-hidden bg-obsidian">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.05)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative w-64 h-64 mb-6 flex items-center justify-center">
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

          {/* Inner Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-mono uppercase tracking-widest text-gray-400 mb-1">
              System Readiness
            </span>
            <div className="text-6xl font-oswald font-bold text-white tracking-tight">
              {readinessScore}%
            </div>
            <div className="flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-summit-gold-500/10 border border-summit-gold-500/20">
              <div className="w-2 h-2 rounded-full bg-summit-gold-500 animate-pulse" />
              <span className="text-[10px] font-mono text-summit-gold-400 uppercase">
                Protocol Active
              </span>
            </div>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-light tracking-tight text-white mb-2">
          THE LAB
        </h1>
        <p className="text-gray-400 font-light tracking-widest uppercase text-sm">
          Rehabilitation & Performance Data
        </p>
      </motion.div>
    </div>
  );
};
