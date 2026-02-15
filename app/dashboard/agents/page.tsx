'use client';

import { useState, useEffect, useCallback } from 'react';
import useSWR from 'swr';
import AgentCard from '../components/AgentCard';

const fetcher = (url: string) => fetch(url).then(r => r.json());

const AGENTS = [
  {
    key: 'researcher',
    name: 'Mountain Researcher',
    description: 'Processes incoming notes, brainstorms topics, drafts blog posts with [IMAGE:] placeholders, and generates weekly insights.',
  },
  {
    key: 'newsletter',
    name: 'Newsletter Manager',
    description: 'Generates and sends a weekly newsletter digest of recent blog posts to all subscribers.',
  },
];

export default function AgentsPage() {
  const { data: statusData } = useSWR('/api/agents/status', fetcher, { refreshInterval: 2000 });
  const [runState, setRunState] = useState<Record<string, { lastRun?: string }>>({});

  const ollamaAvailable = statusData?.ollamaAvailable === true;

  const getAgentData = useCallback((key: string) => {
    if (!statusData || !statusData[key]) return { status: '', progress: 0, isRunning: false };
    const agent = statusData[key];
    return {
      status: agent.status || '',
      progress: agent.progress || 0,
      isRunning: agent.isRunning || false,
    };
  }, [statusData]);

  const runAgent = async (agentKey: string) => {
    try {
      await fetch('/api/agents/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: agentKey }),
      });
      setRunState(prev => ({
        ...prev,
        [agentKey]: { lastRun: new Date().toISOString() },
      }));
    } catch (e) {
      console.error('Failed to run agent:', e);
    }
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold font-oswald text-white mb-6">Agent Control Panel</h2>

      {/* Ollama status banner */}
      <div className={`mb-6 p-3 rounded-lg border text-sm flex items-center gap-2 ${
        ollamaAvailable
          ? 'bg-green-900/20 border-green-800 text-green-400'
          : 'bg-red-900/20 border-red-800 text-red-400'
      }`}>
        <span className={`w-2 h-2 rounded-full ${ollamaAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
        {ollamaAvailable
          ? 'Ollama is running and ready for agent tasks.'
          : 'Ollama is offline. Agents require Ollama to be running (ollama serve).'}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {AGENTS.map((agent) => {
          const agentData = getAgentData(agent.key);
          return (
            <AgentCard
              key={agent.key}
              name={agent.name}
              description={agent.description}
              status={agentData.status}
              progress={agentData.progress}
              isRunning={agentData.isRunning}
              lastRun={runState[agent.key]?.lastRun}
              onRun={() => runAgent(agent.key)}
            />
          );
        })}
      </div>
    </div>
  );
}
