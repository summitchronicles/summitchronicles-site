import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { whoopClient } from '@/modules/training/infrastructure/whoop-client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const error = request.nextUrl.searchParams.get('error');
  const storedState = request.cookies.get('whoop_oauth_state')?.value;

  if (error) {
    return redirectToTraining(request, 'denied');
  }

  if (!code || !state || !storedState || !statesMatch(state, storedState)) {
    return redirectToTraining(request, 'invalid_state');
  }

  try {
    const tokens = await whoopClient.exchangeAuthorizationCode(code);
    await whoopClient.saveAuthorization(tokens);
    return redirectToTraining(request, 'connected');
  } catch (callbackError) {
    console.error('WHOOP OAuth callback failed:', callbackError);
    return redirectToTraining(request, 'connection_failed');
  }
}

function statesMatch(provided: string, expected: string) {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
}

function redirectToTraining(request: NextRequest, status: string) {
  const url = new URL('/training', request.url);
  url.searchParams.set('whoop', status);
  const response = NextResponse.redirect(url);
  response.cookies.set('whoop_oauth_state', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/api/auth/whoop/callback',
    maxAge: 0,
  });
  return response;
}
