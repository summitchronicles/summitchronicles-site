'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface ActivityEntry {
  time: string;
  agent: string;
  message: string;
}

export default function ActivityFeed() {
  const { data } = useSWR('/api/agents/status', fetcher, { refreshInterval: 5000 });

  const entries: ActivityEntry[] = [];

  if (data) {
    // Build feed from multi-agent status
    for (const [name, agentData] of Object.entries(data)) {
      if (name === 'ollamaAvailable') continue;
      const agent = agentData as any;
      if (agent.lastUpdated) {
        entries.push({
          time: agent.lastUpdated,
          agent: name,
          message: agent.status || (agent.isRunning ? 'Running...' : 'Idle'),
        });
      }
    }
  }

  entries.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-5">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
        Recent Activity
      </h3>
      {entries.length === 0 ? (
        <p className="text-gray-600 text-sm italic">No recent activity.</p>
      ) : (
        <div className="space-y-2.5 max-h-64 overflow-y-auto">
          {entries.slice(0, 10).map((entry, i) => (
            <div key={i} className="flex gap-3 text-xs">
              <span className="text-gray-600 whitespace-nowrap font-mono">
                {new Date(entry.time).toLocaleTimeString()}
              </span>
              <span className="text-summit-gold font-medium">{entry.agent}</span>
              <span className="text-gray-400 truncate">{entry.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
