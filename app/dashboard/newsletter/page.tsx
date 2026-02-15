'use client';

import { useState } from 'react';
import SubscriberManager from '../components/SubscriberManager';
import NewsletterPreview from '../components/NewsletterPreview';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function NewsletterPage() {
  const { data: historyData } = useSWR('/api/newsletter/history', fetcher);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<string | null>(null);

  const history = historyData?.history || [];

  const triggerNewsletter = async () => {
    setSending(true);
    setSendResult(null);
    try {
      const res = await fetch('/api/agents/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: 'newsletter' }),
      });
      if (res.ok) {
        setSendResult('Newsletter agent started.');
      } else {
        setSendResult('Failed to start newsletter agent.');
      }
    } catch {
      setSendResult('Error triggering newsletter.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold font-oswald text-white mb-6">Newsletter</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SubscriberManager />
        <div className="space-y-6">
          <NewsletterPreview />
          <div>
            <button
              onClick={triggerNewsletter}
              disabled={sending}
              className="px-4 py-2 bg-summit-gold/20 text-summit-gold border border-summit-gold/30 rounded font-bold text-sm hover:bg-summit-gold/30 disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send Newsletter Now'}
            </button>
            {sendResult && (
              <p className="text-sm text-gray-400 mt-2">{sendResult}</p>
            )}
          </div>
        </div>
      </div>

      {/* Send History */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
          Send History
        </h3>
        {history.length === 0 ? (
          <p className="text-gray-600 text-sm italic">No newsletters sent yet.</p>
        ) : (
          <div className="space-y-2">
            {history.map((entry: any, i: number) => (
              <div key={i} className="flex items-center gap-4 py-2 border-b border-gray-800 last:border-0 text-sm">
                <span className="text-gray-500 font-mono text-xs">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
                <span className="text-white">{entry.subject}</span>
                <span className="text-gray-500 text-xs">
                  {entry.recipientCount} recipient{entry.recipientCount !== 1 ? 's' : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
