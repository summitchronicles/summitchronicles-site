import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST() {
  try {
    console.log('Checking strava_tokens table structure...');

    // First, try to describe the table structure
    const { data: columns, error: columnsError } = await supabase
      .rpc('exec_sql', {
        sql: `
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = 'strava_tokens' 
          AND table_schema = 'public'
          ORDER BY ordinal_position;
        `
      });

    if (columnsError) {
      console.error('Error checking table structure:', columnsError);
      return NextResponse.json({ 
        error: 'Failed to check table structure', 
        details: columnsError 
      }, { status: 500 });
    }

    console.log('Current table columns:', columns);

    // Check if athlete_id column exists and drop it
    const { error: dropError } = await supabase
      .rpc('exec_sql', {
        sql: `ALTER TABLE strava_tokens DROP COLUMN IF EXISTS athlete_id;`
      });

    if (dropError) {
      console.error('Error dropping athlete_id column:', dropError);
      return NextResponse.json({ 
        error: 'Failed to drop athlete_id column', 
        details: dropError 
      }, { status: 500 });
    }

    // Get updated table structure
    const { data: updatedColumns } = await supabase
      .rpc('exec_sql', {
        sql: `
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = 'strava_tokens' 
          AND table_schema = 'public'
          ORDER BY ordinal_position;
        `
      });

    return NextResponse.json({ 
      success: true,
      message: 'Table structure fixed',
      original_columns: columns,
      updated_columns: updatedColumns
    });

  } catch (error: any) {
    console.error('Fix table error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}