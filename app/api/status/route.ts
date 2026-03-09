import { NextResponse } from 'next/server';
import { getLegacyAgentStatusPayload } from '@/modules/agents/application/agent-controller';

export async function GET() {
  return NextResponse.json(getLegacyAgentStatusPayload());
}
