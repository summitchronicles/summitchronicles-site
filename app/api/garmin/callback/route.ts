import { NextRequest, NextResponse } from 'next/server';

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

    // TODO: Implement actual Garmin OAuth token exchange
    // For now, redirect to training page with success parameter
    console.log('Garmin OAuth callback received:', { code, state });

    return NextResponse.redirect(
      new URL('/training?garmin_auth=success', request.url)
    );

  } catch (error) {
    console.error('Garmin OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/training?error=garmin_callback_error', request.url)
    );
  }
}