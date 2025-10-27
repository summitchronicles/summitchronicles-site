import { NextRequest, NextResponse } from 'next/server';
import { getRequestToken, getAuthorizationUrl, storeRequestToken } from '@/lib/integrations/garmin-oauth-1.0a';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

/**
 * Step 1 of OAuth 1.0a flow: Get request token and redirect to Garmin
 */
export async function GET(request: NextRequest) {
  try {
    // Generate callback URL
    const callbackUrl = new URL('/api/garmin/callback', request.url).toString();

    // Get request token from Garmin
    const { oauth_token, oauth_token_secret } = await getRequestToken(callbackUrl);

    // Generate state for CSRF protection
    const state = crypto.randomBytes(16).toString('hex');

    // Store request token temporarily (needed for step 3)
    await storeRequestToken(state, oauth_token, oauth_token_secret);

    // Generate authorization URL
    const authUrl = getAuthorizationUrl(oauth_token);

    // Redirect user to Garmin authorization page
    return NextResponse.redirect(authUrl);

  } catch (error) {
    console.error('Garmin connect error:', error);
    return NextResponse.redirect(
      new URL('/training?error=garmin_connect_failed&details=' + encodeURIComponent(error instanceof Error ? error.message : 'Unknown error'), request.url)
    );
  }
}
