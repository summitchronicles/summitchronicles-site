'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../../components/organisms/Header';
import { ArrowLeft, Save, Eye, Upload, X, Bold, Italic, Underline, List, Link2, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';

interface Section {
  title: string;
  content: string;
  image?: string;
  pullQuote?: string;
}

interface BlogPost {
  title: string;
  subtitle: string;
  heroImage: string;
  location: string;
  sections: Section[];
}

export default function EditBlogPost({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [location, setLocation] = useState('');
  const [sections, setSections] = useState<Section[]>([]);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // Load blog post content
  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await fetch(`/api/edit/${params.slug}`);
        const data = await response.json();

        if (data.success) {
          setTitle(data.post.title || '');
          setSubtitle(data.post.subtitle || '');
          setHeroImage(data.post.heroImage || '');
          setLocation(data.post.location || 'Training Grounds, California');
          setSections(data.post.sections || []);
          setAvailableImages(data.availableImages || []);
        }
      } catch (error) {
        console.error('Error loading post:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [params.slug]);

  const addSection = () => {
    setSections([...sections, { title: '', content: '', image: '', pullQuote: '' }]);
  };

  const updateSection = (index: number, field: keyof Section, value: string) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    setSections(updated);
  };

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('slug', params.slug);

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setAvailableImages([...availableImages, data.filename]);
        return data.filename;
      } else {
        alert('Error uploading image: ' + data.error);
        return null;
      }
    } catch (error) {
      alert('Error uploading image');
      return null;
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, sectionIndex?: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploading(true);
    const filename = await uploadImage(file);
    setUploading(false);

    if (filename) {
      if (sectionIndex !== undefined) {
        updateSection(sectionIndex, 'image', filename);
      } else {
        setHeroImage(filename);
      }
    }

    // Reset input
    event.target.value = '';
  };

  const formatText = (textarea: HTMLTextAreaElement, format: string) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      default:
        formattedText = selectedText;
    }

    const newValue = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    return newValue;
  };

  const savePost = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/edit/${params.slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle,
          heroImage,
          location,
          sections
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('Post saved successfully!');
      } else {
        alert('Error saving post: ' + data.error);
      }
    } catch (error) {
      alert('Error saving post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-spa-stone flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-alpine-blue border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-spa-charcoal">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spa-stone">
      <Header />

      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/blog" className="flex items-center space-x-2 text-spa-charcoal hover:text-alpine-blue">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Stories</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link
                href={`/blog/${params.slug}`}
                className="flex items-center space-x-2 px-4 py-2 border border-spa-charcoal text-spa-charcoal hover:bg-spa-charcoal hover:text-white transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </Link>

              <button
                onClick={savePost}
                disabled={saving || uploading}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 font-semibold"
              >
                <Save className="w-5 h-5" />
                <span>{saving ? 'Saving...' : uploading ? 'Uploading...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-spa-charcoal mb-2">Blog Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 focus:border-alpine-blue focus:ring-1 focus:ring-alpine-blue text-lg"
              placeholder="Enter blog title..."
            />
          </div>

          {/* Subtitle */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-spa-charcoal mb-2">Subtitle</label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 focus:border-alpine-blue focus:ring-1 focus:ring-alpine-blue"
              placeholder="Enter subtitle..."
            />
          </div>

          {/* Location */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-spa-charcoal mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 focus:border-alpine-blue focus:ring-1 focus:ring-alpine-blue"
              placeholder="Training Grounds, California"
            />
          </div>

          {/* Hero Image */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-spa-charcoal mb-2">Hero Image</label>
            <div className="flex space-x-4 mb-4">
              <select
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 focus:border-alpine-blue focus:ring-1 focus:ring-alpine-blue"
              >
                <option value="">Select hero image...</option>
                {availableImages.map(image => (
                  <option key={image} value={image}>{image}</option>
                ))}
              </select>

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                <button
                  disabled={uploading}
                  className="flex items-center space-x-2 px-4 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  <span>{uploading ? 'Uploading...' : 'Upload New'}</span>
                </button>
              </div>
            </div>
            {heroImage &&                <div className="mt-4">
                  <NextImage
                    src={`/content/posts/${params.slug}/images/${heroImage}`}
                    alt="Hero preview"
                    width={400}
                    height={200}
                    className="w-full max-w-md h-48 object-cover border rounded"
                    unoptimized
                  />
                </div>
            }
          </div>

          {/* Sections */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-spa-charcoal">Sections</h3>
              <button
                onClick={addSection}
                className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                Add Section
              </button>
            </div>

            {sections.map((section, index) => (
              <div key={index} className="border border-gray-300 p-6 mb-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-spa-charcoal">Section {index + 1}</h4>
                  <button
                    onClick={() => removeSection(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Section Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-spa-charcoal mb-2">Section Title</label>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateSection(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-alpine-blue focus:ring-1 focus:ring-alpine-blue"
                    placeholder="Enter section title..."
                  />
                </div>

                {/* Section Content */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-spa-charcoal mb-2">Content</label>

                  {/* Text Formatting Toolbar */}
                  <div className="flex items-center space-x-2 mb-2 p-2 bg-gray-50 border border-gray-300 rounded-t">
                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.getElementById(`content-${index}`) as HTMLTextAreaElement;
                        const newValue = formatText(textarea, 'bold');
                        updateSection(index, 'content', newValue);
                      }}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title="Bold"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.getElementById(`content-${index}`) as HTMLTextAreaElement;
                        const newValue = formatText(textarea, 'italic');
                        updateSection(index, 'content', newValue);
                      }}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title="Italic"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.getElementById(`content-${index}`) as HTMLTextAreaElement;
                        const newValue = formatText(textarea, 'underline');
                        updateSection(index, 'content', newValue);
                      }}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                      title="Underline"
                    >
                      <Underline className="w-4 h-4" />
                    </button>
                    <div className="h-4 w-px bg-gray-300"></div>
                    <span className="text-xs text-gray-500">Select text and click to format</span>
                  </div>

                  <textarea
                    id={`content-${index}`}
                    value={section.content}
                    onChange={(e) => updateSection(index, 'content', e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-alpine-blue focus:ring-1 focus:ring-alpine-blue rounded-b"
                    placeholder="Enter section content... Use **text** for bold, *text* for italic"
                  />
                </div>

                {/* Section Image */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-spa-charcoal mb-2">Section Image</label>
                  <div className="flex space-x-4 mb-2">
                    <select
                      value={section.image || ''}
                      onChange={(e) => updateSection(index, 'image', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 focus:border-alpine-blue focus:ring-1 focus:ring-alpine-blue"
                    >
                      <option value="">No image</option>
                      {availableImages.map(image => (
                        <option key={image} value={image}>{image}</option>
                      ))}
                    </select>

                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, index)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploading}
                      />
                      <button
                        disabled={uploading}
                        className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span>Upload</span>
                      </button>
                    </div>
                  </div>
                  {section.image && (
                    <div className="mt-2">
                      <NextImage
                        src={`/content/posts/${params.slug}/images/${section.image}`}
                        alt="Section preview"
                        width={300}
                        height={150}
                        className="w-full max-w-sm h-32 object-cover border rounded"
                        unoptimized
                      />
                    </div>
                  )}
                </div>

                {/* Pull Quote */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-spa-charcoal mb-2">Pull Quote (optional)</label>
                  <input
                    type="text"
                    value={section.pullQuote || ''}
                    onChange={(e) => updateSection(index, 'pullQuote', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:border-alpine-blue focus:ring-1 focus:ring-alpine-blue"
                    placeholder="Enter pull quote..."
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Sticky Save Button */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-6">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {uploading ? 'Uploading image...' : saving ? 'Saving changes...' : 'All changes saved locally'}
              </div>
              <div className="flex space-x-4">
                <Link
                  href={`/blog/${params.slug}`}
                  className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </Link>
                <button
                  onClick={savePost}
                  disabled={saving || uploading}
                  className="flex items-center space-x-2 px-8 py-3 bg-green-600 text-white hover:bg-green-700 transition-colors disabled:opacity-50 font-semibold text-lg shadow-lg"
                >
                  <Save className="w-5 h-5" />
                  <span>{saving ? 'Saving...' : uploading ? 'Uploading...' : 'Save Blog Post'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
