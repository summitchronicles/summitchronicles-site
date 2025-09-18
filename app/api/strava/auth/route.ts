import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Get Strava credentials from environment
  const clientId = process.env.STRAVA_CLIENT_ID;
  const redirectUri = process.env.STRAVA_REDIRECT_URI || `${request.nextUrl.origin}/api/strava/callback`;

  if (!clientId) {
    return NextResponse.json(
      { error: 'Strava client ID not configured' },
      { status: 500 }
    );
  }

  // Strava OAuth URL
  const stravaAuthUrl = new URL('https://www.strava.com/oauth/authorize');
  stravaAuthUrl.searchParams.append('client_id', clientId);
  stravaAuthUrl.searchParams.append('response_type', 'code');
  stravaAuthUrl.searchParams.append('redirect_uri', redirectUri);
  stravaAuthUrl.searchParams.append('approval_prompt', 'force');
  stravaAuthUrl.searchParams.append('scope', 'read,activity:read_all');

  return NextResponse.redirect(stravaAuthUrl.toString());
}