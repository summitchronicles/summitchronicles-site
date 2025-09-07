"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  PencilIcon,
  ClockIcon,
  TagIcon,
  ArrowRightIcon,
  LightBulbIcon
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  status: string;
  featured: boolean;
  created_at: string;
  read_time: number;
}

export default function InsightsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog/posts?status=published');
      const data = await response.json();
      if (response.ok) {
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const featuredPosts = posts.filter(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 text-sm text-white/80 mb-8"
          >
            <LightBulbIcon className="w-4 h-4 text-summitGold" />
            Real Insights from the Mountains
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
            Insights from{" "}
            <span className="bg-gradient-to-r from-summitGold to-yellow-400 bg-clip-text text-transparent">
              My Expeditions
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/70 leading-relaxed mb-12">
            Authentic stories, training insights, gear reviews, and lessons learned 
            from my Seven Summits journey. No fluff, just real experiences from the mountains.
          </p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          {loading ? (
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-summitGold border-r-transparent"></div>
              <p className="mt-4 text-white/60">Loading insights...</p>
            </div>
          ) : (
            <>
              {/* Featured Posts */}
              {featuredPosts.length > 0 && (
                <div className="mb-20">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-12"
                  >
                    <h2 className="text-3xl font-bold text-white mb-4">Featured Insights</h2>
                    <p className="text-white/60">The most impactful lessons from my recent expeditions</p>
                  </motion.div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {featuredPosts.slice(0, 2).map((post, index) => (
                      <motion.article
                        key={post.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: index * 0.2 }}
                        whileHover={{ y: -5 }}
                        className="group"
                      >
                        <Link href={`/blogs/${post.slug}`}>
                          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 h-full">
                            <div className="flex items-center gap-3 mb-4">
                              <span className="px-3 py-1 bg-summitGold/20 border border-summitGold/30 rounded-full text-xs font-medium text-summitGold uppercase tracking-wide">
                                {post.category}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-white/60">
                                <ClockIcon className="w-3 h-3" />
                                {post.read_time} min read
                              </span>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-summitGold transition-colors">
                              {post.title}
                            </h3>

                            <p className="text-white/70 leading-relaxed mb-6 line-clamp-3">
                              {post.excerpt}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex flex-wrap gap-2">
                                {post.tags.slice(0, 2).map((tag) => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-2 py-1 bg-white/10 rounded text-xs text-white/60"
                                  >
                                    <TagIcon className="w-3 h-3" />
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              <div className="flex items-center gap-1 text-summitGold group-hover:gap-2 transition-all">
                                <span className="text-sm font-medium">Read More</span>
                                <ArrowRightIcon className="w-4 h-4" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.article>
                    ))}
                  </div>
                </div>
              )}

              {/* All Posts */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-12"
                >
                  <h2 className="text-3xl font-bold text-white mb-4">All Insights</h2>
                  <p className="text-white/60">Stories, lessons, and insights from my mountaineering journey</p>
                </motion.div>

                {regularPosts.length === 0 && featuredPosts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center py-20"
                  >
                    <PencilIcon className="w-16 h-16 text-white/40 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-4">Coming Soon</h3>
                    <p className="text-white/60 max-w-md mx-auto">
                      I&apos;m currently preparing my first insights from recent expeditions. 
                      Check back soon for authentic stories from the mountains.
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {regularPosts.map((post, index) => (
                      <motion.article
                        key={post.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="group"
                      >
                        <Link href={`/blogs/${post.slug}`}>
                          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 h-full">
                            <div className="flex items-center gap-3 mb-4">
                              <span className="px-2 py-1 bg-white/10 rounded text-xs font-medium text-white/60 uppercase tracking-wide">
                                {post.category}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-white/60">
                                <ClockIcon className="w-3 h-3" />
                                {post.read_time} min
                              </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-summitGold transition-colors">
                              {post.title}
                            </h3>

                            <p className="text-white/70 text-sm leading-relaxed mb-4 line-clamp-3">
                              {post.excerpt}
                            </p>

                            <div className="flex items-center gap-1 text-summitGold group-hover:gap-2 transition-all">
                              <span className="text-xs font-medium">Read More</span>
                              <ArrowRightIcon className="w-3 h-3" />
                            </div>
                          </div>
                        </Link>
                      </motion.article>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Get New Insights First
              </h3>
              <p className="text-lg text-white/70 mb-8">
                Be the first to read my latest expedition stories, training insights, 
                and gear recommendations. No spam, just authentic content from the mountains.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-summitGold/50"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-summitGold text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors"
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}