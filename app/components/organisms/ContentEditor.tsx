'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { H3, Body } from '../atoms/Typography';
import { Card, CardContent, CardHeader } from '../molecules/Card';
import { StatusBadge } from '../molecules/StatusBadge';
import { cn } from '@/lib/utils';

interface ContentEditorProps {
  className?: string;
  onSave?: (content: ContentData) => void;
  initialContent?: ContentData;
}

interface ContentData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: 'draft' | 'published' | 'archived';
  category: string;
  tags: string[];
  featuredImage?: string;
  author?: string;
  location?: string;
  readTime?: string;
  date?: string;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  className,
  onSave,
  initialContent,
}) => {
  const [content, setContent] = useState<ContentData>(
    initialContent || {
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      status: 'draft',
      category: 'PURPOSE',
      tags: [],
      featuredImage: undefined,
      author: 'Sunith Kumar',
      location: 'Training Grounds, California',
      readTime: '',
      date: '',
    }
  );

  const [isPreview, setIsPreview] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle client-side mounting to prevent hydration errors
  useEffect(() => {
    setMounted(true);
    if (!content.date) {
      setContent(prev => ({
        ...prev,
        date: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      }));
    }
  }, []);

  const handleSave = async () => {
    // Calculate read time
    const wordCount = content.content.split(/\s+/).filter(word => word.length > 0).length;
    const readTime = `${Math.ceil(wordCount / 200)} min read`;

    const finalContent = {
      ...content,
      readTime,
      date: content.date || new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };

    if (onSave) {
      onSave(finalContent);
    }

    console.log('Content saved:', finalContent);

    // Save to localStorage as backup
    localStorage.setItem('blog_draft_' + finalContent.slug, JSON.stringify(finalContent));

    alert('Blog post saved! Check console for data structure.');
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setContent((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB.');
      return;
    }

    setIsUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setImagePreview(imageUrl);
        setContent(prev => ({
          ...prev,
          featuredImage: imageUrl
        }));
      };
      reader.readAsDataURL(file);

      // In a real app, you'd upload to your storage service here
      // For now, we'll use the data URL
      console.log('Image uploaded:', file.name);

    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setContent(prev => ({
      ...prev,
      featuredImage: undefined
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTagAdd = (tag: string) => {
    if (tag && !content.tags.includes(tag)) {
      setContent(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setContent(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  return (
    <div className={cn('max-w-6xl mx-auto space-y-8', className)}>
      {/* Editor Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <H3 className="text-spa-charcoal">Content Editor</H3>
          <div className="flex items-center space-x-3">
            <StatusBadge
              variant={
                content.status === 'published'
                  ? 'success'
                  : content.status === 'draft'
                    ? 'warning'
                    : 'default'
              }
            >
              {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
            </StatusBadge>
            <Body className="text-spa-slate text-sm">
              Last modified: {mounted ? new Date().toLocaleDateString() : '--'}
            </Body>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
          >
            <Icon name={isPreview ? 'Edit' : 'Eye'} size="sm" />
            {isPreview ? 'Edit' : 'Preview'}
          </Button>

          <Button variant="secondary" size="sm">
            <Icon name="Save" size="sm" />
            Save Draft
          </Button>

          <Button variant="summit" size="sm" onClick={handleSave}>
            <Icon name="Upload" size="sm" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-3 space-y-6">
          {!isPreview ? (
            <>
              {/* Title */}
              <Card variant="elevated" padding="md">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-spa-charcoal">
                    Title
                  </label>
                  <input
                    type="text"
                    value={content.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-spa-cloud focus:outline-none focus:ring-2 focus:ring-alpine-blue focus:border-alpine-blue"
                    placeholder="Enter content title..."
                  />

                  <div className="text-sm text-spa-slate">
                    Slug:{' '}
                    <code className="bg-spa-stone px-2 py-1 rounded">
                      {content.slug}
                    </code>
                  </div>
                </div>
              </Card>

              {/* Author & Meta Info */}
              <Card variant="elevated" padding="md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-spa-charcoal mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      value={content.author || ''}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          author: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-lg border border-spa-cloud focus:outline-none focus:ring-2 focus:ring-alpine-blue focus:border-alpine-blue"
                      placeholder="Sunith Kumar"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-spa-charcoal mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={content.location || ''}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 rounded-lg border border-spa-cloud focus:outline-none focus:ring-2 focus:ring-alpine-blue focus:border-alpine-blue"
                      placeholder="Training Grounds, California"
                    />
                  </div>
                </div>
              </Card>

              {/* Excerpt */}
              <Card variant="elevated" padding="md">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-spa-charcoal">
                    Excerpt/Subtitle
                  </label>
                  <textarea
                    value={content.excerpt}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        excerpt: e.target.value,
                      }))
                    }
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-spa-cloud focus:outline-none focus:ring-2 focus:ring-alpine-blue focus:border-alpine-blue resize-none"
                    placeholder="A compelling subtitle that draws readers in..."
                  />
                </div>
              </Card>

              {/* Content Editor */}
              <Card variant="elevated" padding="md">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-spa-charcoal">
                    Content
                  </label>
                  <textarea
                    value={content.content}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    rows={25}
                    className="w-full px-4 py-3 rounded-lg border border-spa-cloud focus:outline-none focus:ring-2 focus:ring-alpine-blue focus:border-alpine-blue resize-none font-mono text-sm leading-relaxed"
                    placeholder="Write your authentic story here...\n\nYou can use simple formatting:\n- **bold text**\n- *italic text*\n- ## Headings\n- > Quotes\n- Lists and paragraphs"
                  />
                  <Body className="text-spa-slate text-sm">
                    Supports Markdown formatting. Use **bold**, *italic*, ##
                    headings, and more.
                  </Body>
                </div>
              </Card>
            </>
          ) : (
            /* Preview Mode */
            <Card variant="premium" padding="lg">
              <div className="prose prose-spa max-w-none">
                <h1 className="text-3xl font-bold text-spa-charcoal mb-4">
                  {content.title || 'Untitled'}
                </h1>

                {content.excerpt && (
                  <div className="text-lg text-spa-slate mb-6 p-4 bg-spa-mist rounded-lg">
                    {content.excerpt}
                  </div>
                )}

                <div className="text-spa-charcoal leading-relaxed whitespace-pre-wrap">
                  {content.content || 'No content yet...'}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Publish Settings */}
          <Card variant="elevated" padding="md">
            <CardHeader>
              <H3 className="text-spa-charcoal text-lg">Publish</H3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-spa-charcoal mb-2">
                  Status
                </label>
                <select
                  value={content.status}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      status: e.target.value as ContentData['status'],
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-spa-cloud focus:outline-none focus:ring-2 focus:ring-alpine-blue"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-spa-charcoal mb-2">
                  Category
                </label>
                <select
                  value={content.category}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-spa-cloud focus:outline-none focus:ring-2 focus:ring-alpine-blue"
                >
                  <option value="PURPOSE">PURPOSE</option>
                  <option value="MINDSET">MINDSET</option>
                  <option value="STORIES">STORIES</option>
                  <option value="REALITY">REALITY</option>
                  <option value="TRAINING">TRAINING</option>
                  <option value="EXPEDITION">EXPEDITION</option>
                  <option value="GEAR">GEAR</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card variant="elevated" padding="md">
            <CardHeader>
              <H3 className="text-spa-charcoal text-lg">Featured Image</H3>
            </CardHeader>
            <CardContent className="space-y-4">
              {imagePreview || content.featuredImage ? (
                <div className="relative aspect-video bg-spa-mist rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview || content.featuredImage || ''}
                    alt="Featured image preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                  >
                    <Icon name="X" size="sm" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video bg-spa-mist rounded-lg border-2 border-dashed border-spa-cloud flex items-center justify-center cursor-pointer hover:border-alpine-blue transition-colors"
                >
                  <div className="text-center space-y-2">
                    <Icon
                      name={isUploading ? "Loader2" : "Upload"}
                      size="lg"
                      className={`text-spa-slate mx-auto ${isUploading ? 'animate-spin' : ''}`}
                    />
                    <Body className="text-spa-slate text-sm">
                      {isUploading ? 'Uploading...' : 'Click to Upload Image'}
                    </Body>
                    <Body className="text-spa-slate text-xs">
                      Supports JPG, PNG, GIF (max 5MB)
                    </Body>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Icon name="Upload" size="sm" />
                {imagePreview || content.featuredImage ? 'Change Image' : 'Choose File'}
              </Button>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card variant="elevated" padding="md">
            <CardHeader>
              <H3 className="text-spa-charcoal text-lg">Tags</H3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {content.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center space-x-1 px-3 py-1 bg-alpine-blue/10 text-alpine-blue text-sm rounded-full"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleTagRemove(tag)}
                      className="text-alpine-blue/70 hover:text-alpine-blue ml-1"
                    >
                      <Icon name="X" size="sm" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 rounded-lg border border-spa-cloud focus:outline-none focus:ring-2 focus:ring-alpine-blue text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleTagAdd(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    handleTagAdd(input.value);
                    input.value = '';
                  }}
                >
                  Add
                </Button>
              </div>

              <div className="text-xs text-spa-slate">
                Suggested: everest, training, mindset, preparation, mountaineering
              </div>
            </CardContent>
          </Card>

          {/* Content Stats */}
          <Card variant="elevated" padding="md">
            <CardHeader>
              <H3 className="text-spa-charcoal text-lg">Statistics</H3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <Body className="text-spa-slate">Words:</Body>
                <Body className="text-spa-charcoal font-medium">
                  {
                    content.content
                      .split(/\s+/)
                      .filter((word) => word.length > 0).length
                  }
                </Body>
              </div>
              <div className="flex justify-between">
                <Body className="text-spa-slate">Characters:</Body>
                <Body className="text-spa-charcoal font-medium">
                  {content.content.length}
                </Body>
              </div>
              <div className="flex justify-between">
                <Body className="text-spa-slate">Read time:</Body>
                <Body className="text-spa-charcoal font-medium">
                  {Math.ceil(content.content.split(/\s+/).length / 200)} min
                </Body>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export { ContentEditor };
export type { ContentEditorProps, ContentData };
