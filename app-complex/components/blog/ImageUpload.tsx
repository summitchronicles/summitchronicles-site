'use client';

import { useState, useRef } from 'react';
import { PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ImageUploadProps {
  onImageUploaded?: (imageUrl: string) => void;
  postId?: string;
  className?: string;
  showGallery?: boolean;
}

interface UploadedImage {
  id: string;
  url: string;
  filename: string;
  alt_text?: string;
  caption?: string;
}

export default function ImageUpload({
  onImageUploaded,
  postId,
  className = '',
  showGallery = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [gallery, setGallery] = useState<UploadedImage[]>([]);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.');
      return;
    }

    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (postId) formData.append('postId', postId);

      const response = await fetch('/api/blog/media/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      const newImage: UploadedImage = {
        id: result.media.id,
        url: result.media.url,
        filename: result.media.filename,
        alt_text: result.media.alt_text,
        caption: result.media.caption,
      };

      setUploadedImages((prev) => [...prev, newImage]);

      if (onImageUploaded) {
        onImageUploaded(newImage.url);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(
        `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setUploading(false);
    }
  };

  const loadGallery = async () => {
    try {
      const response = await fetch('/api/blog/media?limit=50');
      const result = await response.json();

      if (response.ok) {
        setGallery(result.media || []);
      }
    } catch (error) {
      console.error('Gallery load error:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleGalleryImageSelect = (image: UploadedImage) => {
    if (onImageUploaded) {
      onImageUploaded(image.url);
    }
    setShowGalleryModal(false);
  };

  const deleteImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/blog/media?id=${imageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
        setGallery((prev) => prev.filter((img) => img.id !== imageId));
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete image');
    }
  };

  return (
    <div className={className}>
      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${
            dragOver
              ? 'border-orange-400 bg-orange-50'
              : 'border-gray-300 hover:border-gray-400'
          }
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-sm text-gray-600 mb-2">
          {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
        </p>
        <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={uploading}
        />
      </div>

      {/* Gallery Button */}
      {showGallery && (
        <button
          onClick={() => {
            loadGallery();
            setShowGalleryModal(true);
          }}
          className="mt-3 w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Choose from Gallery
        </button>
      )}

      {/* Recently Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Recently Uploaded
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {uploadedImages.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.url}
                  alt={image.alt_text || image.filename}
                  className="w-full h-20 object-cover rounded-lg border"
                />
                <button
                  onClick={() => deleteImage(image.id)}
                  className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <TrashIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">Select Image</h3>
              <button
                onClick={() => setShowGalleryModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {gallery.map((image) => (
                  <div
                    key={image.id}
                    onClick={() => handleGalleryImageSelect(image)}
                    className="cursor-pointer hover:opacity-75 transition-opacity"
                  >
                    <img
                      src={image.url}
                      alt={image.alt_text || image.filename}
                      className="w-full h-20 object-cover rounded border"
                    />
                  </div>
                ))}
              </div>
              {gallery.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  No images found
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
