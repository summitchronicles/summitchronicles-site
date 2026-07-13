import { randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { requireStravaCredentials } from '@/shared/env/server';
import { hasInternalApiAccess } from '@/shared/security/internal-api';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const STRAVA_AUTHORIZATION_URL = 'https://www.strava.com/oauth/authorize';
const STRAVA_SCOPES = ['read', 'activity:read_all'];

export async function GET(request: NextRequest) {
  if (!hasInternalApiAccess(request)) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('next', '/api/auth/strava/start');
    return NextResponse.redirect(loginUrl);
  }

  const env = requireStravaCredentials();
  const state = randomBytes(16).toString('base64url');
  const authorizationUrl = new URL(STRAVA_AUTHORIZATION_URL);
  authorizationUrl.searchParams.set('client_id', env.STRAVA_CLIENT_ID);
  authorizationUrl.searchParams.set('redirect_uri', env.STRAVA_REDIRECT_URI);
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('approval_prompt', 'auto');
  authorizationUrl.searchParams.set('scope', STRAVA_SCOPES.join(','));
  authorizationUrl.searchParams.set('state', state);

  const response = NextResponse.redirect(authorizationUrl);
  response.cookies.set('strava_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    domain:
      process.env.NODE_ENV === 'production'
        ? '.summitchronicles.com'
        : undefined,
    path: '/api/strava/callback',
    maxAge: 10 * 60,
  });
  return response;
}
