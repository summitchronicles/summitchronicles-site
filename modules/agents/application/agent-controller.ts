import { spawn } from 'child_process';
import {
  LEGACY_AGENT_SCRIPTS,
  isKnownAgent,
} from '@/modules/agents/domain/agent';
import { getAllAgentStatuses } from '@/modules/agents/infrastructure/file-agent-status-store';
import { isOllamaAvailable } from '@/lib/integrations/ollama';

interface ApiResponse {
  status: number;
  body: Record<string, unknown>;
}

function createResponse(status: number, body: Record<string, unknown>): ApiResponse {
  return { status, body };
}

export async function getAgentStatusResponse(): Promise<ApiResponse> {
  const statuses = getAllAgentStatuses();
  const ollamaAvailable = await isOllamaAvailable();

  return createResponse(200, {
    ...statuses,
    ollamaAvailable,
  });
}

export function getLegacyAgentStatusPayload(): Record<string, unknown> {
  const statuses = getAllAgentStatuses();
  const running = Object.values(statuses).find((status) => status.isRunning);

  if (running) {
    return { ...running };
  }

  return { isRunning: false, ...statuses };
}

export async function runAgentResponse(payload: unknown): Promise<ApiResponse> {
  const agent =
    typeof payload === 'object' && payload !== null && 'agent' in payload
      ? String(payload.agent)
      : '';

  if (!isKnownAgent(agent)) {
    return createResponse(400, {
      error: agent ? `Unknown agent: ${agent}` : 'Agent is required',
    });
  }

  const child = spawn(
    'npx',
    [
      'ts-node',
      '-O',
      '{"module":"commonjs","moduleResolution":"node"}',
      '--transpile-only',
      LEGACY_AGENT_SCRIPTS[agent],
    ],
    {
      cwd: process.cwd(),
      detached: true,
      stdio: 'ignore',
    }
  );

  child.unref();

  return createResponse(200, {
    success: true,
    message: `${agent} started in background`,
  });
}
