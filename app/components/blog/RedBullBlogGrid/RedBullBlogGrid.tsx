'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  Mountain,
  Search,
  X,
} from 'lucide-react';

interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
}

interface ApiPost {
  slug: string;
  title?: string;
  subtitle?: string;
  description?: string;
  category?: string;
  author?: string;
  date?: string;
  readTime?: string;
  image?: string;
  heroImage?: string;
}

interface RedBullBlogGridProps {
  className?: string;
}

const FALLBACK_IMAGE = '/images/sunith-visionary-planning.png';

export function RedBullBlogGrid({ className = '' }: RedBullBlogGridProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) throw new Error('Stories request failed');

        const data = await response.json();
        if (!data.success) throw new Error('Stories response was unsuccessful');

        setPosts(
          data.posts.map((post: ApiPost) => ({
            slug: post.slug,
            title: post.title || 'Untitled story',
            subtitle:
              post.subtitle ||
              post.description ||
              'A field note from the Summit Chronicles journey.',
            category: normalizeCategory(post.category),
            author: post.author || 'Sunith Kumar',
            date: formatDate(post.date),
            readTime: normalizeReadTime(post.readTime),
            image: post.image || post.heroImage || FALLBACK_IMAGE,
          }))
        );
      } catch (fetchError) {
        console.error('Error fetching posts:', fetchError);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    void fetchPosts();
  }, []);

  const categories = [
    'All',
    ...Array.from(new Set(posts.map((post) => post.category))),
  ];
  const normalizedQuery = query.trim().toLowerCase();
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      activeCategory === 'All' || post.category === activeCategory;
    const matchesQuery =
      !normalizedQuery ||
      [post.title, post.subtitle, post.category, post.author]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
  const leadStory = filteredPosts[0];
  const archive = filteredPosts.slice(1);
  return (
    <div className={`min-h-screen bg-[#080808] text-white ${className}`}>
      <section className="relative flex min-h-[72svh] items-end overflow-hidden border-b border-white/10 sm:min-h-[78svh]">
        <Image
          src="/images/sunith-visionary-planning.png"
          alt="Sunith Kumar reviewing the route and expedition plan"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/55 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/20 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-12 sm:px-8 sm:pb-16 lg:px-12"
        >
          <div className="mb-5 flex items-center gap-3 text-xs font-mono uppercase text-summit-gold-300">
            <BookOpen className="h-4 w-4" />
            Field Notes · Summit Chronicles
          </div>
          <h1 className="max-w-5xl font-oswald text-[64px] font-bold uppercase leading-[0.86] text-white sm:text-8xl lg:text-9xl">
            Stories From
            <span className="block text-summit-gold">The Ascent</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-200 sm:text-xl sm:leading-8">
            Expedition reports, recovery notes, mountain culture, and the
            decisions behind a methodical journey toward Everest.
          </p>
        </motion.div>
      </section>

      <section
        className="border-b border-white/10 bg-[#0c0c0c]"
        aria-label="Explore stories"
      >
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-2xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <label htmlFor="story-search" className="sr-only">
                Search stories
              </label>
              <input
                id="story-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search expeditions, lessons, places..."
                className="min-h-12 w-full rounded-md border border-white/10 bg-black/40 py-3 pl-11 pr-11 text-base text-white outline-none transition-colors placeholder:text-zinc-600 focus:border-summit-gold/60 focus:ring-2 focus:ring-summit-gold/20"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-zinc-500 transition-colors hover:text-white"
                  aria-label="Clear story search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>

          {categories.length > 2 ? (
            <div
              className="mt-5 flex gap-2 overflow-x-auto pb-1"
              aria-label="Story categories"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={activeCategory === category}
                  className={`min-h-10 shrink-0 rounded-md border px-4 py-2 text-xs font-mono uppercase transition-colors ${
                    activeCategory === category
                      ? 'border-summit-gold bg-summit-gold text-black'
                      : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/25 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
          <SectionHeading eyebrow="Latest Dispatch" title="Lead Story" />

          {loading ? (
            <StoryLoading />
          ) : error ? (
            <StoryState
              title="The archive is temporarily unavailable"
              body="The story feed could not be reached. The expedition pages and training log remain available."
            />
          ) : leadStory ? (
            <Link
              href={`/blog/${leadStory.slug}`}
              className="group mt-10 grid gap-7 border-t border-white/10 pt-7 lg:grid-cols-[1.45fr_0.75fr] lg:gap-12"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900 sm:aspect-[16/10]">
                <Image
                  src={leadStory.image}
                  alt={leadStory.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  priority
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
              </div>

              <article className="flex flex-col justify-end pb-2">
                <StoryMeta post={leadStory} />
                <h2 className="mt-5 font-oswald text-4xl font-bold uppercase leading-[0.95] text-white transition-colors group-hover:text-summit-gold-200 sm:text-5xl lg:text-6xl">
                  {leadStory.title}
                </h2>
                <p className="mt-5 text-base leading-7 text-zinc-400 sm:text-lg">
                  {leadStory.subtitle}
                </p>
                <div className="mt-8 inline-flex items-center gap-3 text-sm font-bold uppercase text-white">
                  Read the story
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </article>
            </Link>
          ) : posts.length === 0 ? (
            <StoryState
              title="The first dispatch is being prepared"
              body="Expedition stories and training notes will appear here as they are published."
            />
          ) : (
            <StoryState
              title="No stories match this search"
              body="Try a broader phrase, choose another category, or ask the AI archive using natural language."
            />
          )}
        </div>
      </section>

      {!loading && !error && archive.length > 0 ? (
        <section className="bg-[#0c0c0c]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-12">
            <SectionHeading eyebrow="Archive" title="All Stories" />
            <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
              {archive.map((post, index) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(index * 0.06, 0.24),
                  }}
                  data-testid="post-card"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group grid gap-5 py-7 sm:grid-cols-[13rem_1fr] sm:items-center lg:grid-cols-[17rem_1fr_auto] lg:gap-9"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-zinc-900">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 100vw, 272px"
                        unoptimized
                      />
                    </div>
                    <div className="min-w-0">
                      <StoryMeta post={post} />
                      <h2 className="mt-3 max-w-3xl font-oswald text-2xl font-bold uppercase leading-tight text-white transition-colors group-hover:text-summit-gold-200 sm:text-3xl">
                        {post.title}
                      </h2>
                      <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-zinc-500 sm:text-base">
                        {post.subtitle}
                      </p>
                    </div>
                    <ArrowRight className="hidden h-5 w-5 text-zinc-600 transition-all group-hover:translate-x-1 group-hover:text-summit-gold lg:block" />
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-t border-white/10 bg-summit-gold text-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-14 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <div>
            <div className="text-xs font-mono uppercase text-black/60">
              Field Notes · No Noise
            </div>
            <h2 className="mt-3 max-w-2xl font-oswald text-4xl font-bold uppercase leading-none sm:text-5xl">
              Follow the next chapter
            </h2>
          </div>
          <Link
            href="/newsletter"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-md bg-black px-6 py-3 text-sm font-bold uppercase text-white transition-colors hover:bg-zinc-800"
          >
            Join the newsletter
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function StoryMeta({ post }: { post: BlogPost }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-mono uppercase text-zinc-500">
      <span className="text-summit-gold-300">{post.category}</span>
      <span className="inline-flex items-center gap-1.5">
        <CalendarDays className="h-3.5 w-3.5" />
        {post.date}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock3 className="h-3.5 w-3.5" />
        {post.readTime}
      </span>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <div className="text-xs font-mono uppercase text-summit-gold-300">
          {eyebrow}
        </div>
        <h2 className="mt-3 font-oswald text-4xl font-bold uppercase text-white sm:text-5xl">
          {title}
        </h2>
      </div>
      <Mountain className="hidden h-7 w-7 text-white/20 sm:block" />
    </div>
  );
}

function StoryLoading() {
  return (
    <div
      className="mt-10 grid animate-pulse gap-7 border-t border-white/10 pt-7 lg:grid-cols-[1.45fr_0.75fr] lg:gap-12"
      role="status"
    >
      <div className="aspect-[16/10] bg-white/[0.04]" />
      <div className="flex flex-col justify-end gap-5">
        <div className="h-3 w-40 bg-white/[0.05]" />
        <div className="h-14 w-full bg-white/[0.05]" />
        <div className="h-20 w-full bg-white/[0.04]" />
        <span className="sr-only">Loading stories</span>
      </div>
    </div>
  );
}

function StoryState({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-10 border-y border-white/10 py-16">
      <h2 className="font-oswald text-3xl font-bold uppercase text-white">
        {title}
      </h2>
      <p className="mt-4 max-w-2xl leading-7 text-zinc-400">{body}</p>
    </div>
  );
}

function normalizeCategory(category?: string) {
  if (!category || category === 'NULL') return 'Field Note';
  return category.replace(/[-_]/g, ' ');
}

function normalizeReadTime(readTime?: string) {
  if (!readTime) return '5 min read';
  return readTime.includes('read') ? readTime : `${readTime} read`;
}

function formatDate(date?: string) {
  if (!date) return 'Recent';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return 'Recent';
  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
