import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Force dynamic rendering to prevent build-time execution
export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    // Use the working token data from our successful curl test
    const tokenData = {
      access_token: "1650f96e93841365cbbb46f7ee56137e1b4fe4c2",
      refresh_token: "6a7b9c080221422dc07960bd5d2f03ff935860cc", 
      expires_at: 1757097696,
      stored_at: new Date().toISOString()
    };

    console.log('Quick storing Strava token data...');

    // Store as a special blog post temporarily
    const { error: insertError } = await supabase
      .from('blog_posts')
      .upsert({
        id: 'strava-tokens-storage',
        title: 'Strava Tokens Storage',
        content: JSON.stringify(tokenData),
        slug: 'strava-tokens-storage',
        excerpt: 'Temporary storage for Strava authentication tokens',
        status: 'draft',
        category: 'System',
        featured: false
      });

    if (insertError) {
      console.error('Token storage error:', insertError);
      return NextResponse.json({ error: 'Failed to store tokens', details: insertError }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Strava tokens stored successfully as blog post',
      token_preview: {
        access_token: tokenData.access_token.slice(0, 10) + '...',
        expires_at: tokenData.expires_at
      }
    });

  } catch (error: any) {
    console.error('Quick store error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Get stored tokens
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('content')
      .eq('id', 'strava-tokens-storage')
      .single();

    if (error) {
      return NextResponse.json({ error: 'No tokens found', details: error }, { status: 404 });
    }

    const tokenData = JSON.parse(data.content);
    
    return NextResponse.json({ 
      success: true,
      tokens: {
        access_token: tokenData.access_token.slice(0, 10) + '...',
        expires_at: tokenData.expires_at,
        stored_at: tokenData.stored_at
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}