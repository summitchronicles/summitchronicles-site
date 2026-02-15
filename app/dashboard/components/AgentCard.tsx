'use client';

import { motion } from 'framer-motion';

interface AgentCardProps {
  name: string;
  description: string;
  status?: string;
  progress?: number;
  isRunning?: boolean;
  lastRun?: string;
  dailyRuns?: number;
  onRun: () => void;
}

export default function AgentCard({
  name,
  description,
  status,
  progress = 0,
  isRunning = false,
  lastRun,
  dailyRuns = 0,
  onRun,
}: AgentCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-bold text-lg text-white">{name}</h3>
          <p className="text-gray-400 text-sm mt-1">{description}</p>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider ${
            isRunning
              ? 'bg-blue-900/40 text-blue-400 border border-blue-800'
              : 'bg-gray-800 text-gray-500 border border-gray-700'
          }`}
        >
          {isRunning ? 'Running' : 'Idle'}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-800 rounded-full mb-4 overflow-hidden">
        <motion.div
          className="h-full bg-summit-gold rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {status && (
        <div className="mb-4 p-2.5 bg-black/40 rounded text-xs font-mono text-green-400 truncate">
          {status}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={onRun}
          disabled={isRunning}
          className={`px-4 py-2 rounded font-bold text-sm transition-colors ${
            isRunning
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-summit-gold/20 text-summit-gold hover:bg-summit-gold/30 border border-summit-gold/30'
          }`}
        >
          {isRunning ? 'Running...' : 'Run'}
        </button>
        <div className="text-right text-xs text-gray-500">
          {lastRun && <div>Last: {new Date(lastRun).toLocaleString()}</div>}
          <div>Today: {dailyRuns} run{dailyRuns !== 1 ? 's' : ''}</div>
        </div>
      </div>
    </div>
  );
}
