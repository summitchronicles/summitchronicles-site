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
  const convertedPosts: BlogPost[] = generatedPosts.map((post) => ({
    slug: post.slug,
    title: post.title || 'Untitled',
    subtitle: post.excerpt || '',
    category: (post.category || 'STORY').toUpperCase(),
    author: 'Sunith Kumar',
    date: post.date
      ? new Date(post.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'Recent',
    readTime: `${post.readTime || 5} min read`,
    views: '2.1K', // You could track this in the future
    image: post.heroImage || '/stories/default.jpg',
    featured: false, // You could add featured flag to frontmatter
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
    <div className={`bg-obsidian text-white min-h-screen ${className}`}>
      {/* Header */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/stories/sunith-visionary-planning.jpg"
            alt="Field Stories from the Mountains"
            fill
            className="object-cover opacity-60 grayscale scale-105"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-obsidian"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <div className="inline-block px-3 py-1 mb-4 text-xs font-mono text-summit-gold-400 border border-summit-gold-900/50 rounded-full bg-summit-gold-900/10 backdrop-blur-md">
              MISSION REPORTS
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-white mb-6">
              FIELD STORIES
            </h1>
            <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed opacity-80 text-gray-300">
              Raw stories from the mountains. Unfiltered insights from extreme
              preparation. The human side of systematic mountaineering.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/blog/create"
                className="inline-flex items-center space-x-2 bg-white/10 text-white px-6 py-3 rounded-full font-medium hover:bg-white/20 transition-all border border-white/10 backdrop-blur-sm group"
              >
                <Plus className="w-4 h-4 text-summit-gold group-hover:text-white transition-colors" />
                <span>Write Story</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Story */}
      {featuredPost && (
        <section className="border-y border-white/5 bg-black/40">
          <Link href={`/blog/${featuredPost.slug}`} className="block group">
            <div className="relative">
              <div className="relative h-[70vh] overflow-hidden">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100"
                  sizes="100vw"
                  quality={100}
                  unoptimized={true}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-black/40 to-transparent" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                <div className="max-w-5xl mx-auto">
                  <div className="flex items-center space-x-3 mb-6">
                    <div
                      className={`${getCategoryColor(featuredPost.category)}/20 text-${getCategoryColor(featuredPost.category).replace('bg-', '')}-400 border border-${getCategoryColor(featuredPost.category).replace('bg-', '')}-500/30 px-3 py-1 text-xs font-mono tracking-widest uppercase backdrop-blur-md`}
                    >
                      FEATURED
                    </div>
                    <div className="bg-white/10 text-white border border-white/20 px-3 py-1 text-xs font-mono tracking-widest uppercase backdrop-blur-md">
                      {featuredPost.category}
                    </div>
                  </div>

                  <h2 className="text-4xl md:text-7xl font-light text-white leading-[1.1] mb-6 group-hover:text-summit-gold-100 transition-colors">
                    {featuredPost.title}
                  </h2>

                  <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-3xl font-light">
                    {featuredPost.subtitle}
                  </p>

                  <div className="flex items-center space-x-8 text-sm text-gray-400 font-mono tracking-wider">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-summit-gold-400" />
                      <span className="text-gray-300">
                        {featuredPost.author}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-summit-gold-400" />
                      <span>{featuredPost.date}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-summit-gold-400" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Stories Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-16 text-center">
          <h2 className="text-sm font-mono tracking-[0.3em] uppercase text-summit-gold-400 mb-4">
            Archive
          </h2>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6 tracking-wide">
            EXPEDITION REPORTS
          </h2>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-summit-gold-500 to-transparent mx-auto opacity-50"></div>
        </div>

        {loading ? (
          /* Loading State */
          <div className="text-center py-20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-2xl mx-auto"
            >
              <div className="animate-spin w-8 h-8 border border-white/20 border-t-summit-gold-400 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-400 font-mono text-sm tracking-widest">
                DECRYPTING ARCHIVES...
              </p>
            </motion.div>
          </div>
        ) : posts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-glass-panel border border-white/5 rounded-2xl p-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl mx-auto"
            >
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mountain className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-2xl md:text-3xl font-light text-white mb-4">
                Stories Coming Soon
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed mb-8 font-light">
                Authentic expedition stories, training insights, and mountain
                wisdom are being prepared. The first story from the Seven
                Summits journey will be published here soon.
              </p>
              <div className="text-xs text-gray-500 font-mono tracking-widest uppercase">
                Awaiting Transmission
              </div>
            </motion.div>
          </div>
        ) : (
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
                  className="group h-full"
                  data-testid="post-card"
                >
                  <Link href={`/blog/${post.slug}`} className="block h-full">
                    <div className="bg-glass-panel border border-white/5 rounded-xl overflow-hidden hover:border-summit-gold/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 h-full flex flex-col">
                      {/* Image */}
                      <div className="relative aspect-[3/2] overflow-hidden">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover bg-gray-900 group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0 opacity-90 group-hover:opacity-100"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          quality={100}
                          unoptimized={true}
                        />
                        <div className="absolute top-4 left-4">
                          <div className="bg-black/60 backdrop-blur-md text-white border border-white/10 px-3 py-1 text-[10px] font-mono font-bold tracking-widest uppercase flex items-center space-x-2 rounded-sm">
                            <CategoryIcon className="w-3 h-3 text-summit-gold-400" />
                            <span>{post.category}</span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-8 flex flex-col flex-grow">
                        <div className="flex items-center space-x-2 text-xs text-summit-gold-400 font-mono mb-4 tracking-wider uppercase">
                          <Calendar className="w-3 h-3" />
                          <span>{post.date}</span>
                        </div>

                        <h3 className="text-xl font-light text-white leading-tight mb-4 group-hover:text-summit-gold-100 transition-colors">
                          {post.title}
                        </h3>

                        <p className="text-gray-400 leading-relaxed mb-6 text-sm font-light line-clamp-3 flex-grow">
                          {post.subtitle}
                        </p>

                        <div className="pt-6 border-t border-white/5 flex items-center justify-between text-xs text-gray-500 font-mono tracking-wider mt-auto">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-3 h-3" />
                            <span className="whitespace-nowrap">
                              {post.readTime}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-400 group-hover:text-white transition-colors">
                            <span>READ REPORT</span>
                            <ChevronRight className="w-3 h-3" />
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
      <section className="bg-black border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-6 py-24 text-center relative z-10">
          <h3 className="text-3xl md:text-4xl font-light tracking-wide text-white mb-6">
            EXPEDITION UPDATES
          </h3>
          <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed font-light max-w-2xl mx-auto">
            Field reports from the mountains. Training insights and preparation
            updates. Raw stories from the systematic journey to Everest.
          </p>
          <Link
            href="/newsletter"
            className="inline-flex items-center space-x-3 bg-white text-black px-8 py-4 font-medium tracking-widest hover:bg-gray-200 transition-colors uppercase text-sm"
          >
            <span>Initialize Uplink</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
