'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpenIcon,
  ClockIcon,
  TagIcon,
  ArrowRightIcon,
  HeartIcon,
  ShareIcon,
  EyeIcon,
  CalendarIcon,
  UserIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChatBubbleBottomCenterTextIcon,
} from '@heroicons/react/24/outline';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  published_at: string;
  read_time: number;
  views: number;
  likes: number;
  featured: boolean;
  tags: string[];
  category_color?: string;
}

interface Category {
  name: string;
  slug: string;
  color: string;
}

export default function DynamicBlogPage() {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, margin: '-100px' });

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    Promise.all([fetchPosts(), fetchCategories()]).finally(() =>
      setLoading(false)
    );
  }, []);

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams({
        status: 'published',
        limit: '20',
      });

      if (selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }

      if (searchQuery) {
        params.append('search', searchQuery);
      }

      const response = await fetch(`/api/blog/posts?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setPosts(data.posts || []);
      } else {
        setError(data.error || 'Failed to fetch posts');
      }
    } catch (err) {
      setError('Failed to fetch posts');
      console.error('Error fetching posts:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories');
      const data = await response.json();

      if (response.ok) {
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPosts();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [selectedCategory, searchQuery]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryGradient = (category: string) => {
    const gradients: Record<string, string> = {
      Training: 'from-blue-500 to-cyan-600',
      Expeditions: 'from-orange-500 to-red-600',
      Gear: 'from-yellow-500 to-orange-600',
      Mental: 'from-purple-500 to-indigo-600',
      Nutrition: 'from-green-500 to-emerald-600',
      Recovery: 'from-cyan-500 to-blue-600',
    };
    return gradients[category] || 'from-gray-500 to-slate-600';
  };

  const featuredPosts = posts.filter((post) => post.featured);
  const regularPosts = posts.filter((post) => !post.featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading blog posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-24 bg-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 30 }}
            animate={
              isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-summitGold/10 border border-summitGold/20 rounded-full px-4 py-2 text-sm text-summitGold mb-6">
              <BookOpenIcon className="w-4 h-4" />
              Mountain Wisdom
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Chronicles from the{' '}
              <span className="text-summitGold">Heights</span>
            </h1>
            <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
              Deep insights, hard-won lessons, and practical wisdom from the
              world&apos;s highest peaks. Real experiences, honest reflections,
              and actionable knowledge.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-16"
          >
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="w-5 h-5 text-white/50" />
              </div>
              <input
                type="text"
                placeholder="Search articles, topics, or tags..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white placeholder-white/50 focus:outline-none focus:border-summitGold/50 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {['All', ...categories.map((cat) => cat.name)].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-summitGold text-black'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Articles */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
          <div className="max-w-7xl mx-auto px-6">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-white mb-8"
            >
              Featured Articles
            </motion.h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {featuredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative cursor-pointer"
                >
                  <Link href={`/blog/${post.slug}`}>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/8 transition-all duration-500">
                      <div className="relative h-64 overflow-hidden">
                        <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                          <span className="text-white/50">
                            Image placeholder
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute top-4 right-4 px-3 py-1 bg-summitGold/20 border border-summitGold/30 rounded-full text-xs font-medium text-summitGold">
                          {post.category}
                        </div>
                        <div className="absolute bottom-4 left-4 flex items-center gap-4 text-xs text-white/80">
                          <span className="flex items-center gap-1">
                            <EyeIcon className="w-3 h-3" />
                            {post.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <HeartIcon className="w-3 h-3" />
                            {post.likes}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-4 text-sm text-white/60">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {formatDate(post.published_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-3 h-3" />
                            {post.read_time} min
                          </span>
                          <span className="flex items-center gap-1">
                            <UserIcon className="w-3 h-3" />
                            {post.author}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-summitGold transition-colors duration-300 line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="text-white/70 leading-relaxed mb-6 line-clamp-3">
                          {post.excerpt}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {post.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-2 text-white/80 hover:text-summitGold transition-colors duration-300 group/button">
                          <span className="text-sm font-medium">
                            Read Full Article
                          </span>
                          <div className="group-hover/button:translate-x-1 transition-transform duration-300">
                            <ArrowRightIcon className="w-4 h-4" />
                          </div>
                        </div>
                      </div>

                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(post.category)}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}
                      ></div>
                    </div>

                    <div
                      className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${getCategoryGradient(post.category)} opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10 blur-xl`}
                    ></div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Articles */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-white mb-8"
          >
            {selectedCategory !== 'All'
              ? `${selectedCategory} Articles`
              : 'Latest Articles'}
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative cursor-pointer"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden hover:bg-white/8 transition-all duration-500">
                    <div className="relative h-48 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                        <span className="text-white/50 text-sm">
                          Image placeholder
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute top-4 right-4 px-2 py-1 bg-alpineBlue/20 border border-alpineBlue/30 rounded-full text-xs font-medium text-alpineBlue">
                        {post.category}
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3 text-xs text-white/60">
                        <span>{formatDate(post.published_at)}</span>
                        <span>•</span>
                        <span>{post.read_time} min</span>
                        <span>•</span>
                        <span>{post.views.toLocaleString()} views</span>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-3 group-hover:text-summitGold transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-white/10 rounded-lg text-xs text-white/70"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-white/50">
                          <span className="flex items-center gap-1">
                            <HeartIcon className="w-3 h-3" />
                            {post.likes}
                          </span>
                        </div>
                        <button className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-300">
                          <ShareIcon className="w-4 h-4 text-white/60 hover:text-alpineBlue" />
                        </button>
                      </div>

                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${getCategoryGradient(post.category)}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}
                      ></div>
                    </div>
                  </div>

                  <div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${getCategoryGradient(post.category)} opacity-0 group-hover:opacity-20 transition-opacity duration-500 -z-10 blur-xl`}
                  ></div>
                </Link>
              </motion.article>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-white/60 mb-4">No posts found</div>
              <p className="text-white/40">
                {selectedCategory !== 'All'
                  ? `No posts found in the ${selectedCategory} category.`
                  : 'No blog posts are available yet.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
