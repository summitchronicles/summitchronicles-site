'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Activity,
  ChevronDown,
  ChevronUp,
  Quote,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, endOfWeek, parseISO } from 'date-fns';
import type { TrainingInsight } from '@/modules/training/domain/training-dashboard';

interface TrainingActivity {
  activityId?: number | string;
  activityName?: string;
  startTimeLocal?: string;
  distance?: number;
  duration?: number; // seconds
  elevationGain?: number;
  activityType?: { typeKey?: string };
  description?: string;
}

interface WeeklyProtocolLogProps {
  activities: TrainingActivity[];
  missionLogs?: TrainingInsight[] | TrainingInsight | null;
}

export const WeeklyProtocolLog = ({
  activities,
  missionLogs,
}: WeeklyProtocolLogProps) => {
  const activitiesByWeek = activities.reduce(
    (acc, activity) => {
      if (!activity.startTimeLocal) {
        return acc;
      }
      const date = parseISO(activity.startTimeLocal);
      const day = date.getUTCDay();
      const offset = day === 0 ? -6 : 1 - day;
      date.setUTCDate(date.getUTCDate() + offset);
      const weekKey = format(date, 'yyyy-MM-dd');
      if (!acc[weekKey]) acc[weekKey] = [];
      acc[weekKey].push(activity);
      return acc;
    },
    {} as Record<string, TrainingActivity[]>
  );

  const activityWeeks = Object.keys(activitiesByWeek);

  const missionLogsByWeek = Array.isArray(missionLogs)
    ? missionLogs.reduce(
        (acc: Record<string, TrainingInsight>, missionLog: TrainingInsight) => {
          acc[missionLog.weekStart] = missionLog;
          return acc;
        },
        {}
      )
    : {};

  if (missionLogs && !Array.isArray(missionLogs) && activityWeeks[0]) {
    missionLogsByWeek[activityWeeks[0]] = missionLogs;
  }

  const renderedWeekKeys = [...activityWeeks].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  if (renderedWeekKeys.length === 0) {
    return (
      <div className="space-y-12 relative">
        <div className="border border-white/10 bg-black/40 p-8 text-center">
          <div className="text-white font-oswald text-2xl uppercase">
            Mission Logs Pending
          </div>
          <div className="mt-3 text-sm text-zinc-500 font-mono uppercase tracking-[0.2em]">
            No processed Intervals mission logs are available yet.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 relative">
      {/* Timeline Line */}
      <div className="absolute left-6 top-6 bottom-0 w-px bg-white/10 hidden md:block"></div>

      {renderedWeekKeys.map((weekKey, index) => {
        const startDate = parseISO(weekKey);
        const weekActivities = activitiesByWeek[weekKey] || [];
        const matchingMissionLog = missionLogsByWeek[weekKey];

        const totalDuration = weekActivities.reduce(
          (sum, act) => sum + (act.duration || 0),
          0
        );
        const totalElevation = weekActivities.reduce(
          (sum, act) => sum + (act.elevationGain || 0),
          0
        );

        const weekData = {
          startDate,
          endDate: endOfWeek(startDate, { weekStartsOn: 1 }),
          weekKey,
          activities: weekActivities,
          totalDuration,
          totalElevation,
        };

        return (
          <NarrativeWeekBlock
            key={weekKey}
            week={weekData}
            index={index}
            missionLog={matchingMissionLog}
          />
        );
      })}
    </div>
  );
};

const NarrativeWeekBlock = ({
  week,
  index,
  missionLog,
}: {
  week: any;
  index: number;
  missionLog?: TrainingInsight | null;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const durationHours = week.totalDuration / 3600;
  const narrative = {
    title:
      missionLog?.focus ||
      `${week.activities.length} session${week.activities.length === 1 ? '' : 's'} logged`,
    summary:
      missionLog?.weekSummary ||
      `${week.activities.length} logged session${week.activities.length === 1 ? '' : 's'} totaling ${durationHours.toFixed(1)} hrs${week.totalElevation > 0 ? ` and ${Math.round(week.totalElevation)} m of gain` : ''}.`,
    sentiment: missionLog ? 'positive' : 'neutral',
  } as const;
  const tip = missionLog?.tip ? `Note: ${missionLog.tip}` : null;

  const isLatest = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      className="relative pl-0 md:pl-20"
    >
      {/* Timeline Dot */}
      <div
        className={cn(
          'absolute left-[21px] top-8 w-1.5 h-1.5 rounded-full border border-black hidden md:block z-10',
          isLatest
            ? 'bg-amber-500 scale-150 ring-4 ring-amber-500/20'
            : 'bg-zinc-700'
        )}
      ></div>

      {/* Date Marker (Mobile: Top, Desktop: Left Float) */}
      <div className="md:absolute md:left-0 md:top-6 md:w-16 md:text-right mb-2 md:mb-0">
        <span className="text-xs font-mono text-zinc-500 block">
          {format(week.startDate, 'MMM d')}
        </span>
        <span className="text-[10px] font-mono text-zinc-700 block uppercase">
          Week {format(week.startDate, 'w')}
        </span>
      </div>

      {/* The Narrative Card */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'rounded-sm border p-8 transition-all duration-300 relative overflow-hidden group cursor-pointer',
          isLatest
            ? 'bg-gradient-to-br from-zinc-900 via-black to-black border-amber-500/30'
            : 'bg-black border-white/5 hover:border-white/10'
        )}
      >
        {/* Sentiment Badge */}
        <div className="absolute top-0 right-0 p-4">
          {narrative.sentiment === 'positive' && (
            <TrendingUp className="text-emerald-500 w-5 h-5 opacity-50" />
          )}
          {narrative.sentiment === 'neutral' && (
            <CheckCircle2 className="text-blue-500 w-5 h-5 opacity-50" />
          )}
        </div>

        {/* Headline */}
        <h3
          className={cn(
            'text-3xl font-oswald font-bold mb-4 uppercase',
            isLatest ? 'text-white' : 'text-zinc-400'
          )}
        >
          {narrative.title}
        </h3>

        {/* Narrative Text */}
        <div className="relative mb-8 pl-6 border-l-2 border-zinc-800">
          <Quote className="absolute -left-3 -top-2 w-4 h-4 bg-black text-zinc-600" />
          <p className="text-zinc-300 font-serif leading-relaxed text-lg italic opacity-90">
            "{narrative.summary}"
          </p>
          {tip ? (
            <p className="mt-3 text-sm text-zinc-500 not-italic">{tip}</p>
          ) : null}
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-6 text-xs font-mono text-zinc-500 uppercase tracking-wider mb-6">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3 h-3" />
            {week.activities.length} Sessions
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {(week.totalDuration / 3600).toFixed(1)} hrs
          </span>
          {week.totalElevation > 0 && (
            <span className="text-amber-500 flex items-center gap-1.5">
              {Math.round(week.totalElevation)} m gain
            </span>
          )}
        </div>

        {/* Toggle Logs Visual Indicator */}
        <div className="text-xs flex items-center gap-2 text-zinc-600 hover:text-white transition-colors uppercase tracking-widest border-t border-white/5 pt-4 w-full">
          {isExpanded ? 'Hide Daily Logs' : 'View Mission Logs'}
          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </div>

        {/* Expanded Logs */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-6 grid gap-2">
                {week.activities.map((activity: any) => (
                  <div
                    key={
                      activity.activityId ??
                      `${activity.startTimeLocal ?? 'unknown'}-${activity.activityName ?? 'session'}`
                    }
                    className="flex items-start gap-4 p-3 hover:bg-white/5 rounded transition-colors group/log"
                  >
                    <span className="text-xs font-mono text-zinc-500 w-12 pt-1">
                      {format(parseISO(activity.startTimeLocal), 'EEE')}
                    </span>
                    <div className="flex-1">
                      <div className="text-sm text-zinc-300 font-medium">
                        {activity.activityName}
                      </div>
                      {activity.description && (
                        <div className="text-xs text-zinc-500 mt-1 line-clamp-2 group-hover/log:line-clamp-none transition-all">
                          {activity.description}
                        </div>
                      )}
                    </div>
                    {activity.activityType?.typeKey ? (
                      <span className="text-[10px] uppercase font-mono text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded">
                        {activity.activityType.typeKey.replace('_', ' ')}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
