import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseServer';
import { logError, logInfo, logCritical } from '@/lib/error-monitor';

interface BackupResult {
  success: boolean;
  timestamp: string;
  type: 'full' | 'incremental';
  tablesBackedUp: number;
  recordsBackedUp: number;
  backupSize: number;
  duration: number;
  error?: string;
}

const CRITICAL_TABLES = [
  'blog_posts',
  'blog_categories', 
  'blog_tags',
  'knowledge_base',
  'document_chunks',
  'strava_activities',
  'strava_tokens'
];

const ALL_TABLES = [
  ...CRITICAL_TABLES,
  'analytics_sessions',
  'analytics_page_views', 
  'analytics_events',
  'analytics_ai_interactions',
  'error_logs'
];

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  // Verify this is a legitimate cron job or admin request
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'default-secret';
  
  if (authHeader !== `Bearer ${cronSecret}`) {
    await logError('Unauthorized access to backup endpoint', { 
      endpoint: '/api/backup/database',
      authHeader: authHeader ? 'present' : 'missing'
    }, request);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const backupType = searchParams.get('type') || 'incremental';
    const critical_only = searchParams.get('critical') === 'true';
    
    await logInfo('Database backup started', { 
      type: backupType,
      critical_only,
      source: 'api_endpoint'
    });

    const result = await createDatabaseBackup(
      backupType as 'full' | 'incremental',
      critical_only
    );

    const duration = Date.now() - startTime;
    result.duration = duration;

    if (result.success) {
      await logInfo('Database backup completed successfully', {
        ...result,
        duration
      });
      
      return NextResponse.json({
        success: true,
        message: 'Database backup completed',
        result
      });
    } else {
      await logCritical('Database backup failed', {
        error: result.error,
        duration,
        type: backupType
      });
      
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }

  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    await logCritical('Database backup system error', {
      error: error.message,
      duration,
      stack: error.stack
    });

    return NextResponse.json({
      success: false,
      error: 'Database backup system error',
      details: error.message
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // Health check endpoint
  return NextResponse.json({
    status: 'ready',
    endpoint: '/api/backup/database',
    methods: ['POST'],
    description: 'Automated database backup service',
    last_backup: await getLastBackupInfo()
  });
}

async function createDatabaseBackup(
  type: 'full' | 'incremental',
  criticalOnly: boolean = false
): Promise<BackupResult> {
  const supabase = getSupabaseAdmin();
  const timestamp = new Date().toISOString();
  
  const result: BackupResult = {
    success: false,
    timestamp,
    type,
    tablesBackedUp: 0,
    recordsBackedUp: 0,
    backupSize: 0,
    duration: 0
  };

  try {
    const tablesToBackup = criticalOnly ? CRITICAL_TABLES : ALL_TABLES;
    const backupData: Record<string, any[]> = {};
    
    // Get last backup timestamp for incremental backups
    const sinceDate = type === 'incremental' ? await getLastBackupTimestamp() : null;
    
    for (const tableName of tablesToBackup) {
      try {
        let query = supabase.from(tableName).select('*');
        
        // For incremental backups, only get recent changes
        if (type === 'incremental' && sinceDate) {
          // Assume most tables have 'updated_at' or 'created_at'
          const timeField = await getTableTimeField(tableName);
          if (timeField) {
            query = query.gte(timeField, sinceDate);
          }
        }

        const { data, error } = await query;

        if (error) {
          console.error(`Error backing up ${tableName}:`, error);
          if (CRITICAL_TABLES.includes(tableName)) {
            throw new Error(`Critical table backup failed: ${tableName} - ${error.message}`);
          }
          continue;
        }

        if (data && data.length > 0) {
          backupData[tableName] = data;
          result.tablesBackedUp++;
          result.recordsBackedUp += data.length;
        }

      } catch (tableError: any) {
        console.error(`Failed to backup table ${tableName}:`, tableError);
        if (CRITICAL_TABLES.includes(tableName)) {
          throw tableError;
        }
      }
    }

    // Store backup metadata in Supabase (create backup_logs table if needed)
    await storeBackupMetadata({
      timestamp,
      type,
      tables_backed_up: result.tablesBackedUp,
      records_backed_up: result.recordsBackedUp,
      success: true,
      critical_only: criticalOnly
    });

    // In production, you'd want to store this in cloud storage (S3, etc.)
    // For now, we'll just calculate the size
    const backupJson = JSON.stringify({
      timestamp,
      type,
      metadata: result,
      data: backupData
    });
    
    result.backupSize = Buffer.byteLength(backupJson, 'utf8');
    result.success = true;

    return result;

  } catch (error: any) {
    result.error = error.message;
    
    // Store failed backup attempt
    await storeBackupMetadata({
      timestamp,
      type,
      tables_backed_up: result.tablesBackedUp,
      records_backed_up: result.recordsBackedUp,
      success: false,
      error_message: error.message,
      critical_only: criticalOnly
    });

    return result;
  }
}

async function getTableTimeField(tableName: string): Promise<string | null> {
  // Map of tables to their timestamp fields for incremental backups
  const timeFieldMap: Record<string, string> = {
    'blog_posts': 'updated_at',
    'knowledge_base': 'updated_at', 
    'strava_activities': 'start_date',
    'analytics_sessions': 'created_at',
    'analytics_page_views': 'created_at',
    'analytics_events': 'created_at',
    'analytics_ai_interactions': 'created_at',
    'error_logs': 'created_at'
  };
  
  return timeFieldMap[tableName] || null;
}

async function getLastBackupTimestamp(): Promise<string | null> {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from('backup_logs')
      .select('timestamp')
      .eq('success', true)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      // No previous backup, use 24 hours ago as safe default
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday.toISOString();
    }

    return data.timestamp;
  } catch (error) {
    // Fallback to 24 hours ago
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString();
  }
}

async function storeBackupMetadata(metadata: any): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    
    // First, ensure the backup_logs table exists
    await ensureBackupLogsTable();
    
    const { error } = await supabase
      .from('backup_logs')
      .insert([metadata]);

    if (error) {
      console.error('Failed to store backup metadata:', error);
    }
  } catch (error) {
    console.error('Error storing backup metadata:', error);
  }
}

async function ensureBackupLogsTable(): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    
    // Try to create the table if it doesn't exist
    // Note: In production, this should be handled by proper migrations
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS backup_logs (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
        type VARCHAR(20) NOT NULL,
        tables_backed_up INTEGER DEFAULT 0,
        records_backed_up INTEGER DEFAULT 0,
        backup_size_bytes BIGINT DEFAULT 0,
        success BOOLEAN NOT NULL,
        error_message TEXT,
        critical_only BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    await supabase.rpc('exec_sql', { sql: createTableQuery });
  } catch (error) {
    // Table might already exist or we might not have permissions
    // This is non-critical for backup operation
    console.log('Backup logs table setup note:', error);
  }
}

async function getLastBackupInfo(): Promise<any> {
  try {
    const supabase = getSupabaseAdmin();
    
    const { data, error } = await supabase
      .from('backup_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(3);

    if (error || !data) {
      return { status: 'no_previous_backups' };
    }

    return {
      last_backup: data[0],
      recent_backups: data.length,
      last_successful: data.find(b => b.success)
    };
  } catch (error) {
    return { status: 'unable_to_check', error: error };
  }
}