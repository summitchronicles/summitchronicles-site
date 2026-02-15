'use client';

import { useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function SubscriberManager() {
  const { data, mutate } = useSWR('/api/newsletter/subscribers', fetcher);
  const [newEmail, setNewEmail] = useState('');

  const subscribers: string[] = data?.subscribers || [];

  const addSubscriber = async () => {
    if (!newEmail.includes('@')) return;
    await fetch('/api/newsletter/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newEmail }),
    });
    setNewEmail('');
    mutate();
  };

  const removeSubscriber = async (email: string) => {
    await fetch('/api/newsletter/subscribers', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    mutate();
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
        Subscribers ({subscribers.length})
      </h3>

      <div className="flex gap-2 mb-4">
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addSubscriber()}
          placeholder="email@example.com"
          className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-white placeholder-gray-600 focus:border-summit-gold outline-none"
        />
        <button
          onClick={addSubscriber}
          className="px-3 py-1.5 bg-summit-gold/20 text-summit-gold border border-summit-gold/30 rounded text-sm hover:bg-summit-gold/30"
        >
          Add
        </button>
      </div>

      <div className="space-y-1.5 max-h-48 overflow-y-auto">
        {subscribers.map((email) => (
          <div key={email} className="flex items-center justify-between py-1 px-2 rounded hover:bg-gray-800/50 group">
            <span className="text-sm text-gray-300">{email}</span>
            <button
              onClick={() => removeSubscriber(email)}
              className="text-gray-600 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
