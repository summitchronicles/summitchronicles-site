'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Calendar, TrendingUp, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogEntry {
  id: string;
  date: string;
  day: number;
  title: string;
  category: 'Rehab' | 'Training' | 'Recovery' | 'Milestone';
  description: string;
  metrics?: { label: string; value: string }[];
}

import MISSION_LOGS_DATA from '../../../content/mission-logs.json';

// Type assertion or mapping if needed, though JSON import is usually sufficient.
const MISSION_LOGS: LogEntry[] = MISSION_LOGS_DATA as unknown as LogEntry[];

export function MissionLog() {
  return (
    <div className="bg-glass-panel border border-white/5 rounded-2xl overflow-hidden flex flex-col h-full ring-1 ring-white/10">
      <div className="p-6 border-b border-white/5 bg-white/5">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="w-5 h-5 text-summit-gold-400" />
          <h3 className="text-lg font-medium text-white tracking-wide">
            MISSION LOG
          </h3>
        </div>
        <p className="text-sm text-gray-400">
          Live updates from the recovery lab.
        </p>
      </div>

      <div className="p-6 space-y-8 flex-grow overflow-y-auto max-h-full custom-scrollbar">
        {MISSION_LOGS.map((log, index) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative pl-8 border-l border-white/10 last:pb-0"
          >
            {/* Timeline Dot */}
            <div
              className={cn(
                'absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full border border-black',
                index === 0
                  ? 'bg-summit-gold-400 shadow-[0_0_10px_rgba(234,179,8,0.5)]'
                  : 'bg-gray-700'
              )}
            />

            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-summit-gold-400 uppercase tracking-wider">
                  Day {log.day}
                </span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-400">{log.date}</span>
              </div>
              <span
                className={cn(
                  'text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest border',
                  log.category === 'Rehab' &&
                    'border-blue-500/30 text-blue-400 bg-blue-500/10',
                  log.category === 'Training' &&
                    'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
                  log.category === 'Recovery' &&
                    'border-purple-500/30 text-purple-400 bg-purple-500/10',
                  log.category === 'Milestone' &&
                    'border-summit-gold-500/30 text-summit-gold-400 bg-summit-gold-500/10'
                )}
              >
                {log.category}
              </span>
            </div>

            <h4 className="text-base font-medium text-white mb-2">
              {log.title}
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              {log.description}
            </p>

            {log.metrics && (
              <div className="flex gap-4">
                {log.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="bg-black/30 px-3 py-1.5 rounded border border-white/5 flex items-center gap-2"
                  >
                    <span className="text-[10px] text-gray-500 uppercase">
                      {metric.label}
                    </span>
                    <span className="text-xs font-mono text-white">
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
