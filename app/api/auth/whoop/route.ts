import { NextRequest, NextResponse } from 'next/server';
import { getServerEnv } from '@/shared/env/server';
import { requireInternalApiAccess } from '@/shared/security/internal-api';
import { whoopClient } from '@/modules/training/infrastructure/whoop-client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const env = getServerEnv();
  const configured = Boolean(
    env.WHOOP_CLIENT_ID &&
      env.WHOOP_CLIENT_SECRET &&
      env.WHOOP_REDIRECT_URI &&
      env.WHOOP_TOKEN_ENCRYPTION_KEY &&
      env.DATABASE_URL
  );

  if (!configured) {
    return NextResponse.json({ configured: false, connected: false });
  }

  try {
    const status = await whoopClient.getStatus();
    return NextResponse.json({ configured: true, connected: status.connected });
  } catch (error) {
    console.error('WHOOP status check failed:', error);
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
    await whoopClient.disconnect();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('WHOOP disconnect failed:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to disconnect WHOOP' },
      { status: 500 }
    );
  }
}
