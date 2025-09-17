'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  PaperAirplaneIcon,
} from '@heroicons/react/24/outline';
import ImageUpload from '../../../components/blog/ImageUpload';
import AdvancedEditorLazy from '../../../components/editor/AdvancedEditorLazy';

interface Category {
  name: string;
  slug: string;
  color: string;
}

export default function NewBlogPost() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: '',
    status: 'draft' as 'draft' | 'published' | 'scheduled',
    featured: false,
    meta_title: '',
    meta_description: '',
    tags: [] as string[],
    scheduled_for: '',
    read_time: 5,
  });
  const [tagInput, setTagInput] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog/categories');
      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories || []);
        if (data.categories?.length > 0) {
          setFormData((prev) => ({
            ...prev,
            category: data.categories[0].name,
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
      meta_title: prev.meta_title || title,
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.replace(/<[^>]*>/g, '').split(/\\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({
      ...prev,
      content,
      read_time: estimateReadTime(content),
    }));
  };

  const handleSave = async (
    status: 'draft' | 'published' | 'scheduled' = 'draft'
  ) => {
    if (!formData.title || !formData.content || !formData.category) {
      alert('Please fill in title, content, and category');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        status,
        excerpt:
          formData.excerpt ||
          formData.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
        meta_description:
          formData.meta_description ||
          formData.excerpt ||
          formData.content.replace(/<[^>]*>/g, '').substring(0, 160),
      };

      const response = await fetch('/api/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin/blog');
      } else {
        alert(data.error || 'Failed to save post');
      }
    } catch (error) {
      alert('Failed to save post');
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin/blog')}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Create New Post
                </h1>
                <p className="text-white/60">
                  Share your mountaineering insights
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white"
              >
                <EyeIcon className="w-4 h-4" />
                Preview
              </button>

              <button
                onClick={() => handleSave('draft')}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors text-white disabled:opacity-50"
              >
                <BookmarkIcon className="w-4 h-4" />
                Save Draft
              </button>

              <button
                onClick={() => handleSave('published')}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-summitGold hover:bg-yellow-400 rounded-xl transition-colors text-black disabled:opacity-50"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Title */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <input
                type="text"
                placeholder="Post title..."
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full bg-transparent text-3xl font-bold text-white placeholder-white/50 focus:outline-none"
              />

              <div className="mt-4 flex items-center gap-2 text-sm text-white/60">
                <span>Slug:</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white focus:outline-none focus:border-summitGold/50"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <label className="block text-white font-medium mb-3">
                Excerpt
              </label>
              <textarea
                placeholder="Brief description of your post..."
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                rows={3}
                className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-summitGold/50 resize-none"
              />
            </div>

            {/* Content Editor */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <label className="block text-white font-medium mb-3">
                Content
              </label>

              <AdvancedEditorLazy
                content={formData.content}
                onChange={handleContentChange}
                placeholder="Start writing your expedition story... Use the toolbar for rich formatting, images, tables, and more!"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Visibility */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">
                Publish Settings
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: e.target.value as any,
                      }))
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-summitGold/50"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>

                {formData.status === 'scheduled' && (
                  <div>
                    <label className="block text-white/80 text-sm mb-2">
                      Schedule For
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.scheduled_for}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          scheduled_for: e.target.value,
                        }))
                      }
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-summitGold/50"
                    />
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        featured: e.target.checked,
                      }))
                    }
                    className="rounded"
                  />
                  <label className="text-white/80 text-sm">Featured Post</label>
                  <StarIcon className="w-4 h-4 text-summitGold" />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Category</h3>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-summitGold/50"
              >
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Tags</h3>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Add tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === 'Enter' && (e.preventDefault(), addTag())
                  }
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-summitGold/50"
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-summitGold text-black rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg text-sm text-white"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-white/60 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">SEO</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.meta_title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        meta_title: e.target.value,
                      }))
                    }
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-summitGold/50"
                    maxLength={60}
                  />
                  <div className="text-xs text-white/50 mt-1">
                    {formData.meta_title.length}/60 characters
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm mb-2">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.meta_description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        meta_description: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-summitGold/50"
                    maxLength={160}
                  />
                  <div className="text-xs text-white/50 mt-1">
                    {formData.meta_description.length}/160 characters
                  </div>
                </div>
              </div>
            </div>

            {/* Media Upload */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Images</h3>
              <ImageUpload
                showGallery={true}
                onImageUploaded={(imageUrl) => {
                  // Insert image markdown into content
                  const markdown = `\n![Image](${imageUrl})\n`;
                  setFormData((prev) => ({
                    ...prev,
                    content: prev.content + markdown,
                  }));
                }}
              />
            </div>

            {/* Reading Time */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-summitGold" />
                <span className="text-white font-semibold">
                  {formData.read_time} min read
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
