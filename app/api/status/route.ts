import { NextResponse } from 'next/server';
import { getAgentStatus } from '@/lib/agent-status';

export async function GET() {
  const status = getAgentStatus();
  return NextResponse.json(status || { isRunning: false });
}
