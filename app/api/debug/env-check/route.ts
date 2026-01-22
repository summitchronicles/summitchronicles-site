import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * Debug endpoint to verify environment variables are set (without exposing values)
 * Access: /api/debug/env-check
 */
export async function GET() {
  const envCheck = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {
      intervals_api_key: {
        exists: !!process.env.INTERVALS_ICU_API_KEY,
        length: process.env.INTERVALS_ICU_API_KEY?.length || 0,
        preview:
          process.env.INTERVALS_ICU_API_KEY?.substring(0, 4) + '...' ||
          'NOT_SET',
      },
      intervals_athlete_id: {
        exists: !!process.env.INTERVALS_ICU_ATHLETE_ID,
        value: process.env.INTERVALS_ICU_ATHLETE_ID || 'NOT_SET',
      },
      cohere_api_key: {
        exists: !!process.env.COHERE_API_KEY,
        length: process.env.COHERE_API_KEY?.length || 0,
        preview:
          process.env.COHERE_API_KEY?.substring(0, 4) + '...' || 'NOT_SET',
      },
      vo2_manual: {
        exists: !!process.env.VO2_MAX_MANUAL,
        value: process.env.VO2_MAX_MANUAL || 'NOT_SET',
      },
    },
  };

  return NextResponse.json(envCheck);
}
