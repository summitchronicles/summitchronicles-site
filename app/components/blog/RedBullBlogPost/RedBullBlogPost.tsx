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
  ChevronDown,
} from 'lucide-react';
// import type { Post } from '../../../lib/sanity/types'

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
    <article className={`bg-white ${className}`}>
      {/* Reading Progress */}
      <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-100">
        <div
          className="h-full bg-red-600 transition-all duration-300"
          style={{ width: `${readingProgress * 100}%` }}
        />
      </div>

      {/* Header Navigation */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/blog"
            className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Stories</span>
          </Link>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <Eye className="w-4 h-4" />
              <span>{displayPost.views}</span>
            </div>
            <Link
              href={`/edit/${slug}`}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit</span>
            </Link>

            <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 transition-colors">
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
            className="object-contain bg-gray-100"
            sizes="100vw"
            quality={100}
            unoptimized={true}
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Hero Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="space-y-6">
            {/* Category */}
            <div className="flex items-center space-x-2">
              <div className="bg-red-600 text-white px-3 py-1 text-xs font-bold tracking-wider uppercase">
                {displayPost.category}
              </div>
              <CategoryIcon className="w-5 h-5 text-red-600" />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-black leading-tight text-gray-900">
              {displayPost.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed font-light max-w-4xl">
              {displayPost.subtitle}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-gray-500 pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span className="font-medium text-gray-900">
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
      </section>

      {/* Article Content */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        {/* Intro */}
        <div className="mb-12">
          <p className="text-xl leading-relaxed text-gray-700 font-light border-l-4 border-red-600 pl-6">
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
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
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
                    className="w-full rounded-lg object-contain bg-gray-100"
                  />
                </div>
              )}

              <div className="prose prose-lg prose-gray max-w-none">
                {section.content.split('\n\n').map((paragraph: string, pIndex: number) => (
                  <p
                    key={pIndex}
                    className="text-gray-700 leading-relaxed mb-6"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {section.pullQuote && (
                <blockquote className="my-8 text-2xl font-light text-gray-900 border-l-4 border-red-600 pl-6 italic">
                  "{section.pullQuote}"
                </blockquote>
              )}
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap gap-3">
            {displayPost.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
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
          className="mt-16 p-8 bg-gray-50 rounded-lg"
        >
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {displayPost.author}
              </h3>
              <p className="text-gray-600 leading-relaxed">
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
            className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>More Stories</span>
          </Link>
        </div>
      </section>
    </article>
  );
}
