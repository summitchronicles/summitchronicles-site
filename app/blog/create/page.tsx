'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  Eye,
  Plus,
  Trash2,
  Image as ImageIcon,
  ArrowLeft,
  Type,
  Quote,
  MoreVertical,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { publishPost } from '@/app/actions/blog';
import { useRouter } from 'next/navigation';

interface BlogSection {
  id: string;
  type: 'text' | 'image' | 'quote';
  content: string;
  image?: string;
  imageId?: string; // Sanity Asset ID
  caption?: string;
}

interface BlogPostForm {
  title: string;
  subtitle: string;
  category: string;
  author: string;
  heroImage: string;
  heroImageId?: string; // Sanity Asset ID
  sections: BlogSection[];
}

export default function LiveCinematicEditor() {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Refs for file inputs
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const sectionImageInputRef = useRef<HTMLInputElement>(null);
  const [activeImageSectionId, setActiveImageSectionId] = useState<string | null>(null);

  const [formData, setFormData] = useState<BlogPostForm>({
    title: 'The Unwritten Summit',
    subtitle: 'Click here to add your compelling subtitle...',
    category: 'Mental Preparation',
    author: 'Sunith Kumar',
    heroImage: '/stories/everest-prep.jpeg', // Default placeholder
    sections: [
      {
        id: '1',
        type: 'text',
        content:
          'Start typing your story here. Select text to format it, or use the toolbar to add images and quotes.',
      },
    ],
  });

  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const updateSection = (id: string, content: string) => {
    setFormData({
      ...formData,
      sections: formData.sections.map((s) =>
        s.id === id ? { ...s, content } : s
      ),
    });
  };

  const addSection = (type: 'text' | 'image' | 'quote') => {
    const newSection: BlogSection = {
      id: Date.now().toString(),
      type,
      content: type === 'text' ? '' : 'New section content',
      image: type === 'image' ? '/placeholder.jpg' : undefined,
    };
    setFormData({
      ...formData,
      sections: [...formData.sections, newSection],
    });
  };

  const removeSection = (id: string) => {
    setFormData({
      ...formData,
      sections: formData.sections.filter((s) => s.id !== id),
    });
  };

  // Image Upload Logic
  const handleImageUpload = async (file: File, isHero: boolean, sectionId?: string) => {
    setIsUploading(true);
    setUploadError(null);

    const data = new FormData();
    data.append('file', file);

    try {
      const response = await fetch('/api/sanity/upload', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();

      if (result.success && result.asset) {
        if (isHero) {
          setFormData(prev => ({
            ...prev,
            heroImage: result.asset.url,
            heroImageId: result.asset._id
          }));
        } else if (sectionId) {
          setFormData(prev => ({
            ...prev,
            sections: prev.sections.map(s =>
              s.id === sectionId
                ? { ...s, image: result.asset.url, imageId: result.asset._id }
                : s
            )
          }));
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload image. Please try again.');
        alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      setActiveImageSectionId(null);
    }
  };

  const triggerHeroImageUpload = () => {
    heroImageInputRef.current?.click();
  };

  const triggerSectionImageUpload = (sectionId: string) => {
    setActiveImageSectionId(sectionId);
    // Use setTimeout to ensure state update before click, or just click directly if ref is stable
    // However, since we share one input for sections, we need to know which ID it is for.
    // The state `activeImageSectionId` handles that context.
    // We need to wait for state to propagate if we were using a single input,
    // but React batching might be an issue.
    // SAFEST: Set state, then wait. simpler: distinct inputs or just use the state in the change handler.
    // We'll use the state in the change handler, so triggering click is fine.
    // BUT verify if state updates synchronously enough? No.
    // Better pattern: Set a ref to the active section ID immediately before click.
    // We'll trust React state for now, but if it fails, we can use a ref.
    sectionImageInputRef.current?.click();
  };


  const handlePublish = async () => {
    if (!formData.title || !formData.author) {
       alert('Please provide a title and author.');
       return;
    }

    setIsPublishing(true);
    try {
      const result = await publishPost(formData);
      if (result.success) {
        // Redirect to the new post
        router.push(`/blog/${result.slug}`);
      } else {
        alert('Failed to publish: ' + result.error);
      }
    } catch (error) {
      console.error('Publish error:', error);
      alert('An unexpected error occurred.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-summit-gold/30 selection:text-white">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={heroImageInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file, true);
        }}
      />
      <input
        type="file"
        ref={sectionImageInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && activeImageSectionId) {
             handleImageUpload(file, false, activeImageSectionId);
          }
        }}
      />

      {/* Editor Toolbar (Floating) */}
      <div className="fixed top-6 right-6 z-50 flex items-center space-x-3 bg-black/80 backdrop-blur-xl border border-white/10 p-2 rounded-full shadow-2xl">
        <Link
          href="/blog"
          className="p-2 text-gray-400 hover:text-white transition-colors"
          title="Back to Stories"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="h-6 w-px bg-white/10" />
        <button
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-full transition-all"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">Preview</span>
        </button>
        <button
          onClick={handlePublish}
          disabled={isPublishing || isUploading}
          className="flex items-center space-x-2 px-6 py-2 text-sm font-bold text-black bg-summit-gold hover:bg-yellow-500 rounded-full transition-all shadow-lg shadow-summit-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPublishing ? (
            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">
            {isPublishing ? 'Publishing...' : 'Publish'}
          </span>
        </button>
      </div>

      {/* Hero Section (Live Edit) */}
      <div className="relative h-screen w-full flex items-end">
        {/* Hero Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src={formData.heroImage}
            alt="Hero Background"
            fill
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

          {/* Image Upload Overlay */}
          <div className="absolute top-6 left-6 z-20 opacity-0 hover:opacity-100 transition-opacity">
            <button
              onClick={triggerHeroImageUpload}
              disabled={isUploading}
              className="flex items-center space-x-2 bg-black/60 backdrop-blur text-white px-4 py-2 rounded-lg border border-white/10 text-sm hover:bg-black/80 transition-colors"
            >
              {isUploading ? (
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <ImageIcon className="w-4 h-4" />
              )}
              <span>{isUploading ? 'Uploading...' : 'Change Cover Image'}</span>
            </button>
          </div>
        </div>

        {/* Hero Content Editable */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-8 pb-24 space-y-6">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="bg-transparent border border-white/20 rounded-full px-4 py-1 text-sm font-medium text-summit-gold uppercase tracking-wider focus:outline-none focus:border-summit-gold w-auto min-w-[150px]"
              placeholder="CATEGORY"
            />
          </div>

          <textarea
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="w-full bg-transparent text-5xl md:text-7xl font-light text-white leading-tight focus:outline-none resize-none overflow-hidden placeholder-white/30"
            rows={2}
            placeholder="Enter Title..."
          />

          <textarea
            value={formData.subtitle}
            onChange={(e) => handleInputChange('subtitle', e.target.value)}
            className="w-full bg-transparent text-xl md:text-2xl text-gray-300 font-light leading-relaxed focus:outline-none resize-none placeholder-gray-500"
            rows={2}
            placeholder="Add a subtitle..."
          />

          <div className="flex items-center space-x-4 text-sm text-gray-400 pt-6 border-t border-white/10">
            <span className="font-medium text-white">{formData.author}</span>
            <span>•</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Content Editor */}
      <div className="max-w-3xl mx-auto px-8 py-24 space-y-12">
        {formData.sections.map((section, index) => (
          <motion.div
            layout
            key={section.id}
            className="group relative"
            onMouseEnter={() => setActiveSection(section.id)}
            onMouseLeave={() => setActiveSection(null)}
          >
            {/* Section Controls */}
            <div
              className={`absolute -left-16 top-0 flex flex-col space-y-2 transition-opacity duration-200 ${
                activeSection === section.id ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <button
                onClick={() => removeSection(section.id)}
                className="p-2 text-gray-500 hover:text-red-500 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                title="Remove Section"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Content Render/Edit */}
            {section.type === 'text' && (
              <textarea
                value={section.content}
                onChange={(e) => updateSection(section.id, e.target.value)}
                className="w-full bg-transparent text-xl leading-relaxed text-gray-300 focus:outline-none resize-none placeholder-gray-600 min-h-[150px]"
                placeholder="Type your story..."
              />
            )}

            {section.type === 'quote' && (
              <div className="relative pl-8 border-l-2 border-summit-gold">
                <Quote className="absolute -left-3 -top-3 w-6 h-6 text-summit-gold bg-black p-1" />
                <textarea
                  value={section.content}
                  onChange={(e) => updateSection(section.id, e.target.value)}
                  className="w-full bg-transparent text-2xl font-light italic text-white focus:outline-none resize-none min-h-[100px]"
                  placeholder="Enter quote..."
                />
              </div>
            )}

            {section.type === 'image' && (
              <div className="relative group/image">
                <div className="aspect-video relative rounded-lg overflow-hidden bg-white/5 border border-white/10">
                  <Image
                    src={section.image || '/placeholder.jpg'}
                    alt="Section Image"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity">
                    <button
                      onClick={() => triggerSectionImageUpload(section.id)}
                      disabled={isUploading}
                      className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      {isUploading && activeImageSectionId === section.id ? (
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      ) : (
                        <ImageIcon className="w-4 h-4" />
                      )}
                      <span>{isUploading && activeImageSectionId === section.id ? 'Uploading...' : 'Release to Upload'}</span>
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={section.caption || ''}
                  onChange={(e) => {
                     const newCaption = e.target.value;
                     setFormData({
                      ...formData,
                      sections: formData.sections.map((s) =>
                        s.id === section.id ? { ...s, caption: newCaption } : s
                      ),
                    });
                  }}
                  className="mt-2 w-full bg-transparent text-sm text-center text-gray-500 focus:outline-none border-b border-transparent focus:border-white/10 pb-1"
                  placeholder="Add a caption..."
                />
              </div>
            )}
          </motion.div>
        ))}

        {/* Add Section Controls */}
        <div className="flex justify-center pt-12 pb-24">
          <div className="flex items-center space-x-4 bg-white/5 p-2 rounded-full border border-white/10 backdrop-blur-sm">
            <button
              onClick={() => addSection('text')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              <Type className="w-4 h-4" />
              <span>Text</span>
            </button>
            <div className="w-px h-4 bg-white/10" />
            <button
              onClick={() => addSection('image')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Image</span>
            </button>
            <div className="w-px h-4 bg-white/10" />
            <button
              onClick={() => addSection('quote')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              <Quote className="w-4 h-4" />
              <span>Quote</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
