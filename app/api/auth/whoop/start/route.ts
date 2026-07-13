import { randomBytes } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { requireWhoopCredentials } from '@/shared/env/server';
import { hasInternalApiAccess } from '@/shared/security/internal-api';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const WHOOP_AUTHORIZATION_URL = 'https://api.prod.whoop.com/oauth/oauth2/auth';
const WHOOP_SCOPES = [
  'offline',
  'read:profile',
  'read:cycles',
  'read:recovery',
  'read:sleep',
  'read:workout',
];

export async function GET(request: NextRequest) {
  if (!hasInternalApiAccess(request)) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('next', '/api/auth/whoop/start');
    return NextResponse.redirect(loginUrl);
  }

  const env = requireWhoopCredentials();
  const state = randomBytes(6).toString('base64url');
  const authorizationUrl = new URL(WHOOP_AUTHORIZATION_URL);
  authorizationUrl.searchParams.set('client_id', env.WHOOP_CLIENT_ID);
  authorizationUrl.searchParams.set('redirect_uri', env.WHOOP_REDIRECT_URI);
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('scope', WHOOP_SCOPES.join(' '));
  authorizationUrl.searchParams.set('state', state);

  const response = NextResponse.redirect(authorizationUrl);
  response.cookies.set('whoop_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/api/auth/whoop/callback',
    maxAge: 10 * 60,
  });
  return response;
}
