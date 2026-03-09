import { NextResponse } from 'next/server';
import { getServerEnv } from '@/shared/env/server';
import { requireInternalApiAccess } from '@/shared/security/internal-api';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const unauthorized = requireInternalApiAccess(request);
  if (unauthorized) {
    return unauthorized;
  }

  const env = getServerEnv();

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    checks: {
      intervals_api_key: { configured: Boolean(env.INTERVALS_ICU_API_KEY) },
      intervals_athlete_id: { configured: Boolean(env.INTERVALS_ICU_ATHLETE_ID) },
      buttondown_api_key: { configured: Boolean(env.BUTTONDOWN_API_KEY) },
      internal_api_key: { configured: Boolean(env.INTERNAL_API_KEY) },
      sanity_project: { configured: Boolean(env.NEXT_PUBLIC_SANITY_PROJECT_ID) },
    },
  });
}
