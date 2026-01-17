'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface BlogDraft {
  filename: string;
  title: string;
  date: string;
  author: string;
  status: 'draft' | 'published' | 'processing';
  hasImage: boolean;
  wordCount: number;
  slug: string;
}

interface AgentStatus {
  running: boolean;
  lastRun?: string;
  status?: string;
}

export default function AgentDashboard() {
  const [drafts, setDrafts] = useState<BlogDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [agentStatus, setAgentStatus] = useState<{
    [key: string]: AgentStatus;
  }>({
    researcher: { running: false },
    'content-updater': { running: false },
  });

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const response = await fetch('/api/drafts');
      const data = await response.json();
      setDrafts(data.drafts);
    } catch (error) {
      console.error('Failed to fetch drafts:', error);
    } finally {
      setLoading(false);
    }
  };

  const runAgent = async (agentName: string) => {
    setAgentStatus((prev) => ({
      ...prev,
      [agentName]: { running: true, status: 'Starting agent...' },
    }));

    try {
      const response = await fetch(`/api/agents/${agentName}`, {
        method: 'POST',
        headers: { Authorization: 'Bearer dev-secret' },
      });

      if (response.ok) {
        setAgentStatus((prev) => ({
          ...prev,
          [agentName]: {
            running: true,
            status:
              agentName === 'researcher'
                ? 'Brainstorming → Drafting → Generating Image...'
                : 'Processing notes...',
          },
        }));

        // Poll for completion AND real-time status
        const pollInterval = setInterval(async () => {
          // 1. Check Real-Time Status from Agent
          try {
            const statusRes = await fetch('/api/status');
            const statusData = await statusRes.json();

            if (
              statusData &&
              statusData.agent === agentName &&
              statusData.isRunning
            ) {
              setAgentStatus((prev) => ({
                ...prev,
                [agentName]: {
                  running: true,
                  status: `${statusData.status} (${statusData.progress}%)`,
                  lastRun: prev[agentName].lastRun,
                },
              }));
            } else if (
              statusData &&
              !statusData.isRunning &&
              statusData.agent === agentName &&
              agentStatus[agentName].running
            ) {
              // Agent marked itself as done
              setAgentStatus((prev) => ({
                ...prev,
                [agentName]: {
                  running: false,
                  status: '✅ Completed!',
                  lastRun: new Date().toISOString(),
                },
              }));
              clearInterval(pollInterval);
              fetchDrafts();
              return;
            }
          } catch (e) {
            // ignore status errors
          }

          // 2. Draft Check (Backup: did a file appear?)
          await fetchDrafts();
          const response = await fetch('/api/drafts');
          const data = await response.json();
          if (data.drafts.length > drafts.length) {
            setAgentStatus((prev) => ({
              ...prev,
              [agentName]: {
                running: false,
                status: '✅ Completed!',
                lastRun: new Date().toISOString(),
              },
            }));
            clearInterval(pollInterval);
          }
        }, 1000);

        // Timeout after 5 minutes
        setTimeout(() => {
          clearInterval(pollInterval);
          setAgentStatus((prev) => ({
            ...prev,
            [agentName]: { running: false, status: 'Completed (or timed out)' },
          }));
        }, 300000);
      }
    } catch (error) {
      setAgentStatus((prev) => ({
        ...prev,
        [agentName]: { running: false, status: '❌ Failed' },
      }));
    }
  };

  const deleteDraft = async (filename: string) => {
    if (!confirm(`Delete "${filename}"? This cannot be undone.`)) return;

    try {
      const response = await fetch(
        `/api/drafts/${encodeURIComponent(filename)}`,
        {
          method: 'DELETE',
        }
      );
      if (response.ok) {
        await fetchDrafts();
      } else {
        alert('Failed to delete draft');
      }
    } catch (error) {
      alert('Error deleting draft');
    }
  };

  const publishDraft = async (filename: string) => {
    if (!confirm(`Publish "${filename}"? It will go live on the site.`)) return;

    try {
      const response = await fetch(
        `/api/drafts/${encodeURIComponent(filename)}`,
        {
          method: 'POST',
        }
      );
      if (response.ok) {
        alert('✅ Published successfully!');
        await fetchDrafts(); // Refresh list (it might disappear or update status)
      } else {
        alert('Failed to publish draft');
      }
    } catch (error) {
      alert('Error publishing draft');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* ... (Keep Header and Quick Actions same) ... */}

        {/* Draft List */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Drafts</h2>

          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : drafts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No drafts yet. Run an agent to generate content!
            </div>
          ) : (
            <div className="space-y-4">
              {drafts.map((draft) => (
                <div
                  key={draft.filename}
                  className="bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{draft.title}</h3>
                      <div className="text-sm text-gray-400 space-x-4">
                        <span>📅 {draft.date}</span>
                        <span>✍️ {draft.author}</span>
                        <span>📊 {draft.wordCount} words</span>
                        {draft.status === 'published' ? (
                          <span className="text-green-500 font-bold border border-green-500 px-2 rounded-full text-xs">
                            🚀 PUBLISHED
                          </span>
                        ) : (
                          <span className="text-gray-500 border border-gray-600 px-2 rounded-full text-xs">
                            DRAFT
                          </span>
                        )}
                        {draft.hasImage ? (
                          <span className="text-green-400">🖼️ Image ✓</span>
                        ) : (
                          <span className="text-yellow-400">🖼️ No image</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {/* Publish Button */}
                      {draft.status !== 'published' && (
                        <button
                          onClick={() => publishDraft(draft.filename)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm flex items-center gap-1"
                        >
                          🚀 Publish
                        </button>
                      )}

                      <Link
                        href={`/dashboard/edit/${encodeURIComponent(draft.filename)}`}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-sm"
                      >
                        ✏️ Edit
                      </Link>
                      <a
                        href={`/api/preview/${encodeURIComponent(draft.filename)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                      >
                        📄 View
                      </a>
                      <button
                        onClick={() => deleteDraft(draft.filename)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-gray-900 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-400">
              {drafts.length}
            </div>
            <div className="text-sm text-gray-400">Total Drafts</div>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-400">
              {drafts.filter((d) => d.hasImage).length}
            </div>
            <div className="text-sm text-gray-400">With Images</div>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-purple-400">
              {drafts.reduce((sum, d) => sum + d.wordCount, 0)}
            </div>
            <div className="text-sm text-gray-400">Total Words</div>
          </div>
        </div>
      </div>
    </div>
  );
}
