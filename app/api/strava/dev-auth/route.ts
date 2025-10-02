import { NextRequest, NextResponse } from 'next/server';
import { storeStravaTokens } from '@/lib/strava';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { access_token, refresh_token, expires_at } = await request.json();

    if (!access_token || !refresh_token) {
      return NextResponse.json(
        { error: 'Missing required tokens' },
        { status: 400 }
      );
    }

    // Store tokens in Supabase
    await storeStravaTokens({
      access_token,
      refresh_token,
      expires_at: expires_at || Math.floor(Date.now() / 1000) + 3600
    });

    return NextResponse.json({
      success: true,
      message: 'Tokens stored successfully for development'
    });

  } catch (error) {
    console.error('Dev auth error:', error);
    return NextResponse.json(
      { error: 'Failed to store tokens' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const instructions = `
# Development Authentication for Strava

Since Strava only allows one redirect URI, here's how to get tokens for local development:

## Option 1: Use Production Tokens (Recommended)
1. Go to https://summitchronicles.com/api/strava/auth
2. Complete OAuth flow on production
3. Tokens will be stored in Supabase and work for both environments

## Option 2: Manual Token Entry
1. Go to https://www.strava.com/settings/api
2. Create a temporary app or use the existing one
3. Use this curl to exchange authorization code:

curl -X POST https://www.strava.com/oauth/token \\
  -d client_id=YOUR_CLIENT_ID \\
  -d client_secret=YOUR_CLIENT_SECRET \\
  -d code=YOUR_AUTH_CODE \\
  -d grant_type=authorization_code

4. Then POST the tokens here:

curl -X POST http://localhost:3001/api/strava/dev-auth \\
  -H "Content-Type: application/json" \\
  -d '{
    "access_token": "your_access_token",
    "refresh_token": "your_refresh_token",
    "expires_at": 1234567890
  }'

## Current Status
- Client ID: ${process.env.STRAVA_CLIENT_ID}
- Production redirect: https://summitchronicles.com/api/strava/callback
- Database: ${process.env.SUPABASE_URL ? 'Connected' : 'Not configured'}
  `;

  return new Response(instructions, {
    headers: { 'Content-Type': 'text/plain' }
  });
}