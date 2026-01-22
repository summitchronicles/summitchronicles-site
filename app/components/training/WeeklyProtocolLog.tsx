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
  AlertCircle,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, startOfWeek, endOfWeek, parseISO, isSameDay } from 'date-fns';

interface Activity {
  activityId: number;
  activityName: string;
  startTimeLocal: string;
  distance: number;
  duration: number; // seconds
  elevationGain: number;
  activityType: { typeKey: string };
  description?: string;
}

interface WeeklyProtocolLogProps {
  activities: Activity[];
  latestInsight?: any[] | any | null; // Supports array or single object (legacy)
}

export const WeeklyProtocolLog = ({
  activities,
  latestInsight, // This is now an array of insights
}: WeeklyProtocolLogProps) => {
  // 1. Map Activities to Weeks and Identify Unique Weeks
  const activitiesByWeek = activities.reduce(
    (acc, activity) => {
      const date = parseISO(activity.startTimeLocal);
      const weekKey = format(
        startOfWeek(date, { weekStartsOn: 1 }),
        'yyyy-MM-dd'
      );
      if (!acc[weekKey]) acc[weekKey] = [];
      acc[weekKey].push(activity);
      return acc;
    },
    {} as Record<string, Activity[]>
  );

  // 2. Determine Week List
  // Always include the Current Week (for AI Coach status)
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const currentWeekKey = format(currentWeekStart, 'yyyy-MM-dd');

  // Get all unique weeks from activities
  const activityWeeks = Object.keys(activitiesByWeek);

  // Combine unique weeks (Set removes duplicates)
  const uniqueWeekKeys = Array.from(
    new Set([currentWeekKey, ...activityWeeks])
  );

  // Sort weeks descending (Newest first)
  uniqueWeekKeys.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  // Generate Week Objects
  const weeks = uniqueWeekKeys.map((weekKey) => {
    const startDate = parseISO(weekKey);
    return {
      startDate,
      endDate: endOfWeek(startDate, { weekStartsOn: 1 }),
      weekKey,
    };
  });

  // 3. Map Insights to Weeks (Assuming new array structure or backwards compatibility)
  const insightsByWeek = Array.isArray(latestInsight)
    ? latestInsight.reduce((acc: any, insight: any) => {
        // Normalize insight weekStart to our key format if needed (assuming "yyyy-MM-dd")
        acc[insight.weekStart] = insight;
        return acc;
      }, {})
    : {};
  // If latestInsight is still a single object (legacy/transition), assign it to current week
  if (latestInsight && !Array.isArray(latestInsight)) {
    insightsByWeek[format(currentWeekStart, 'yyyy-MM-dd')] = latestInsight;
  }

  return (
    <div className="space-y-12 relative">
      {/* Timeline Line */}
      <div className="absolute left-6 top-6 bottom-0 w-px bg-white/10 hidden md:block"></div>

      {weeks.map((week, index) => {
        const weekActivities = activitiesByWeek[week.weekKey] || [];

        // Calculate totals for the week
        const totalDuration = weekActivities.reduce(
          (sum, act) => sum + act.duration,
          0
        );
        const totalElevation = weekActivities.reduce(
          (sum, act) => sum + act.elevationGain,
          0
        );

        // Prepare data object for NarrativeBlock
        const weekData = {
          ...week,
          activities: weekActivities,
          totalDuration,
          totalElevation,
          mood: 'neutral', // Default
        };

        const matchingInsight = insightsByWeek[week.weekKey];

        return (
          <NarrativeWeekBlock
            key={index}
            week={weekData}
            index={index}
            latestInsight={matchingInsight} // Pass specific insight for this week
          />
        );
      })}
    </div>
  );
};

// --- Mock AI Logic for Narrative Generation ---
const deriveNarrative = (week: any) => {
  const durationHours = week.totalDuration / 3600;
  const activityCount = week.activities.length;

  // Simple heuristic for "Theme"
  let title = 'Maintenance Phase';
  let summary = 'Steady work. Keeping the baseline engaged.';
  let sentiment: 'positive' | 'caution' | 'neutral' = 'neutral';

  if (activityCount > 8) {
    title = 'Building Momentum';
    summary =
      'High frequency week. The volume is increasing, and consistency is locked in. Key focus on upper body strength while the lower body recovers.';
    sentiment = 'positive';
  } else if (activityCount < 3) {
    title = 'Strategic Rest / Travel';
    summary =
      'Low volume week. Prioritizing recovery and inflammation management over output. Mental reset.';
    sentiment = 'caution';
  } else if (week.totalElevation > 100) {
    title = 'Elevation Focus';
    summary =
      'Introducing vertical gain back into the protocol. Testing stability under load.';
    sentiment = 'positive';
  }

  return { title, summary, sentiment };
};

const NarrativeWeekBlock = ({
  week,
  index,
  latestInsight,
}: {
  week: any;
  index: number;
  latestInsight: any;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Default heuristic narrative
  let narrative = deriveNarrative(week);

  // Override with AI Insight if available
  if (latestInsight) {
    narrative = {
      title: latestInsight.focus || 'Protocol Update',
      summary: latestInsight.weekSummary || narrative.summary,
      sentiment: 'positive', // Can be refined later based on insight content
    };
    if (latestInsight.tip) {
      narrative.summary += ` Note: ${latestInsight.tip}`;
    }
  }

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
          {narrative.sentiment === 'caution' && (
            <AlertCircle className="text-amber-500 w-5 h-5 opacity-50" />
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
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-6 text-xs font-mono text-zinc-500 uppercase tracking-wider mb-6">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3 h-3" />
            {week.activities.length} Projects
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {(week.totalDuration / 3600).toFixed(1)} hrs
          </span>
          {isLatest && (
            <span className="text-amber-500 flex items-center gap-1.5">
              Live Phase
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
                    key={activity.activityId}
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
                    <span className="text-[10px] uppercase font-mono text-zinc-600 bg-zinc-900 px-2 py-0.5 rounded">
                      {activity.activityType.typeKey.replace('_', ' ')}
                    </span>
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
