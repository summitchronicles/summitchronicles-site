import { NextResponse } from 'next/server';
import { getAllAgentStatuses } from '@/lib/agent-status';

export async function GET() {
  const statuses = getAllAgentStatuses();
  // Backward compatible: if any agent is running, expose it at the top level too
  const running = Object.values(statuses).find(s => s.isRunning);
  return NextResponse.json(running || { isRunning: false, ...statuses });
}
