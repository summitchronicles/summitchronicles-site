'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowDown,
  ArrowUpRight,
  Clock3,
  CloudOff,
  Database,
  HeartPulse,
  Mountain,
  RefreshCw,
  Route,
  Watch,
} from 'lucide-react';
import { useTrainingSummary } from '@/lib/hooks/useTrainingSummary';
import { cn } from '@/lib/utils';
import type { TrainingIntegrationStatus } from '@/modules/training/domain/training-dashboard';
import type { NormalizedTrainingActivity } from '@/modules/training/domain/training-metrics';

const integrationIcons = {
  'intervals.icu': Database,
  whoop: HeartPulse,
  strava: Route,
  garmin: Watch,
};

export function TrainingRedesignPrototype() {
  const { summary, loading, error, refresh } = useTrainingSummary();
  const missionLogs = useMemo(() => summary?.missionLogs ?? [], [summary]);
  const recentActivities = useMemo(
    () => summary?.metrics.recentActivities ?? [],
    [summary]
  );
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const defaultWeekStart = missionLogs[0]?.weekStart ?? null;

  useEffect(() => {
    if (!selectedWeek && defaultWeekStart) setSelectedWeek(defaultWeekStart);
  }, [defaultWeekStart, selectedWeek]);

  const resolvedWeek =
    selectedWeek ??
    defaultWeekStart ??
    getWeekKey(recentActivities[0]?.startTimeLocal) ??
    null;
  const selectedMissionLog =
    missionLogs.find((log) => log.weekStart === resolvedWeek) ??
    summary?.latestMissionLog ??
    null;
  const weekSessions = useMemo(
    () =>
      resolvedWeek
        ? recentActivities.filter(
            (activity) => getWeekKey(activity.startTimeLocal) === resolvedWeek
          )
        : recentActivities.slice(0, 8),
    [recentActivities, resolvedWeek]
  );

  useEffect(() => {
    const ids = weekSessions.map(getActivityId);
    if (ids.length === 0) {
      setSelectedSessionId(null);
    } else if (!selectedSessionId || !ids.includes(selectedSessionId)) {
      setSelectedSessionId(ids[0]);
    }
  }, [selectedSessionId, weekSessions]);

  const selectedSession =
    weekSessions.find(
      (activity) => getActivityId(activity) === selectedSessionId
    ) ??
    weekSessions[0] ??
    null;
  const missionArc = missionLogs.slice(0, 8).reverse();
  const maxArcHours = Math.max(
    1,
    ...missionArc.map((log) => log.totalDurationSeconds / 3600)
  );
  const whoop = summary?.integrations.find((item) => item.id === 'whoop');
  const whoopRecovery = summary?.metrics.whoopRecovery;
  const hasRecoveryData = Boolean(whoopRecovery);

  if (loading) return <TrainingLoading />;

  if (!summary) {
    return (
      <div className="min-h-screen bg-[#070707] px-6 pb-24 pt-36 text-white">
        <div className="mx-auto max-w-5xl border-l-2 border-summit-gold pl-6 md:pl-10">
          <p className="font-mono text-xs uppercase text-zinc-500">
            Training record
          </p>
          <h1 className="mt-5 font-oswald text-6xl font-bold uppercase leading-none md:text-8xl">
            Feed unavailable
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-zinc-400">
            No training observations could be loaded. Existing athlete values
            are intentionally not estimated.
          </p>
          {error ? (
            <p className="mt-5 font-mono text-xs text-amber-300">{error}</p>
          ) : null}
          <button
            type="button"
            onClick={() => void refresh()}
            className="mt-8 inline-flex min-h-11 items-center gap-2 rounded bg-white px-5 py-3 font-oswald text-sm font-bold uppercase text-black focus:outline-none focus:ring-2 focus:ring-summit-gold"
          >
            <RefreshCw className="h-4 w-4" /> Retry
          </button>
        </div>
      </div>
    );
  }

  const weeklyHours = selectedMissionLog
    ? formatHours(selectedMissionLog.totalDurationSeconds)
    : '--';
  const lastUpdated = formatTimestamp(summary.telemetry.lastUpdated);
  const latestObservation = formatObservationDate(
    recentActivities[0]?.startTimeLocal
  );

  return (
    <div className="min-h-screen bg-[#070707] text-white selection:bg-summit-gold selection:text-black">
      <section className="relative flex min-h-[78svh] items-end overflow-hidden px-6 pb-12 pt-28 md:min-h-[80svh] md:pb-16">
        <Image
          src="/images/sunith-grit-training.png"
          alt="Sunith training in the mountains"
          fill
          priority
          className="object-cover object-top opacity-50"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#070707]/65" />
        <div className="relative mx-auto w-full max-w-7xl">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 font-mono text-xs uppercase text-zinc-200">
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  statusDot(summary.telemetry.state)
                )}
              />
              {telemetryLabel(summary.telemetry.state)} · Latest session{' '}
              {latestObservation}
            </div>
            <h1 className="mt-6 font-oswald text-7xl font-bold uppercase leading-[0.86] md:text-9xl">
              Training
              <span className="block text-summit-gold">Record</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-100 md:text-xl">
              The observed work behind the expeditions: weekly load, recovery
              context, and field notes from each session.
            </p>
          </div>
          <div className="mt-10 grid max-w-4xl grid-cols-2 gap-px bg-white/15 md:grid-cols-4">
            <HeroMetric label="Current week" value={weeklyHours} />
            <HeroMetric
              label="Sessions"
              value={String(
                selectedMissionLog?.activityCount ?? weekSessions.length
              )}
            />
            <HeroMetric
              label="Elevation"
              value={formatElevation(selectedMissionLog?.totalElevationGain)}
            />
            <HeroMetric
              label="Primary work"
              value={selectedMissionLog?.dominantActivityType ?? '--'}
            />
          </div>
          <a
            href="#current-block"
            className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase text-zinc-300 hover:text-white"
          >
            View current block <ArrowDown className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section
        aria-label="Training data sources"
        className="border-y border-white/10 bg-[#0c0c0c] px-6"
      >
        <div className="mx-auto grid max-w-7xl md:grid-cols-4">
          {summary.integrations.map((integration) => (
            <IntegrationItem key={integration.id} integration={integration} />
          ))}
        </div>
      </section>

      <section id="current-block" className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            index="01"
            eyebrow="Current block"
            title={selectedMissionLog?.focus ?? 'Awaiting observed work'}
            copy={
              selectedMissionLog?.weekSummary ??
              'No sessions have been observed for this training week.'
            }
          />

          <div className="mt-12 grid gap-10 border-t border-white/10 pt-10 lg:grid-cols-[1.45fr_0.75fr]">
            <div>
              <div className="flex gap-2 overflow-x-auto pb-4">
                {missionLogs.slice(0, 8).map((log) => (
                  <button
                    type="button"
                    key={log.weekStart}
                    onClick={() => setSelectedWeek(log.weekStart)}
                    className={cn(
                      'min-h-10 shrink-0 rounded border px-4 font-mono text-xs uppercase transition-colors',
                      log.weekStart === resolvedWeek
                        ? 'border-summit-gold bg-summit-gold text-black'
                        : 'border-white/15 text-zinc-400 hover:border-white/40 hover:text-white'
                    )}
                  >
                    {formatWeekLabel(log.weekStart)}
                  </button>
                ))}
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                <Metric
                  label="Time under load"
                  value={weeklyHours}
                  icon={Clock3}
                />
                <Metric
                  label="Distance"
                  value={formatDistance(selectedMissionLog?.totalDistanceKm)}
                  icon={Route}
                />
                <Metric
                  label="Vertical gain"
                  value={formatElevation(
                    selectedMissionLog?.totalElevationGain
                  )}
                  icon={Mountain}
                />
              </div>
              <div className="mt-10 border-l-2 border-summit-gold pl-6">
                <p className="font-mono text-xs uppercase text-summit-gold">
                  Field directive
                </p>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-300">
                  {selectedMissionLog?.tip ??
                    'No training directive is available for this week.'}
                </p>
              </div>
            </div>

            <aside className="border-t border-white/10 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
              <div className="flex items-center gap-3">
                <HeartPulse className="h-5 w-5 text-summit-gold" />
                <h2 className="font-oswald text-2xl uppercase">
                  Recovery context
                </h2>
              </div>
              {hasRecoveryData ? (
                <div className="mt-8 grid grid-cols-2 gap-8">
                  <Metric
                    label="Recovery"
                    value={formatScore(whoopRecovery?.recoveryScore)}
                  />
                  <Metric label="HRV" value={formatHrv(whoopRecovery?.hrvMs)} />
                  <Metric
                    label="Resting HR"
                    value={formatHeartRate(whoopRecovery?.restingHeartRate)}
                  />
                  <Metric
                    label="Sleep performance"
                    value={formatPercent(whoopRecovery?.sleepPerformance)}
                  />
                  <Metric
                    label="Day strain"
                    value={formatDecimal(whoopRecovery?.dayStrain)}
                  />
                  <div className="col-span-2 font-mono text-[10px] uppercase text-zinc-600">
                    WHOOP observation ·{' '}
                    {formatObservationDate(whoopRecovery?.observedAt)}
                  </div>
                </div>
              ) : (
                <div className="mt-8 rounded border border-white/10 bg-white/[0.025] p-6">
                  <CloudOff className="h-6 w-6 text-zinc-500" />
                  <p className="mt-5 font-oswald text-2xl uppercase">
                    Recovery signal unavailable
                  </p>
                  <p className="mt-3 text-sm leading-6 text-zinc-500">
                    {whoop?.state === 'connected'
                      ? 'WHOOP is connected, but no observed recovery values are present in this snapshot.'
                      : 'WHOOP will supply sleep, HRV, recovery, and strain once authorization is complete.'}
                  </p>
                  <p className="mt-5 font-mono text-xs uppercase text-zinc-400">
                    WHOOP · {formatState(whoop?.state)}
                  </p>
                  {whoop?.state !== 'connected' ? (
                    <a
                      href="/api/auth/whoop/start"
                      className="mt-6 inline-flex min-h-11 items-center gap-2 rounded bg-white px-4 py-3 font-oswald text-sm font-bold uppercase text-black transition-colors hover:bg-summit-gold"
                    >
                      Connect WHOOP
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#0c0c0c] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            index="02"
            eyebrow="Eight-week load"
            title="Time under load"
            copy="Observed duration by training week. No readiness score or performance forecast is inferred from this activity volume."
          />
          <div className="mt-14 h-80 border-b border-white/20">
            {missionArc.length ? (
              <div className="grid h-full grid-cols-8 items-end gap-2 md:gap-5">
                {missionArc.map((log) => {
                  const hours = log.totalDurationSeconds / 3600;
                  const height = `${Math.max(5, (hours / maxArcHours) * 100)}%`;
                  return (
                    <button
                      type="button"
                      key={log.weekStart}
                      onClick={() => setSelectedWeek(log.weekStart)}
                      className="group flex h-full min-w-0 flex-col justify-end"
                      aria-label={`${formatWeekLabel(log.weekStart)}, ${hours.toFixed(1)} hours`}
                    >
                      <span className="mb-2 hidden font-mono text-xs text-zinc-500 sm:block">
                        {hours.toFixed(1)}h
                      </span>
                      <motion.span
                        initial={{ height: 0 }}
                        whileInView={{ height }}
                        viewport={{ once: true }}
                        className={cn(
                          'w-full min-w-0 bg-zinc-700 transition-colors group-hover:bg-white',
                          log.weekStart === resolvedWeek && 'bg-summit-gold'
                        )}
                      />
                      <span className="mt-3 truncate font-mono text-[10px] uppercase text-zinc-500">
                        {formatChartLabel(log.weekStart)}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex h-full items-center text-sm text-zinc-500">
                No observed weekly history.
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="sessions" className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            index="03"
            eyebrow="Session ledger"
            title={formatWeekRange(resolvedWeek)}
            copy="Select a recorded session to inspect the work and its field note."
          />
          <div className="mt-12 grid gap-12 border-t border-white/10 pt-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="divide-y divide-white/10 border-b border-white/10">
              {weekSessions.length ? (
                weekSessions.slice(0, 10).map((activity) => {
                  const id = getActivityId(activity);
                  const active = id === getActivityId(selectedSession);
                  return (
                    <button
                      type="button"
                      key={id}
                      onClick={() => setSelectedSessionId(id)}
                      className={cn(
                        'grid w-full grid-cols-[64px_minmax(0,1fr)_24px] items-center gap-4 py-5 text-left',
                        active
                          ? 'text-white'
                          : 'text-zinc-500 hover:text-zinc-200'
                      )}
                    >
                      <span className="font-mono text-xs">
                        {formatClock(activity.startTimeLocal)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-oswald text-lg uppercase">
                          {activity.activityName || 'Recorded session'}
                        </span>
                        <span className="mt-1 block truncate font-mono text-[10px] uppercase">
                          {formatActivityType(activity.activityType?.typeKey)} ·{' '}
                          {formatDuration(activity.duration)}
                        </span>
                      </span>
                      <ArrowUpRight
                        className={cn('h-4 w-4', active && 'text-summit-gold')}
                      />
                    </button>
                  );
                })
              ) : (
                <p className="py-8 text-sm text-zinc-500">
                  No sessions observed for this week.
                </p>
              )}
            </div>
            <article className="min-w-0">
              <p className="font-mono text-xs uppercase text-summit-gold">
                Selected session
              </p>
              <h2 className="mt-5 break-words font-oswald text-5xl uppercase leading-none md:text-7xl">
                {selectedSession?.activityName || 'Awaiting session'}
              </h2>
              <div className="mt-8 grid grid-cols-2 gap-8 border-y border-white/10 py-7 sm:grid-cols-4">
                <Metric
                  label="Duration"
                  value={formatDuration(selectedSession?.duration)}
                />
                <Metric
                  label="Distance"
                  value={formatMeters(selectedSession?.distance)}
                />
                <Metric
                  label="Elevation"
                  value={formatElevation(selectedSession?.elevationGain)}
                />
                <Metric
                  label="Average HR"
                  value={formatHeartRate(selectedSession?.averageHR)}
                />
              </div>
              <p className="mt-8 max-w-3xl text-base leading-8 text-zinc-300 md:text-lg">
                {selectedSession?.description?.trim() ||
                  'No field note was recorded for this session.'}
              </p>
            </article>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 font-mono text-xs uppercase text-zinc-500 md:flex-row md:items-center md:justify-between">
          <span>Observed athlete data · No synthetic readiness metrics</span>
          <span>
            Refreshed {lastUpdated} · Latest session {latestObservation}
          </span>
        </div>
      </footer>
    </div>
  );
}

function TrainingLoading() {
  return (
    <div className="min-h-screen bg-[#070707] px-6 pb-24 pt-36 text-white">
      <div className="mx-auto max-w-7xl" role="status">
        <p className="font-mono text-xs uppercase text-zinc-500">
          Training record
        </p>
        <h1 className="mt-5 font-oswald text-6xl font-bold uppercase md:text-8xl">
          Loading observations
        </h1>
        <div className="mt-12 grid gap-px bg-white/10 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse bg-[#0c0c0c]" />
          ))}
        </div>
      </div>
    </div>
  );
}

function IntegrationItem({
  integration,
}: {
  integration: TrainingIntegrationStatus;
}) {
  const Icon = integrationIcons[integration.id];
  const connectionHref =
    integration.id === 'whoop'
      ? '/api/auth/whoop/start'
      : integration.id === 'strava'
        ? '/api/auth/strava/start'
        : null;
  return (
    <div className="border-white/10 py-6 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0">
      <div className="flex items-start gap-4">
        <Icon className="mt-0.5 h-5 w-5 shrink-0 text-zinc-400" />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-oswald text-lg uppercase">
              {integration.label}
            </span>
            <span
              className={cn(
                'h-1.5 w-1.5 rounded-full',
                integrationDot(integration.state)
              )}
            />
            <span className="font-mono text-[10px] uppercase text-zinc-500">
              {formatState(integration.state)}
            </span>
          </div>
          <p className="mt-2 text-xs leading-5 text-zinc-500">
            {integration.role}
          </p>
          {connectionHref && integration.state === 'setup-required' ? (
            <a
              href={connectionHref}
              className="mt-3 inline-flex min-h-9 items-center gap-1.5 font-mono text-[10px] uppercase text-summit-gold transition-colors hover:text-white"
            >
              Connect {integration.label}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SectionHeading({
  index,
  eyebrow,
  title,
  copy,
}: {
  index: string;
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-[80px_minmax(0,1fr)_minmax(240px,420px)] md:items-end">
      <span className="font-mono text-xs text-summit-gold">/{index}</span>
      <div>
        <p className="font-mono text-xs uppercase text-zinc-500">{eyebrow}</p>
        <h2 className="mt-3 break-words font-oswald text-4xl uppercase leading-none md:text-6xl">
          {title}
        </h2>
      </div>
      <p className="text-sm leading-7 text-zinc-500">{copy}</p>
    </div>
  );
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 bg-black/60 p-4 md:p-5">
      <p className="font-mono text-[10px] uppercase text-zinc-400">{label}</p>
      <p className="mt-2 break-words font-oswald text-2xl uppercase leading-none">
        {value}
      </p>
    </div>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: typeof Activity;
}) {
  return (
    <div className="min-w-0">
      {Icon ? <Icon className="mb-4 h-5 w-5 text-summit-gold" /> : null}
      <p className="font-mono text-[10px] uppercase text-zinc-500">{label}</p>
      <p className="mt-2 break-words font-oswald text-2xl uppercase leading-none md:text-3xl">
        {value}
      </p>
    </div>
  );
}

function getActivityId(activity?: NormalizedTrainingActivity | null) {
  if (!activity) return 'unknown';
  return String(
    activity.activityId ??
      `${activity.startTimeLocal ?? 'unknown'}-${activity.activityName ?? 'session'}`
  );
}

function getWeekKey(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const day = date.getUTCDay();
  date.setUTCDate(date.getUTCDate() + (day === 0 ? -6 : 1 - day));
  return date.toISOString().split('T')[0];
}

function formatHours(seconds?: number | null) {
  return seconds && seconds > 0 ? `${(seconds / 3600).toFixed(1)} hrs` : '--';
}
function formatDuration(seconds?: number | null) {
  if (!seconds || seconds <= 0) return '--';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
}
function formatDistance(km?: number | null) {
  return km && km > 0 ? `${km.toFixed(1)} km` : '--';
}
function formatMeters(meters?: number | null) {
  return meters && meters > 0 ? `${(meters / 1000).toFixed(1)} km` : '--';
}
function formatElevation(meters?: number | null) {
  return meters && meters > 0
    ? `${Math.round(meters).toLocaleString()} m`
    : '--';
}
function formatHeartRate(value?: number | null) {
  return value && value > 0 ? `${Math.round(value)} bpm` : '--';
}
function formatHrv(value?: number | null) {
  return value && value > 0 ? `${Math.round(value)} ms` : '--';
}
function formatPercent(value?: number | null) {
  return value && value > 0 ? `${Math.round(value)}%` : '--';
}
function formatScore(value?: number | null) {
  return value && value > 0 ? `${Math.round(value)}%` : '--';
}
function formatDecimal(value?: number | null) {
  return value && value > 0 ? value.toFixed(1) : '--';
}
function formatWeekLabel(value?: string | null) {
  if (!value) return '--';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
function formatWeekRange(value?: string | null) {
  if (!value) return 'Latest observations';
  const start = new Date(`${value}T00:00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return `${formatWeekLabel(value)} — ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}
function formatChartLabel(value: string) {
  return formatWeekLabel(value).replace(' ', '·');
}
function formatClock(value?: string) {
  if (!value) return '--';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '--'
    : date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
}
function formatActivityType(value?: string) {
  return value
    ? value
        .replace(/[_-]+/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    : 'Training';
}
function formatTimestamp(value?: string) {
  if (!value) return 'unknown';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'unknown'
    : date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
}
function formatObservationDate(value?: string) {
  if (!value) return 'unknown';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'unknown'
    : date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
}
function telemetryLabel(state: string) {
  return state === 'live'
    ? 'Live observations'
    : state === 'cached'
      ? 'Cached observations'
      : 'Feed degraded';
}
function statusDot(state: string) {
  return state === 'live'
    ? 'bg-emerald-400'
    : state === 'cached'
      ? 'bg-amber-300'
      : 'bg-red-400';
}
function integrationDot(state: TrainingIntegrationStatus['state']) {
  return ['live', 'connected'].includes(state)
    ? 'bg-emerald-400'
    : ['cached', 'setup-required'].includes(state)
      ? 'bg-amber-300'
      : 'bg-zinc-600';
}
function formatState(state?: TrainingIntegrationStatus['state']) {
  return state ? state.replace('-', ' ') : 'not configured';
}
