'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function NewsletterPreview() {
  const { data } = useSWR('/api/newsletter/history', fetcher);
  const latest = data?.history?.[0];

  if (!latest) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
          Last Newsletter
        </h3>
        <p className="text-gray-600 text-sm italic">No newsletters sent yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
        Last Newsletter
      </h3>
      <div className="text-sm text-white mb-1">{latest.subject}</div>
      <div className="text-xs text-gray-500 mb-2">
        {new Date(latest.date).toLocaleString()} · {latest.recipientCount} recipient{latest.recipientCount !== 1 ? 's' : ''}
      </div>
      {latest.results && (
        <div className="text-xs text-gray-500">
          {latest.results.filter((r: any) => r.success).length}/{latest.results.length} delivered
        </div>
      )}
    </div>
  );
}
