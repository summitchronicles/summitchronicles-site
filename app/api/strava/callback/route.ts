import { NextRequest, NextResponse } from 'next/server';
import { storeStravaTokens } from '@/lib/strava';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const baseUrl = request.nextUrl.origin;

  if (error) {
    return NextResponse.redirect(`${baseUrl}/admin?error=access_denied`);
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/admin?error=no_code`);
  }

  try {
    console.log('🔄 Starting token exchange with Strava...');
    console.log('📊 Environment check:', {
      client_id: process.env.STRAVA_CLIENT_ID ? 'SET' : 'MISSING',
      client_secret: process.env.STRAVA_CLIENT_SECRET ? 'SET' : 'MISSING',
      supabase_url: process.env.SUPABASE_URL ? 'SET' : 'MISSING',
      supabase_key: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING',
    });

    // Exchange code for access token
    const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
      }),
    });

    console.log(`📊 Strava token response status: ${tokenResponse.status}`);

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('❌ Strava token exchange failed:', errorData);
      throw new Error(`Failed to exchange code for token: ${errorData}`);
    }

    const tokenData = await tokenResponse.json();
    console.log('✅ Token exchange successful:', {
      athlete_id: tokenData.athlete?.id,
      athlete_name: `${tokenData.athlete?.firstname} ${tokenData.athlete?.lastname}`,
      expires_at: new Date(tokenData.expires_at * 1000).toISOString(),
      access_token_length: tokenData.access_token?.length || 0,
      refresh_token_length: tokenData.refresh_token?.length || 0,
    });

    // Store tokens using our library
    console.log('💾 Attempting to store tokens in Supabase...');
    try {
      await storeStravaTokens(tokenData);
      console.log('✅ Tokens stored successfully in Supabase');
    } catch (storageError) {
      console.error('❌ Token storage failed:', storageError);
      throw new Error(`Token storage failed: ${storageError.message}`);
    }

    console.log('✅ Strava connected successfully');

    return NextResponse.redirect(
      `${baseUrl}/training/realtime?success=strava_connected&athlete=${tokenData.athlete?.firstname}`
    );
  } catch (error) {
    console.error('❌ Strava OAuth error:', error);
    return NextResponse.redirect(`${baseUrl}/training/realtime?error=auth_failed&details=${encodeURIComponent(error.message)}`);
  }
}