'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mountain, Flag, TrendingUp, Anchor } from 'lucide-react';
import { cn } from '@/lib/utils';

const PHASES = [
  {
    id: 'p1',
    title: 'Broken Talus',
    date: 'NOV 2025',
    status: 'complete',
    icon: Anchor,
    desc: 'Surgery & non-weight bearing.',
  },
  {
    id: 'p2',
    title: 'Rehabilitation',
    date: 'JAN 2026',
    status: 'current',
    icon: TrendingUp,
    desc: 'Mobility & strength rebuild.',
    progress: 45, // Percentage complete of this phase
  },
  {
    id: 'p3',
    title: 'Base Building',
    date: 'MAR 2026',
    status: 'upcoming',
    icon: Mountain,
    desc: 'Aerobic capacity & hiking.',
  },
  {
    id: 'p4',
    title: 'Technical Prep',
    date: 'EARLY 2027',
    status: 'upcoming',
    icon: ActivityIcon,
    desc: 'Glacier travel & altitude.',
  },
  {
    id: 'p5',
    title: 'Everest Expedition',
    date: 'MAY 2027',
    status: 'upcoming',
    icon: Flag,
    desc: 'The summit push.',
  },
];

function ActivityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

export function TrainingRoadmap() {
  return (
    <div className="flex flex-col gap-6">
      {/* Narrative Header (Hidden mostly as main section handles it, but good for context) */}

      <div className="relative flex flex-col pl-4">
        {/* Vertical Line */}
        <div className="absolute left-[27px] top-4 bottom-4 w-px border-l border-dashed border-white/20 z-0" />

        {PHASES.map((phase, index) => {
          const isComplete = phase.status === 'complete';
          const isCurrent = phase.status === 'current';
          const Icon = phase.icon;

          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className={cn(
                'relative z-10 flex gap-6 group mb-8 last:mb-0',
                !isComplete &&
                  !isCurrent &&
                  'opacity-60 hover:opacity-100 transition-opacity'
              )}
            >
              {/* Icon Bubble */}
              <div
                className={cn(
                  'w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-[#0a0a0a]',
                  isComplete
                    ? 'border-summit-gold text-summit-gold'
                    : isCurrent
                      ? 'border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                      : 'border-white/10 text-gray-600 group-hover:border-white/30'
                )}
              >
                <Icon className="w-6 h-6" />
              </div>

              {/* Content */}
              <div className="flex-1 pt-2">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h4
                      className={cn(
                        'text-xl font-oswald uppercase tracking-wide transition-colors',
                        isCurrent
                          ? 'text-white'
                          : isComplete
                            ? 'text-summit-gold'
                            : 'text-gray-400'
                      )}
                    >
                      {phase.title}
                    </h4>
                    <span className="text-xs font-mono text-gray-500 tracking-widest">
                      {phase.date}
                    </span>
                  </div>

                  {isCurrent && (
                    <div className="px-2 py-1 bg-white/10 border border-white/20 text-[10px] font-mono text-white animate-pulse">
                      ACTIVE
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-500 mt-2 font-light leading-relaxed max-w-xs">
                  {phase.desc}
                </p>

                {/* Progress Bar for Current Phase */}
                {isCurrent && phase.progress && (
                  <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden w-full max-w-[200px]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${phase.progress}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      className="h-full bg-summit-gold rounded-full"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Final target decoration */}
      <div className="mt-4 pl-[74px] italic text-xs text-gray-600 font-mono">
        ...THE HORIZON AWAITS
      </div>
    </div>
  );
}
