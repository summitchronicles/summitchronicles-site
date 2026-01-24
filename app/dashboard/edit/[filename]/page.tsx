'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NotionEditor } from '../components/BlockNoteEditor';

export default function EditBlogPage({
  params,
}: {
  params: { filename: string };
}) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  const filename = decodeURIComponent(params.filename);

  useEffect(() => {
    fetch(`/api/drafts/${filename}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.content) {
          setContent(data.content);
        } else {
          alert('Failed to load file');
          router.push('/dashboard');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [filename, router]);

  const handleSave = async (newContent: string) => {
    try {
      const res = await fetch(`/api/drafts/${filename}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newContent }),
      });

      if (res.ok) {
        alert('Saved successfully!');
        // Reload the page to fetch fresh content
        window.location.reload();
      } else {
        alert('Failed to save');
      }
    } catch (e) {
      console.error(e);
      alert('Error saving');
    }
  };

  if (loading)
    return (
      <div className="p-10 text-white min-h-screen bg-black flex items-center justify-center">
        Loading Editor...
      </div>
    );

  return (
    <NotionEditor
      initialContent={content}
      filename={filename}
      onSave={handleSave}
      onCancel={() => router.push('/dashboard')}
    />
  );
}
