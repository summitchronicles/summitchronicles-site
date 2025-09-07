"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  EyeIcon,
  DocumentTextIcon,
  TagIcon,
  CalendarIcon,
  ClockIcon,
  StarIcon,
  BookmarkIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import ImageUpload from '../../../../components/blog/ImageUpload';
import AdvancedEditor from '../../../../components/editor/AdvancedEditor';

interface Category {
  name: string;
  slug: string;
  color: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  tags: string[];
  scheduled_for: string | null;
  read_time: number;
  created_at: string;
  updated_at: string;
}

export default function EditBlogPost() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    status: 'draft' as 'draft' | 'published' | 'scheduled' | 'archived',
    featured: false,
    meta_title: '',
    meta_description: '',
    tags: [] as string[],
    scheduled_for: '',
    read_time: 5
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchCategories();
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/posts/${postId}`);
      const data = await response.json();
      
      if (response.ok) {
        const post: BlogPost = data.post;
        setFormData({
          title: post.title || '',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          content: post.content || '',
          category: post.category || '',
          status: post.status || 'draft',
          featured: post.featured || false,
          meta_title: post.meta_title || '',
          meta_description: post.meta_description || '',
          tags: post.tags || [],
          scheduled_for: post.scheduled_for ? new Date(post.scheduled_for).toISOString().slice(0, 16) : '',
          read_time: post.read_time || 5
        });
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

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories');
      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      slug: prev.slug || generateSlug(newTitle)
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target === document.activeElement) {
      e.preventDefault();
      addTag();
    }
  };

  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  const handleContentChange = (content: string) => {
    const readTime = calculateReadTime(content);
    setFormData(prev => ({
      ...prev,
      content,
      read_time: readTime
    }));
  };

  const handleSave = async (status: 'draft' | 'published' | 'scheduled') => {
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }

    if (!formData.content.trim()) {
      alert('Content is required');
      return;
    }

    if (!formData.category) {
      alert('Please select a category');
      return;
    }

    if (status === 'scheduled' && !formData.scheduled_for) {
      alert('Please set a scheduled date and time');
      return;
    }

    try {
      setSaving(true);
      
      const postData = {
        ...formData,
        status,
        scheduled_for: status === 'scheduled' ? formData.scheduled_for : null,
        meta_title: formData.meta_title || formData.title,
        meta_description: formData.meta_description || formData.excerpt
      };

      const response = await fetch(`/api/blog/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/blog');
      } else {
        alert(data.error || 'Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading post...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">{error}</div>
          <button
            onClick={() => router.push('/admin/blog')}
            className="px-6 py-3 bg-summitGold text-black rounded-xl hover:bg-yellow-400 transition-colors"
          >
            Back to Blog Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin/blog')}
                className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Edit Post</h1>
                <p className="text-white/60">Update your mountaineering content</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              
              <button
                onClick={() => handleSave('draft')}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-500 transition-colors disabled:opacity-50"
              >
                <BookmarkIcon className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Draft'}
              </button>
              
              <button
                onClick={() => handleSave('published')}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-summitGold text-black font-semibold rounded-xl hover:bg-yellow-400 transition-colors disabled:opacity-50"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
                {saving ? 'Publishing...' : 'Update & Publish'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Slug */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="Your amazing mountaineering story..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-summitGold/50"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="your-amazing-story"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-summitGold/50"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <label className="block text-white font-medium mb-4">Content *</label>
              <AdvancedEditor
                content={formData.content}
                onChange={handleContentChange}
                placeholder="Edit your mountaineering adventure... Use the toolbar for rich formatting, images, tables, and more!"
              />
            </div>

            {/* Excerpt */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <label className="block text-white font-medium mb-2">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="A brief summary of your post..."
                className="w-full h-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-summitGold/50 resize-none"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing Options */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <DocumentTextIcon className="w-5 h-5" />
                Publishing
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      status: e.target.value as 'draft' | 'published' | 'scheduled' 
                    }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-summitGold/50"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>

                {formData.status === 'scheduled' && (
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Scheduled For</label>
                    <input
                      type="datetime-local"
                      value={formData.scheduled_for}
                      onChange={(e) => setFormData(prev => ({ ...prev, scheduled_for: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-summitGold/50"
                    />
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 bg-white/5 border-white/10 rounded focus:ring-summitGold"
                  />
                  <label htmlFor="featured" className="text-white/70 text-sm flex items-center gap-2">
                    <StarIcon className="w-4 h-4" />
                    Featured post
                  </label>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Category *</h3>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-summitGold/50"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <TagIcon className="w-5 h-5" />
                Tags
              </h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a tag..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-summitGold/50"
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-summitGold text-black rounded-xl hover:bg-yellow-400 transition-colors"
                  >
                    Add
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/10 rounded-lg text-sm text-white flex items-center gap-2"
                    >
                      #{tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-white/50 hover:text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Meta Info */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">SEO & Meta</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Meta Title</label>
                  <input
                    type="text"
                    value={formData.meta_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                    placeholder="SEO title (defaults to post title)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-summitGold/50"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Meta Description</label>
                  <textarea
                    value={formData.meta_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                    placeholder="SEO description (defaults to excerpt)"
                    className="w-full h-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-summitGold/50 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2 flex items-center gap-2">
                    <ClockIcon className="w-4 h-4" />
                    Read Time (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.read_time}
                    onChange={(e) => setFormData(prev => ({ ...prev, read_time: parseInt(e.target.value) || 1 }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-summitGold/50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}