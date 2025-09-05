import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json();
    
    // Verify setup secret for security
    if (secret !== process.env.INGEST_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Create the required tables by running our setup SQL
    const setupSQL = `
      -- Analytics Sessions Table
      CREATE TABLE IF NOT EXISTS analytics_sessions (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          session_id VARCHAR(255) UNIQUE NOT NULL,
          user_id VARCHAR(255),
          ip_address INET,
          user_agent TEXT,
          country VARCHAR(10),
          device_type VARCHAR(50),
          browser VARCHAR(100),
          os VARCHAR(100),
          referrer TEXT,
          landing_page VARCHAR(500),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Analytics Page Views Table
      CREATE TABLE IF NOT EXISTS analytics_page_views (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          session_id UUID REFERENCES analytics_sessions(id) ON DELETE CASCADE,
          page_url VARCHAR(500) NOT NULL,
          page_title VARCHAR(255),
          duration_ms INTEGER DEFAULT 0,
          scroll_depth INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Web Vitals Table
      CREATE TABLE IF NOT EXISTS web_vitals (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          session_id UUID REFERENCES analytics_sessions(id) ON DELETE CASCADE,
          name VARCHAR(10) NOT NULL,
          value DECIMAL(10,2) NOT NULL,
          rating VARCHAR(20) NOT NULL,
          delta DECIMAL(10,2),
          entry_id VARCHAR(255),
          navigation_type VARCHAR(50),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- AI Interactions Table
      CREATE TABLE IF NOT EXISTS ai_interactions (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          session_id UUID REFERENCES analytics_sessions(id) ON DELETE CASCADE,
          question TEXT NOT NULL,
          answer TEXT NOT NULL,
          model VARCHAR(50),
          response_time_ms INTEGER,
          rating INTEGER CHECK (rating >= 1 AND rating <= 5),
          category VARCHAR(50),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Strava Tokens Table
      CREATE TABLE IF NOT EXISTS strava_tokens (
          id INTEGER PRIMARY KEY DEFAULT 1,
          access_token TEXT NOT NULL,
          refresh_token TEXT NOT NULL,
          expires_at INTEGER NOT NULL,
          athlete_id BIGINT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Strava Activities Table
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

      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_analytics_sessions_session_id ON analytics_sessions(session_id);
      CREATE INDEX IF NOT EXISTS idx_analytics_sessions_created_at ON analytics_sessions(created_at);
      CREATE INDEX IF NOT EXISTS idx_analytics_page_views_session_id ON analytics_page_views(session_id);
      CREATE INDEX IF NOT EXISTS idx_web_vitals_session_id ON web_vitals(session_id);
      CREATE INDEX IF NOT EXISTS idx_ai_interactions_session_id ON ai_interactions(session_id);
      CREATE INDEX IF NOT EXISTS idx_strava_activities_start_date ON strava_activities(start_date);
      CREATE INDEX IF NOT EXISTS idx_strava_activities_sport_type ON strava_activities(sport_type);
    `;

    // Execute the setup SQL
    const { error: sqlError } = await supabase.rpc('exec_sql', { 
      sql: setupSQL 
    });

    if (sqlError) {
      console.error('Database setup error:', sqlError);
      return NextResponse.json(
        { error: 'Failed to setup database tables', details: sqlError.message },
        { status: 500 }
      );
    }

    // Insert some sample data for testing
    await insertSampleData();

    return NextResponse.json({ 
      success: true,
      message: 'Database setup completed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Setup failed', details: error.message },
      { status: 500 }
    );
  }
}

async function insertSampleData() {
  try {
    // Insert sample analytics session
    const sessionId = crypto.randomUUID();
    await supabase.from('analytics_sessions').insert({
      session_id: sessionId,
      ip_address: '127.0.0.1',
      user_agent: 'Sample Browser',
      country: 'US',
      device_type: 'desktop',
      browser: 'Chrome',
      os: 'macOS',
      landing_page: '/'
    });

    // Insert sample AI interaction
    await supabase.from('ai_interactions').insert({
      question: 'What is the best training for Everest?',
      answer: 'For Everest training, focus on cardiovascular endurance, strength training, and altitude acclimatization. A comprehensive program should include...',
      model: 'cohere',
      response_time_ms: 1500,
      rating: 5,
      category: 'training'
    });

    // Insert sample web vitals
    await supabase.from('web_vitals').insert([
      {
        name: 'LCP',
        value: 2.1,
        rating: 'good'
      },
      {
        name: 'FCP',
        value: 1.8,
        rating: 'good'
      },
      {
        name: 'CLS',
        value: 0.05,
        rating: 'good'
      }
    ]);

    console.log('✅ Sample data inserted successfully');
  } catch (error) {
    console.error('⚠️ Failed to insert sample data:', error);
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Database setup endpoint. Use POST with proper credentials.',
    requiredFields: ['secret']
  });
}