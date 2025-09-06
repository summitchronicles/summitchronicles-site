"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeftIcon,
  ClockIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  HeartIcon,
  ShareIcon,
  EyeIcon
} from "@heroicons/react/24/outline";

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
  meta_title?: string;
  meta_description?: string;
}

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPost();
  }, [params.slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/posts/${params.slug}`);
      const data = await response.json();
      
      if (response.ok) {
        setPost(data.post);
      } else if (response.status === 404) {
        notFound();
      } else {
        setError(data.error || 'Failed to fetch post');
      }
    } catch (err) {
      setError('Failed to fetch post');
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Training': 'text-blue-400 border-blue-400/20 bg-blue-400/10',
      'Expeditions': 'text-orange-400 border-orange-400/20 bg-orange-400/10',
      'Gear': 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10',
      'Mental': 'text-purple-400 border-purple-400/20 bg-purple-400/10',
      'Nutrition': 'text-green-400 border-green-400/20 bg-green-400/10',
      'Recovery': 'text-cyan-400 border-cyan-400/20 bg-cyan-400/10'
    };
    return colors[category] || 'text-gray-400 border-gray-400/20 bg-gray-400/10';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading blog post...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error: {error}</div>
          <Link href="/blog" className="text-summitGold hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return notFound();
  }

  return (
    <article className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <header className="relative py-16 bg-black">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 text-white/70 hover:text-summitGold transition-colors duration-300"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Blog
            </Link>
          </motion.div>

          {/* Category */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4"
          >
            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(post.category)}`}>
              <TagIcon className="w-3 h-3" />
              {post.category}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            {post.title}
          </motion.h1>

          {/* Excerpt */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-white/70 leading-relaxed mb-8 max-w-3xl"
          >
            {post.excerpt}
          </motion.p>

          {/* Meta Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center gap-6 text-white/60 mb-8"
          >
            <div className="flex items-center gap-2">
              <UserIcon className="w-4 h-4" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <span>{formatDate(post.published_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4" />
              <span>{post.read_time} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <EyeIcon className="w-4 h-4" />
              <span>{post.views.toLocaleString()} views</span>
            </div>
          </motion.div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white/10 text-white/80 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </motion.div>
          )}
        </div>
      </header>

      {/* Content */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12"
          >
            <div 
              className="prose prose-invert prose-lg max-w-none
                prose-headings:text-white prose-headings:font-bold
                prose-p:text-white/80 prose-p:leading-relaxed
                prose-a:text-summitGold prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white prose-strong:font-semibold
                prose-em:text-white/90
                prose-blockquote:border-l-summitGold prose-blockquote:border-l-4 prose-blockquote:pl-6 prose-blockquote:text-white/70
                prose-ul:text-white/80 prose-ol:text-white/80
                prose-li:text-white/80
                prose-img:rounded-xl prose-img:shadow-2xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </motion.div>
        </div>
      </section>

      {/* Footer Actions */}
      <footer className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-between border-t border-white/10 pt-8"
          >
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors duration-300">
                <HeartIcon className="w-4 h-4 text-red-400" />
                <span className="text-white/80">Like ({post.likes})</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors duration-300">
                <ShareIcon className="w-4 h-4 text-blue-400" />
                <span className="text-white/80">Share</span>
              </button>
            </div>
            
            <Link 
              href="/blog"
              className="text-summitGold hover:text-summitGold/80 transition-colors duration-300 font-medium"
            >
              ← Back to all posts
            </Link>
          </motion.div>
        </div>
      </footer>
    </article>
  );
}