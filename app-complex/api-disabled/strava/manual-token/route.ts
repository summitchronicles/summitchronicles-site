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
      expires_at: 1757097696
    };

    console.log('Manually storing Strava token data');

    // Store in Supabase with minimal required fields - use insert/update to avoid schema cache issues
    const { data: existing } = await supabase.from("strava_tokens").select('id').eq('id', 1).single();
    
    let storeError;
    if (existing) {
      // Update existing record
      const { error } = await supabase
        .from("strava_tokens")
        .update({
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: tokenData.expires_at,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);
      storeError = error;
    } else {
      // Insert new record
      const { error } = await supabase
        .from("strava_tokens")
        .insert({
          id: 1,
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: tokenData.expires_at
        });
      storeError = error;
    }

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