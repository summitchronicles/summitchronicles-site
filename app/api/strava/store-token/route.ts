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

    console.log('Storing Strava token data in clean table...');

    // Create a clean table with exact schema we need
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS strava_auth_tokens (
          id INTEGER PRIMARY KEY DEFAULT 1,
          access_token TEXT NOT NULL,
          refresh_token TEXT NOT NULL,
          expires_at INTEGER NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (createError) {
      console.error('Table creation error:', createError);
      return NextResponse.json({ error: 'Failed to create table', details: createError }, { status: 500 });
    }

    // Insert the token data
    const { error: insertError } = await supabase
      .from('strava_auth_tokens')
      .insert({
        id: 1,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: tokenData.expires_at
      });

    if (insertError) {
      console.error('Token insert error:', insertError);
      return NextResponse.json({ error: 'Failed to insert token', details: insertError }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Strava token stored successfully in clean table',
      table: 'strava_auth_tokens'
    });

  } catch (error: any) {
    console.error('Store token error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}