'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  ArrowRight,
  Eye,
  BookOpen,
  Mountain,
  TrendingUp,
  Award,
  User,
} from 'lucide-react';
// import type { Post } from '../../../lib/sanity/types'

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
  image: string;
  views?: string;
  featured?: boolean;
}

interface CinematicBlogGridProps {
  posts?: BlogPost[];
  className?: string;
}

export function CinematicBlogGrid({
  posts = [],
  className = '',
}: CinematicBlogGridProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [hoveredPost, setHoveredPost] = useState<string | null>(null);

  // Fallback sample posts for demonstration
  const samplePosts: BlogPost[] = [
    {
      slug: 'everest-mental-preparation',
      title: 'The Mental Game',
      excerpt:
        "Conquering Everest starts in the mind. Discover the psychological preparation behind the world's ultimate mountaineering challenge, where mental fortitude often determines success more than physical strength.",
      date: 'December 2024',
      readTime: '12 min read',
      category: 'Mental Preparation',
      author: 'Sunith Kumar',
      image: '/stories/everest-prep.jpeg',
      views: '2.1K',
      featured: true,
    },
    {
      slug: 'kilimanjaro-chronicles',
      title: 'Kilimanjaro Chronicles',
      excerpt:
        "Standing at 5,895 meters above sea level, Kilimanjaro taught me that every step toward a summit is a decision to continue when everything inside says stop. Here's what I learned on Africa's rooftop.",
      date: 'March 2024',
      readTime: '8 min read',
      category: 'Expedition',
      author: 'Sunith Kumar',
      image: '/stories/kilimanjaro.jpg',
      views: '3.2K',
      featured: false,
    },
    {
      slug: 'data-driven-training',
      title: 'Analytics in Action',
      excerpt:
        'From heart rate variability to altitude acclimatization metrics, discover how systematic data analysis revolutionizes mountaineering preparation and transforms athletic performance.',
      date: 'November 2024',
      readTime: '15 min read',
      category: 'Training',
      author: 'Sunith Kumar',
      image: '/stories/data-training.jpg',
      views: '1.8K',
      featured: false,
    },
    {
      slug: 'gear-optimization',
      title: 'Equipment Evolution',
      excerpt:
        'The difference between success and failure on a mountain often comes down to gear choices. A comprehensive analysis of equipment selection, weight optimization, and gear systems.',
      date: 'October 2024',
      readTime: '10 min read',
      category: 'Equipment',
      author: 'Sunith Kumar',
      image: '/hero.jpg',
      views: '2.4K',
      featured: false,
    },
    {
      slug: 'alpine-photography',
      title: 'Capturing the Summit',
      excerpt:
        'Photography at extreme altitude presents unique challenges and opportunities. Learn the techniques, equipment, and mindset needed to document your mountaineering journey.',
      date: 'September 2024',
      readTime: '6 min read',
      category: 'Photography',
      author: 'Sunith Kumar',
      image: '/hero.jpg',
      views: '1.5K',
      featured: false,
    },
    {
      slug: 'weather-reading',
      title: 'Reading the Mountain',
      excerpt:
        'Weather patterns at altitude can change in minutes and determine the fate of an expedition. Master the art of mountain weather interpretation and decision-making.',
      date: 'August 2024',
      readTime: '9 min read',
      category: 'Safety',
      author: 'Sunith Kumar',
      image: '/hero.jpg',
      views: '2.7K',
      featured: false,
    },
  ];

  const displayPosts =
    posts.length > 0
      ? posts.map((post) => ({
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt || '',
          date: post.date || 'October 2024',
          readTime: `${post.readTime || 8} min read`,
          category: post.category || 'Story',
          author: post.author || 'Sunith Kumar',
          image: post.image || '/hero.jpg',
          views: '1.2K',
          featured: post.featured || false,
        }))
      : samplePosts;

  const featuredPost =
    displayPosts.find((post) => post.featured) || displayPosts[0];
  const regularPosts = displayPosts
    .filter((post) => !post.featured)
    .slice(0, 5);

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
      case 'equipment':
      case 'gear':
        return BookOpen;
      default:
        return Mountain;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'mental preparation':
      case 'mental':
        return 'bg-purple-100 text-purple-800';
      case 'expedition':
      case 'adventure':
        return 'bg-blue-100 text-blue-800';
      case 'training':
        return 'bg-green-100 text-green-800';
      case 'equipment':
      case 'gear':
        return 'bg-orange-100 text-orange-800';
      case 'photography':
        return 'bg-pink-100 text-pink-800';
      case 'safety':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  };

  return (
    <section className={`py-20 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-light text-slate-900 mb-6">
            Mountain Chronicles
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Stories of preparation, perseverance, and peak experiences. Each
            expedition teaches lessons that extend far beyond the summit —
            discover insights from the world's highest peaks.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Featured Story - Large Card */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2"
            onMouseEnter={() => setHoveredPost(featuredPost.slug)}
            onMouseLeave={() => setHoveredPost(null)}
          >
            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 transform hover:-translate-y-2">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Featured Badge */}
                <div className="absolute top-6 left-6">
                  <div className="flex items-center space-x-2 bg-summit-gold text-spa-charcoal px-4 py-2 rounded-full text-sm font-medium">
                    <Award className="w-4 h-4" />
                    <span>Featured Story</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="absolute top-6 right-6 flex space-x-3">
                  <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                    <Eye className="w-4 h-4" />
                    <span>{featuredPost.views}</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="space-y-4">
                    <div
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(featuredPost.category)}`}
                    >
                      {React.createElement(
                        getCategoryIcon(featuredPost.category),
                        { className: 'w-4 h-4 mr-2' }
                      )}
                      {featuredPost.category}
                    </div>

                    <div>
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 group-hover:text-summit-gold transition-colors duration-500">
                        {featuredPost.title}
                      </h2>
                      <p className="text-slate-200 text-lg leading-relaxed mb-6">
                        {featuredPost.excerpt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-slate-300">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>{featuredPost.author}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{featuredPost.date}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-summit-gold group-hover:translate-x-2 transition-transform duration-500">
                        <span className="font-medium">Read Story</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Regular Stories - Right Column */}
          <div className="space-y-6">
            {regularPosts.map((post, index) => {
              const CategoryIcon = getCategoryIcon(post.category);
              const isHovered = hoveredPost === post.slug;

              return (
                <motion.div
                  key={post.slug}
                  variants={itemVariants}
                  onMouseEnter={() => setHoveredPost(post.slug)}
                  onMouseLeave={() => setHoveredPost(null)}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <div
                      className={`bg-slate-50 hover:bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-500 transform hover:-translate-y-1 border border-slate-100 hover:border-slate-200 ${
                        isHovered ? 'scale-105 shadow-xl' : ''
                      }`}
                    >
                      <div className="flex gap-4">
                        {/* Image */}
                        <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="80px"
                          />
                        </div>

                        {/* Content */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}
                            >
                              <CategoryIcon className="w-3 h-3 mr-1" />
                              {post.category}
                            </div>
                            <div className="flex items-center space-x-1 text-slate-400 text-xs">
                              <Eye className="w-3 h-3" />
                              <span>{post.views}</span>
                            </div>
                          </div>

                          <h3 className="font-bold text-slate-900 group-hover:text-alpine-blue transition-colors duration-300 line-clamp-2">
                            {post.title}
                          </h3>

                          <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
                            {post.excerpt}
                          </p>

                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{post.date}</span>
                            <div className="flex items-center space-x-1 text-alpine-blue opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                              <span className="font-medium">Read</span>
                              <ArrowRight className="w-3 h-3" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Newsletter CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-center text-white"
        >
          <h3 className="text-3xl font-bold mb-4">Never Miss a Summit Story</h3>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Get exclusive expedition updates, training insights, and
            behind-the-scenes content delivered directly to your inbox every
            week.
          </p>
          <Link
            href="/newsletter"
            className="inline-flex items-center gap-3 bg-summit-gold text-spa-charcoal px-8 py-4 rounded-2xl font-medium hover:bg-yellow-500 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            <BookOpen className="w-5 h-5" />
            <span>Subscribe to Weekly Chronicles</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Add React import for createElement
import React from 'react';
