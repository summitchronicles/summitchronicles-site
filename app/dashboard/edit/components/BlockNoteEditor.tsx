'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { ArrowLeft, Save, Camera } from 'lucide-react';
import { BlockNoteEditor, PartialBlock } from '@blocknote/core';
import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import ImageCropper from './ImageCropper';

interface BlockNoteEditorProps {
  initialContent: string;
  filename: string;
  onSave: (newContent: string) => Promise<void>;
  onCancel: () => void;
}

// Parse frontmatter from markdown
function parseFrontmatter(markdown: string) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: {}, body: markdown };

  const frontmatterStr = match[1];
  const body = markdown.replace(/^---\n[\s\S]*?\n---\n?/, '');

  const frontmatter: Record<string, any> = {};
  const lines = frontmatterStr.split('\n');
  let currentKey = '';

  for (const line of lines) {
    if (line.startsWith('  - ')) {
      // Array item
      if (currentKey && Array.isArray(frontmatter[currentKey])) {
        frontmatter[currentKey].push(line.replace('  - ', '').trim());
      }
    } else if (line.includes(':')) {
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim();
      currentKey = key.trim();

      if (value === '') {
        frontmatter[currentKey] = [];
      } else {
        frontmatter[currentKey] = value.replace(/^['"]|['"]$/g, '');
      }
    }
  }

  return { frontmatter, body };
}

// Convert frontmatter object back to string
function stringifyFrontmatter(frontmatter: Record<string, any>) {
  let str = '---\n';
  for (const [key, value] of Object.entries(frontmatter)) {
    if (Array.isArray(value)) {
      str += `${key}:\n`;
      for (const item of value) {
        str += `  - ${item}\n`;
      }
    } else {
      // Quote strings that contain special characters
      const needsQuotes =
        typeof value === 'string' &&
        (value.includes(':') || value.includes('?') || value.includes('"'));
      str += `${key}: ${needsQuotes ? `"${value}"` : value}\n`;
    }
  }
  str += '---\n';
  return str;
}

export function NotionEditor({
  initialContent,
  filename,
  onSave,
  onCancel,
}: BlockNoteEditorProps) {
  const [saving, setSaving] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  // Parse initial markdown
  const { frontmatter: initialFrontmatter, body: initialBody } = useMemo(
    () => parseFrontmatter(initialContent),
    [initialContent]
  );

  const [frontmatter, setFrontmatter] = useState(initialFrontmatter);
  const heroImage = frontmatter.image || '/stories/default.jpg';
  const title = frontmatter.title || 'Untitled';
  const subtitle = frontmatter.description || frontmatter.subtitle || '';

  // Create BlockNote editor with custom upload
  const editor = useCreateBlockNote({
    uploadFile: async (file: File) => {
      const formData = new FormData();
      const timestamp = Date.now();
      const ext = file.name.split('.').pop() || 'jpg';
      formData.append('file', file, `upload-${timestamp}.${ext}`);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      return data.url || '';
    },
  });

  // Load initial content into editor
  useEffect(() => {
    const loadContent = async () => {
      if (initialBody.trim()) {
        try {
          const blocks = await editor.tryParseMarkdownToBlocks(initialBody);
          editor.replaceBlocks(editor.document, blocks);
        } catch (e) {
          console.error('Failed to parse markdown:', e);
        }
      }
    };
    loadContent();
  }, [editor, initialBody]);

  // Handle save
  const handleSave = async () => {
    setSaving(true);
    try {
      const markdownBody = await editor.blocksToMarkdownLossy(editor.document);
      const fullMarkdown =
        stringifyFrontmatter(frontmatter) + '\n' + markdownBody;
      await onSave(fullMarkdown);
    } catch (e) {
      console.error('Save failed:', e);
      alert('Save failed');
    }
    setSaving(false);
  };

  // Handle hero image selection
  const handleHeroImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setOriginalFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFile(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  // Handle crop complete
  const handleCropComplete = async (croppedBlob: Blob) => {
    const formData = new FormData();
    const timestamp = Date.now();
    formData.append('file', croppedBlob, `hero-${timestamp}.jpg`);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setFrontmatter((prev) => ({ ...prev, image: data.url }));
      }
    } catch (e) {
      console.error('Upload failed:', e);
    }
    setShowCropper(false);
    setSelectedFile(null);
    setOriginalFile(null);
  };

  // Handle skip crop (upload original)
  const handleSkipCrop = async () => {
    if (originalFile) {
      const formData = new FormData();
      const timestamp = Date.now();
      const ext = originalFile.name.split('.').pop() || 'jpg';
      formData.append('file', originalFile, `hero-${timestamp}.${ext}`);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.url) {
          setFrontmatter((prev) => ({ ...prev, image: data.url }));
        }
      } catch (e) {
        console.error('Upload failed:', e);
      }
    }
    setShowCropper(false);
    setSelectedFile(null);
    setOriginalFile(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onCancel}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-summit-gold text-black font-bold rounded-lg hover:brightness-110 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[50vh] mt-16">
        <Image
          src={heroImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Change Cover Button */}
        <label className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-sm border border-white/20 rounded-lg cursor-pointer hover:bg-black/80 transition-colors">
          <Camera className="w-4 h-4" />
          <span className="text-sm">Change Cover</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleHeroImageSelect}
          />
        </label>

        {/* Title */}
        <div className="absolute bottom-8 left-0 right-0 px-6">
          <div className="max-w-4xl mx-auto">
            <input
              type="text"
              value={title}
              onChange={(e) =>
                setFrontmatter((prev) => ({ ...prev, title: e.target.value }))
              }
              className="text-4xl md:text-5xl font-bold text-white bg-transparent border-none outline-none w-full placeholder-gray-500"
              placeholder="Untitled"
            />
            <input
              type="text"
              value={subtitle}
              onChange={(e) =>
                setFrontmatter((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="mt-4 text-xl text-gray-400 bg-transparent border-none outline-none w-full placeholder-gray-600"
              placeholder="Add a subtitle..."
            />
          </div>
        </div>
      </div>

      {/* BlockNote Editor */}
      <div className="max-w-4xl mx-auto px-6 py-12 pb-32">
        <div className="prose prose-invert prose-lg max-w-none blocknote-dark">
          <BlockNoteView editor={editor} theme="dark" />
        </div>
      </div>

      {/* Image Cropper Modal */}
      {showCropper && selectedFile && (
        <ImageCropper
          imageSrc={selectedFile}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setShowCropper(false);
            setSelectedFile(null);
            setOriginalFile(null);
          }}
          onSkip={handleSkipCrop}
        />
      )}

      {/* Custom Styles for BlockNote */}
      <style jsx global>{`
        /* Red Bull style quote */
        /* Target the specific BlockNote quote container wrapper */
        .blocknote-dark .bn-block-content[data-content-type='quote'] {
          position: relative !important;
          padding-left: 4.5rem !important; /* Make space for the large quote */
          margin: 3rem 0 !important;
        }

        /* The actual blockquote element inside - remove default styling */
        .blocknote-dark
          .bn-block-content[data-content-type='quote']
          blockquote {
          border-left: none !important;
          padding: 0 !important;
          margin: 0 !important;
          font-family: 'Inter', sans-serif !important;
          font-size: 1.85rem !important; /* Larger text */
          font-weight: 800 !important; /* Extra bold */
          font-style: italic !important;
          line-height: 1.2 !important;
          color: #ffffff !important;
          opacity: 1 !important;
        }

        /* Large gold decorative quote mark attached to the wrapper */
        .blocknote-dark .bn-block-content[data-content-type='quote']::before {
          content: '“';
          position: absolute;
          left: 0rem;
          top: -1.5rem;
          font-size: 8rem;
          font-family: 'Times New Roman', serif;
          color: #d4af37; /* Summit Gold */
          line-height: 1;
          opacity: 1;
        }

        /* Hide any default before/after pseudo elements on the inner blockquote to prevent double icons */
        .blocknote-dark
          .bn-block-content[data-content-type='quote']
          blockquote::before,
        .blocknote-dark
          .bn-block-content[data-content-type='quote']
          blockquote::after {
          display: none !important;
          content: '' !important;
        }

        .blocknote-dark {
          --bn-colors-editor-background: transparent;
          --bn-colors-editor-text: #e5e5e5;
        }

        /* Force transparent background on all editor layers */
        .blocknote-dark .bn-editor,
        .blocknote-dark .mantine-Paper-root,
        .blocknote-dark .bn-block-outer {
          background: transparent !important;
          background-color: transparent !important;
          font-family: inherit;
        }
      `}</style>
    </div>
  );
}

export default NotionEditor;
