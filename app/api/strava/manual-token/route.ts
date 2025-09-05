import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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
      expires_at: 1757097696
    };

    console.log('Manually storing Strava token data');

    // Store in Supabase with minimal required fields
    const { error: storeError } = await supabase.from("strava_tokens").upsert({
      id: 1,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: tokenData.expires_at
    });

    if (storeError) {
      console.error('Supabase storage error:', storeError);
      return NextResponse.json({ error: 'Failed to store token', details: storeError }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Strava token stored successfully'
    });

  } catch (error: any) {
    console.error('Manual token error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}