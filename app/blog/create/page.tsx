'use client';

import { useState } from 'react';
import { Header } from '../../components/organisms/Header';
import {
  Save,
  Eye,
  Plus,
  Trash2,
  Upload,
  ArrowLeft,
  FileText,
  Image as ImageIcon,
  Quote,
} from 'lucide-react';
import Link from 'next/link';

interface BlogSection {
  id: string;
  title: string;
  content: string;
  image?: string;
  pullQuote?: string;
}

interface BlogPostForm {
  title: string;
  subtitle: string;
  category: string;
  author: string;
  location: string;
  heroImage: string;
  intro: string;
  sections: BlogSection[];
  tags: string[];
}

export default function CreateBlogPost() {
  const [formData, setFormData] = useState<BlogPostForm>({
    title: '',
    subtitle: '',
    category: 'MENTAL PREPARATION',
    author: 'Sunith Kumar',
    location: 'Training Grounds, California',
    heroImage: '',
    intro: '',
    sections: [
      {
        id: '1',
        title: '',
        content: '',
        image: '',
        pullQuote: '',
      },
    ],
    tags: [],
  });

  const [newTag, setNewTag] = useState('');

  const categories = [
    'MENTAL PREPARATION',
    'TRAINING',
    'EXPEDITION',
    'GEAR',
    'NUTRITION',
    'RECOVERY',
  ];

  const addSection = () => {
    const newSection: BlogSection = {
      id: Date.now().toString(),
      title: '',
      content: '',
      image: '',
      pullQuote: '',
    };
    setFormData({
      ...formData,
      sections: [...formData.sections, newSection],
    });
  };

  const removeSection = (sectionId: string) => {
    setFormData({
      ...formData,
      sections: formData.sections.filter((section) => section.id !== sectionId),
    });
  };

  const updateSection = (sectionId: string, field: string, value: string) => {
    setFormData({
      ...formData,
      sections: formData.sections.map((section) =>
        section.id === sectionId ? { ...section, [field]: value } : section
      ),
    });
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag],
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSave = async () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');

    const blogPost = {
      ...formData,
      slug,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      readTime: `${Math.ceil(formData.intro.split(' ').length / 200)} min read`,
      views: '0',
    };

    // In a real app, you'd save this to your database/CMS
    console.log('Saving blog post:', blogPost);
    alert('Blog post saved! (Check console for data structure)');
  };

  const generatePreview = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');

    window.open(`/blog/${slug}?preview=true`, '_blank');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="min-h-screen bg-gray-50 pt-16 flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/blog"
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Back to Stories</span>
                </Link>
                <div className="h-6 w-px bg-gray-300" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Create New Story
                </h1>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={generatePreview}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors rounded"
                  disabled={!formData.title}
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 bg-red-600 text-white px-6 py-2 hover:bg-red-700 transition-colors rounded font-medium"
                  disabled={!formData.title || !formData.subtitle}
                >
                  <Save className="w-4 h-4" />
                  <span>Save Story</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="space-y-8">
            {/* Basic Info */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Story Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="The Mental Game"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle *
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) =>
                      setFormData({ ...formData, subtitle: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Preparing Mind and Body for Everest 2027: A Systematic Approach to Peak Performance"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) =>
                      setFormData({ ...formData, author: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.heroImage}
                    onChange={(e) =>
                      setFormData({ ...formData, heroImage: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="/stories/everest-prep.jpeg"
                  />
                </div>
              </div>
            </div>

            {/* Introduction */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Introduction
              </h2>
              <textarea
                value={formData.intro}
                onChange={(e) =>
                  setFormData({ ...formData, intro: e.target.value })
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Every summit begins in the mind. The statistics are sobering..."
              />
            </div>

            {/* Content Sections */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Content Sections
                </h2>
                <button
                  onClick={addSection}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Section</span>
                </button>
              </div>

              <div className="space-y-6">
                {formData.sections.map((section, index) => (
                  <div
                    key={section.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-gray-900">
                        Section {index + 1}
                      </h3>
                      {formData.sections.length > 1 && (
                        <button
                          onClick={() => removeSection(section.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) =>
                            updateSection(section.id, 'title', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="The Psychology of Extreme Altitude"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Content
                        </label>
                        <textarea
                          value={section.content}
                          onChange={(e) =>
                            updateSection(section.id, 'content', e.target.value)
                          }
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="At 8,849 meters above sea level, Everest exists..."
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <ImageIcon className="w-4 h-4 mr-1" />
                            Section Image (optional)
                          </label>
                          <input
                            type="text"
                            value={section.image || ''}
                            onChange={(e) =>
                              updateSection(section.id, 'image', e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            placeholder="/stories/data-training.jpg"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <Quote className="w-4 h-4 mr-1" />
                            Pull Quote (optional)
                          </label>
                          <input
                            type="text"
                            value={section.pullQuote || ''}
                            onChange={(e) =>
                              updateSection(
                                section.id,
                                'pullQuote',
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                            placeholder="The mountain doesn't care about your plan..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Tags</h2>

              <div className="flex flex-wrap gap-2 mb-4">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Add a tag..."
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
