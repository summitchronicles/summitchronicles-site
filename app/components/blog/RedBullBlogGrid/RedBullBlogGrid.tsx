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
  // Authentic blog posts with emotional storytelling
  const samplePosts: BlogPost[] = [
    {
      slug: 'why-the-seven-summits',
      title: 'Why the Seven Summits?',
      subtitle:
        'A Journey of Purpose, Passion, and Perseverance - The real reason I risk everything for some mountains',
      category: 'PURPOSE',
      author: 'Sunith Kumar',
      date: 'March 15, 2024',
      readTime: '5 min read',
      views: '3.2K',
      image: '/stories/everest-prep.jpg',
      featured: true,
    },
    {
      slug: 'systematic-thinking-beats-motivation',
      title: 'Why Systems Beat Motivation',
      subtitle: 'Motivation is like mountain weather - unreliable when you need it most. Here\'s what actually works.',
      category: 'MINDSET',
      author: 'Sunith Kumar',
      date: 'March 22, 2024',
      readTime: '4 min read',
      views: '2.8K',
      image: '/stories/data-training.jpg',
      featured: false,
    },
    {
      slug: 'the-fear-of-failure',
      title: 'The Fear That Keeps Me Going',
      subtitle: 'Everyone asks about success. I think about failure every single day. Here\'s why that\'s my secret weapon.',
      category: 'MINDSET',
      author: 'Sunith Kumar',
      date: 'March 29, 2024',
      readTime: '3 min read',
      views: '2.1K',
      image: '/stories/kilimanjaro.jpg',
      featured: false,
    },
    {
      slug: 'the-day-motivation-failed',
      title: 'The Day I Nearly Quit',
      subtitle: 'February 18th, 5:47 AM. Rain pounding. Body aching. Motivation score: Zero. I went anyway.',
      category: 'STORIES',
      author: 'Sunith Kumar',
      date: 'February 18, 2024',
      readTime: '6 min read',
      views: '4.1K',
      image: '/stories/everest-prep.jpg',
      featured: false,
    },
    {
      slug: 'mount-whitney-failure',
      title: 'My First Mountain Failure',
      subtitle: 'At 14,000 feet, gasping for air, watching my partner disappear into the clouds. That night changed everything.',
      category: 'STORIES',
      author: 'Sunith Kumar',
      date: 'January 10, 2024',
      readTime: '8 min read',
      views: '5.3K',
      image: '/stories/data-training.jpg',
      featured: false,
    },
    {
      slug: 'everest-statistics-reality',
      title: 'The Numbers That Haunt Me',
      subtitle: '60% success rate. 1.2% fatality rate. These aren\'t abstract - they\'re real people who didn\'t come home.',
      category: 'REALITY',
      author: 'Sunith Kumar',
      date: 'April 5, 2024',
      readTime: '7 min read',
      views: '1.9K',
      image: '/stories/kilimanjaro.jpg',
      featured: false,
    },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PURPOSE':
        return Mountain;
      case 'MINDSET':
        return TrendingUp;
      case 'STORIES':
        return User;
      case 'REALITY':
        return Eye;
      default:
        return Mountain;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'PURPOSE':
        return 'bg-blue-600';
      case 'MINDSET':
        return 'bg-purple-600';
      case 'STORIES':
        return 'bg-green-600';
      case 'REALITY':
        return 'bg-orange-600';
      default:
        return 'bg-red-600';
    }
  };

  const featuredPost = samplePosts.find((post) => post.featured);
  const regularPosts = samplePosts.filter((post) => !post.featured);

  return (
    <div className={`bg-black text-white min-h-screen ${className}`}>
      {/* Header */}
      <section className="relative py-20">
        <div className="absolute inset-0">
          <img
            src="/stories/data-training.jpg"
            alt="Field Stories from the Mountains"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-light tracking-wide">
              FIELD STORIES
            </h1>
            <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed opacity-90">
              Raw stories from the mountains. Unfiltered insights from extreme preparation. 
              The human side of systematic mountaineering.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Story */}
      {featuredPost && (
        <section className="border-b border-gray-800">
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
          <h2 className="text-3xl md:text-4xl font-light text-white mb-4 tracking-wide">
            EXPEDITION REPORTS
          </h2>
          <div className="h-px w-24 bg-white/30"></div>
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
                  <div className="bg-gray-900 border border-gray-700 overflow-hidden hover:border-white/50 transition-all duration-300 hover:shadow-2xl">
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
                      <h3 className="text-xl font-bold text-white leading-tight mb-3 group-hover:text-gray-300 transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-gray-400 leading-relaxed mb-4 text-sm">
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
      <section className="bg-gray-800 text-white border-t border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h3 className="text-3xl md:text-4xl font-light tracking-wide mb-6">
            EXPEDITION UPDATES
          </h3>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed font-light">
            Field reports from the mountains. Training insights and preparation updates. 
            Raw stories from the systematic journey to Everest.
          </p>
          <Link
            href="/newsletter"
            className="inline-flex items-center space-x-3 bg-white text-black px-8 py-4 font-medium tracking-wide hover:bg-gray-200 transition-colors"
          >
            <span>Subscribe to Updates</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
