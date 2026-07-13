'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  Trash2,
  Image as ImageIcon,
  ArrowLeft,
  Type,
  Quote,
  AlertTriangle,
  Check,
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
  contentType: 'expedition-update' | 'training-log' | 'field-note' | 'essay';
  category: string;
  author: string;
  heroImage: string;
  heroImageId?: string; // Sanity Asset ID
  sections: BlogSection[];
}

const STORY_DRAFT_KEY = 'summit-chronicles:story-draft:v1';

export default function LiveCinematicEditor() {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [draftStatus, setDraftStatus] = useState<
    'restored' | 'saving' | 'saved'
  >('saved');
  const [publishMessage, setPublishMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const draftReadyRef = useRef(false);

  // Refs for file inputs
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const sectionImageInputRef = useRef<HTMLInputElement>(null);
  const [activeImageSectionId, setActiveImageSectionId] = useState<
    string | null
  >(null);

  const [formData, setFormData] = useState<BlogPostForm>({
    title: 'The Unwritten Summit',
    subtitle: 'Click here to add your compelling subtitle...',
    contentType: 'field-note',
    category: 'Mental Preparation',
    author: 'Sunith Kumar',
    heroImage: '',
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

  useEffect(() => {
    try {
      const savedDraft = window.localStorage.getItem(STORY_DRAFT_KEY);
      if (savedDraft) {
        const parsedDraft = JSON.parse(savedDraft) as Partial<BlogPostForm>;
        setFormData((current) => ({
          ...current,
          ...parsedDraft,
          contentType: parsedDraft.contentType || 'field-note',
        }));
        setDraftStatus('restored');
      }
    } catch (error) {
      console.error('Unable to restore story draft:', error);
    } finally {
      draftReadyRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!draftReadyRef.current) return;
    setDraftStatus('saving');
    const saveTimer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(STORY_DRAFT_KEY, JSON.stringify(formData));
        setDraftStatus('saved');
      } catch (error) {
        console.error('Unable to autosave story draft:', error);
      }
    }, 650);

    return () => window.clearTimeout(saveTimer);
  }, [formData]);

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
      image:
        type === 'image' ? '/images/sunith-visionary-planning.png' : undefined,
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
  const handleImageUpload = async (
    file: File,
    isHero: boolean,
    sectionId?: string
  ) => {
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
          setFormData((prev) => ({
            ...prev,
            heroImage: result.asset.url,
            heroImageId: result.asset._id,
          }));
        } else if (sectionId) {
          setFormData((prev) => ({
            ...prev,
            sections: prev.sections.map((s) =>
              s.id === sectionId
                ? { ...s, image: result.asset.url, imageId: result.asset._id }
                : s
            ),
          }));
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Failed to upload image. Please try again.');
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
    const errors = validateStory(formData);
    setValidationErrors(errors);
    setPublishMessage(null);
    if (errors.length) return;

    setIsPublishing(true);
    try {
      const result = await publishPost(formData);
      if (result.success) {
        window.localStorage.removeItem(STORY_DRAFT_KEY);
        setPublishMessage('Story published successfully.');
        window.setTimeout(() => router.push(`/blog/${result.slug}`), 900);
      } else {
        setPublishMessage(`Publishing failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Publish error:', error);
      setPublishMessage(
        'Publishing failed unexpectedly. Your draft is still saved.'
      );
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
      <div className="fixed left-4 right-4 top-4 z-50 flex items-center justify-between gap-3 rounded-md border border-white/10 bg-black/90 p-2 shadow-2xl backdrop-blur-xl sm:left-auto sm:right-6 sm:top-6 sm:w-auto">
        <Link
          href="/blog"
          className="p-2 text-gray-400 hover:text-white transition-colors"
          title="Back to Stories"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="hidden h-6 w-px bg-white/10 sm:block" />
        <div
          className="hidden min-w-28 items-center gap-2 px-2 text-xs font-mono uppercase text-zinc-500 sm:flex"
          aria-live="polite"
        >
          {draftStatus === 'saving' ? (
            <Save className="h-3.5 w-3.5" />
          ) : (
            <Check className="h-3.5 w-3.5" />
          )}
          {draftStatus === 'restored'
            ? 'Draft restored'
            : draftStatus === 'saving'
              ? 'Saving draft'
              : 'Draft saved'}
        </div>
        <button
          onClick={handlePublish}
          disabled={isPublishing || isUploading}
          className="flex min-h-10 items-center space-x-2 rounded-md bg-summit-gold px-4 py-2 text-sm font-bold text-black shadow-lg shadow-summit-gold/20 transition-all hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
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

      {(validationErrors.length > 0 || publishMessage || uploadError) && (
        <div
          className="fixed left-4 right-4 top-20 z-40 mx-auto max-w-2xl border border-amber-400/30 bg-black/95 p-4 text-sm text-zinc-200 shadow-2xl backdrop-blur-xl sm:top-24"
          role="status"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              {validationErrors.map((message) => (
                <p key={message}>{message}</p>
              ))}
              {publishMessage ? <p>{publishMessage}</p> : null}
              {uploadError ? <p>{uploadError}</p> : null}
            </div>
          </div>
        </div>
      )}

      {/* Hero Section (Live Edit) */}
      <div className="relative h-screen w-full flex items-end">
        {/* Hero Background */}
        <div className="absolute inset-0 z-0">
          {formData.heroImage ? (
            <>
              <Image
                src={formData.heroImage}
                alt="Hero Background"
                fill
                className="object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              {/* Change image overlay (shown on hover) */}
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
                  <span>
                    {isUploading ? 'Uploading...' : 'Change Cover Image'}
                  </span>
                </button>
              </div>
            </>
          ) : (
            /* No image yet — show upload CTA */
            <div className="absolute inset-0 bg-zinc-950 flex flex-col items-center justify-center gap-4 border-b border-white/5">
              <button
                onClick={triggerHeroImageUpload}
                disabled={isUploading}
                className="flex flex-col items-center gap-3 text-zinc-500 hover:text-white transition-colors group"
              >
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-zinc-700 group-hover:border-summit-gold flex items-center justify-center transition-colors">
                  {isUploading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ImageIcon className="w-7 h-7" />
                  )}
                </div>
                <span className="text-sm font-mono uppercase tracking-widest">
                  {isUploading ? 'Uploading...' : 'Add Cover Image'}
                </span>
              </button>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none" />
            </div>
          )}
        </div>

        {/* Hero Content Editable */}
        <div className="relative z-10 w-full max-w-4xl mx-auto px-8 pb-24 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="entry-type" className="sr-only">
              Entry type
            </label>
            <select
              id="entry-type"
              value={formData.contentType}
              onChange={(event) =>
                handleInputChange('contentType', event.target.value)
              }
              className="min-h-10 rounded-md border border-white/20 bg-black/70 px-4 py-2 text-xs font-mono uppercase text-white focus:border-summit-gold focus:outline-none"
            >
              <option value="expedition-update">Expedition update</option>
              <option value="training-log">Training log</option>
              <option value="field-note">Field note</option>
              <option value="essay">Essay</option>
            </select>
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
                    src={
                      section.image || '/images/sunith-visionary-planning.png'
                    }
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
                      <span>
                        {isUploading && activeImageSectionId === section.id
                          ? 'Uploading...'
                          : 'Choose image'}
                      </span>
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

function validateStory(formData: BlogPostForm) {
  const errors: string[] = [];
  if (formData.title.trim().length < 6) {
    errors.push('Add a descriptive title with at least 6 characters.');
  }
  if (formData.subtitle.trim().length < 12) {
    errors.push(
      'Add a subtitle that gives readers a clear reason to continue.'
    );
  }
  if (!formData.category.trim()) {
    errors.push('Choose a story category.');
  }
  if (!formData.contentType) {
    errors.push('Choose an entry type.');
  }
  if (!formData.author.trim()) {
    errors.push('Add the author name.');
  }
  if (!formData.heroImage) {
    errors.push('Add a cover image before publishing.');
  }
  const writtenContent = formData.sections
    .filter((section) => section.type !== 'image')
    .map((section) => section.content.trim())
    .join(' ');
  if (writtenContent.length < 300) {
    errors.push('Write at least 300 characters before publishing.');
  }
  return errors;
}
