'use client';

import { useState } from 'react';
import { useDashboardStore } from '@/lib/stores/dashboardStore';

export default function PublishModal() {
  const { activeModal, modalData, closeModal } = useDashboardStore();
  const [publishing, setPublishing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  if (activeModal !== 'publish' || !modalData) return null;

  const { files, title } = modalData as { files: string[]; title: string };

  const handlePublish = async () => {
    setPublishing(true);
    setResult(null);

    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: files.map((f: string) => `content/blog/${f}`),
          message: `Publish: ${title}`,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(`Published successfully! ${data.commitHash ? `(${data.commitHash})` : ''}`);
      } else {
        setResult(`Failed: ${data.error || 'Unknown error'}`);
      }
    } catch (e: any) {
      setResult(`Error: ${e.message}`);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold text-white mb-4">Confirm Publish</h2>

        <div className="mb-4">
          <p className="text-gray-400 text-sm mb-2">Files to commit and push:</p>
          <div className="bg-black/50 p-3 rounded font-mono text-xs text-green-400 space-y-1">
            {files.map((f: string) => (
              <div key={f}>content/blog/{f}</div>
            ))}
          </div>
        </div>

        <div className="mb-4 p-3 bg-black/30 rounded text-xs text-gray-400 font-mono">
          git add {files.map((f: string) => `content/blog/${f}`).join(' ')}
          <br />
          git commit -m &quot;Publish: {title}&quot;
          <br />
          git push
        </div>

        {result && (
          <div className={`mb-4 p-3 rounded text-sm ${
            result.startsWith('Published') ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
          }`}>
            {result}
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-gray-400 hover:text-white text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={publishing || !!result?.startsWith('Published')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-bold text-sm disabled:opacity-50"
          >
            {publishing ? 'Publishing...' : result?.startsWith('Published') ? 'Done' : 'Publish & Deploy'}
          </button>
        </div>
      </div>
    </div>
  );
}
