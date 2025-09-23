'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
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
  const [generatedPosts, setGeneratedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        if (data.success) {
          setGeneratedPosts(data.posts);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Convert generated posts to component format
  const convertedPosts: BlogPost[] = generatedPosts.map(post => ({
    slug: post.slug,
    title: post.title || 'Untitled',
    subtitle: post.excerpt || '',
    category: (post.category || 'STORY').toUpperCase(),
    author: 'Sunith Kumar',
    date: post.date ? new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Recent',
    readTime: `${post.readTime || 5} min read`,
    views: '2.1K', // You could track this in the future
    image: post.heroImage || '/stories/default.jpg',
    featured: false // You could add featured flag to frontmatter
  }));

  // Empty array - no sample posts
  const samplePosts: BlogPost[] = [];

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

  // Use generated posts if available, fallback to sample posts
  const posts = convertedPosts.length > 0 ? convertedPosts : samplePosts;

  const featuredPost = posts.find((post) => post.featured) || null;
  const regularPosts = posts.filter((post) => !post.featured);

  return (
    <div className={`bg-black text-white min-h-screen ${className}`}>
      {/* Header */}
      <section className="relative py-12 md:py-20">
        <div className="absolute inset-0">
          <Image
            src="/stories/data-training.jpg"
            alt="Field Stories from the Mountains"
            fill
            className="object-cover opacity-40"
            sizes="100vw"
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
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-wide">
              FIELD STORIES
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl font-light max-w-3xl mx-auto leading-relaxed opacity-90">
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
                  className="object-contain bg-gray-900 group-hover:scale-105 transition-transform duration-700"
                  sizes="100vw"
                  quality={100}
                  unoptimized={true}
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
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-light text-white mb-4 tracking-wide">
            EXPEDITION REPORTS
          </h2>
          <div className="h-px w-24 bg-white/30"></div>
        </div>

        {loading ? (
          /* Loading State */
          <div className="text-center py-20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-2xl mx-auto"
            >
              <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400">Loading authentic expedition stories...</p>
            </motion.div>
          </div>
        ) : posts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl mx-auto"
            >
              <Mountain className="w-16 h-16 text-gray-500 mx-auto mb-6" />
              <h3 className="text-2xl md:text-3xl font-light text-white mb-4">
                Stories Coming Soon
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                Authentic expedition stories, training insights, and mountain wisdom are being prepared.
                The first story from the Seven Summits journey will be published here soon.
              </p>
              <div className="text-sm text-gray-500">
                Stories will be added through the semantic content pipeline with your authentic experiences and images.
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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
                data-testid="post-card"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden hover:border-white/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-contain bg-gray-800 group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        quality={100}
                        unoptimized={true}
                      />
                      <div className="absolute top-3 left-3">
                        <div
                          className={`${getCategoryColor(post.category)} text-white px-2 py-1 text-xs font-bold tracking-wider uppercase flex items-center space-x-1 rounded`}
                        >
                          <CategoryIcon className="w-3 h-3" />
                          <span>{post.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white leading-tight mb-2 group-hover:text-gray-300 transition-colors" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                        {post.title}
                      </h3>

                      <p className="text-gray-400 leading-relaxed mb-4 text-sm" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                        {post.subtitle}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                        <div className="flex items-center space-x-3">
                          <span className="truncate">{post.date}</span>
                          <span className="whitespace-nowrap">{post.readTime}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-400">
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
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="bg-gray-800 text-white border-t border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 text-center">
          <h3 className="text-2xl md:text-3xl font-light tracking-wide mb-6">
            EXPEDITION UPDATES
          </h3>
          <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed font-light">
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
