'use client';

import { useState } from 'react';
import { RedBullBlogPost } from '@/app/components/blog/RedBullBlogPost/RedBullBlogPost';
import { parseMarkdownToRedBull } from '@/lib/markdown-utils';
import ImageCropper from './ImageCropper';

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
  const [markdown, setMarkdown] = useState(initialContent);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeImageKey, setActiveImageKey] = useState<string | null>(null);
  const [activeImageSrc, setActiveImageSrc] = useState<string>('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [showCropper, setShowCropper] = useState(false);
  const [selectedFileForCrop, setSelectedFileForCrop] = useState<string | null>(
    null
  );
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setOriginalFile(file);
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setSelectedFileForCrop(reader.result?.toString() || null);
        setShowCropper(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const uploadFile = async (file: Blob | File) => {
    const formData = new FormData();
    formData.append('file', file, (file as File).name || 'image.jpg');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setNewImageUrl(data.url);
        setShowCropper(false);
        setSelectedFileForCrop(null);
        setOriginalFile(null);
      } else {
        alert('Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload error');
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    await uploadFile(croppedBlob);
  };

  const handleSkipCrop = async () => {
    if (originalFile) {
      await uploadFile(originalFile);
    }
  };

  // Derived state: Parse markdown to component data
  const parsedData = parseMarkdownToRedBull(markdown, filename);

  // Construct component data object (mocking frontmatter for now or using reliable defaults)
  // Ideally we should parse frontmatter here too, but for image replacement, the body is key.
  // Construct component data object
  const componentData = {
    title:
      parsedData.metadata?.title ||
      filename.replace(/-/g, ' ').replace('.md', ''),
    subtitle:
      parsedData.metadata?.description || parsedData.metadata?.subtitle || '',
    author: parsedData.metadata?.author || 'Summit Explorer',
    date: parsedData.metadata?.date || new Date().toISOString(),
    readTime: '5 min', // could calculate
    category: (parsedData.metadata?.tags?.[0] || 'Story').toUpperCase(),
    location: parsedData.metadata?.location || 'Himalayas',
    // Use frontmatter image if available, else fallback to first body image
    mainImage:
      parsedData.metadata?.image ||
      parsedData.introImage ||
      '/stories/default.jpg',
    views: '0',
    tags: parsedData.metadata?.tags || [],
    content: {
      intro: parsedData.intro,
      sections: parsedData.sections,
    },
  };

  const handleImageClick = (key: string, currentSrc: string) => {
    setActiveImageKey(key);
    setActiveImageSrc(currentSrc);
    setNewImageUrl(currentSrc);
    setModalOpen(true);
  };

  const applyImageChange = () => {
    if (!activeImageKey || !newImageUrl) return;

    let newMarkdown = markdown;

    if (activeImageKey === 'hero') {
      // Determine if the current hero is from frontmatter or body
      if (parsedData.metadata?.image) {
        // Replace in Frontmatter
        // Regex: (image:\s*)(oldUrl)
        // We need to be careful to match the specific line
        const regex = new RegExp(
          `(image:\\s*)(${escapeRegExp(activeImageSrc)})`
        );
        if (regex.test(newMarkdown)) {
          newMarkdown = newMarkdown.replace(regex, `$1${newImageUrl}`);
        } else {
          // Fallback: If regex fails (maybe formatting diff), try simple replace in the first 20 lines
          // Or just replace the string if it's unique enough?
          // Safer to target "image: value"
          const fallbackRegex = /image: .*/;
          newMarkdown = newMarkdown.replace(
            fallbackRegex,
            `image: ${newImageUrl}`
          );
        }
      } else {
        // Fallback to body replacement if no frontmatter image existed
        newMarkdown = newMarkdown.replace(activeImageSrc, newImageUrl);
      }
    } else if (activeImageKey.startsWith('section-')) {
      newMarkdown = newMarkdown.replace(activeImageSrc, newImageUrl);
    }

    setMarkdown(newMarkdown);
    setModalOpen(false);
  };

  function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  const handleTitleChange = (newTitle: string) => {
    // Update Frontmatter Title
    const regex = /^title:.*$/m;
    if (regex.test(markdown)) {
      setMarkdown(markdown.replace(regex, `title: ${newTitle}`));
    }
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    // Update Frontmatter Description/Subtitle
    const regex = /^description:.*$/m;
    if (regex.test(markdown)) {
      setMarkdown(markdown.replace(regex, `description: ${newSubtitle}`));
    } else {
      // checks for subtitle key logic if description is missing
      const subRegex = /^subtitle:.*$/m;
      if (subRegex.test(markdown)) {
        setMarkdown(markdown.replace(subRegex, `subtitle: ${newSubtitle}`));
      }
    }
  };

  const handleIntroChange = (newIntro: string) => {
    // Reconstruct Markdown replacing the intro.
    // This is approximate but safer than regex on large blocks.
    // We assume intro is everything before the first '##' and after frontmatter.

    const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---/);
    const frontmatter = frontmatterMatch ? frontmatterMatch[0] : '';
    const body = markdown.replace(/^---\n[\s\S]*?\n---/, '');

    const parts = body.split(/^## /m);
    // parts[0] is intro. rest are sections
    const oldIntro = parts[0];

    // Preserve images in intro if any (we don't show them in intro text edit)
    // This is a known limitation: editing detailed text might strip unrendered markdown if we just swap.
    // However, newIntro is plain text from contentEditable.
    // Ideally we just replace the *text* part of the intro.

    let newMarkdown = frontmatter + '\n\n' + newIntro + '\n\n';

    // Append rest
    if (parts.length > 1) {
      for (let i = 1; i < parts.length; i++) {
        newMarkdown += '## ' + parts[i];
      }
    }

    setMarkdown(newMarkdown);
  };

  const handleSectionChange = (
    index: number,
    field: 'title' | 'content',
    newValue: string
  ) => {
    // We need to locate the specific section in the markdown string.
    const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---/);
    const frontmatter = frontmatterMatch ? frontmatterMatch[0] : '';
    const body = markdown.replace(/^---\n[\s\S]*?\n---/, '');

    // Split by Headers
    // Note: This split consumes the delimiter '## '. We need to re-add it.
    const parts = body.split(/^## /m);
    // parts[0] is Intro.
    // parts[1] is Section 0 (index 0).
    // parts[k] is Section k-1.

    const sectionPartIndex = index + 1;

    if (sectionPartIndex < parts.length) {
      const sectionContent = parts[sectionPartIndex];
      const lines = sectionContent.split('\n');
      const oldTitle = lines[0].trim(); // The first line is the title (since we split on '## ')
      const oldContent = lines.slice(1).join('\n').trim(); // The rest is content

      let newSectionPart = '';
      if (field === 'title') {
        newSectionPart = newValue + '\n\n' + oldContent;
      } else {
        newSectionPart = oldTitle + '\n\n' + newValue;
      }

      parts[sectionPartIndex] = newSectionPart + '\n\n'; // Add trailing newline for spacing

      // Reassemble
      let newMarkdown = frontmatter + (frontmatter ? '\n' : ''); // Ensure newline after frontmatter

      newMarkdown += parts[0]; // Intro

      for (let i = 1; i < parts.length; i++) {
        newMarkdown += '## ' + parts[i];
      }

      setMarkdown(newMarkdown);
    }
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
          onClick={() => onSave(markdown)}
          className="px-4 py-2 bg-blue-600 rounded text-white shadow font-bold"
        >
          Save Changes
        </button>
      </div>

      <RedBullBlogPost
        slug={filename}
        post={componentData}
        isEditable={true}
        onImageClick={handleImageClick}
        onTitleChange={handleTitleChange}
        onSubtitleChange={handleSubtitleChange}
        onSectionChange={handleSectionChange}
        onIntroChange={handleIntroChange}
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
                onChange={handleImageSelect}
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

      {/* Cropper Modal */}
      {showCropper && selectedFileForCrop && (
        <ImageCropper
          imageSrc={selectedFileForCrop}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setShowCropper(false);
            setSelectedFileForCrop(null);
            setOriginalFile(null);
          }}
          onSkip={handleSkipCrop}
        />
      )}
    </div>
  );
}
