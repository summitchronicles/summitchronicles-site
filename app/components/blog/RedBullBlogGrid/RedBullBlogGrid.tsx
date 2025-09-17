'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  Eye,
  TrendingUp,
  Mountain,
  Award,
  User,
  ChevronRight,
  Plus,
} from 'lucide-react';

interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  views: string;
  image: string;
  featured: boolean;
}

interface RedBullBlogGridProps {
  className?: string;
}

export function RedBullBlogGrid({ className = '' }: RedBullBlogGridProps) {
  // Red Bull-style sample posts
  const samplePosts: BlogPost[] = [
    {
      slug: 'mental-preparation-everest-2027',
      title: 'The Mental Game',
      subtitle:
        'Preparing Mind and Body for Everest 2027: A Systematic Approach to Peak Performance',
      category: 'MENTAL PREPARATION',
      author: 'Sunith Kumar',
      date: 'December 15, 2024',
      readTime: '12 min read',
      views: '2.1K',
      image: '/stories/everest-prep.jpg',
      featured: true,
    },
    {
      slug: 'kilimanjaro-data-analysis',
      title: 'Data-Driven Ascent',
      subtitle: 'How Analytics Transformed My Kilimanjaro Training Strategy',
      category: 'TRAINING',
      author: 'Sunith Kumar',
      date: 'November 28, 2024',
      readTime: '8 min read',
      views: '1.8K',
      image: '/stories/kilimanjaro.jpg',
      featured: false,
    },
    {
      slug: 'altitude-acclimatization-science',
      title: 'Breathing at the Edge',
      subtitle: 'The Science Behind High-Altitude Acclimatization',
      category: 'EXPEDITION',
      author: 'Sunith Kumar',
      date: 'November 12, 2024',
      readTime: '10 min read',
      views: '1.5K',
      image: '/stories/data-training.jpg',
      featured: false,
    },
    {
      slug: 'gear-optimization-strategy',
      title: 'Every Gram Matters',
      subtitle: 'Optimizing Gear Selection for Multi-Day Expeditions',
      category: 'GEAR',
      author: 'Sunith Kumar',
      date: 'October 30, 2024',
      readTime: '6 min read',
      views: '1.2K',
      image: '/stories/everest-prep.jpg',
      featured: false,
    },
    {
      slug: 'team-dynamics-mountain',
      title: 'Trust at Altitude',
      subtitle: 'Building Team Dynamics for Life-or-Death Situations',
      category: 'EXPEDITION',
      author: 'Sunith Kumar',
      date: 'October 18, 2024',
      readTime: '9 min read',
      views: '943',
      image: '/stories/data-training.jpg',
      featured: false,
    },
    {
      slug: 'nutrition-extreme-environments',
      title: 'Fueling the Summit',
      subtitle: 'Nutrition Strategies for Extreme High-Altitude Performance',
      category: 'TRAINING',
      author: 'Sunith Kumar',
      date: 'October 5, 2024',
      readTime: '7 min read',
      views: '1.7K',
      image: '/stories/kilimanjaro.jpg',
      featured: false,
    },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'MENTAL PREPARATION':
        return TrendingUp;
      case 'EXPEDITION':
        return Mountain;
      case 'TRAINING':
        return Award;
      default:
        return Mountain;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'MENTAL PREPARATION':
        return 'bg-purple-600';
      case 'EXPEDITION':
        return 'bg-blue-600';
      case 'TRAINING':
        return 'bg-green-600';
      case 'GEAR':
        return 'bg-orange-600';
      default:
        return 'bg-red-600';
    }
  };

  const featuredPost = samplePosts.find((post) => post.featured);
  const regularPosts = samplePosts.filter((post) => !post.featured);

  return (
    <div className={`bg-white min-h-screen ${className}`}>
      {/* Header */}
      <section className="bg-red-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-black">
              MOUNTAIN CHRONICLES
            </h1>
            <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed">
              Stories from the summit. Data-driven insights from extreme
              environments. The systematic journey toward mountaineering
              excellence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Story */}
      {featuredPost && (
        <section className="border-b-4 border-red-600">
          <Link href={`/blog/${featuredPost.slug}`} className="block group">
            <div className="relative">
              <div className="relative h-[60vh] overflow-hidden">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="100vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <div className="max-w-4xl">
                  <div className="flex items-center space-x-2 mb-4">
                    <div
                      className={`${getCategoryColor(featuredPost.category)} text-white px-3 py-1 text-xs font-bold tracking-wider uppercase`}
                    >
                      FEATURED
                    </div>
                    <div className="bg-white text-gray-900 px-3 py-1 text-xs font-bold tracking-wider uppercase">
                      {featuredPost.category}
                    </div>
                  </div>

                  <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 group-hover:text-red-400 transition-colors">
                    {featuredPost.title}
                  </h2>

                  <p className="text-xl text-gray-200 leading-relaxed mb-6 max-w-3xl">
                    {featuredPost.subtitle}
                  </p>

                  <div className="flex items-center space-x-6 text-gray-300">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span className="font-medium">{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{featuredPost.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>{featuredPost.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Stories Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
            LATEST STORIES
          </h2>
          <div className="h-1 w-24 bg-red-600"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post, index) => {
            const CategoryIcon = getCategoryIcon(post.category);

            return (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="bg-white border border-gray-200 overflow-hidden hover:border-red-600 transition-all duration-300 hover:shadow-lg">
                    {/* Image */}
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute top-4 left-4">
                        <div
                          className={`${getCategoryColor(post.category)} text-white px-3 py-1 text-xs font-bold tracking-wider uppercase flex items-center space-x-1`}
                        >
                          <CategoryIcon className="w-3 h-3" />
                          <span>{post.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 leading-tight mb-3 group-hover:text-red-600 transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                        {post.subtitle}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>{post.date}</span>
                          <span>{post.readTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{post.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <Link
            href="/blog/create"
            className="inline-flex items-center space-x-2 bg-green-600 text-white px-8 py-3 font-bold uppercase tracking-wide hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Story</span>
          </Link>
          <button className="inline-flex items-center space-x-2 bg-red-600 text-white px-8 py-3 font-bold uppercase tracking-wide hover:bg-red-700 transition-colors">
            <span>Load More Stories</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h3 className="text-3xl md:text-4xl font-black mb-6">
            GET THE INSIDE STORY
          </h3>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Exclusive expedition updates, training data, and behind-the-scenes
            insights delivered directly to your inbox every week.
          </p>
          <Link
            href="/newsletter"
            className="inline-flex items-center space-x-3 bg-red-600 text-white px-8 py-4 font-bold uppercase tracking-wide hover:bg-red-700 transition-colors"
          >
            <span>Subscribe Now</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
