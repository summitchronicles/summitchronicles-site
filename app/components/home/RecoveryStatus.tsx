import React, { useState } from 'react';
import { Activity, TrendingUp, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative h-full overflow-hidden rounded-2xl bg-black border border-white/10 group"
    >
      {/* Background texture */}
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-overlay"></div>

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
              T+{daysInPhase} Days Since Surgery
            </p>
          </div>

          <motion.div
            animate={{ rotate: isHovered ? 15 : 0 }}
            className="p-3 bg-zinc-900/50 rounded-xl border border-white/5"
          >
            <Activity className="w-6 h-6 text-amber-500" />
          </motion.div>
        </div>

        {/* Recovery status without a speculative deadline */}
        <div className="py-8 space-y-4">
          <div className="flex justify-between text-xs font-mono uppercase tracking-wider">
            <span className="text-zinc-400">Current Objective</span>
            <span className="text-amber-500">
              {recoveryData.milestone.status}
            </span>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-5">
            <div className="flex items-start gap-3">
              <Activity className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <div>
                <div className="font-oswald text-xl uppercase text-white">
                  {recoveryData.milestone.title}
                </div>
                <p className="mt-2 text-xs leading-5 text-zinc-400">
                  Progress is assessed from recovery, gait quality, mobility,
                  and strength rather than a fixed return-to-running date.
                </p>
              </div>
            </div>
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
