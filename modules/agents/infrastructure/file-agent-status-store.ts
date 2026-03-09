import * as fs from 'fs';
import * as path from 'path';
import type { AgentStatus, MultiAgentStatus } from '@/modules/agents/domain/agent';

const STATUS_FILE = path.join(process.cwd(), 'public', 'agent-status.json');

function ensureStatusDirectory() {
  fs.mkdirSync(path.dirname(STATUS_FILE), { recursive: true });
}

function loadStatusFile(): MultiAgentStatus {
  try {
    if (fs.existsSync(STATUS_FILE)) {
      const content = fs.readFileSync(STATUS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed.agent && typeof parsed.agent === 'string') {
        return { [parsed.agent]: parsed };
      }
      return parsed;
    }
  } catch {
    // Ignore corrupt or missing status files.
  }

  return {};
}

function saveStatusFile(data: MultiAgentStatus) {
  try {
    ensureStatusDirectory();
    fs.writeFileSync(STATUS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to update agent status file', error);
  }
}

export function updateAgentStatus(
  agent: string,
  status: string,
  step = '',
  progress = 0,
  isRunning = true,
  result?: string
) {
  const all = loadStatusFile();

  all[agent] = {
    agent,
    status,
    step,
    progress,
    isRunning,
    lastUpdated: new Date().toISOString(),
    result,
  };

  saveStatusFile(all);
}

export function getAgentStatus(agent?: string): AgentStatus | MultiAgentStatus | null {
  const all = loadStatusFile();
  if (agent) {
    return all[agent] || null;
  }
  return all;
}

export function getAllAgentStatuses(): MultiAgentStatus {
  return loadStatusFile();
}
