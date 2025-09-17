import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { getSupabaseAdmin } from '@/lib/supabaseServer';
import { protectionPresets, ProtectedRequest } from '@/lib/api-protection';

export const GET = protectionPresets.adminEndpoint(
  async (request: ProtectedRequest) => {
    // User is already authenticated and authorized by the protection middleware

    try {
      const supabase = getSupabaseAdmin();

      // Get backup history
      const { data: backupLogs, error: logsError } = await supabase
        .from('backup_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(10);

      // Get database table sizes and record counts
      const tableStats = await getDatabaseStats();

      // Calculate backup health metrics
      const healthMetrics = calculateBackupHealth(backupLogs || []);

      return NextResponse.json({
        success: true,
        backup_logs: backupLogs || [],
        table_stats: tableStats,
        health_metrics: healthMetrics,
        last_updated: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('Backup status error:', error);
      return NextResponse.json(
        {
          error: 'Failed to fetch backup status',
          details: error.message,
        },
        { status: 500 }
      );
    }
  }
);

export const POST = protectionPresets.adminEndpoint(
  async (request: ProtectedRequest) => {
    // User is already authenticated and authorized by the protection middleware

    try {
      const { type = 'incremental', critical_only = false } =
        await request.json();

      // Trigger backup via internal API call
      const backupUrl = new URL('/api/backup/database', request.url);
      backupUrl.searchParams.set('type', type);
      if (critical_only) {
        backupUrl.searchParams.set('critical', 'true');
      }

      const cronSecret = process.env.CRON_SECRET || 'default-secret';

      const backupResponse = await fetch(backupUrl.toString(), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cronSecret}`,
          'Content-Type': 'application/json',
        },
      });

      const backupResult = await backupResponse.json();

      return NextResponse.json({
        success: true,
        message: 'Manual backup triggered',
        result: backupResult,
      });
    } catch (error: any) {
      return NextResponse.json(
        {
          error: 'Failed to trigger backup',
          details: error.message,
        },
        { status: 500 }
      );
    }
  }
);

async function getDatabaseStats() {
  const supabase = getSupabaseAdmin();

  const tables = [
    'blog_posts',
    'blog_categories',
    'blog_tags',
    'knowledge_base',
    'document_chunks',
    'strava_activities',
    'analytics_sessions',
    'analytics_page_views',
    'analytics_ai_interactions',
  ];

  const stats: Record<string, any> = {};

  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (!error) {
        stats[table] = {
          record_count: count || 0,
          status: 'accessible',
        };
      } else {
        stats[table] = {
          record_count: 0,
          status: 'error',
          error: error.message,
        };
      }
    } catch (error: any) {
      stats[table] = {
        record_count: 0,
        status: 'error',
        error: error.message,
      };
    }
  }

  return stats;
}

function calculateBackupHealth(backupLogs: any[]) {
  if (!backupLogs || backupLogs.length === 0) {
    return {
      status: 'no_backups',
      last_backup: null,
      success_rate: 0,
      avg_duration: 0,
      total_backups: 0,
      health_score: 0,
    };
  }

  const now = new Date();
  const lastBackup = new Date(backupLogs[0].timestamp);
  const hoursSinceLastBackup =
    (now.getTime() - lastBackup.getTime()) / (1000 * 60 * 60);

  // Calculate success rate (last 10 backups)
  const successfulBackups = backupLogs.filter((log) => log.success).length;
  const successRate = (successfulBackups / backupLogs.length) * 100;

  // Calculate average duration for successful backups
  const successfulDurations = backupLogs
    .filter((log) => log.success && log.duration)
    .map((log) => log.duration || 0);

  const avgDuration =
    successfulDurations.length > 0
      ? successfulDurations.reduce((a, b) => a + b, 0) /
        successfulDurations.length
      : 0;

  // Calculate health score (0-100)
  let healthScore = 100;

  // Penalize if last backup is old
  if (hoursSinceLastBackup > 26)
    healthScore -= 30; // More than 26 hours
  else if (hoursSinceLastBackup > 24) healthScore -= 10; // More than 24 hours

  // Penalize low success rate
  if (successRate < 80) healthScore -= 40;
  else if (successRate < 95) healthScore -= 20;

  // Penalize if backups are taking too long
  if (avgDuration > 60000) healthScore -= 10; // More than 1 minute

  return {
    status:
      healthScore >= 80
        ? 'healthy'
        : healthScore >= 60
          ? 'warning'
          : 'critical',
    last_backup: backupLogs[0],
    hours_since_last_backup: Math.round(hoursSinceLastBackup * 10) / 10,
    success_rate: Math.round(successRate),
    avg_duration_ms: Math.round(avgDuration),
    total_backups: backupLogs.length,
    health_score: Math.round(healthScore),
    recommendations: generateRecommendations(
      hoursSinceLastBackup,
      successRate,
      avgDuration
    ),
  };
}

function generateRecommendations(
  hoursSinceLastBackup: number,
  successRate: number,
  avgDuration: number
): string[] {
  const recommendations: string[] = [];

  if (hoursSinceLastBackup > 26) {
    recommendations.push(
      '⚠️ Last backup is overdue - check cron job configuration'
    );
  }

  if (successRate < 80) {
    recommendations.push(
      '🔧 Low backup success rate - investigate recent failures'
    );
  }

  if (avgDuration > 60000) {
    recommendations.push(
      '⏱️ Backup duration is high - consider optimizing or using incremental backups'
    );
  }

  if (successRate === 100 && hoursSinceLastBackup < 25) {
    recommendations.push('✅ Backup system is healthy and operating normally');
  }

  return recommendations;
}
