'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Camera, Type, Quote, Save, ArrowLeft, Trash2 } from 'lucide-react';
import { parseMarkdownToRedBull } from '@/lib/markdown-utils';
import ImageCropper from './ImageCropper';

interface CleanVisualEditorProps {
  initialContent: string;
  filename: string;
  onSave: (newContent: string) => Promise<void>;
  onCancel: () => void;
}

export function CleanVisualEditor({
  initialContent,
  filename,
  onSave,
  onCancel,
}: CleanVisualEditorProps) {
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
  const [focusedBlock, setFocusedBlock] = useState<'intro' | number | null>(
    null
  );

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

  const uploadFile = async (file: Blob | File): Promise<string | null> => {
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
        return data.url;
      } else {
        alert('Upload failed');
        return null;
      }
    } catch (err) {
      console.error(err);
      alert('Upload error');
      return null;
    }
  };

  const insertContentAtFocus = (newContent: string) => {
    setMarkdown((prevMarkdown) => {
      const frontmatterMatch = prevMarkdown.match(/^---\n([\s\S]*?)\n---/);
      const frontmatter = frontmatterMatch ? frontmatterMatch[0] : '';
      const body = prevMarkdown.replace(/^---\n[\s\S]*?\n---/, '');

      const parts = body.split(/^## /m);
      const newMarkdownParts = [...parts];

      let targetPartIndex = 0;
      if (focusedBlock === 'intro') targetPartIndex = 0;
      else if (typeof focusedBlock === 'number')
        targetPartIndex = focusedBlock + 1;
      else targetPartIndex = parts.length - 1;

      if (newContent.startsWith('## ')) {
        const contentWithoutHeader = newContent.replace(/^## /, '');
        newMarkdownParts.splice(targetPartIndex + 1, 0, contentWithoutHeader);
      } else {
        newMarkdownParts[targetPartIndex] =
          newMarkdownParts[targetPartIndex] + '\n\n' + newContent;
      }

      let newMarkdown = frontmatter + (frontmatter ? '\n' : '');
      newMarkdown += newMarkdownParts[0];
      for (let i = 1; i < newMarkdownParts.length; i++) {
        newMarkdown += '## ' + newMarkdownParts[i];
      }
      return newMarkdown;
    });
  };

  const deleteSection = (index: number) => {
    const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---/);
    const frontmatter = frontmatterMatch ? frontmatterMatch[0] : '';
    const body = markdown.replace(/^---\n[\s\S]*?\n---/, '');

    const parts = body.split(/^## /m);
    const sectionPartIndex = index + 1;

    if (sectionPartIndex < parts.length) {
      parts.splice(sectionPartIndex, 1);

      let newMarkdown = frontmatter + (frontmatter ? '\n' : '');
      newMarkdown += parts[0];
      for (let i = 1; i < parts.length; i++) {
        newMarkdown += '## ' + parts[i];
      }
      setMarkdown(newMarkdown);
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    const url = await uploadFile(croppedBlob);
    if (url && activeImageKey === 'APPEND') {
      insertContentAtFocus(`![New Image](${url})`);
      setActiveImageKey(null);
    }
  };

  const handleSkipCrop = async () => {
    if (originalFile) {
      const url = await uploadFile(originalFile);
      if (url && activeImageKey === 'APPEND') {
        insertContentAtFocus(`![New Image](${url})`);
        setActiveImageKey(null);
      }
    }
  };

  const handleImageClick = (key: string, currentSrc: string) => {
    setActiveImageKey(key);
    setActiveImageSrc(currentSrc);
    setNewImageUrl(currentSrc);
    setModalOpen(true);
  };

  function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  const applyImageChange = () => {
    if (!activeImageKey || !newImageUrl) return;

    let newMarkdown = markdown;

    if (activeImageKey === 'hero') {
      const regex = new RegExp(`(image:\\s*)(${escapeRegExp(activeImageSrc)})`);
      if (regex.test(newMarkdown)) {
        newMarkdown = newMarkdown.replace(regex, `$1${newImageUrl}`);
      } else {
        const fallbackRegex = /image: .*/;
        newMarkdown = newMarkdown.replace(
          fallbackRegex,
          `image: ${newImageUrl}`
        );
      }
    } else if (activeImageKey.startsWith('section-')) {
      newMarkdown = newMarkdown.replace(activeImageSrc, newImageUrl);
    }

    setMarkdown(newMarkdown);
    setModalOpen(false);
  };

  const handleTitleChange = (newTitle: string) => {
    const regex = /^title:.*$/m;
    if (regex.test(markdown)) {
      setMarkdown(markdown.replace(regex, `title: ${newTitle}`));
    }
  };

  const handleSubtitleChange = (newSubtitle: string) => {
    const regex = /^description:.*$/m;
    if (regex.test(markdown)) {
      setMarkdown(markdown.replace(regex, `description: ${newSubtitle}`));
    } else {
      const regexSub = /^subtitle:.*$/m;
      if (regexSub.test(markdown)) {
        setMarkdown(markdown.replace(regexSub, `subtitle: ${newSubtitle}`));
      }
    }
  };

  const handleIntroChange = (newIntroHTML: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = newIntroHTML;
    const newIntro = tempDiv.textContent || tempDiv.innerText || '';

    const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---/);
    const frontmatter = frontmatterMatch ? frontmatterMatch[0] : '';
    const body = markdown.replace(/^---\n[\s\S]*?\n---/, '');

    const parts = body.split(/^## /m);

    let newMarkdown = frontmatter + '\n\n' + newIntro + '\n\n';
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
    newValueHTML: string
  ) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = newValueHTML;
    const newValue = tempDiv.textContent || tempDiv.innerText || '';

    const frontmatterMatch = markdown.match(/^---\n([\s\S]*?)\n---/);
    const frontmatter = frontmatterMatch ? frontmatterMatch[0] : '';
    const body = markdown.replace(/^---\n[\s\S]*?\n---/, '');

    const parts = body.split(/^## /m);
    const sectionPartIndex = index + 1;

    if (sectionPartIndex < parts.length) {
      const sectionContent = parts[sectionPartIndex];
      const lines = sectionContent.split('\n');
      const oldTitle = lines[0].trim();
      const oldContent = lines.slice(1).join('\n').trim();

      let newSectionPart = '';
      if (field === 'title') {
        newSectionPart = newValue + '\n\n' + oldContent;
      } else {
        newSectionPart = oldTitle + '\n\n' + newValue;
      }
      parts[sectionPartIndex] = newSectionPart + '\n\n';

      let newMarkdown = frontmatter + (frontmatter ? '\n' : '');
      newMarkdown += parts[0];
      for (let i = 1; i < parts.length; i++) {
        newMarkdown += '## ' + parts[i];
      }
      setMarkdown(newMarkdown);
    }
  };

  const handleAddText = () => {
    insertContentAtFocus('## New Section\n\nStart typing content here...');
  };

  const handleAddQuote = () => {
    insertContentAtFocus('> "Start typing your quote here..."');
  };

  const handleImageUploadTrigger = () => {
    document.getElementById('global-image-upload')?.click();
  };

  const handleGlobalImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setOriginalFile(file);
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setSelectedFileForCrop(reader.result?.toString() || null);
        setShowCropper(true);
        setActiveImageKey('APPEND');
      });
      reader.readAsDataURL(file);
    }
  };

  const parsedData = parseMarkdownToRedBull(markdown, filename);
  const heroImage =
    parsedData.metadata?.image ||
    parsedData.introImage ||
    '/stories/default.jpg';
  const title = parsedData.metadata?.title || filename.replace(/-/g, ' ');
  const subtitle =
    parsedData.metadata?.description || parsedData.metadata?.subtitle || '';
  const date = parsedData.metadata?.date || new Date().toDateString();
  const author = parsedData.metadata?.author || 'Summit Explorer';
  const category = (parsedData.metadata?.tags?.[0] || 'Story').toUpperCase();

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-summit-gold/30">
      <div className="fixed top-0 left-0 right-0 p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="pointer-events-auto">
          <button
            onClick={onCancel}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>
        </div>
        <div className="flex items-center gap-4 pointer-events-auto">
          <button className="flex items-center text-gray-400 hover:text-white px-4 py-2 rounded-full border border-white/10 bg-black/50 backdrop-blur-md">
            <span className="mr-2">Preview</span>
          </button>
          <button
            onClick={() => onSave(markdown)}
            className="bg-summit-gold text-black px-6 py-2 rounded-full font-bold hover:bg-yellow-400 transition-colors flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Publish
          </button>
        </div>
      </div>

      <div className="relative h-[80vh] w-full group">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="Hero"
            fill
            className="object-cover opacity-60 group-hover:opacity-50 transition-opacity"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
          <button
            onClick={() => handleImageClick('hero', heroImage)}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 border border-white/20 px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 hover:bg-summit-gold hover:text-black hover:border-transparent"
          >
            <Camera className="w-4 h-4" /> Change Cover
          </button>
        </div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 z-10">
          <div className="max-w-4xl w-full">
            <div className="text-summit-gold text-sm tracking-widest uppercase mb-4 font-mono">
              {category}
            </div>
            <h1
              className="text-5xl md:text-7xl font-bold mb-6 text-white outline-none placeholder-gray-600 focus:border-b border-summit-gold/50"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleTitleChange(e.currentTarget.textContent || '')
              }
            >
              {title}
            </h1>
            <p
              className="text-xl md:text-2xl text-gray-300 font-light italic outline-none placeholder-gray-600 focus:border-b border-summit-gold/50 max-w-2xl mx-auto"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleSubtitleChange(e.currentTarget.textContent || '')
              }
            >
              {subtitle || 'Click to add subtitle...'}
            </p>
            <div className="mt-8 flex items-center justify-center text-gray-400 text-sm font-mono">
              <span className="mr-4">{author}</span>
              <span>{date}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-20 pb-40">
        <div className="text-center text-gray-500 mb-12 italic text-sm">
          Click on any text block to select it, then use the toolbar below to
          add content after it. Press Enter for new lines.
        </div>

        {parsedData.intro && (
          <div
            className={`prose prose-xl prose-invert max-w-none mb-16 font-serif leading-relaxed outline-none rounded p-2 transition-all ${focusedBlock === 'intro' ? 'ring-2 ring-summit-gold/50 bg-white/5' : 'hover:bg-white/5'}`}
            contentEditable
            onFocus={() => setFocusedBlock('intro')}
            onBlur={(e) => handleIntroChange(e.currentTarget.innerHTML || '')}
            dangerouslySetInnerHTML={{
              __html: parsedData.intro.replace(/\n/g, '<br>'),
            }}
          />
        )}

        <div className="space-y-16">
          {parsedData.sections.map((section: any, index: number) => (
            <div key={index} className="group relative">
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-3xl font-bold text-white outline-none focus:text-summit-gold flex-1"
                  contentEditable
                  onFocus={() => setFocusedBlock(index)}
                  onBlur={(e) =>
                    handleSectionChange(
                      index,
                      'title',
                      e.currentTarget.innerHTML || ''
                    )
                  }
                  dangerouslySetInnerHTML={{ __html: section.title }}
                />
                <button
                  onClick={() => deleteSection(index)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity ml-4 p-2 bg-red-500/20 hover:bg-red-500 rounded-full text-red-400 hover:text-white"
                  title="Delete section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {section.image && (
                <div className="relative my-8 rounded-lg overflow-hidden border border-white/10">
                  <Image
                    src={section.image}
                    alt={section.title}
                    width={800}
                    height={400}
                    className="w-full object-cover"
                    unoptimized
                  />
                  <button
                    onClick={() =>
                      handleImageClick(`section-${index}`, section.image!)
                    }
                    className="absolute top-4 right-4 bg-black/50 p-2 rounded-full hover:bg-summit-gold hover:text-black transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div
                className={`prose prose-lg prose-invert max-w-none text-gray-300 outline-none rounded p-2 transition-all ${focusedBlock === index ? 'ring-2 ring-summit-gold/50 bg-white/5' : 'hover:bg-white/5'}`}
                contentEditable
                onFocus={() => setFocusedBlock(index)}
                onBlur={(e) =>
                  handleSectionChange(
                    index,
                    'content',
                    e.currentTarget.innerHTML || ''
                  )
                }
                dangerouslySetInnerHTML={{
                  __html: section.content.replace(/\n/g, '<br>'),
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center gap-8 shadow-2xl z-50">
        <button
          className="flex flex-col items-center gap-1 group text-gray-400 hover:text-white transition-colors"
          onClick={handleAddText}
        >
          <Type className="w-5 h-5 group-hover:text-summit-gold transition-colors" />
          <span className="text-[10px] font-medium uppercase tracking-wider">
            Text
          </span>
        </button>
        <div className="w-px h-8 bg-white/10" />
        <button
          className="flex flex-col items-center gap-1 group text-gray-400 hover:text-white transition-colors"
          onClick={handleImageUploadTrigger}
        >
          <Camera className="w-5 h-5 group-hover:text-summit-gold transition-colors" />
          <span className="text-[10px] font-medium uppercase tracking-wider">
            Image
          </span>
          <input
            type="file"
            id="global-image-upload"
            className="hidden"
            accept="image/*"
            onChange={handleGlobalImageSelect}
          />
        </button>
        <div className="w-px h-8 bg-white/10" />
        <button
          className="flex flex-col items-center gap-1 group text-gray-400 hover:text-white transition-colors"
          onClick={handleAddQuote}
        >
          <Quote className="w-5 h-5 group-hover:text-summit-gold transition-colors" />
          <span className="text-[10px] font-medium uppercase tracking-wider">
            Quote
          </span>
        </button>
      </div>

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
              <label className="block text-xs uppercase text-summit-gold mb-1">
                Upload New Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-summit-gold focus:outline-none mb-4"
              />
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
