'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useTrainingSummary } from '@/lib/hooks/useTrainingSummary';
import { cn } from '@/lib/utils';
import type { NormalizedTrainingActivity } from '@/modules/training/domain/training-metrics';

export function TrainingRedesignPrototype() {
  const { summary, loading, error, refresh } = useTrainingSummary();
  const missionLogs = summary?.missionLogs ?? [];
  const recentActivities = summary?.metrics.recentActivities ?? [];
  const defaultWeekStart = missionLogs[0]?.weekStart ?? null;

  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedWeek && defaultWeekStart) {
      setSelectedWeek(defaultWeekStart);
    }
  }, [defaultWeekStart, selectedWeek]);

  const resolvedWeek =
    selectedWeek ??
    defaultWeekStart ??
    getWeekKey(recentActivities[0]?.startTimeLocal) ??
    null;

  const selectedMissionLog =
    missionLogs.find((missionLog) => missionLog.weekStart === resolvedWeek) ??
    summary?.latestMissionLog ??
    missionLogs[0] ??
    null;

  const weekSessions = resolvedWeek
    ? recentActivities.filter(
        (activity) => getWeekKey(activity.startTimeLocal) === resolvedWeek
      )
    : recentActivities.slice(0, 8);

  useEffect(() => {
    if (weekSessions.length === 0) {
      setSelectedSessionId(null);
      return;
    }

    const validIds = weekSessions.map((activity) => getActivityId(activity));
    if (!selectedSessionId || !validIds.includes(selectedSessionId)) {
      setSelectedSessionId(validIds[0]);
    }
  }, [resolvedWeek, selectedSessionId, weekSessions]);

  const selectedSession =
    weekSessions.find((activity) => getActivityId(activity) === selectedSessionId) ??
    weekSessions[0] ??
    null;

  const fieldNotes = weekSessions
    .filter((activity) => activity.description && activity.description.trim().length > 0)
    .slice(0, 3);
  const missionArc = missionLogs.slice(0, 8).reverse();
  const missionArcMaxHours = Math.max(
    1,
    ...missionArc.map((missionLog) => missionLog.totalDurationSeconds / 3600)
  );
  const telemetryState = summary?.telemetry.state ?? 'degraded';
  const telemetryLabel = getTelemetryLabel(telemetryState);
  const weeklyHours = selectedMissionLog
    ? formatHours(selectedMissionLog.totalDurationSeconds)
    : '--';
  const restingHrValue =
    summary?.metrics.currentStats.currentRestingHR.value !== null &&
    summary?.metrics.currentStats.currentRestingHR.value !== undefined
      ? String(summary.metrics.currentStats.currentRestingHR.value)
      : '--';
  const vo2MaxValue = summary?.metrics.vo2Max ? String(Math.round(summary.metrics.vo2Max)) : '--';
  const observedWorkouts =
    summary?.workoutStats?.total_workouts ?? recentActivities.length ?? 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] px-6 pt-32 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="border border-white/10 bg-white/[0.02] p-10 md:p-16">
            <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500">
              Training Preview
            </div>
            <div className="mt-8 h-24 w-3/4 animate-pulse bg-white/[0.03]" />
            <div className="mt-6 h-6 w-1/2 animate-pulse bg-white/[0.03]" />
            <div className="mt-16 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-20 animate-pulse bg-white/[0.02]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-[#050505] px-6 pt-32 text-white">
        <div className="mx-auto max-w-5xl border border-white/10 bg-white/[0.02] p-10 md:p-16">
          <div className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500">
            Training Preview
          </div>
          <h1 className="mt-8 font-oswald text-5xl uppercase tracking-tight md:text-7xl">
            Signal Lost
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400">
            The redesign preview needs a live training summary. If the feed is
            available, retry the request and reopen this page.
          </p>
          {error ? (
            <div className="mt-8 text-sm font-mono uppercase tracking-[0.2em] text-amber-400">
              {error}
            </div>
          ) : null}
          <button
            onClick={() => {
              void refresh();
            }}
            className="mt-10 inline-flex items-center gap-2 border border-white/10 px-5 py-3 text-xs font-mono uppercase tracking-[0.3em] text-white transition-colors hover:border-summit-gold hover:text-summit-gold"
          >
            Retry Summary
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-summit-gold selection:text-black">
      <section className="relative overflow-hidden px-6 pt-28">
        <div className="absolute inset-0">
          <Image
            src="/images/sunith-grit-training.png"
            alt="Training prototype hero"
            fill
            priority
            className="object-cover object-top opacity-25"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_34%),linear-gradient(180deg,rgba(5,5,5,0.08)_0%,rgba(5,5,5,0.72)_52%,rgba(5,5,5,0.98)_100%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl pb-24 pt-12 md:pb-32">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-[10px] font-mono uppercase tracking-[0.26em] text-zinc-400 backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-summit-gold" />
              Intervals.icu Live
            </div>

            <div className="mt-10 text-[10px] font-mono uppercase tracking-[0.32em] text-summit-gold/85">
              Weekly field reports
            </div>

            <div className="mt-6 text-ghost font-oswald text-[18vw] font-bold uppercase leading-[0.92] tracking-[-0.06em] md:text-[168px]">
              Training
            </div>

            <p className="mt-8 max-w-[38rem] text-[17px] leading-[1.85] text-zinc-300 md:text-[20px]">
              Live telemetry, distilled into one weekly record of the work, one
              quiet ledger of sessions, and one long view of the load.
            </p>
          </div>

          <div className="mt-16 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-4">
            <QuietStat
              label="Feed"
              value={telemetryLabel}
              note={
                summary.telemetry.source === 'intervals.icu'
                  ? 'Intervals.icu'
                  : 'Latest snapshot'
              }
            />
            <QuietStat
              label="This Week"
              value={weeklyHours}
              note={selectedMissionLog?.focus ?? 'Awaiting current block'}
            />
            <QuietStat
              label="Resting HR"
              value={restingHrValue}
              note="Current baseline"
            />
            <QuietStat
              label="Last Ingest"
              value={formatLastUpdated(summary.telemetry.lastUpdated)}
              note="Processed summary"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-white/8 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionEyebrow label="Current Week" />
          <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-oswald text-4xl uppercase leading-[0.92] tracking-[-0.03em] md:text-5xl">
                Mission Log
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-500">
                One week, clearly stated. The work, the emphasis, and the note
                that matters.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {missionLogs.slice(0, 8).map((missionLog) => {
                const isActive = missionLog.weekStart === resolvedWeek;
                return (
                  <button
                    key={missionLog.weekStart}
                    onClick={() => setSelectedWeek(missionLog.weekStart)}
                    className={cn(
                      'min-w-[92px] border-b px-0 pb-3 pt-1 text-left transition-colors',
                      isActive
                        ? 'border-summit-gold text-white'
                        : 'border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-300'
                    )}
                  >
                    <div className="text-[10px] font-mono uppercase tracking-[0.28em]">
                      {formatWeekLabel(missionLog.weekStart)}
                    </div>
                    <div className="mt-2 text-xs uppercase tracking-[0.12em] text-current/80">
                      {missionLog.activityCount} sessions
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.article
              key={resolvedWeek ?? 'empty'}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mt-14 border-t border-white/10 pt-10"
            >
              <div className="max-w-4xl">
                <div className="text-[10px] font-mono uppercase tracking-[0.36em] text-summit-gold/80">
                  Week of {formatWeekLabel(selectedMissionLog?.weekStart)}
                </div>
                <h3 className="mt-5 font-oswald text-5xl uppercase leading-[0.92] tracking-[-0.04em] md:text-7xl">
                  {selectedMissionLog?.focus ?? 'Mission Logs Pending'}
                </h3>
                <p className="mt-8 max-w-3xl text-[19px] leading-[1.8] text-zinc-300 md:text-[24px]">
                  {selectedMissionLog?.weekSummary ??
                    'No processed weekly report is available yet.'}
                </p>

                <div className="mt-12 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-3">
                  <QuietStat
                    label="Observed Sessions"
                    value={selectedMissionLog ? String(selectedMissionLog.activityCount) : '--'}
                  />
                  <QuietStat
                    label="Time Under Load"
                    value={
                      selectedMissionLog
                        ? formatHours(selectedMissionLog.totalDurationSeconds)
                        : '--'
                    }
                  />
                  <QuietStat
                    label="Dominant Mode"
                    value={selectedMissionLog?.dominantActivityType ?? '--'}
                  />
                </div>

                <div className="mt-12 grid gap-10 border-t border-white/10 pt-8 lg:grid-cols-[minmax(0,1fr)_260px]">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.32em] text-zinc-500">
                      Field Notes
                    </div>
                    <div className="mt-6 space-y-6">
                      {fieldNotes.length > 0 ? (
                        fieldNotes.map((activity) => (
                          <div key={getActivityId(activity)}>
                            <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-zinc-500">
                              {formatSessionDate(activity.startTimeLocal)} {'//'}{' '}
                              {formatActivityType(activity.activityType?.typeKey)}
                            </div>
                            <p className="mt-3 max-w-2xl text-sm leading-[1.85] text-zinc-400">
                              {truncateText(activity.description || '', 180)}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="max-w-2xl text-sm leading-[1.85] text-zinc-500">
                          No written field notes were recorded for the selected week.
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-[0.32em] text-zinc-500">
                      Recovery Directive
                    </div>
                    <p className="mt-4 text-sm leading-[1.85] text-zinc-400">
                      {selectedMissionLog?.tip ??
                        'Protect recovery between quality sessions and let the load accumulate deliberately.'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>
      </section>

      <section className="border-t border-white/8 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionEyebrow label="Sessions" />
          <div className="mt-6">
            <h2 className="font-oswald text-4xl uppercase leading-[0.92] tracking-[-0.03em] md:text-5xl">
              Session Ledger
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-500">
              The week, reduced to the individual efforts that created it.
            </p>
          </div>

          <div className="mt-14 grid gap-12 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
            <div className="border-t border-white/10">
              {weekSessions.length > 0 ? (
                weekSessions.slice(0, 8).map((activity) => {
                  const activityId = getActivityId(activity);
                  const isActive = activityId === getActivityId(selectedSession);

                  return (
                    <button
                      key={activityId}
                      onClick={() => setSelectedSessionId(activityId)}
                      className={cn(
                        'grid w-full grid-cols-[76px_minmax(0,1fr)_90px] items-center gap-4 border-b border-white/8 py-5 text-left transition-colors md:grid-cols-[84px_minmax(0,1fr)_110px]',
                        isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
                      )}
                    >
                      <div className="text-[10px] font-mono uppercase tracking-[0.24em] text-zinc-500">
                        {formatClock(activity.startTimeLocal)}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium uppercase tracking-[0.08em] md:text-base">
                          {activity.activityName || 'Recorded Session'}
                        </div>
                        <div className="mt-1 truncate text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                          {formatActivityType(activity.activityType?.typeKey)}
                        </div>
                      </div>
                      <div className="text-right text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                        {formatDuration(activity.duration)}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="py-8 text-sm leading-relaxed text-zinc-500">
                  No sessions are available for the selected week.
                </div>
              )}
            </div>

            <div className="border-t border-white/10 pt-6">
              <div className="text-[10px] font-mono uppercase tracking-[0.32em] text-summit-gold/80">
                Selected Session
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-[10px] font-mono uppercase tracking-[0.24em] text-zinc-500">
                <span>{formatSessionDate(selectedSession?.startTimeLocal)}</span>
                <span className="h-1 w-1 rounded-full bg-zinc-700" />
                <span>{formatActivityType(selectedSession?.activityType?.typeKey)}</span>
              </div>

              <h3 className="mt-5 font-oswald text-4xl uppercase leading-[0.94] tracking-[-0.03em] md:text-6xl">
                {selectedSession?.activityName || 'Awaiting Session'}
              </h3>

              <div className="mt-8 grid gap-8 sm:grid-cols-3">
                <QuietStat label="Duration" value={formatDuration(selectedSession?.duration)} />
                <QuietStat
                  label="Average HR"
                  value={
                    selectedSession?.averageHR
                      ? `${Math.round(selectedSession.averageHR)} bpm`
                      : '--'
                  }
                />
                <QuietStat
                  label="Distance"
                  value={
                    selectedSession?.distance
                      ? `${(selectedSession.distance / 1000).toFixed(1)} km`
                      : '--'
                  }
                />
              </div>

              <div className="mt-10 border-t border-white/10 pt-8">
                <div className="text-[10px] font-mono uppercase tracking-[0.32em] text-zinc-500">
                  Session Narrative
                </div>
                <p className="mt-4 max-w-3xl text-base leading-[1.9] text-zinc-300 md:text-lg">
                  {selectedSession?.description?.trim()
                    ? selectedSession.description
                    : 'No written field note was logged for this session.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/8 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionEyebrow label="Training Arc" />
              <h2 className="mt-6 font-oswald text-4xl uppercase leading-[0.92] tracking-[-0.03em] md:text-5xl">
                Long View
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-zinc-500">
                The last observed weeks, shown only as time under load.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3 sm:gap-10">
              <QuietStat label="Observed Sessions" value={String(observedWorkouts)} />
              <QuietStat label="VO2 Max" value={vo2MaxValue} />
              <QuietStat label="Resting HR" value={restingHrValue} />
            </div>
          </div>

          <div className="mt-14 border-t border-white/10 pt-8">
            {missionArc.length > 0 ? (
              <div className="grid h-[280px] grid-cols-8 items-end gap-4">
                {missionArc.map((missionLog) => {
                  const hours = missionLog.totalDurationSeconds / 3600;
                  const height = `${Math.max(12, (hours / missionArcMaxHours) * 100)}%`;
                  const isSelected = missionLog.weekStart === resolvedWeek;

                  return (
                    <div key={missionLog.weekStart} className="flex h-full flex-col justify-end gap-3">
                      <div className="relative flex-1 border-t border-white/8">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height }}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          className={cn(
                            'absolute bottom-0 left-0 right-0',
                            isSelected
                              ? 'bg-[linear-gradient(180deg,#fee1b5_0%,#d4af37_60%,#8f6a14_100%)]'
                              : 'bg-[linear-gradient(180deg,rgba(255,255,255,0.65)_0%,rgba(255,255,255,0.12)_100%)]'
                          )}
                        />
                      </div>
                      <div className="text-center text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
                        {formatChartLabel(missionLog.weekStart)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-sm leading-relaxed text-zinc-500">
                No weekly arc is available yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionEyebrow({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.28em] text-zinc-500">
      <span className="h-px w-8 bg-white/12" />
      <span>{label}</span>
    </div>
  );
}

function QuietStat({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: string;
}) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-zinc-500">
        {label}
      </div>
      <div className="mt-3 font-oswald text-2xl uppercase leading-none text-white md:text-3xl">
        {value}
      </div>
      {note ? (
        <div className="mt-3 text-[10px] font-mono uppercase tracking-[0.22em] text-zinc-600">
          {note}
        </div>
      ) : null}
    </div>
  );
}

function getActivityId(activity?: NormalizedTrainingActivity | null) {
  if (!activity) {
    return 'unknown';
  }

  return String(
    activity.activityId ??
      `${activity.startTimeLocal ?? 'unknown'}-${activity.activityName ?? 'session'}`
  );
}

function getWeekKey(dateString?: string) {
  if (!dateString) {
    return null;
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const copy = new Date(date);
  const day = copy.getUTCDay();
  const offset = day === 0 ? -6 : 1 - day;
  copy.setUTCDate(copy.getUTCDate() + offset);
  return copy.toISOString().split('T')[0];
}

function formatHours(totalDurationSeconds?: number | null) {
  if (!totalDurationSeconds || totalDurationSeconds <= 0) {
    return '--';
  }

  return `${(totalDurationSeconds / 3600).toFixed(1)} hrs`;
}

function formatDuration(durationSeconds?: number | null) {
  if (!durationSeconds || durationSeconds <= 0) {
    return '--';
  }

  const hours = Math.floor(durationSeconds / 3600);
  const minutes = Math.round((durationSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

function formatWeekLabel(weekStart?: string | null) {
  if (!weekStart) {
    return '--';
  }

  const date = new Date(`${weekStart}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return weekStart;
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function formatChartLabel(weekStart: string) {
  return formatWeekLabel(weekStart).split(' ')[1] ?? formatWeekLabel(weekStart);
}

function formatSessionDate(dateString?: string) {
  if (!dateString) {
    return '--';
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatClock(dateString?: string) {
  if (!dateString) {
    return '--';
  }

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function formatActivityType(typeKey?: string) {
  if (!typeKey) {
    return 'Training';
  }

  return typeKey
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatLastUpdated(timestamp?: string | null) {
  if (!timestamp) {
    return '--';
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function truncateText(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trimEnd()}...`;
}

function getTelemetryLabel(state: 'live' | 'cached' | 'degraded') {
  if (state === 'live') {
    return 'Live';
  }

  if (state === 'cached') {
    return 'Latest Snapshot';
  }

  return 'Unavailable';
}
