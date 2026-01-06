'use client';

import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineNode {
  date: string;
  isoDate: string;
  label: string;
}

const milestones: TimelineNode[] = [
  { date: 'Nov 10', isoDate: '2025-11-10', label: 'Surgery' },
  { date: 'Jan 9', isoDate: '2026-01-09', label: 'Walking' },
  { date: "Apr '26", isoDate: '2026-04-01', label: 'Gym Return' },
  { date: "July '26", isoDate: '2026-07-01', label: 'Hiking' },
  { date: "Nov '26", isoDate: '2026-11-01', label: 'Full Training' },
];

export const RecoveryTimeline = () => {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  // Calculate progress within current phase
  const startDate = new Date('2025-11-10').getTime();
  const endDate = new Date('2026-01-09').getTime();
  const now = currentDate ? currentDate.getTime() : Date.now();
  const phaseProgress = Math.min(
    Math.max((now - startDate) / (endDate - startDate), 0),
    1
  );

  // 5 nodes = 4 segments, each 25%. Currently in segment 1.
  const progressPercent = phaseProgress * 25;

  const getStatus = (isoDate: string): 'completed' | 'active' | 'upcoming' => {
    if (!currentDate) {
      return isoDate === '2025-11-10' ? 'completed' : 'upcoming';
    }
    const target = new Date(isoDate);
    const targetDay = new Date(
      target.getFullYear(),
      target.getMonth(),
      target.getDate()
    ).getTime();
    const today = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    ).getTime();

    if (today > targetDay) return 'completed';
    if (today === targetDay) return 'active';
    return 'upcoming';
  };

  return (
    <div className="w-full py-4">
      <div className="relative">
        {/* Background Track - thin line */}
        <div
          className="absolute left-0 right-0 h-px bg-zinc-800"
          style={{ top: '1rem' }}
        />

        {/* Progress Track - gold */}
        <div
          className="absolute left-0 h-px bg-summit-gold-500 transition-all duration-1000"
          style={{ top: '1rem', width: `${progressPercent}%` }}
        />

        {/* Nodes */}
        <div className="relative flex justify-between">
          {milestones.map((node, index) => {
            const status = getStatus(node.isoDate);
            const isCompleted = status === 'completed';
            const isActive = status === 'active';

            return (
              <div key={index} className="flex flex-col items-center">
                {/* Node Circle - smaller, cleaner */}
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 bg-[#0a0a0a]',
                    isCompleted && 'border-emerald-500 bg-emerald-500/10',
                    isActive &&
                      'border-summit-gold-500 ring-4 ring-summit-gold-500/20',
                    !isCompleted && !isActive && 'border-zinc-700'
                  )}
                >
                  {isCompleted && (
                    <Check className="w-4 h-4 text-emerald-500" />
                  )}
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-summit-gold-500" />
                  )}
                  {!isCompleted && !isActive && (
                    <div className="w-2 h-2 rounded-full bg-zinc-700" />
                  )}
                </div>

                {/* Labels */}
                <div className="mt-3 text-center">
                  <div
                    className={cn(
                      'text-xs font-medium',
                      isCompleted && 'text-emerald-500',
                      isActive && 'text-summit-gold-500',
                      !isCompleted && !isActive && 'text-zinc-500'
                    )}
                  >
                    {node.date}
                  </div>
                  <div
                    className={cn(
                      'text-sm mt-1',
                      isActive ? 'text-white font-medium' : 'text-zinc-400'
                    )}
                  >
                    {node.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
