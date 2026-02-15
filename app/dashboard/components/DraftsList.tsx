'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { useDashboardStore } from '@/lib/stores/dashboardStore';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function DraftsList() {
  const { data, mutate } = useSWR('/api/drafts', fetcher);
  const openModal = useDashboardStore(s => s.openModal);
  const drafts = (data?.drafts || []).filter((d: any) => d.status !== 'published');

  const handleDelete = async (filename: string) => {
    if (!confirm(`Delete "${filename}"?`)) return;
    await fetch(`/api/drafts/${encodeURIComponent(filename)}`, { method: 'DELETE' });
    mutate();
  };

  return (
    <div className="space-y-3">
      {drafts.length === 0 && (
        <p className="text-gray-500 italic text-sm">No drafts found.</p>
      )}
      {drafts.map((draft: any) => (
        <div
          key={draft.filename}
          className="bg-gray-900 border border-gray-800 p-4 rounded-lg flex justify-between items-center"
        >
          <div>
            <h3 className="font-bold text-white">{draft.title}</h3>
            <p className="text-gray-500 text-sm">{draft.date} · {draft.wordCount}w</p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/dashboard/edit/${encodeURIComponent(draft.filename)}`}
              className="px-3 py-1 bg-yellow-600 rounded text-sm hover:bg-yellow-700"
            >
              Edit
            </Link>
            <button
              onClick={() => openModal('publish', { files: [draft.filename], title: draft.title })}
              className="px-3 py-1 bg-green-600 rounded text-sm hover:bg-green-700"
            >
              Publish
            </button>
            <button
              onClick={() => handleDelete(draft.filename)}
              className="px-3 py-1 bg-gray-700 rounded text-sm hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
