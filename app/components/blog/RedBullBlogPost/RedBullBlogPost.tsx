'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Edit3,
  Eye,
  User,
  MapPin,
  Mountain,
  TrendingUp,
  Award,
} from 'lucide-react';

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

interface BlogPostData {
  title: string;
  subtitle: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  location: string;
  heroImage: string;
  content: {
    intro: string;
    sections: Array<{
      title: string;
      content: string;
      image?: string;
      pullQuote?: string;
    }>;
  };
  tags: string[];
  views: string;
}

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

  // Red Bull-style sample content
  const samplePost: BlogPostData = {
    title: 'The Mental Game',
    subtitle:
      'Preparing Mind and Body for Everest 2027: A Systematic Approach to Peak Performance',
    author: 'Sunith Kumar',
    date: 'December 15, 2024',
    readTime: '12 min read',
    category: 'MENTAL PREPARATION',
    location: 'Training Grounds, California',
    heroImage: '/stories/everest-prep.jpeg',
    views: '2.1K',
    tags: ['Mental Training', 'Everest', 'Peak Performance', 'Mountaineering'],
    content: {
      intro:
        'Every summit begins in the mind. The statistics are sobering: only 29% of climbers who attempt Mount Everest actually reach the summit. Of those who turn back or fail, the majority cite mental challenges rather than physical limitations. This realization fundamentally changed how I approach my preparation for the 2027 expedition.',
      sections: [
        {
          title: 'The Psychology of Extreme Altitude',
          content:
            "At 8,849 meters above sea level, Everest exists in what mountaineers call the 'Death Zone' — altitudes where the human body literally begins to die. But before your body fails, your mind is tested in ways most people never experience.\n\nDuring my preparation, I've discovered that mental training requires the same systematic approach I apply to physical conditioning. It's not enough to simply 'think positive' — you need structured psychological preparation.",
          pullQuote:
            "The mountain doesn't care about your plan — but your preparation does. Mental preparation isn't just helpful; it's the difference between life and death.",
        },
        {
          title: 'Visualization and Mental Rehearsal',
          content:
            "Every day, I spend 30 minutes visualizing the Everest climb in intricate detail. I mentally rehearse everything from the technical challenges of the Khumbu Icefall to the psychological pressure of the final summit push.\n\nThis isn't daydreaming — it's systematic mental training. Sports psychology research shows that mental rehearsal activates the same neural pathways as physical practice. When I'm actually on the mountain facing these challenges, my brain will recognize the situations and respond with practiced calm.",
          image: '/stories/data-training.jpg',
        },
        {
          title: 'Stress Inoculation Training',
          content:
            "One of the most valuable aspects of my training has been deliberately exposing myself to controlled stress and discomfort. This includes cold exposure training in near-freezing conditions, altitude simulation in hypoxic chambers, extended periods of physical discomfort during long training sessions, and decision-making exercises under fatigue and pressure.\n\nThe goal isn't to eliminate fear or discomfort — it's to maintain clear thinking and good judgment when these feelings arise.",
        },
        {
          title: 'Data-Driven Mental Training',
          content:
            "Just as I track physical metrics like heart rate and VO2 max, I've begun quantifying my mental training. I use apps to monitor meditation consistency, stress response patterns, and decision-making speed under pressure.\n\nThis data reveals patterns I wouldn't notice otherwise. For example, my stress response improves significantly after just 10 minutes of morning meditation, but shows diminishing returns beyond 20 minutes. This allows me to optimize my mental training time.",
        },
      ],
    },
  };

  const displayPost = post
    ? {
        title: post.title,
        subtitle: post.subtitle || post.excerpt || '',
        author: post.author?.name || 'Sunith Kumar',
        date: post.date
          ? new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
        readTime: post.readTime || '5 min read',
        category: post.categories?.[0]?.title?.toUpperCase() || 'STORY',
        location: post.location || 'Training Grounds, California',
        heroImage: post.mainImage || '/stories/everest-prep.jpeg',
        views: '2.1K',
        tags: post.categories?.map((cat: any) => cat.title) || samplePost.tags,
        content: post.content || samplePost.content, // Use actual post content
      }
    : samplePost;

  // Helper for Editable Image Overlay
  const EditableOverlay = ({ onClick }: { onClick: () => void }) => (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer z-20 group"
    >
      <div className="bg-summit-gold text-black px-4 py-2 rounded-full font-bold flex items-center gap-2 transform group-hover:scale-105 transition-transform">
        <Edit3 className="w-4 h-4" />
        <span>Replace Image</span>
      </div>
    </div>
  );

  // ... existing useEffect and helper functions ...

  return (
    <article className={`bg-black min-h-screen ${className}`}>
      {/* ... existing Reading Progress and Header ... */}

      {/* Hero Section */}
      <section className="relative">
        <div className="relative h-[70vh] overflow-hidden group">
          <Image
            src={displayPost.heroImage}
            alt={displayPost.title}
            fill
            className="object-cover bg-black"
            sizes="100vw"
            quality={100}
            unoptimized={true}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />

          {/* Editable Overlay for Hero Image */}
          {isEditable && onImageClick && (
            <EditableOverlay
              onClick={() => onImageClick('hero', displayPost.heroImage)}
            />
          )}

          {/* Hero Content Overlay */}
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-10">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center space-x-4 mb-6">
                <span className="px-3 py-1 bg-summit-gold text-black text-xs font-bold uppercase tracking-wider rounded">
                  {displayPost.category}
                </span>
                <span className="text-gray-300 text-sm flex items-center">
                  <Mountain className="w-4 h-4 mr-1" />
                  Story
                </span>
              </div>

              <h1
                className={`text-4xl md:text-6xl font-bold text-white mb-4 leading-tight font-oswald ${isEditable ? 'cursor-text hover:bg-white/10 rounded px-2 -ml-2 ring-2 ring-transparent focus:ring-summit-gold outline-none' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning={true}
                onBlur={(e) =>
                  isEditable &&
                  onTitleChange &&
                  onTitleChange(e.currentTarget.textContent || '')
                }
              >
                {displayPost.title}
              </h1>

              <p
                className={`text-xl md:text-2xl text-gray-200 mb-8 font-light ${isEditable ? 'cursor-text hover:bg-white/10 rounded px-2 -ml-2 ring-2 ring-transparent focus:ring-summit-gold outline-none' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning={true}
                onBlur={(e) =>
                  isEditable &&
                  onSubtitleChange &&
                  onSubtitleChange(e.currentTarget.textContent || '')
                }
              >
                {displayPost.subtitle}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-200 font-mono font-medium">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-2 text-summit-gold" />
                  {displayPost.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-summit-gold" />
                  {displayPost.date}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-summit-gold" />
                  {displayPost.readTime}
                </div>
                {displayPost.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-summit-gold" />
                    {displayPost.location}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        {/* Intro */}
        {displayPost.content.intro && (
          <div className="mb-12">
            {displayPost.content.intro
              .split('\n\n')
              .map((paragraph: string, index: number) => {
                const isQuote = paragraph.trim().startsWith('>');
                const cleanContent = isQuote
                  ? paragraph.replace(/^>\s?/, '').trim()
                  : paragraph;

                if (isQuote) {
                  return (
                    <div
                      key={index}
                      className="my-8 flex flex-col md:flex-row gap-6 items-start"
                    >
                      <div className="text-5xl md:text-6xl text-summit-gold leading-none font-serif select-none">
                        "
                      </div>
                      <blockquote className="flex-1">
                        <p className="text-2xl md:text-3xl lg:text-4xl font-extrabold italic text-white leading-tight">
                          {cleanContent}
                        </p>
                      </blockquote>
                    </div>
                  );
                }

                return (
                  <p
                    key={index}
                    className={`text-xl md:text-2xl text-gray-300 mb-6 leading-relaxed font-serif ${isEditable ? 'cursor-text hover:bg-white/5 rounded px-2 -ml-2 ring-1 ring-transparent focus:ring-summit-gold outline-none' : ''}`}
                    contentEditable={isEditable}
                    suppressContentEditableWarning={true}
                    onBlur={(e) =>
                      isEditable &&
                      onIntroChange &&
                      onIntroChange(e.currentTarget.textContent || '')
                    }
                  >
                    {paragraph}
                  </p>
                );
              })}
          </div>
        )}

        {/* Content Sections */}
        <div className="space-y-12">
          {displayPost.content.sections.map((section: any, index: number) => (
            <div key={index} className="space-y-6">
              <h2
                className={`text-2xl md:text-3xl font-bold text-white leading-tight ${isEditable ? 'cursor-text hover:bg-white/5 rounded px-2 -ml-2 ring-1 ring-transparent focus:ring-summit-gold outline-none' : ''}`}
                contentEditable={isEditable}
                suppressContentEditableWarning={true}
                onBlur={(e) =>
                  isEditable &&
                  onSectionChange &&
                  onSectionChange(
                    index,
                    'title',
                    e.currentTarget.textContent || ''
                  )
                }
              >
                {section.title}
              </h2>

              {section.image && (
                <div className="my-8 relative group">
                  <Image
                    src={section.image}
                    alt={section.title}
                    width={1200}
                    height={600}
                    quality={100}
                    unoptimized={true}
                    className="w-full rounded-lg object-contain bg-white/5 border border-white/10"
                  />
                  {/* Editable Overlay for Section Image */}
                  {isEditable && onImageClick && (
                    <EditableOverlay
                      onClick={() =>
                        onImageClick(`section-${index}`, section.image)
                      }
                    />
                  )}
                </div>
              )}

              {/* ... existing prose content and pullquote ... */}

              <div className="prose prose-lg prose-invert max-w-none">
                {section.content
                  .split('\n\n')
                  .map((paragraph: string, pIndex: number) => {
                    // Check if this paragraph is a blockquote (starts with >)
                    const isQuote = paragraph.trim().startsWith('>');
                    const cleanContent = isQuote
                      ? paragraph.replace(/^>\s?/, '').trim()
                      : paragraph;

                    if (isQuote) {
                      return (
                        <div
                          key={pIndex}
                          className="my-12 flex flex-col md:flex-row gap-8 items-start"
                        >
                          {/* Decorative Quote Mark */}
                          <div className="text-6xl md:text-8xl text-summit-gold leading-none font-serif select-none">
                            "
                          </div>
                          {/* Quote Content */}
                          <blockquote className="flex-1">
                            <p className="text-2xl md:text-3xl lg:text-4xl font-extrabold italic text-white leading-tight mb-4">
                              {cleanContent}
                            </p>
                          </blockquote>
                        </div>
                      );
                    }

                    return (
                      <p
                        key={pIndex}
                        className={`text-gray-300 leading-relaxed mb-6 ${isEditable ? 'cursor-text hover:bg-white/5 rounded px-2 -ml-2 ring-1 ring-transparent focus:ring-summit-gold outline-none' : ''}`}
                        contentEditable={isEditable}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => {
                          if (isEditable && onSectionChange) {
                            // Reconstruct content with updated paragraph
                            const paragraphs = section.content.split('\n\n');
                            paragraphs[pIndex] =
                              e.currentTarget.textContent || '';
                            onSectionChange(
                              index,
                              'content',
                              paragraphs.join('\n\n')
                            );
                          }
                        }}
                      >
                        {paragraph}
                      </p>
                    );
                  })}
              </div>

              {section.pullQuote && (
                <div className="my-12 flex flex-col md:flex-row gap-8 items-start">
                  {/* Decorative Quote Mark */}
                  <div className="text-6xl md:text-8xl text-summit-gold leading-none font-serif select-none">
                    "
                  </div>
                  {/* Quote Content */}
                  <blockquote className="flex-1">
                    <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight mb-4">
                      {section.pullQuote}
                    </p>
                  </blockquote>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-wrap gap-3">
            {displayPost.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/5 text-gray-400 text-sm rounded-full hover:bg-summit-gold/20 hover:text-summit-gold transition-colors cursor-pointer border border-white/5 hover:border-summit-gold/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Author Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 p-8 bg-white/5 rounded-2xl border border-white/10"
        >
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-summit-gold/20 rounded-full flex items-center justify-center border border-summit-gold/30">
              <User className="w-8 h-8 text-summit-gold" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">
                {displayPost.author}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Mountaineer and systematic athlete pursuing the Seven Summits
                challenge. Currently preparing for Mount Everest in Spring 2027
                through data-driven training and methodical preparation
                approaches.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="mt-16 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center space-x-2 text-summit-gold hover:text-white transition-colors font-medium border-b border-transparent hover:border-summit-gold pb-0.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>More Mountain Chronicles</span>
          </Link>
        </div>
      </section>
    </article>
  );
}
