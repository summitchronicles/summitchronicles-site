'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Edit3,
  MapPin,
  Share2,
  User,
} from 'lucide-react';

interface StorySection {
  title: string;
  content: string;
  image?: string;
  pullQuote?: string;
}

interface BlogPostData {
  title: string;
  subtitle: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  location?: string;
  heroImage: string;
  content: {
    intro: string;
    sections: StorySection[];
  };
  tags: string[];
}

interface RedBullBlogPostProps {
  post?: any;
  slug: string;
  className?: string;
  isEditable?: boolean;
  onImageClick?: (key: string, currentSrc: string) => void;
  onTitleChange?: (newTitle: string) => void;
  onSubtitleChange?: (newSubtitle: string) => void;
  onIntroChange?: (newIntro: string) => void;
  onSectionChange?: (
    index: number,
    field: 'title' | 'content',
    newValue: string
  ) => void;
}

const FALLBACK_IMAGE = '/images/sunith-visionary-planning.png';

export function RedBullBlogPost({
  post,
  slug,
  className = '',
  isEditable = false,
  onImageClick,
  onTitleChange,
  onSubtitleChange,
  onSectionChange,
  onIntroChange,
}: RedBullBlogPostProps) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [shareComplete, setShareComplete] = useState(false);
  const displayPost = useMemo(() => normalizePost(post), [post]);

  useEffect(() => {
    const updateProgress = () => {
      const article = document.querySelector('[data-story-body]');
      if (!article) return;
      const bounds = article.getBoundingClientRect();
      const total = Math.max(1, article.scrollHeight - window.innerHeight);
      const traversed = Math.min(total, Math.max(0, -bounds.top));
      setReadingProgress((traversed / total) * 100);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: displayPost.title,
      text: displayPost.subtitle,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
      setShareComplete(true);
      window.setTimeout(() => setShareComplete(false), 1800);
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Story sharing failed:', error);
      }
    }
  };

  return (
    <article className={`min-h-screen bg-[#080808] text-white ${className}`}>
      <div
        className="fixed left-0 top-0 z-[130] h-1 w-full bg-white/10"
        aria-hidden="true"
      >
        <div
          className="h-full bg-summit-gold transition-[width] duration-150"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <section className="relative flex min-h-[76svh] items-end overflow-hidden border-b border-white/10 sm:min-h-[82svh]">
        <Image
          src={displayPost.heroImage}
          alt={displayPost.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-black/55 to-black/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />

        {isEditable && onImageClick ? (
          <button
            type="button"
            onClick={() => onImageClick('hero', displayPost.heroImage)}
            className="absolute right-5 top-5 z-20 inline-flex min-h-11 items-center gap-2 rounded-md border border-white/20 bg-black/70 px-4 py-2 text-sm font-bold text-white backdrop-blur-md"
          >
            <Edit3 className="h-4 w-4" />
            Replace image
          </button>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-10 sm:px-8 sm:pb-14 lg:px-12"
        >
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono uppercase text-zinc-300 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Stories
          </Link>

          <div className="max-w-5xl">
            <div className="text-xs font-mono uppercase text-summit-gold-300">
              {displayPost.category}
            </div>
            <h1
              className={`mt-5 max-w-5xl font-oswald text-5xl font-bold uppercase leading-[0.92] text-white sm:text-7xl lg:text-8xl ${editableClass(isEditable)}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) =>
                isEditable &&
                onTitleChange?.(event.currentTarget.textContent || '')
              }
            >
              {displayPost.title}
            </h1>
            {displayPost.subtitle ? (
              <p
                className={`mt-6 max-w-3xl text-lg leading-8 text-zinc-200 sm:text-2xl sm:leading-9 ${editableClass(isEditable)}`}
                contentEditable={isEditable}
                suppressContentEditableWarning
                onBlur={(event) =>
                  isEditable &&
                  onSubtitleChange?.(event.currentTarget.textContent || '')
                }
              >
                {displayPost.subtitle}
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/15 pt-5 text-xs font-mono uppercase text-zinc-300">
              <span className="inline-flex items-center gap-2">
                <User className="h-4 w-4 text-summit-gold" />
                {displayPost.author}
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-summit-gold" />
                {displayPost.date}
              </span>
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-summit-gold" />
                {displayPost.readTime}
              </span>
              {displayPost.location ? (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-summit-gold" />
                  {displayPost.location}
                </span>
              ) : null}
            </div>
          </div>
        </motion.div>
      </section>

      <div
        data-story-body
        className="relative mx-auto grid max-w-7xl gap-12 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[13rem_minmax(0,46rem)] lg:justify-center lg:px-12"
      >
        <aside className="hidden lg:block">
          <div className="sticky top-28 border-t border-white/10 pt-5">
            <div className="text-xs font-mono uppercase text-zinc-600">
              In this story
            </div>
            <nav className="mt-4" aria-label="Story chapters">
              <ol className="space-y-3">
                {displayPost.content.sections.map((section, index) => (
                  <li key={`${section.title}-${index}`}>
                    <a
                      href={`#chapter-${index + 1}`}
                      className="text-sm leading-5 text-zinc-500 transition-colors hover:text-summit-gold-200"
                    >
                      {section.title || `Chapter ${index + 1}`}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <button
              type="button"
              onClick={handleShare}
              className="mt-8 inline-flex min-h-10 items-center gap-2 text-xs font-mono uppercase text-zinc-400 transition-colors hover:text-white"
            >
              {shareComplete ? (
                <Check className="h-4 w-4" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
              {shareComplete ? 'Link copied' : 'Share story'}
            </button>
          </div>
        </aside>

        <div className="min-w-0">
          <IntroContent
            content={displayPost.content.intro}
            isEditable={isEditable}
            onChange={onIntroChange}
          />

          <div className="mt-16 space-y-20 sm:mt-20 sm:space-y-24">
            {displayPost.content.sections.map((section, index) => (
              <StoryChapter
                key={`${section.title}-${index}`}
                section={section}
                index={index}
                isEditable={isEditable}
                onImageClick={onImageClick}
                onSectionChange={onSectionChange}
              />
            ))}
          </div>

          {displayPost.tags.length ? (
            <div className="mt-20 border-y border-white/10 py-6">
              <div className="flex flex-wrap gap-x-5 gap-y-3 text-xs font-mono uppercase text-zinc-500">
                {displayPost.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-12 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-md border border-white/15 px-5 py-3 text-sm font-bold uppercase text-white transition-colors hover:border-white/35"
            >
              {shareComplete ? (
                <Check className="h-4 w-4" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
              {shareComplete ? 'Link copied' : 'Share story'}
            </button>
          </div>
        </div>
      </div>

      <section className="border-t border-white/10 bg-[#0c0c0c]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-14 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
          <div>
            <div className="text-xs font-mono uppercase text-summit-gold-300">
              Continue exploring
            </div>
            <h2 className="mt-3 font-oswald text-4xl font-bold uppercase text-white sm:text-5xl">
              More stories from the ascent
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-md border border-white/15 px-5 py-3 text-sm font-bold uppercase text-white transition-colors hover:border-summit-gold hover:text-summit-gold"
          >
            Open the archive
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}

function IntroContent({
  content,
  isEditable,
  onChange,
}: {
  content: string;
  isEditable: boolean;
  onChange?: (value: string) => void;
}) {
  if (!content) return null;
  return (
    <div className="space-y-7">
      {content.split('\n\n').map((paragraph, index) => {
        const quote = paragraph.trim().startsWith('>');
        const text = quote ? paragraph.replace(/^>\s?/, '').trim() : paragraph;
        if (quote) return <PullQuote key={index} text={text} />;
        return (
          <p
            key={index}
            className={`font-serif text-xl leading-9 text-zinc-200 sm:text-2xl sm:leading-10 ${editableClass(isEditable)}`}
            contentEditable={isEditable}
            suppressContentEditableWarning
            onBlur={(event) =>
              isEditable && onChange?.(event.currentTarget.textContent || '')
            }
          >
            {text}
          </p>
        );
      })}
    </div>
  );
}

function StoryChapter({
  section,
  index,
  isEditable,
  onImageClick,
  onSectionChange,
}: {
  section: StorySection;
  index: number;
  isEditable: boolean;
  onImageClick?: (key: string, currentSrc: string) => void;
  onSectionChange?: (
    index: number,
    field: 'title' | 'content',
    value: string
  ) => void;
}) {
  return (
    <section id={`chapter-${index + 1}`} className="scroll-mt-28">
      <div className="text-xs font-mono uppercase text-summit-gold-300">
        Chapter {String(index + 1).padStart(2, '0')}
      </div>
      <h2
        className={`mt-4 font-oswald text-4xl font-bold uppercase leading-tight text-white sm:text-5xl ${editableClass(isEditable)}`}
        contentEditable={isEditable}
        suppressContentEditableWarning
        onBlur={(event) =>
          isEditable &&
          onSectionChange?.(
            index,
            'title',
            event.currentTarget.textContent || ''
          )
        }
      >
        {section.title || `Chapter ${index + 1}`}
      </h2>

      {section.image ? (
        <div className="group relative my-9 -mx-5 aspect-[4/3] overflow-hidden bg-zinc-900 sm:mx-0 sm:aspect-[16/10]">
          {section.image.startsWith('placeholder:') ? (
            <div className="flex h-full items-center justify-center border border-dashed border-white/20 p-8 text-center text-zinc-500">
              {section.image.replace('placeholder:', '')}
            </div>
          ) : (
            <Image
              src={section.image}
              alt={section.title || 'Story image'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 736px"
              unoptimized
            />
          )}
          {isEditable && onImageClick ? (
            <button
              type="button"
              onClick={() =>
                onImageClick(`section-${index}`, section.image || '')
              }
              className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm font-bold uppercase text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              Replace image
            </button>
          ) : null}
        </div>
      ) : null}

      <div className="mt-7 space-y-7">
        {section.content.split('\n\n').map((paragraph, paragraphIndex) => {
          const quote = paragraph.trim().startsWith('>');
          const text = quote
            ? paragraph.replace(/^>\s?/, '').trim()
            : paragraph;
          if (quote) return <PullQuote key={paragraphIndex} text={text} />;
          return (
            <p
              key={paragraphIndex}
              className={`text-lg leading-8 text-zinc-300 sm:text-xl sm:leading-9 ${editableClass(isEditable)}`}
              contentEditable={isEditable}
              suppressContentEditableWarning
              onBlur={(event) => {
                if (!isEditable || !onSectionChange) return;
                const paragraphs = section.content.split('\n\n');
                paragraphs[paragraphIndex] =
                  event.currentTarget.textContent || '';
                onSectionChange(index, 'content', paragraphs.join('\n\n'));
              }}
            >
              {text}
            </p>
          );
        })}
      </div>

      {section.pullQuote ? <PullQuote text={section.pullQuote} /> : null}
    </section>
  );
}

function PullQuote({ text }: { text: string }) {
  return (
    <blockquote className="my-10 border-l-2 border-summit-gold pl-6 sm:pl-8">
      <p className="font-oswald text-3xl font-bold uppercase leading-tight text-white sm:text-4xl">
        {text}
      </p>
    </blockquote>
  );
}

function editableClass(isEditable: boolean) {
  return isEditable
    ? 'rounded-sm outline-none transition-colors hover:bg-white/[0.04] focus:bg-white/[0.06] focus:ring-1 focus:ring-summit-gold'
    : '';
}

function normalizePost(post: any): BlogPostData {
  const author =
    typeof post?.author === 'string'
      ? post.author
      : post?.author?.name || 'Sunith Kumar';
  const category =
    post?.category || post?.categories?.[0]?.title || 'Field Note';
  const tags =
    post?.tags || post?.categories?.map((item: any) => item.title) || [];
  const date = post?.date
    ? new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recent';

  return {
    title: post?.title || 'Untitled story',
    subtitle: post?.subtitle || post?.excerpt || '',
    author,
    date,
    readTime: post?.readTime || '5 min read',
    category: String(category).toUpperCase(),
    location: post?.location,
    heroImage: post?.mainImage || post?.heroImage || FALLBACK_IMAGE,
    content: post?.content || { intro: '', sections: [] },
    tags: tags.filter(Boolean),
  };
}
