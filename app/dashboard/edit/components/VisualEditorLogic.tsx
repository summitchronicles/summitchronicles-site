'use client';

import { useState } from 'react';
import { RedBullBlogPost } from '@/app/components/blog/RedBullBlogPost/RedBullBlogPost';
import { parseMarkdownToRedBull } from '@/lib/markdown-utils';

export function VisualEditorLogic({
  initialContent,
  filename,
  onSave,
  onCancel,
}: {
  initialContent: string;
  filename: string;
  onSave: (newContent: string) => Promise<void>;
  onCancel: () => void;
}) {
  // Parse initial content once to set up state
  const initialParsed = parseMarkdownToRedBull(initialContent, filename);

  // State is now the structured data, NOT the raw markdown
  const [postData, setPostData] = useState({
    title: initialParsed.metadata.title || filename.replace('.md', ''),
    subtitle:
      initialParsed.metadata.subtitle ||
      initialParsed.metadata.description ||
      'Editing...',
    author: initialParsed.metadata.author || 'Summit Explorer',
    date: initialParsed.metadata.date || new Date().toISOString(),
    readTime: initialParsed.metadata.readTime || '5 min',
    category: initialParsed.metadata.category || 'Story',
    location: initialParsed.metadata.location || 'Editor',
    heroImage:
      initialParsed.metadata.heroImage ||
      initialParsed.introImage ||
      '',
    views: '0',
    tags: initialParsed.metadata.tags
      ? Array.isArray(initialParsed.metadata.tags)
        ? initialParsed.metadata.tags
        : initialParsed.metadata.tags.split(',').map((t: string) => t.trim())
      : ['Edit'],
    content: {
      intro: initialParsed.intro,
      sections: initialParsed.sections,
    },
  });

  // Keep original metadata to preserve fields we don't edit
  const [originalMetadata] = useState(initialParsed.metadata);

  const [modalOpen, setModalOpen] = useState(false);
  const [activeImageKey, setActiveImageKey] = useState<string | null>(null);
  const [activeImageSrc, setActiveImageSrc] = useState<string>('');
  const [newImageUrl, setNewImageUrl] = useState('');

  // -- Text Change Handlers --

  const handleTitleChange = (newVal: string) => {
    setPostData((prev) => ({ ...prev, title: newVal }));
  };

  const handleSubtitleChange = (newVal: string) => {
    setPostData((prev) => ({ ...prev, subtitle: newVal }));
  };

  const handleIntroChange = (newVal: string) => {
    setPostData((prev) => ({
      ...prev,
      content: { ...prev.content, intro: newVal },
    }));
  };

  const handleSectionChange = (
    index: number,
    field: 'title' | 'content',
    newVal: string
  ) => {
    setPostData((prev) => {
      const newSections = [...prev.content.sections];
      newSections[index] = { ...newSections[index], [field]: newVal };
      return {
        ...prev,
        content: { ...prev.content, sections: newSections },
      };
    });
  };

  // -- Image Logic --

  const handleImageClick = (key: string, currentSrc: string) => {
    setActiveImageKey(key);
    setActiveImageSrc(currentSrc);
    setNewImageUrl(currentSrc);
    setModalOpen(true);
  };

  const applyImageChange = () => {
    if (!activeImageKey || !newImageUrl) return;

    setPostData((prev) => {
      const newData = { ...prev };

      if (activeImageKey === 'hero') {
        newData.heroImage = newImageUrl;
      } else if (activeImageKey.startsWith('section-')) {
        const index = parseInt(activeImageKey.split('-')[1]);
        if (!isNaN(index) && newData.content.sections[index]) {
          newData.content.sections[index] = {
            ...newData.content.sections[index],
            image: newImageUrl,
          };
        }
      }
      return newData;
    });

    setModalOpen(false);
  };

  // -- Save Logic --
  const handleSaveClick = async () => {
    const { convertRedBullToMarkdown } = await import('@/lib/markdown-utils');
    const markdown = convertRedBullToMarkdown(postData, originalMetadata);
    await onSave(markdown);
  };

  return (
    <div className="relative">
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-800 rounded text-white shadow"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveClick}
          className="px-4 py-2 bg-blue-600 rounded text-white shadow font-bold"
        >
          Save Changes
        </button>
      </div>

      <RedBullBlogPost
        slug={filename}
        post={postData}
        isEditable={true}
        onImageClick={handleImageClick}
        onTitleChange={handleTitleChange}
        onSubtitleChange={handleSubtitleChange}
        onIntroChange={handleIntroChange}
        onSectionChange={handleSectionChange}
      />

      {/* Image Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 p-8 rounded-xl max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Replace Image</h3>
            <div className="mb-4">
              <label className="block text-xs uppercase text-gray-500 mb-1">
                Current URL
              </label>
              <div className="text-gray-400 text-sm truncate">
                {activeImageSrc}
              </div>
            </div>

            <div className="mb-6">
              {/* File Upload Option */}
              <label className="block text-xs uppercase text-summit-gold mb-1">
                Upload New Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const formData = new FormData();
                  formData.append('file', file);

                  try {
                    const res = await fetch('/api/upload', {
                      method: 'POST',
                      body: formData,
                    });
                    const data = await res.json();
                    if (data.url) {
                      setNewImageUrl(data.url);
                    } else {
                      alert('Upload failed');
                    }
                  } catch (err) {
                    console.error(err);
                    alert('Upload error');
                  }
                }}
                className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-summit-gold focus:outline-none mb-4"
              />

              {/* Manual URL Fallback */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-900 px-2 text-gray-500">
                    Or use URL
                  </span>
                </div>
              </div>

              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-summit-gold focus:outline-none mt-4"
                placeholder="https://... or /uploads/..."
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={applyImageChange}
                className="px-6 py-2 bg-summit-gold text-black font-bold rounded hover:brightness-110"
              >
                Update Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
