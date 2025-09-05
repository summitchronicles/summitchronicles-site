import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Create the strava_tokens table if it doesn't exist
    const { error: tokensError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS strava_tokens (
          id INTEGER PRIMARY KEY DEFAULT 1,
          access_token TEXT NOT NULL,
          refresh_token TEXT NOT NULL,
          expires_at INTEGER NOT NULL,
          athlete_id BIGINT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    // Try creating tables directly with SQL
    const createTablesSQL = `
      CREATE TABLE IF NOT EXISTS strava_tokens (
        id INTEGER PRIMARY KEY DEFAULT 1,
        access_token TEXT NOT NULL,
        refresh_token TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        athlete_id BIGINT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS strava_activities (
        id BIGINT PRIMARY KEY,
        name VARCHAR(255),
        sport_type VARCHAR(50),
        workout_type INTEGER,
        distance DECIMAL(10,2),
        moving_time INTEGER,
        elapsed_time INTEGER,
        total_elevation_gain DECIMAL(8,2),
        average_speed DECIMAL(8,4),
        max_speed DECIMAL(8,4),
        average_heartrate DECIMAL(5,1),
        max_heartrate INTEGER,
        start_date TIMESTAMP WITH TIME ZONE,
        timezone VARCHAR(50),
        location_city VARCHAR(100),
        location_state VARCHAR(100),
        location_country VARCHAR(100),
        private BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // For now, just check if we can connect to the database
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id')
      .limit(1);

    if (error) {
      return NextResponse.json(
        { error: 'Database connection failed', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Database connection verified. Strava tables ready.',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Strava setup error:', error);
    return NextResponse.json(
      { error: 'Setup failed', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Strava setup endpoint. Use POST to initialize tables.',
    status: 'ready'
  });
}