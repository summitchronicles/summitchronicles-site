'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { useDashboardStore } from '@/lib/stores/dashboardStore';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function PublishedList() {
  const { data } = useSWR('/api/drafts', fetcher);
  const openModal = useDashboardStore(s => s.openModal);
  const published = (data?.drafts || []).filter((d: any) => d.status === 'published');

  return (
    <div className="space-y-3">
      {published.length === 0 && (
        <p className="text-gray-500 italic text-sm">No published articles yet.</p>
      )}
      {published.map((draft: any) => (
        <div
          key={draft.filename}
          className="bg-gray-900 border border-gray-800 p-4 rounded-lg flex justify-between items-center"
        >
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white">{draft.title}</h3>
              <span className="text-green-500 font-bold uppercase tracking-wider text-[10px] border border-green-900 bg-green-900/20 px-1 rounded">
                LIVE
              </span>
            </div>
            <p className="text-gray-500 text-sm">{draft.date} · {draft.wordCount}w</p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/dashboard/edit/${encodeURIComponent(draft.filename)}`}
              className="px-3 py-1 bg-gray-700 rounded text-sm hover:bg-gray-600"
            >
              Edit
            </Link>
            <button
              onClick={() => openModal('publish', { files: [draft.filename], title: draft.title })}
              className="px-3 py-1 bg-green-900/40 text-green-400 border border-green-800 rounded text-sm hover:bg-green-800"
            >
              Republish
            </button>
            <a
              href={`/blog/${draft.slug}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 border border-gray-600 rounded text-sm hover:bg-white hover:text-black transition-colors"
            >
              View
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
