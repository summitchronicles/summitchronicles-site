'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Mountain,
} from 'lucide-react';
import { useTrainingSummary } from '@/lib/hooks/useTrainingSummary';

interface LatestPost {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  readTime: string;
}

export function LatestChronicles() {
  const [latestPost, setLatestPost] = useState<LatestPost | null>(null);
  const [storiesLoading, setStoriesLoading] = useState(true);
  const { summary, loading: trainingLoading } = useTrainingSummary();
  const trainingLog = summary?.latestMissionLog ?? null;

  useEffect(() => {
    const loadLatestPost = async () => {
      try {
        const response = await fetch('/api/posts', { cache: 'no-store' });
        if (!response.ok) return;

        const data = (await response.json()) as { posts?: LatestPost[] };
        setLatestPost(data.posts?.[0] ?? null);
      } finally {
        setStoriesLoading(false);
      }
    };

    void loadLatestPost();
  }, []);

  return (
    <section className="border-y border-white/10 bg-[#0a0a0a] px-5 py-20 text-white sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-9 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-mono uppercase text-summit-gold">
              Latest chronicles
            </div>
            <h2 className="mt-3 max-w-3xl font-oswald text-4xl font-bold uppercase leading-[0.95] text-white sm:text-5xl md:text-6xl">
              What is happening now
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
            The newest verified entry from the journal, the latest observed
            training week, and the expedition objective they are building
            toward.
          </p>
        </div>

        <div className="grid divide-y divide-white/10 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          <ChronicleEntry
            eyebrow="Journal"
            icon={<BookOpen className="h-4 w-4" />}
            href={latestPost ? `/blog/${latestPost.slug}` : '/blog'}
            title={
              storiesLoading
                ? 'Loading the latest journal entry'
                : latestPost?.title || 'No reviewed journal entry yet'
            }
            summary={
              latestPost?.subtitle ||
              'New field notes and reflections will appear here after editorial review.'
            }
            meta={
              latestPost
                ? `${formatDate(latestPost.date)} / ${latestPost.readTime}`
                : 'Journal archive'
            }
          />

          <ChronicleEntry
            eyebrow="Training"
            icon={<Activity className="h-4 w-4" />}
            href="/training"
            title={
              trainingLoading
                ? 'Loading the latest training week'
                : trainingLog?.focus || 'Training update unavailable'
            }
            summary={
              trainingLog?.weekSummary ||
              'The training ledger will update when a verified weekly summary is available.'
            }
            meta={
              trainingLog
                ? `Week of ${formatDate(trainingLog.weekStart)} / ${trainingLog.activityCount} sessions`
                : 'Training ledger'
            }
          />

          <ChronicleEntry
            eyebrow="Expedition roadmap"
            icon={<Mountain className="h-4 w-4" />}
            href="/expeditions"
            title="Everest remains the long objective"
            summary="The route runs through recovery, gait rebuild, strength, and a deliberate return to full mountain training."
            meta="Target: Spring 2028"
          />
        </div>
      </div>
    </section>
  );
}

function ChronicleEntry({
  eyebrow,
  icon,
  href,
  title,
  summary,
  meta,
}: {
  eyebrow: string;
  icon: React.ReactNode;
  href: string;
  title: string;
  summary: string;
  meta: string;
}) {
  return (
    <Link
      href={href}
      className="group flex min-h-[340px] flex-col px-0 py-10 transition-colors hover:bg-white/[0.025] lg:px-8 lg:first:pl-0 lg:last:pr-0"
    >
      <div className="flex items-center gap-3 text-xs font-mono uppercase text-summit-gold">
        {icon}
        {eyebrow}
      </div>
      <h3 className="mt-7 font-oswald text-3xl font-bold uppercase leading-tight text-white sm:text-4xl">
        {title}
      </h3>
      <p className="mt-5 line-clamp-4 text-sm leading-7 text-zinc-400 sm:text-base">
        {summary}
      </p>
      <div className="mt-auto flex items-end justify-between gap-4 pt-10">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-zinc-500">
          <CalendarDays className="h-3.5 w-3.5" />
          {meta}
        </div>
        <ArrowUpRight className="h-5 w-5 shrink-0 text-zinc-600 transition-colors group-hover:text-summit-gold" />
      </div>
    </Link>
  );
}

function formatDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
