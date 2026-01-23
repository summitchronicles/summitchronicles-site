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
  const [activeTab, setActiveTab] = useState<'drafts' | 'live' | 'agents'>(
    'drafts'
  );
  const [drafts, setDrafts] = useState<BlogDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [agentStatus, setAgentStatus] = useState<{
    [key: string]: AgentStatus;
  }>({
    researcher: { running: false },
    'content-updater': { running: false },
  });
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    fetchDrafts();
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const res = await fetch('/api/insights');
      const data = await res.json();
      if (data.success) {
        setInsights(data.insights);
      }
    } catch (e) {
      console.error('Failed to fetch insights');
    }
  };

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

        const pollInterval = setInterval(async () => {
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
              setAgentStatus((prev) => ({
                ...prev,
                [agentName]: {
                  running: false,
                  status: statusData.result
                    ? `✅ ${statusData.result}`
                    : '✅ Completed!',
                  lastRun: new Date().toISOString(),
                },
              }));
              clearInterval(pollInterval);
              fetchDrafts();
              return;
            }
          } catch (e) {
            // ignore
          }

          // Backup check
          await fetchDrafts();
          const response = await fetch('/api/drafts');
          const data = await response.json();
          if (data.drafts.length > drafts.length) {
            setAgentStatus((prev) => ({
              ...prev,
              [agentName]: {
                running: false,
                status: '✅ Completed! (New draft found)',
                lastRun: new Date().toISOString(),
              },
            }));
            clearInterval(pollInterval);
          }
        }, 1000);

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
        { method: 'DELETE' }
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
        { method: 'POST' }
      );
      const data = await response.json();

      if (response.ok) {
        if (data.gitLogs && data.gitLogs.length > 0) {
          const logStr = data.gitLogs.join('\n');
          alert(`✅ Published successfully!\n\nGit Status:\n${logStr}`);
        } else {
          alert('✅ Published successfully!');
        }
        await fetchDrafts();
      } else {
        alert('Failed to publish draft');
      }
    } catch (error) {
      alert('Error publishing draft');
    }
  };

  const publishedLength = drafts.filter((d) => d.status === 'published').length;
  const draftsLength = drafts.filter((d) => d.status !== 'published').length;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="sr-only">Agent Dashboard</h1>

        {/* Header Area */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold font-oswald text-white">
            MISSION CONTROL
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-800 pb-1">
          <button
            onClick={() => setActiveTab('drafts')}
            className={`px-4 py-2 font-bold transition-colors ${
              activeTab === 'drafts'
                ? 'text-summit-gold border-b-2 border-summit-gold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Drafts ({draftsLength})
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className={`px-4 py-2 font-bold transition-colors ${
              activeTab === 'live'
                ? 'text-summit-gold border-b-2 border-summit-gold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Live Content ({publishedLength})
          </button>
          <button
            onClick={() => setActiveTab('agents')}
            className={`px-4 py-2 font-bold transition-colors ${
              activeTab === 'agents'
                ? 'text-summit-gold border-b-2 border-summit-gold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            AI Agents
          </button>
        </div>

        {/* Agent Tab Content */}
        {activeTab === 'agents' && (
          <div className="space-y-6">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
              <h3 className="text-xl font-bold mb-4">Autonomous Agents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Researcher Agent Card */}
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h4 className="font-bold text-lg mb-2">
                    Researcher & Drafter
                  </h4>
                  <p className="text-gray-400 text-sm mb-4">
                    Scouts topics, researches online, and drafts a new blog
                    post.
                  </p>
                  <button
                    onClick={() => runAgent('researcher')}
                    disabled={agentStatus['researcher'].running}
                    className={`w-full py-3 rounded font-bold ${
                      agentStatus['researcher'].running
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {agentStatus['researcher'].running
                      ? 'Running...'
                      : 'Run Researcher'}
                  </button>
                  {agentStatus['researcher'].status && (
                    <div className="mt-4 p-3 bg-black/50 rounded text-sm font-mono text-green-400">
                      Status: {agentStatus['researcher'].status}
                    </div>
                  )}
                </div>

                {/* Content Optimizer Agent Card */}
                <div className="bg-gray-800 p-6 rounded-lg">
                  <h4 className="font-bold text-lg mb-2">Content Optimizer</h4>
                  <p className="text-gray-400 text-sm mb-4">
                    Analyzes existing drafts and improves SEO, readability, and
                    tone.
                  </p>
                  <button
                    onClick={() => runAgent('content-updater')}
                    disabled={agentStatus['content-updater'].running}
                    className={`w-full py-3 rounded font-bold ${
                      agentStatus['content-updater'].running
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {agentStatus['content-updater'].running
                      ? 'Running...'
                      : 'Run Optimizer'}
                  </button>
                  {agentStatus['content-updater'].status && (
                    <div className="mt-4 p-3 bg-black/50 rounded text-sm font-mono text-green-400">
                      Status: {agentStatus['content-updater'].status}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* AI Insight Card (Moved here) */}
            {insights && (
              <div className="bg-gradient-to-r from-zinc-900 to-black border border-summit-gold/20 p-6 rounded-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <svg
                    width="100"
                    height="100"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 2L2 22h20L12 2zm0 3.5L18.5 20h-13L12 5.5z" />
                  </svg>
                </div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">
                    Weekly Coaching Insight
                  </h3>
                  <div className="flex gap-8 mt-4">
                    <div>
                      <div className="text-[10px] uppercase text-zinc-500 font-mono">
                        Focus
                      </div>
                      <div className="text-lg text-emerald-400 font-bold">
                        {insights.focus}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-zinc-500 font-mono">
                        Tip
                      </div>
                      <div className="text-sm text-zinc-300 max-w-md italic">
                        "{insights.tip}"
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Drafts List (Drafts Tab) */}
        {activeTab === 'drafts' && (
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Work In Progress</h2>
            {loading ? (
              <div className="text-gray-400">Loading...</div>
            ) : (
              <div className="space-y-4">
                {drafts
                  .filter((d) => d.status !== 'published')
                  .map((draft) => (
                    <div
                      key={draft.filename}
                      className="bg-gray-800 p-4 rounded-lg flex justify-between items-center group"
                    >
                      <div>
                        <h3 className="font-bold text-white group-hover:text-summit-gold transition-colors">
                          {draft.title}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {draft.date} • {draft.author}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/edit/${encodeURIComponent(draft.filename)}`}
                          className="px-3 py-1 bg-yellow-600 rounded text-sm hover:bg-yellow-700"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => publishDraft(draft.filename)}
                          className="px-3 py-1 bg-green-600 rounded text-sm hover:bg-green-700"
                        >
                          Publish
                        </button>
                        <button
                          onClick={() => deleteDraft(draft.filename)}
                          className="px-3 py-1 bg-gray-700 rounded text-sm hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                {drafts.filter((d) => d.status !== 'published').length ===
                  0 && (
                  <p className="text-gray-500 italic">
                    No drafts found. Start a new topic!
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Live Content List (Live Tab) */}
        {activeTab === 'live' && (
          <div className="bg-gray-900 rounded-lg p-6 border-t-4 border-green-600">
            <h2 className="text-xl font-bold mb-4">Published Content</h2>
            {loading ? (
              <div className="text-gray-400">Loading...</div>
            ) : (
              <div className="space-y-4">
                {drafts
                  .filter((d) => d.status === 'published')
                  .map((draft) => (
                    <div
                      key={draft.filename}
                      className="bg-black/40 p-4 rounded-lg flex justify-between items-center border border-gray-800"
                    >
                      <div>
                        <h3 className="font-bold text-white">{draft.title}</h3>
                        <div className="flex gap-2 text-sm text-gray-500 mt-1">
                          <span className="text-green-500 font-bold uppercase tracking-wider text-[10px] border border-green-900 bg-green-900/20 px-1 rounded">
                            LIVE
                          </span>
                          <span>{draft.date}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/edit/${encodeURIComponent(draft.filename)}`}
                          className="px-3 py-1 bg-gray-700 rounded text-sm hover:bg-gray-600"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => publishDraft(draft.filename)}
                          className="px-3 py-1 bg-green-900/40 text-green-400 border border-green-800 rounded text-sm hover:bg-green-800 hover:text-white transition-colors"
                        >
                          Republish
                        </button>
                        <a
                          href={`/blog/${draft.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 border border-gray-600 rounded text-sm hover:bg-white hover:text-black transition-colors"
                        >
                          View Live
                        </a>
                      </div>
                    </div>
                  ))}
                {drafts.filter((d) => d.status === 'published').length ===
                  0 && (
                  <p className="text-gray-500 italic">
                    No published articles yet.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
