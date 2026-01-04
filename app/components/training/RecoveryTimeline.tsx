import React from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Footprints,
  Dumbbell,
  Mountain,
  Activity,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineNode {
  date: string;
  label: string;
  sublabel?: string;
  status: 'completed' | 'active' | 'upcoming';
  icon: React.ElementType;
}

const milestones: TimelineNode[] = [
  {
    date: 'Nov 10',
    label: 'Surgery',
    sublabel: 'Completed',
    status: 'completed',
    icon: Activity,
  },
  {
    date: 'Jan 9',
    label: 'Walking',
    sublabel: 'With Boot',
    status: 'active',
    icon: Footprints,
  },
  {
    date: "Apr '26",
    label: 'Gym Return',
    sublabel: 'Strength',
    status: 'upcoming',
    icon: Dumbbell,
  },
  {
    date: "July '26",
    label: 'Hiking',
    sublabel: 'Local Trails',
    status: 'upcoming',
    icon: Mountain,
  },
  {
    date: "Nov '26",
    label: 'Full Training',
    sublabel: 'Return to Sport',
    status: 'upcoming',
    icon: AlertCircle,
  },
];

export const RecoveryTimeline = () => {
  return (
    <div className="w-full py-8">
      <div className="relative">
        {/* Background Track */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 rounded-full" />

        {/* Active Progress Track (Approximate for visual) */}
        <div className="absolute top-1/2 left-0 w-[28%] h-1 bg-gradient-to-r from-summit-gold-600 to-summit-gold-400 -translate-y-1/2 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.3)]" />

        <div className="relative flex justify-between items-start">
          {milestones.map((node, index) => {
            const Icon = node.icon;
            const isActive = node.status === 'active';
            const isCompleted = node.status === 'completed';

            return (
              <div
                key={index}
                className="flex flex-col items-center group cursor-default"
              >
                {/* Date Label (Top) */}
                <div
                  className={cn(
                    'mb-3 text-xs font-mono transition-colors duration-300',
                    isActive
                      ? 'text-summit-gold-400 font-bold'
                      : 'text-gray-500'
                  )}
                >
                  {node.date}
                </div>

                {/* Node Circle */}
                <div
                  className={cn(
                    'relative w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 bg-obsidian',
                    isCompleted
                      ? 'border-summit-gold-500 text-summit-gold-500'
                      : isActive
                        ? 'border-summit-gold-400 text-summit-gold-400 shadow-[0_0_15px_rgba(251,191,36,0.4)] scale-110'
                        : 'border-gray-800 text-gray-700 group-hover:border-gray-700'
                  )}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-summit-gold-400/20" />
                  )}
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>

                {/* Text Labels (Bottom) */}
                <div className="mt-3 text-center">
                  <div
                    className={cn(
                      'text-sm font-medium transition-colors',
                      isActive ? 'text-white' : 'text-gray-400'
                    )}
                  >
                    {node.label}
                  </div>
                  {node.sublabel && (
                    <div className="text-[10px] text-gray-600 uppercase tracking-wider mt-0.5">
                      {node.sublabel}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
