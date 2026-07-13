import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getServerEnv } from '@/shared/env/server';

export async function POST(request: NextRequest) {
  const env = getServerEnv();
  const payload = await request.json().catch(() => null);
  const providedKey =
    payload && typeof payload.key === 'string' ? payload.key.trim() : '';

  if (env.NODE_ENV === 'production') {
    if (
      !env.INTERNAL_API_KEY ||
      !keysMatch(providedKey, env.INTERNAL_API_KEY)
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid access key' },
        { status: 401 }
      );
    }
  }

  const sessionValue = env.INTERNAL_API_KEY || 'development-session';
  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_session', sessionValue, {
    httpOnly: true,
    sameSite: 'strict',
    secure: env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_session', '', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return response;
}

function keysMatch(provided: string, expected: string) {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
}
