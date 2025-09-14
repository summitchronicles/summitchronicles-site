import { NextRequest, NextResponse } from 'next/server'
import { storeStravaTokens } from '@/lib/strava'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  if (error) {
    return NextResponse.redirect(`${baseUrl}/admin?error=access_denied`)
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/admin?error=no_code`)
  }

  try {
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
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Strava token exchange failed:', errorData)
      throw new Error('Failed to exchange code for token')
    }

    const tokenData = await tokenResponse.json()

    // Store tokens using our library
    storeStravaTokens(tokenData)

    console.log('✅ Strava connected successfully:', {
      athlete_id: tokenData.athlete?.id,
      athlete_name: `${tokenData.athlete?.firstname} ${tokenData.athlete?.lastname}`,
      expires_at: new Date(tokenData.expires_at * 1000).toISOString(),
    })

    return NextResponse.redirect(`${baseUrl}/admin?success=strava_connected&athlete=${tokenData.athlete?.firstname}`)
  } catch (error) {
    console.error('Strava OAuth error:', error)
    return NextResponse.redirect(`${baseUrl}/admin?error=auth_failed`)
  }
}