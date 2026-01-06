import { NextResponse } from 'next/server';

const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_API_URL = 'https://graph.instagram.com/me/media';

export async function GET() {
  if (!INSTAGRAM_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: 'Instagram access token not configured', usingFallback: true },
      { status: 200 } // Return 200 to allow client to handle fallback gracefully
    );
  }

  try {
    const response = await fetch(
      `${INSTAGRAM_API_URL}?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${INSTAGRAM_ACCESS_TOKEN}&limit=2`
    );

    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Instagram posts', usingFallback: true },
      { status: 500 }
    );
  }
}
