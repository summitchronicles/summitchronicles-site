import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken, storeGarminTokens, getRequestTokenFromState } from '@/lib/integrations/garmin-oauth-1.0a';

// Mark this route as dynamic to prevent static generation errors
export const dynamic = 'force-dynamic';

/**
 * Step 3 of OAuth 1.0a flow: Exchange oauth_verifier for access token
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const oauth_token = searchParams.get('oauth_token');
    const oauth_verifier = searchParams.get('oauth_verifier');
    const error = searchParams.get('error');

    // Handle OAuth callback from Garmin
    if (error) {
      console.error('Garmin OAuth error:', error);
      return NextResponse.redirect(
        new URL('/training?error=garmin_auth_failed', request.url)
      );
    }

    if (!oauth_token || !oauth_verifier) {
      console.error('Missing oauth_token or oauth_verifier from Garmin');
      return NextResponse.redirect(
        new URL('/training?error=garmin_no_token', request.url)
      );
    }

    console.log('Garmin OAuth 1.0a callback received, exchanging for access token...');

    // Get the request token secret from temporary storage
    // In OAuth 1.0a, Garmin returns oauth_token, we need to find the matching secret
    const requestTokenData = getRequestTokenFromState(oauth_token);

    if (!requestTokenData) {
      console.error('Could not find request token secret for oauth_token:', oauth_token);
      // Fallback: try to proceed without state (some implementations store it differently)
      // For now, return error
      return NextResponse.redirect(
        new URL('/training?error=garmin_token_mismatch', request.url)
      );
    }

    // Exchange oauth_verifier for access token
    const tokens = await getAccessToken(
      oauth_token,
      requestTokenData.oauth_token_secret,
      oauth_verifier
    );

    // Store access tokens in database
    const userId = 'sunith'; // For now, single user
    await storeGarminTokens(userId, tokens);

    console.log('Garmin OAuth 1.0a successful, access tokens stored');

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