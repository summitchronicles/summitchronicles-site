import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { stravaClient } from '@/modules/training/infrastructure/strava-client';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const error = request.nextUrl.searchParams.get('error');
  const scope = request.nextUrl.searchParams.get('scope') ?? '';
  const storedState = request.cookies.get('strava_oauth_state')?.value;

  if (error) {
    return redirectToTraining(request, 'denied');
  }

  if (!code || !state || !storedState || !statesMatch(state, storedState)) {
    return redirectToTraining(request, 'invalid_state');
  }

  const scopes = scope
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  if (!scopes.includes('activity:read_all')) {
    return redirectToTraining(request, 'insufficient_scope');
  }

  try {
    const tokens = await stravaClient.exchangeAuthorizationCode(code);
    await stravaClient.saveAuthorization(tokens, scopes);
    return redirectToTraining(request, 'connected');
  } catch (callbackError) {
    console.error('Strava OAuth callback failed:', callbackError);
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
  url.searchParams.set('strava', status);
  const response = NextResponse.redirect(url);
  response.cookies.set('strava_oauth_state', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    domain:
      process.env.NODE_ENV === 'production'
        ? '.summitchronicles.com'
        : undefined,
    path: '/api/strava/callback',
    maxAge: 0,
  });
  return response;
}
