import { NextResponse } from 'next/server';
import {
  getAiInitializationStatusResponse,
  initializeAiSystemResponse,
} from '@/modules/ai/application/ai-operations-controller';
import { requireInternalApiAccess } from '@/shared/security/internal-api';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const unauthorized = requireInternalApiAccess(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const response = await initializeAiSystemResponse();
    return NextResponse.json(response.body, { status: response.status });
  } catch (error) {
    console.error('Initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize knowledge base' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const unauthorized = requireInternalApiAccess(request);
  if (unauthorized) {
    return unauthorized;
  }

  try {
    const response = await getAiInitializationStatusResponse();
    return NextResponse.json(response.body, { status: response.status });
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check system status' },
      { status: 500 }
    );
  }
}
