import React, { useState } from 'react';
import {
  Target,
  Activity,
  Calendar,
  Brain,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import recoveryData from '@/content/recovery-status.json';
import { cn } from '@/lib/utils';

interface RecoveryStatusProps {
  vo2Max?: number | null; // Live VO2 Max from API
  latestLog?: string; // Live training log
}

export const RecoveryStatus = ({ vo2Max, latestLog }: RecoveryStatusProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const startDate = new Date(recoveryData.since);
  const now = new Date();
  const daysInPhase = Math.floor(
    (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const targetDate = new Date(recoveryData.milestone.targetDate);
  const totalDuration = Math.ceil(
    (targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const progress = Math.min(
    100,
    Math.max(0, (daysInPhase / totalDuration) * 100)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative h-full overflow-hidden rounded-2xl bg-black border border-white/10 group"
    >
      {/* Background Ambience - Living Pulse */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]"
      />

      {/* Scanning Line Effect */}
      <motion.div
        animate={{ top: ['-10%', '110%'] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
          repeatDelay: 5,
        }}
        className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent blur-sm z-0 pointer-events-none"
      />

      <div className="relative z-10 p-8 flex flex-col h-full justify-between">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/30 border border-amber-500/20 backdrop-blur-md"
            >
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </div>
              <span className="text-amber-500 text-[10px] font-mono uppercase tracking-[0.2em] font-bold">
                Recovery Protocol
              </span>
            </motion.div>

            <h3 className="text-3xl font-oswald text-white font-bold tracking-tight">
              {recoveryData.phase}
            </h3>
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-wider">
              T+{daysInPhase} Days Since Incident
            </p>
          </div>

          <motion.div
            animate={{ rotate: isHovered ? 15 : 0 }}
            className="p-3 bg-zinc-900/50 rounded-xl border border-white/5"
          >
            <Activity className="w-6 h-6 text-amber-500" />
          </motion.div>
        </div>

        {/* Dynamic Segmented Progress Bar */}
        <div className="py-8 space-y-3">
          <div className="flex justify-between text-xs font-mono uppercase tracking-wider">
            <span className="text-zinc-400">Current Objective</span>
            <span className="text-amber-500 animate-pulse">
              {recoveryData.milestone.title}
            </span>
          </div>

          <div className="relative h-6 flex items-center gap-1 group/bar cursor-crosshair">
            {Array.from({ length: 40 }).map((_, i) => {
              const isActive = (i / 40) * 100 <= progress;
              return (
                <motion.div
                  key={i}
                  initial={{ height: '40%', opacity: 0.3 }}
                  animate={{
                    height: isActive ? '100%' : '40%',
                    opacity: isActive ? 1 : 0.2,
                    backgroundColor: isActive ? '#F59E0B' : '#52525b',
                  }}
                  whileHover={{ scaleY: 1.5, backgroundColor: '#FFF' }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 rounded-full"
                />
              );
            })}

            {/* Hover Tooltip/Glow */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 bg-amber-500/0 group-hover/bar:bg-amber-500/10 transition-colors blur-xl rounded-full"></div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[10px] text-zinc-600 font-mono dark:text-zinc-500">
              {progress.toFixed(0)}% Complete
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              ETA:{' '}
              {new Date(recoveryData.milestone.targetDate).toLocaleDateString(
                'en-US',
                { month: 'short', day: 'numeric' }
              )}
            </span>
          </div>
        </div>

        {/* Interactive Metrics Grid */}
        <div className="grid grid-cols-3 gap-3">
          {recoveryData.metrics.map((metric, i) => {
            // Override VO2 Max with live data if available
            const displayValue =
              metric.label === 'VO2 Max' && vo2Max
                ? Math.round(vo2Max).toString()
                : metric.value;

            return (
              <motion.div
                key={i}
                whileHover={{
                  y: -2,
                  backgroundColor: 'rgba(255,255,255,0.03)',
                }}
                className="bg-black/40 border border-white/5 rounded-xl p-3 backdrop-blur-sm transition-colors"
              >
                <div className="flex items-center gap-2 mb-2 text-zinc-500">
                  {metric.label === 'Mobility' && <Activity size={12} />}
                  {metric.label === 'Upper Body' && <Zap size={12} />}
                  {metric.label === 'VO2 Max' && <TrendingUp size={12} />}
                  <span className="text-[10px] uppercase tracking-widest">
                    {metric.label}
                  </span>
                </div>
                <div className="text-sm font-medium text-white">
                  {displayValue}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-start gap-3">
          <div className="mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-mono opacity-60 group-hover:opacity-100 transition-opacity">
            latest_log: "{latestLog || recoveryData.latestUpdate}"
          </p>
        </div>
      </div>
    </motion.div>
  );
};
