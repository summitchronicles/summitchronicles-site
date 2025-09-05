import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    console.log('Fixing Strava tokens table schema...');

    // Step 1: Drop the existing table completely to clear schema cache
    const dropResult = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!
      },
      body: JSON.stringify({
        sql: 'DROP TABLE IF EXISTS strava_tokens CASCADE;'
      })
    });

    // Step 2: Create clean table with only required columns
    const createResult = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY!
      },
      body: JSON.stringify({
        sql: `
          CREATE TABLE strava_tokens (
            id INTEGER PRIMARY KEY DEFAULT 1,
            access_token TEXT NOT NULL,
            refresh_token TEXT NOT NULL,  
            expires_at BIGINT NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
          
          -- Insert the working tokens immediately
          INSERT INTO strava_tokens (id, access_token, refresh_token, expires_at) 
          VALUES (1, '1650f96e93841365cbbb46f7ee56137e1b4fe4c2', '6a7b9c080221422dc07960bd5d2f03ff935860cc', 1757097696)
          ON CONFLICT (id) DO UPDATE SET 
            access_token = EXCLUDED.access_token,
            refresh_token = EXCLUDED.refresh_token,
            expires_at = EXCLUDED.expires_at,
            updated_at = NOW();
        `
      })
    });

    if (!createResult.ok) {
      const error = await createResult.text();
      return NextResponse.json({ 
        error: 'Failed to create table', 
        details: error 
      }, { status: 500 });
    }

    // Step 3: Verify the tokens are stored
    const { data: stored, error: selectError } = await supabase
      .from('strava_tokens')
      .select('*')
      .eq('id', 1)
      .single();

    if (selectError) {
      return NextResponse.json({ 
        error: 'Failed to verify storage', 
        details: selectError 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Schema fixed and tokens stored successfully',
      stored_token: {
        id: stored.id,
        access_token: stored.access_token.slice(0, 10) + '...',
        expires_at: stored.expires_at,
        created_at: stored.created_at
      }
    });

  } catch (error: any) {
    console.error('Schema fix error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}