import { NextResponse } from 'next/server';
import { getAllAgentStatuses } from '@/lib/agent-status';
import { isOllamaAvailable } from '@/lib/integrations/ollama';

export async function GET() {
  const statuses = getAllAgentStatuses();
  const ollamaAvailable = await isOllamaAvailable();

  return NextResponse.json({ ...statuses, ollamaAvailable });
}
