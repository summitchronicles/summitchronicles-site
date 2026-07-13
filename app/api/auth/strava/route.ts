import { NextRequest, NextResponse } from 'next/server';
import { getServerEnv } from '@/shared/env/server';
import { requireInternalApiAccess } from '@/shared/security/internal-api';
import { stravaClient } from '@/modules/training/infrastructure/strava-client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const env = getServerEnv();
  const configured = Boolean(
    env.STRAVA_CLIENT_ID &&
      env.STRAVA_CLIENT_SECRET &&
      env.WHOOP_TOKEN_ENCRYPTION_KEY &&
      env.DATABASE_URL
  );

  if (!configured) {
    return NextResponse.json({ configured: false, connected: false });
  }

  try {
    const status = await stravaClient.getStatus();
    return NextResponse.json({ configured: true, connected: status.connected });
  } catch (error) {
    console.error('Strava status check failed:', error);
    return NextResponse.json(
      { configured: true, connected: false, storageReady: false },
      { status: 503 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const unauthorized = requireInternalApiAccess(request);
  if (unauthorized) return unauthorized;

  try {
    await stravaClient.disconnect();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Strava disconnect failed:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to disconnect Strava' },
      { status: 500 }
    );
  }
}
