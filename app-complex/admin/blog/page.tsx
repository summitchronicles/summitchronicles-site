'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  TagIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  ArchiveBoxIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  views: number;
  likes: number;
  tags: string[];
  read_time: number;
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    status: 'all',
    category: 'all',
    search: '',
  });

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (filter.status !== 'all') params.append('status', filter.status);
      if (filter.category !== 'all') params.append('category', filter.category);
      if (filter.search) params.append('search', filter.search);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/blog/posts/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== postId));
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete post');
      }
    } catch (err) {
      alert('Failed to delete post');
      console.error('Delete error:', err);
    }
  };

  const toggleFeatured = async (post: BlogPost) => {
    try {
      const response = await fetch(`/api/blog/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !post.featured }),
      });

      if (response.ok) {
        setPosts(
          posts.map((p) =>
            p.id === post.id ? { ...p, featured: !p.featured } : p
          )
        );
      }
    } catch (err) {
      console.error('Error toggling featured:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Blog Management
              </h1>
              <p className="text-white/60">
                Create and manage your mountaineering content
              </p>
            </div>
            <Link
              href="/admin/blog/new"
              className="flex items-center gap-2 px-6 py-3 bg-summitGold text-black font-semibold rounded-2xl hover:bg-yellow-400 transition-colors duration-300"
            >
              <PlusIcon className="w-5 h-5" />
              New Post
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
              <input
                type="text"
                placeholder="Search posts..."
                value={filter.search}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, search: e.target.value }))
                }
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-summitGold/50"
              />
            </div>

            <select
              value={filter.status}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, status: e.target.value }))
              }
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-summitGold/50"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </select>

            <select
              value={filter.category}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, category: e.target.value }))
              }
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-summitGold/50"
            >
              <option value="all">All Categories</option>
              <option value="Training">Training</option>
              <option value="Expeditions">Expeditions</option>
              <option value="Gear">Gear</option>
              <option value="Mental">Mental</option>
              <option value="Nutrition">Nutrition</option>
              <option value="Recovery">Recovery</option>
            </select>

            <div className="flex items-center gap-2 text-sm text-white/60">
              <span>Total: {posts.length} posts</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6">
            <div className="text-red-400">{error}</div>
          </div>
        )}

        {/* Posts Table */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="text-left p-6 text-white font-semibold">
                    Title
                  </th>
                  <th className="text-left p-6 text-white font-semibold">
                    Category
                  </th>
                  <th className="text-left p-6 text-white font-semibold">
                    Status
                  </th>
                  <th className="text-left p-6 text-white font-semibold">
                    Stats
                  </th>
                  <th className="text-left p-6 text-white font-semibold">
                    Updated
                  </th>
                  <th className="text-left p-6 text-white font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-white/5 hover:bg-white/2"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        {post.featured && (
                          <StarIcon className="w-4 h-4 text-summitGold fill-summitGold" />
                        )}
                        <div>
                          <div className="text-white font-medium line-clamp-1">
                            {post.title}
                          </div>
                          <div className="text-white/50 text-sm line-clamp-2">
                            {post.excerpt}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {post.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-white/10 rounded-lg text-xs text-white/70"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-6">
                      <span className="text-white/70">{post.category}</span>
                    </td>

                    <td className="p-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}
                      >
                        {post.status}
                      </span>
                    </td>

                    <td className="p-6">
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <div className="flex items-center gap-1">
                          <EyeIcon className="w-4 h-4" />
                          {post.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          {post.read_time}m
                        </div>
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="text-white/60 text-sm">
                        {new Date(post.updated_at).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFeatured(post)}
                          className={`p-2 rounded-xl transition-colors ${
                            post.featured
                              ? 'bg-summitGold text-black'
                              : 'bg-white/10 text-white/60 hover:bg-white/20'
                          }`}
                          title={
                            post.featured
                              ? 'Remove from featured'
                              : 'Mark as featured'
                          }
                        >
                          <StarIcon className="w-4 h-4" />
                        </button>

                        <Link
                          href={`/admin/blog/edit/${post.id}`}
                          className="p-2 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-colors"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Link>

                        <Link
                          href={`/blogs/${post.slug}`}
                          target="_blank"
                          className="p-2 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-colors"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {posts.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-white/60 mb-4">No posts found</div>
              <Link
                href="/admin/blog/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-summitGold text-black font-semibold rounded-2xl hover:bg-yellow-400 transition-colors duration-300"
              >
                <PlusIcon className="w-5 h-5" />
                Create your first post
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
