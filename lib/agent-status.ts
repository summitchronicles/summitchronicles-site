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

export function updateAgentStatus(
  agent: string,
  status: string,
  step: string = '',
  progress: number = 0,
  isRunning: boolean = true,
  result?: string
) {
  const data: AgentStatus = {
    agent,
    status,
    step,
    progress,
    isRunning,
    lastUpdated: new Date().toISOString(),
    result,
  };

  try {
    fs.writeFileSync(STATUS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to update agent status file', error);
  }
}

export function getAgentStatus(): AgentStatus | null {
  try {
    if (fs.existsSync(STATUS_FILE)) {
      const content = fs.readFileSync(STATUS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    // ignore
  }
  return null;
}
