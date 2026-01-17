'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditBlogPage({
  params,
}: {
  params: { filename: string };
}) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Use React.use() or access params directly depending on Next.js version
  // For older App Router, params is prop. For newer (v15), it might be a Promise.
  // Assuming standard { params } prop works for this version.
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

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/drafts/${filename}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        alert('Saved successfully!');
        router.push('/dashboard');
      } else {
        alert('Failed to save');
      }
    } catch (e) {
      console.error(e);
      alert('Error saving');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-white">Loading Editor...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Editing: {filename}</h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium flex items-center gap-2"
            >
              {saving ? 'Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-1 border border-gray-700 shadow-xl">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-[70vh] bg-gray-900 text-gray-100 p-6 rounded-lg font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            spellCheck={false}
          />
        </div>
        <p className="mt-4 text-gray-400 text-sm">
          Tip: This is a raw Markdown editor. Be careful with frontmatter (the
          metadata at the top).
        </p>
      </div>
    </div>
  );
}
