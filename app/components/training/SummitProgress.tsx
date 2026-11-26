import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import canonical from '@/data/canonical-climbs.json';

// Ultra-compact data sourced from canonical facts
const totalSummits = 7;
const completedCountFromCanonical = Math.max(
  0,
  Math.min(totalSummits, canonical.sevenSummitsCompleted || 0)
);
const summits = Array.from({ length: totalSummits }, (_, i) => ({
  completed: i < completedCountFromCanonical
}));

export const SummitProgress = () => {
  const completedCount = completedCountFromCanonical;

  return (
    <div className="w-full space-y-3">
      {/* Compact Dots Visualization */}
      <div className="flex items-center justify-center gap-2">
        {summits.map((summit, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            viewport={{ once: true }}
            className={cn(
              'w-3 h-3 rounded-full transition-all',
              summit.completed
                ? 'bg-summit-gold-500 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                : 'bg-gray-800 border border-gray-700'
            )}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${(completedCount / 7) * 100}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
            className="h-full bg-gradient-to-r from-summit-gold-600 to-summit-gold-400 rounded-full"
          />
        </div>
        <div className="flex justify-between text-[10px] text-gray-600 font-mono">
          <span>0/7</span>
          <span className="text-summit-gold-400">{completedCount}/7</span>
          <span>7/7</span>
        </div>
      </div>
    </div>
  );
};
