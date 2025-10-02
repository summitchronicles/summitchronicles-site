import { NextRequest, NextResponse } from 'next/server';
import GarminAPIClient, { GarminTokens } from '../../../../lib/garmin-api';

const GARMIN_CLIENT_ID = process.env.GARMIN_CLIENT_ID;
const GARMIN_CLIENT_SECRET = process.env.GARMIN_CLIENT_SECRET;
const GARMIN_REDIRECT_URI = process.env.GARMIN_REDIRECT_URI || 'http://localhost:3000/api/garmin/callback';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Check for OAuth errors
    if (error) {
      const errorDescription = searchParams.get('error_description');
      console.error('Garmin OAuth error:', error, errorDescription);

      return NextResponse.redirect(
        new URL(
          `/training/realtime?error=${encodeURIComponent(error)}&message=${encodeURIComponent(errorDescription || 'Authentication failed')}`,
          request.url
        )
      );
    }

    // Validate required parameters
    if (!code || !state) {
      return NextResponse.redirect(
        new URL(
          '/training/realtime?error=missing_params&message=Missing authorization code or state',
          request.url
        )
      );
    }

    // Verify state parameter (CSRF protection)
    const storedState = request.cookies.get('garmin_oauth_state')?.value;
    if (!storedState || storedState !== state) {
      return NextResponse.redirect(
        new URL(
          '/training/realtime?error=invalid_state&message=Invalid state parameter',
          request.url
        )
      );
    }

    // Validate environment configuration
    if (!GARMIN_CLIENT_ID || !GARMIN_CLIENT_SECRET) {
      console.error('Missing Garmin OAuth configuration');
      return NextResponse.redirect(
        new URL(
          '/training/realtime?error=config_error&message=Garmin OAuth not properly configured',
          request.url
        )
      );
    }

    // Exchange authorization code for tokens
    const garminClient = new GarminAPIClient();

    try {
      const tokens = await garminClient.exchangeCodeForTokens(
        code,
        GARMIN_CLIENT_ID,
        GARMIN_CLIENT_SECRET,
        GARMIN_REDIRECT_URI
      );

      // Store tokens securely
      // In a production app, you'd store these in a database or secure session
      // For now, we'll demonstrate with a secure cookie approach
      const response = NextResponse.redirect(
        new URL('/training/realtime?success=true&message=Successfully connected to Garmin Connect', request.url)
      );

      // Store tokens in secure httpOnly cookies (temporary solution)
      // In production, use a database with user sessions
      response.cookies.set('garmin_access_token', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: tokens.expiresAt - Date.now(),
      });

      response.cookies.set('garmin_refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      response.cookies.set('garmin_token_expires', tokens.expiresAt.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: tokens.expiresAt - Date.now(),
      });

      // Clear the OAuth state cookie
      response.cookies.delete('garmin_oauth_state');

      // Log successful authentication
      console.log('✅ Garmin Connect authentication successful');

      return response;

    } catch (tokenError) {
      console.error('Token exchange error:', tokenError);
      return NextResponse.redirect(
        new URL(
          `/training/realtime?error=token_exchange&message=${encodeURIComponent('Failed to exchange authorization code for tokens')}`,
          request.url
        )
      );
    }

  } catch (error) {
    console.error('Garmin OAuth callback error:', error);
    return NextResponse.redirect(
      new URL(
        `/training/realtime?error=callback_error&message=${encodeURIComponent('Authentication callback failed')}`,
        request.url
      )
    );
  }
}

