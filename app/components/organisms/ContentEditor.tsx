'use client';

import React, { useState } from 'react';
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
}

const ContentEditor: React.FC<ContentEditorProps> = ({ 
  className, 
  onSave,
  initialContent 
}) => {
  const [content, setContent] = useState<ContentData>(initialContent || {
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'draft',
    category: 'training',
    tags: [],
    featuredImage: undefined
  });

  const [isPreview, setIsPreview] = useState(false);

  const handleSave = () => {
    if (onSave) {
      onSave(content);
    }
    console.log('Content saved:', content);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setContent(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  return (
    <div className={cn('max-w-6xl mx-auto space-y-8', className)}>
      {/* Editor Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <H3 className="text-spa-charcoal">Content Editor</H3>
          <div className="flex items-center space-x-3">
            <StatusBadge variant={content.status === 'published' ? 'success' : content.status === 'draft' ? 'warning' : 'default'}>
              {content.status.charAt(0).toUpperCase() + content.status.slice(1)}
            </StatusBadge>
            <Body className="text-spa-slate text-sm">
              Last modified: {new Date().toLocaleDateString()}
            </Body>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
          >
            <Icon name={isPreview ? "Edit" : "Eye"} size="sm" />
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
                    Slug: <code className="bg-spa-stone px-2 py-1 rounded">{content.slug}</code>
                  </div>
                </div>
              </Card>

              {/* Excerpt */}
              <Card variant="elevated" padding="md">
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-spa-charcoal">
                    Excerpt
                  </label>
                  <textarea
                    value={content.excerpt}
                    onChange={(e) => setContent(prev => ({ ...prev, excerpt: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-spa-cloud focus:outline-none focus:ring-2 focus:ring-alpine-blue focus:border-alpine-blue resize-none"
                    placeholder="Brief description of this content..."
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
                    onChange={(e) => setContent(prev => ({ ...prev, content: e.target.value }))}
                    rows={20}
                    className="w-full px-4 py-3 rounded-lg border border-spa-cloud focus:outline-none focus:ring-2 focus:ring-alpine-blue focus:border-alpine-blue resize-none font-mono text-sm"
                    placeholder="Write your content in Markdown format..."
                  />
                  <Body className="text-spa-slate text-sm">
                    Supports Markdown formatting. Use **bold**, *italic*, ## headings, and more.
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
                  onChange={(e) => setContent(prev => ({ ...prev, status: e.target.value as ContentData['status'] }))}
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
                  onChange={(e) => setContent(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-spa-cloud focus:outline-none focus:ring-2 focus:ring-alpine-blue"
                >
                  <option value="training">Training</option>
                  <option value="expedition">Expedition</option>
                  <option value="gear">Gear Review</option>
                  <option value="insights">Insights</option>
                  <option value="updates">Updates</option>
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
              <div className="aspect-video bg-spa-mist rounded-lg border-2 border-dashed border-spa-cloud flex items-center justify-center">
                <div className="text-center space-y-2">
                  <Icon name="Upload" size="lg" className="text-spa-slate mx-auto" />
                  <Body className="text-spa-slate text-sm">Upload Image</Body>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full">
                <Icon name="Upload" size="sm" />
                Choose File
              </Button>
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
                  {content.content.split(/\s+/).filter(word => word.length > 0).length}
                </Body>
              </div>
              <div className="flex justify-between">
                <Body className="text-spa-slate">Characters:</Body>
                <Body className="text-spa-charcoal font-medium">{content.content.length}</Body>
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