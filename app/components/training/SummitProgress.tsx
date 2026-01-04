import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Using the summits from original hook logic
const totalSummits = 7;
const completedSummits = 4; // Kilimanjaro, Elbrus, Aconcagua, Denali

export const SummitProgress = () => {
  // Generate an array for the 7 summits visual
  const peaks = Array.from(
    { length: totalSummits },
    (_, i) => i < completedSummits
  );

  return (
    <div className="w-full">
      <div className="flex items-end justify-between gap-1 h-12 mb-2">
        {peaks.map((isCompleted, i) => (
          <motion.div
            key={i}
            initial={{ height: '20%', opacity: 0 }}
            whileInView={{
              height: isCompleted ? ['20%', '100%'] : '40%',
              opacity: 1,
            }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={cn(
              'w-full rounded-sm relative',
              isCompleted
                ? 'bg-gradient-to-t from-summit-gold-600 to-summit-gold-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]'
                : 'bg-white/5'
            )}
          >
            {/* Peak Effect */}
            <div
              className={cn(
                'absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent',
                isCompleted ? 'border-b-summit-gold-400' : 'border-b-white/5'
              )}
            />
          </motion.div>
        ))}
      </div>
      <div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest">
        <span className="text-summit-gold-400">Progress</span>
        <span className="text-white">
          {completedSummits}/{totalSummits} Summits
        </span>
      </div>
    </div>
  );
};
