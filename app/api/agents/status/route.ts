import { NextResponse } from 'next/server';
import { getAgentStatusResponse } from '@/modules/agents/application/agent-controller';
import { requireInternalApiAccess } from '@/shared/security/internal-api';

export async function GET(request: Request) {
  const unauthorized = requireInternalApiAccess(request);
  if (unauthorized) {
    return unauthorized;
  }

  const response = await getAgentStatusResponse();
  return NextResponse.json(response.body, { status: response.status });
}
