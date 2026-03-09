export interface AgentStatus {
  agent: string;
  status: string;
  step: string;
  progress: number;
  isRunning: boolean;
  lastUpdated: string;
  result?: string;
}

export interface MultiAgentStatus {
  [agentName: string]: AgentStatus;
}

export const LEGACY_AGENT_SCRIPTS = {
  researcher: 'scripts/legacy/researcher/index.ts',
  newsletter: 'scripts/legacy/newsletter/index.ts',
} as const;

export type AgentName = keyof typeof LEGACY_AGENT_SCRIPTS;

export function isKnownAgent(agent: string): agent is AgentName {
  return agent in LEGACY_AGENT_SCRIPTS;
}
