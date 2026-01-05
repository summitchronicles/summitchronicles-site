'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mountain, Flag, TrendingUp, Anchor } from 'lucide-react';
import { cn } from '@/lib/utils';

const PHASES = [
  {
    id: 'p1',
    title: 'Broken Talus',
    date: 'Nov 2025',
    status: 'complete',
    icon: Anchor,
    desc: 'Surgery & non-weight bearing.',
  },
  {
    id: 'p2',
    title: 'Rehabilitation',
    date: 'Jan 2026',
    status: 'current',
    icon: TrendingUp,
    desc: 'Mobility & strength rebuild.',
    progress: 45, // Percentage complete of this phase
  },
  {
    id: 'p3',
    title: 'Base Building',
    date: 'Mar 2026',
    status: 'upcoming',
    icon: Mountain,
    desc: 'Aerobic capacity & hiking.',
  },
  {
    id: 'p4',
    title: 'Technical Prep',
    date: '2027',
    status: 'upcoming',
    icon: ActivityIcon,
    desc: 'Glacier travel & altitude.',
  },
  {
    id: 'p5',
    title: 'Everest Expedition',
    date: '2028',
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
    <div className="bg-glass-panel border border-white/5 rounded-2xl overflow-hidden p-8 h-full ring-1 ring-white/10 flex flex-col">
      <div className="mb-8">
        <h3 className="text-lg font-medium text-white tracking-wide mb-2">
          THE ROADMAP
        </h3>
        <p className="text-sm text-gray-400">
          Strategic phases from recovery to summit.
        </p>
      </div>

      <div className="relative flex-grow flex flex-col justify-between py-4">
        {/* Vertical Line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-px bg-white/10 z-0" />

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
                'relative z-10 flex gap-6 group',
                !isComplete &&
                  !isCurrent &&
                  'opacity-50 hover:opacity-100 transition-opacity'
              )}
            >
              {/* Icon Bubble */}
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300',
                  isComplete
                    ? 'bg-summit-gold-500 text-black border-summit-gold-500'
                    : isCurrent
                      ? 'bg-black text-summit-gold-400 border-summit-gold-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]'
                      : 'bg-black text-gray-600 border-gray-800'
                )}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Content */}
              <div className="flex-1 pt-1 pb-8">
                <div className="flex justify-between items-center mb-1">
                  <h4
                    className={cn(
                      'text-base font-medium transition-colors',
                      isCurrent ? 'text-white' : 'text-gray-300'
                    )}
                  >
                    {phase.title}
                  </h4>
                  <span className="text-xs font-mono text-gray-500 uppercase">
                    {phase.date}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-3">{phase.desc}</p>

                {/* Progress Bar for Current Phase */}
                {isCurrent && phase.progress && (
                  <div className="h-1 bg-gray-800 rounded-full overflow-hidden w-full max-w-[200px]">
                    <div
                      className="h-full bg-summit-gold-400 rounded-full"
                      style={{ width: `${phase.progress}%` }}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
