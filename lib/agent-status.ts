import * as fs from 'fs';
import * as path from 'path';

const STATUS_FILE = path.join(process.cwd(), 'public', 'agent-status.json');

export interface AgentStatus {
  agent: string;
  status: string;
  step: string;
  progress: number; // 0-100
  isRunning: boolean;
  lastUpdated: string;
  result?: string;
}

export interface MultiAgentStatus {
  [agentName: string]: AgentStatus;
}

function loadStatusFile(): MultiAgentStatus {
  try {
    if (fs.existsSync(STATUS_FILE)) {
      const content = fs.readFileSync(STATUS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      // Handle legacy single-agent format
      if (parsed.agent && typeof parsed.agent === 'string') {
        return { [parsed.agent]: parsed };
      }
      return parsed;
    }
  } catch {
    // ignore
  }
  return {};
}

function saveStatusFile(data: MultiAgentStatus) {
  try {
    fs.writeFileSync(STATUS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to update agent status file', error);
  }
}

export function updateAgentStatus(
  agent: string,
  status: string,
  step: string = '',
  progress: number = 0,
  isRunning: boolean = true,
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
