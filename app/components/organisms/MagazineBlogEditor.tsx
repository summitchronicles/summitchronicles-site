'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';
import { H3, Body } from '../atoms/Typography';
import { Card, CardContent, CardHeader } from '../molecules/Card';
import { StatusBadge } from '../molecules/StatusBadge';
import { cn } from '@/lib/utils';
import {
  Plus,
  Trash2,
  Upload,
  Eye,
  Save,
  MoveUp,
  MoveDown,
  Quote,
  FileImage,
  Type,
  FileText,
} from 'lucide-react';

interface MagazineBlogEditorProps {
  className?: string;
  onSave?: (content: MagazineBlogData) => void;
  initialContent?: MagazineBlogData;
}

interface ContentSection {
  id: string;
  title: string;
  content: string;
  image?: string;
  pullQuote?: string;
}

interface MagazineBlogData {
  title: string;
  subtitle: string;
  slug: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  location: string;
  heroImage: string;
  intro: string;
  sections: ContentSection[];
  tags: string[];
  views: string;
  status: 'draft' | 'published' | 'archived';
}

export function MagazineBlogEditor({
  className,
  onSave,
  initialContent,
}: MagazineBlogEditorProps) {
  const [content, setContent] = useState<MagazineBlogData>(
    initialContent || {
      title: '',
      subtitle: '',
      slug: '',
      author: 'Sunith Kumar',
      date: '',
      readTime: '',
      category: 'PURPOSE',
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
      views: '0',
      status: 'draft',
    }
  );

  const [isPreview, setIsPreview] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroImageInputRef = useRef<HTMLInputElement>(null);

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
      slug: generateSlug(title),
    }));
  };

  const handleSave = async () => {
    // Calculate read time
    const totalWords = content.intro.split(/\s+/).length +
      content.sections.reduce((acc, section) =>
        acc + section.content.split(/\s+/).length, 0
      );
    const readTime = `${Math.ceil(totalWords / 200)} min read`;

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

    console.log('Magazine blog post saved:', finalContent);

    // Save to localStorage as backup
    localStorage.setItem('magazine_blog_draft_' + finalContent.slug, JSON.stringify(finalContent));

    alert('Magazine-style blog post saved! Check console for RedBull format data structure.');
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'hero' | 'section',
    sectionId?: string
  ) => {
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

        if (type === 'hero') {
          setImagePreview(imageUrl);
          setContent(prev => ({
            ...prev,
            heroImage: imageUrl
          }));
        } else if (type === 'section' && sectionId) {
          updateSection(sectionId, 'image', imageUrl);
        }
      };
      reader.readAsDataURL(file);

      console.log('Image uploaded:', file.name);

    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const addSection = () => {
    const newSection: ContentSection = {
      id: Date.now().toString(),
      title: '',
      content: '',
      image: '',
      pullQuote: '',
    };
    setContent(prev => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const removeSection = (sectionId: string) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId),
    }));
  };

  const updateSection = (sectionId: string, field: keyof ContentSection, value: string) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, [field]: value } : section
      ),
    }));
  };

  const moveSectionUp = (index: number) => {
    if (index === 0) return;
    setContent(prev => {
      const newSections = [...prev.sections];
      [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
      return { ...prev, sections: newSections };
    });
  };

  const moveSectionDown = (index: number) => {
    if (index === content.sections.length - 1) return;
    setContent(prev => {
      const newSections = [...prev.sections];
      [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
      return { ...prev, sections: newSections };
    });
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

  const generatePreview = () => {
    const previewData = {
      ...content,
      content: {
        intro: content.intro,
        sections: content.sections.map(s => ({
          title: s.title,
          content: s.content,
          image: s.image,
          pullQuote: s.pullQuote,
        }))
      }
    };

    // In a real app, you'd pass this to the RedBullBlogPost component
    console.log('Preview data for RedBullBlogPost:', previewData);

    // For now, open existing blog format
    window.open(`/blog/why-the-seven-summits`, '_blank');
  };

  if (!mounted) return null;

  return (
    <div className={cn('max-w-7xl mx-auto space-y-8', className)}>
      {/* Editor Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <H3 className="text-spa-charcoal">Magazine Blog Editor</H3>
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
              Red Bull Magazine Format
            </Body>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={generatePreview}
          >
            <Icon name="Eye" size="sm" />
            Preview Magazine
          </Button>

          <Button variant="secondary" size="sm">
            <Icon name="Save" size="sm" />
            Save Draft
          </Button>

          <Button variant="summit" size="sm" onClick={handleSave}>
            <Icon name="Upload" size="sm" />
            Publish Story
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Editor */}
        <div className="lg:col-span-3 space-y-6">
          {/* Story Header */}
          <Card variant="elevated" padding="md">
            <CardHeader>
              <H3 className="text-spa-charcoal text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Story Header
              </H3>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-spa-charcoal mb-2">
                    Story Title *
                  </label>
                  <input
                    type="text"
                    value={content.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-spa-cloud focus:outline-none focus:ring-2 focus:ring-alpine-blue focus:border-alpine-blue text-lg font-semibold"
                    placeholder="Why the Seven Summits?"
                  />
                  <div className="text-sm text-spa-slate mt-1">
                    Slug: <code className="bg-spa-stone px-2 py-1 rounded">{content.slug}</code>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-spa-charcoal mb-2">
                    Compelling Subtitle *
                  </label>
                  <textarea
                    value={content.subtitle}
                    onChange={(e) => setContent(prev => ({ ...prev, subtitle: e.target.value }))}
                    rows={2}
                    className="w-full px-4 py-3 rounded-lg border border-spa-cloud focus:outline-none focus:ring-2 focus:ring-alpine-blue focus:border-alpine-blue"
                    placeholder="A Journey of Purpose, Passion, and Perseverance - The real reason I risk everything for some mountains"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-spa-charcoal mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      value={content.author}
                      onChange={(e) => setContent(prev => ({ ...prev, author: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-spa-cloud focus:outline-none focus:ring-2 focus:ring-alpine-blue focus:border-alpine-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-spa-charcoal mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={content.location}
                      onChange={(e) => setContent(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 rounded-lg border border-spa-cloud focus:outline-none focus:ring-2 focus:ring-alpine-blue focus:border-alpine-blue"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hero Image */}
          <Card variant="elevated" padding="md">
            <CardHeader>
              <H3 className="text-spa-charcoal text-lg flex items-center gap-2">
                <FileImage className="w-5 h-5" />
                Hero Image
              </H3>
            </CardHeader>
            <CardContent className="space-y-4">
              {imagePreview || content.heroImage ? (
                <div className="relative aspect-[21/9] bg-spa-mist rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview || content.heroImage || ''}
                    alt="Hero image preview"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setContent(prev => ({ ...prev, heroImage: '' }));
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                  >
                    <Icon name="X" size="sm" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => heroImageInputRef.current?.click()}
                  className="aspect-[21/9] bg-spa-mist rounded-lg border-2 border-dashed border-spa-cloud flex items-center justify-center cursor-pointer hover:border-alpine-blue transition-colors"
                >
                  <div className="text-center space-y-2">
                    <Upload className="w-8 h-8 text-spa-slate mx-auto" />
                    <Body className="text-spa-slate">Click to Upload Hero Image</Body>
                    <Body className="text-spa-slate text-xs">
                      Magazine format - wide aspect ratio
                    </Body>
                  </div>
                </div>
              )}

              <input
                ref={heroImageInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'hero')}
                className="hidden"
              />

              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => heroImageInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {imagePreview || content.heroImage ? 'Change Hero Image' : 'Upload Hero Image'}
              </Button>
            </CardContent>
          </Card>

          {/* Introduction */}
          <Card variant="elevated" padding="md">
            <CardHeader>
              <H3 className="text-spa-charcoal text-lg flex items-center gap-2">
                <Type className="w-5 h-5" />
                Opening Introduction
              </H3>
            </CardHeader>
            <CardContent>
              <textarea
                value={content.intro}
                onChange={(e) => setContent(prev => ({ ...prev, intro: e.target.value }))}
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-spa-cloud focus:outline-none focus:ring-2 focus:ring-alpine-blue focus:border-alpine-blue"
                placeholder="Every summit begins in the mind. The statistics are sobering: only 29% of climbers who attempt Mount Everest actually reach the summit..."
              />
              <div className="text-sm text-spa-slate mt-2">
                This appears as the highlighted introduction with red border accent
              </div>
            </CardContent>
          </Card>

          {/* Content Sections */}
          <Card variant="elevated" padding="md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <H3 className="text-spa-charcoal text-lg">Magazine Sections</H3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addSection}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              {content.sections.map((section, index) => (
                <div
                  key={section.id}
                  className="border border-spa-cloud rounded-lg p-6 space-y-6"
                >
                  {/* Section Header */}
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-spa-charcoal">Section {index + 1}</h4>
                    <div className="flex items-center space-x-2">
                      {index > 0 && (
                        <button
                          onClick={() => moveSectionUp(index)}
                          className="p-1 text-spa-slate hover:text-alpine-blue"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>
                      )}
                      {index < content.sections.length - 1 && (
                        <button
                          onClick={() => moveSectionDown(index)}
                          className="p-1 text-spa-slate hover:text-alpine-blue"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>
                      )}
                      {content.sections.length > 1 && (
                        <button
                          onClick={() => removeSection(section.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Section Title */}
                  <div>
                    <label className="block text-sm font-medium text-spa-charcoal mb-2">
                      Section Title
                    </label>
                    <input
                      type="text"
                      value={section.title}
                      onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-spa-cloud focus:outline-none focus:ring-2 focus:ring-alpine-blue focus:border-alpine-blue"
                      placeholder="The Psychology of Extreme Altitude"
                    />
                  </div>

                  {/* Section Content */}
                  <div>
                    <label className="block text-sm font-medium text-spa-charcoal mb-2">
                      Section Content
                    </label>
                    <textarea
                      value={section.content}
                      onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                      rows={8}
                      className="w-full px-4 py-3 rounded-lg border border-spa-cloud focus:outline-none focus:ring-2 focus:ring-alpine-blue focus:border-alpine-blue"
                      placeholder="At 8,849 meters above sea level, Everest exists in what mountaineers call the 'Death Zone'...

Use double line breaks to create paragraph separations in the magazine format."
                    />
                  </div>

                  {/* Section Image & Pull Quote */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-spa-charcoal mb-2 flex items-center gap-2">
                        <FileImage className="w-4 h-4" />
                        Section Image (Optional)
                      </label>
                      {section.image ? (
                        <div className="relative aspect-video bg-spa-mist rounded-lg overflow-hidden mb-2">
                          <Image
                            src={section.image}
                            alt={section.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 400px"
                          />
                          <button
                            onClick={() => updateSection(section.id, 'image', '')}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                          >
                            <Icon name="X" size="sm" />
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => handleImageUpload(e as any, 'section', section.id);
                            input.click();
                          }}
                          className="aspect-video bg-spa-mist rounded-lg border-2 border-dashed border-spa-cloud flex items-center justify-center cursor-pointer hover:border-alpine-blue transition-colors"
                        >
                          <div className="text-center">
                            <Upload className="w-6 h-6 text-spa-slate mx-auto mb-1" />
                            <Body className="text-spa-slate text-sm">Add Image</Body>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-spa-charcoal mb-2 flex items-center gap-2">
                        <Quote className="w-4 h-4" />
                        Pull Quote (Optional)
                      </label>
                      <textarea
                        value={section.pullQuote || ''}
                        onChange={(e) => updateSection(section.id, 'pullQuote', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-spa-cloud focus:outline-none focus:ring-2 focus:ring-alpine-blue focus:border-alpine-blue"
                        placeholder="The mountain doesn't care about your plan — but your preparation does."
                      />
                      <div className="text-sm text-spa-slate mt-1">
                        Appears as large italic quote with red accent
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
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
                    setContent(prev => ({
                      ...prev,
                      status: e.target.value as MagazineBlogData['status'],
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
                    setContent(prev => ({
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
                Suggested: everest, mental-training, peak-performance, mountaineering
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
                <Body className="text-spa-slate">Sections:</Body>
                <Body className="text-spa-charcoal font-medium">
                  {content.sections.length}
                </Body>
              </div>
              <div className="flex justify-between">
                <Body className="text-spa-slate">Total Words:</Body>
                <Body className="text-spa-charcoal font-medium">
                  {
                    content.intro.split(/\s+/).length +
                    content.sections.reduce((acc, section) =>
                      acc + section.content.split(/\s+/).length, 0
                    )
                  }
                </Body>
              </div>
              <div className="flex justify-between">
                <Body className="text-spa-slate">Read time:</Body>
                <Body className="text-spa-charcoal font-medium">
                  {Math.ceil((content.intro.split(/\s+/).length +
                    content.sections.reduce((acc, section) =>
                      acc + section.content.split(/\s+/).length, 0
                    )) / 200)} min
                </Body>
              </div>
              <div className="flex justify-between">
                <Body className="text-spa-slate">Images:</Body>
                <Body className="text-spa-charcoal font-medium">
                  {(content.heroImage ? 1 : 0) + content.sections.filter(s => s.image).length}
                </Body>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export type { MagazineBlogEditorProps, MagazineBlogData };