import { NextResponse } from 'next/server';
import { runAgentResponse } from '@/modules/agents/application/agent-controller';
import { requireInternalApiAccess } from '@/shared/security/internal-api';

export async function POST(request: Request) {
  const unauthorized = requireInternalApiAccess(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const payload = await request.json();
    const response = await runAgentResponse(payload);
    return NextResponse.json(response.body, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
