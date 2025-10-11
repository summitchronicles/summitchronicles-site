import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, storeGarminTokens } from '@/lib/integrations/garmin-oauth';

// Mark this route as dynamic to prevent static generation errors
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');

    // Handle OAuth callback from Garmin
    if (error) {
      console.error('Garmin OAuth error:', error);
      return NextResponse.redirect(
        new URL('/training?error=garmin_auth_failed', request.url)
      );
    }

    if (!code) {
      console.error('No authorization code received from Garmin');
      return NextResponse.redirect(
        new URL('/training?error=garmin_no_code', request.url)
      );
    }

    console.log('Garmin OAuth callback received, exchanging code for token...');

    // Exchange authorization code for access token
    const redirectUri = new URL('/api/garmin/callback', request.url).toString();
    const tokens = await exchangeCodeForToken(code, redirectUri);

    // Store tokens in database
    const userId = 'sunith'; // For now, single user
    await storeGarminTokens(userId, tokens);

    console.log('Garmin OAuth successful, tokens stored');

    return NextResponse.redirect(
      new URL('/training?garmin_auth=success', request.url)
    );

  } catch (error) {
    console.error('Garmin OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/training?error=garmin_callback_error&details=' + encodeURIComponent(error instanceof Error ? error.message : 'Unknown error'), request.url)
    );
  }
}