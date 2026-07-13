'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Activity, ArrowRight, ArrowUpRight, Mountain } from 'lucide-react';
import { useTrainingSummary } from '@/lib/hooks/useTrainingSummary';

interface LatestPost {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
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
    <section className="bg-[#0a0a0a] px-5 py-20 text-white sm:px-8 sm:py-24 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-mono uppercase text-summit-gold">
              Field journal
            </div>
            <h2 className="mt-3 max-w-3xl font-oswald text-4xl font-bold uppercase leading-[0.95] text-white sm:text-5xl md:text-6xl">
              Latest from the journey
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex min-h-11 items-center gap-2 self-start text-xs font-mono uppercase text-white/65 transition-colors hover:text-summit-gold md:self-auto"
          >
            View all stories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid border-t border-white/10 lg:grid-cols-[1.65fr_0.85fr]">
          <Link
            href={latestPost ? `/blog/${latestPost.slug}` : '/blog'}
            className="group border-b border-white/10 py-8 lg:border-b-0 lg:border-r lg:pr-10"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
              {latestPost?.image ? (
                <Image
                  src={latestPost.image}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 62vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                />
              ) : (
                <Image
                  src="/images/sunith-visionary-planning.png"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 62vw"
                  className="object-cover opacity-70"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] font-mono uppercase tracking-[0.16em] text-summit-gold">
              <span>{latestPost?.category || 'Journal'}</span>
              <span className="text-white/25">/</span>
              <span className="text-white/45">
                {latestPost
                  ? `${formatDate(latestPost.date)} / ${latestPost.readTime}`
                  : 'Browse the archive'}
              </span>
            </div>
            <div className="mt-4 flex items-start justify-between gap-6">
              <div>
                <h3 className="max-w-4xl font-oswald text-3xl font-bold uppercase leading-[1.02] text-white sm:text-4xl lg:text-5xl">
                  {storiesLoading
                    ? 'From the Summit Chronicles journal'
                    : latestPost?.title ||
                      'The next field note is being prepared'}
                </h3>
                <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400 sm:text-base">
                  {latestPost?.subtitle ||
                    'Expedition reports, training reflections, and lessons from the mountains.'}
                </p>
              </div>
              <ArrowUpRight className="mt-1 h-6 w-6 shrink-0 text-white/35 transition-colors group-hover:text-summit-gold" />
            </div>
          </Link>

          <aside className="divide-y divide-white/10 lg:pl-10">
            <SupportingUpdate
              eyebrow="Training notes"
              icon={<Activity className="h-4 w-4" />}
              href="/training"
              title={
                trainingLoading
                  ? 'The latest training chapter'
                  : trainingLog?.focus || 'Recovery-led preparation'
              }
              summary={
                trainingLog?.weekSummary ||
                'Verified sessions and weekly context, without invented milestones or deadlines.'
              }
              meta={
                trainingLog
                  ? `Week of ${formatDate(trainingLog.weekStart)} / ${trainingLog.activityCount} sessions`
                  : 'Open the training journal'
              }
            />
            <SupportingUpdate
              eyebrow="Expedition roadmap"
              icon={<Mountain className="h-4 w-4" />}
              href="/expeditions"
              title="The route to the next expedition"
              summary="Completed climbs, lessons from each mountain, and the objectives still ahead."
              meta="Explore the Seven Summits journey"
            />
          </aside>
        </div>
      </div>
    </section>
  );
}

function SupportingUpdate({
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
    <Link href={href} className="group flex min-h-[290px] flex-col py-8">
      <div className="flex items-center gap-3 text-xs font-mono uppercase text-summit-gold">
        {icon}
        {eyebrow}
      </div>
      <h3 className="mt-6 font-oswald text-3xl font-bold uppercase leading-[1.05] text-white">
        {title}
      </h3>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-zinc-400">
        {summary}
      </p>
      <div className="mt-auto flex items-end justify-between gap-4 pt-10">
        <div className="text-[10px] font-mono uppercase leading-5 tracking-[0.12em] text-zinc-500">
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
