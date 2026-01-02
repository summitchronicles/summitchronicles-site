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
        subtitle: post.excerpt || samplePost.subtitle,
        author: post.author?.name || 'Sunith Kumar',
        date: new Date(post.publishedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        readTime: `${post.readTime || 12} min read`,
        category: post.categories?.[0]?.title?.toUpperCase() || 'STORY',
        location: post.location || 'Training Grounds, California',
        heroImage: post.mainImage || '/stories/everest-prep.jpeg',
        views: '2.1K',
        tags: post.categories?.map((cat: any) => cat.title) || samplePost.tags,
        content: post.content || samplePost.content, // Use actual post content
      }
    : samplePost;

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrolled / maxScroll, 1);
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'mental preparation':
      case 'mental':
        return TrendingUp;
      case 'expedition':
      case 'adventure':
        return Mountain;
      case 'training':
        return Award;
      default:
        return Mountain;
    }
  };

  const CategoryIcon = getCategoryIcon(displayPost.category);

  return (
    <article className={`bg-black min-h-screen ${className}`}>
      {/* Reading Progress */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-white/5">
        <div
          className="h-full bg-summit-gold transition-all duration-300"
          style={{ width: `${readingProgress * 100}%` }}
        />
      </div>

      {/* Header Navigation */}
      <div className="sticky top-0 bg-black/90 backdrop-blur-md border-b border-white/10 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/blog"
            className="flex items-center space-x-2 text-gray-400 hover:text-summit-gold transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Stories</span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Eye className="w-4 h-4" />
              <span>{displayPost.views}</span>
            </div>
            <Link
              href={`/edit/${slug}`}
              className="flex items-center space-x-1 text-sm text-gray-400 hover:text-summit-gold transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit</span>
            </Link>

            <button className="flex items-center space-x-1 text-sm text-gray-400 hover:text-summit-gold transition-colors">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative">
        {/* Hero Image */}
        <div className="relative h-[70vh] overflow-hidden">
          <Image
            src={displayPost.heroImage}
            alt={displayPost.title}
            fill
            className="object-contain bg-black"
            sizes="100vw"
            quality={100}
            unoptimized={true}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
        </div>

        {/* Hero Content */}
        <div className="max-w-4xl mx-auto px-6 relative -mt-32 z-10">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl">
            <div className="space-y-6">
              {/* Category */}
              <div className="flex items-center space-x-2">
                <div className="bg-summit-gold-600/20 text-summit-gold px-3 py-1 text-xs font-bold tracking-wider uppercase border border-summit-gold/20 rounded">
                  {displayPost.category}
                </div>
                <CategoryIcon className="w-5 h-5 text-summit-gold" />
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-black leading-tight text-white tracking-tight">
                {displayPost.title}
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
                {displayPost.subtitle}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-6 text-gray-400 pt-4 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium text-gray-200">
                    {displayPost.author}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{displayPost.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{displayPost.readTime}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{displayPost.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        {/* Intro */}
        <div className="mb-12">
          <p className="text-xl leading-relaxed text-gray-300 font-light border-l-4 border-summit-gold pl-6">
            {displayPost.content.intro}
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {displayPost.content.sections.map((section: any, index: number) => (
            <div
              key={index}
              className="space-y-6"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                {section.title}
              </h2>

              {section.image && (
                <div className="my-8">
                  <Image
                    src={section.image}
                    alt={section.title}
                    width={1200}
                    height={600}
                    quality={100}
                    unoptimized={true}
                    className="w-full rounded-lg object-contain bg-white/5 border border-white/10"
                  />
                </div>
              )}

              <div className="prose prose-lg prose-invert max-w-none">
                {section.content.split('\n\n').map((paragraph: string, pIndex: number) => (
                  <p
                    key={pIndex}
                    className="text-gray-300 leading-relaxed mb-6"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {section.pullQuote && (
                <blockquote className="my-8 text-2xl font-light text-summit-gold border-l-4 border-summit-gold pl-6 italic bg-summit-gold/5 py-6 pr-6 rounded-r-lg">
                  "{section.pullQuote}"
                </blockquote>
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
