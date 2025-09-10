#!/usr/bin/env tsx

/**
 * Summit Chronicles Database Backup Script
 * 
 * This script creates automated backups of all critical Supabase data
 * including blog posts, analytics, Strava data, and knowledge base.
 * 
 * Usage:
 *   npx tsx scripts/database-backup.ts
 *   npx tsx scripts/database-backup.ts --type=incremental
 *   npx tsx scripts/database-backup.ts --restore=backup-2025-01-01.json
 */

import fs from 'fs/promises';
import path from 'path';
import { getSupabaseAdmin } from '../lib/supabaseServer';

interface BackupConfig {
  backupPath: string;
  maxBackups: number;
  compressionEnabled: boolean;
  tables: {
    name: string;
    critical: boolean;
    incrementalKey?: string;
  }[];
}

const config: BackupConfig = {
  backupPath: './backups',
  maxBackups: 30, // Keep 30 days of backups
  compressionEnabled: true,
  tables: [
    // Critical business data
    { name: 'blog_posts', critical: true, incrementalKey: 'updated_at' },
    { name: 'blog_categories', critical: true },
    { name: 'blog_tags', critical: true },
    { name: 'blog_post_tags', critical: true },
    { name: 'blog_media', critical: true },
    
    // Knowledge base (RAG system)
    { name: 'knowledge_base', critical: true, incrementalKey: 'updated_at' },
    { name: 'document_chunks', critical: true },
    
    // Strava integration data
    { name: 'strava_activities', critical: true, incrementalKey: 'start_date' },
    { name: 'strava_tokens', critical: true },
    
    // Analytics (less critical, but important for insights)
    { name: 'analytics_sessions', critical: false, incrementalKey: 'created_at' },
    { name: 'analytics_page_views', critical: false, incrementalKey: 'created_at' },
    { name: 'analytics_events', critical: false, incrementalKey: 'created_at' },
    { name: 'analytics_ai_interactions', critical: false, incrementalKey: 'created_at' },
    
    // Error monitoring
    { name: 'error_logs', critical: false, incrementalKey: 'created_at' },
  ]
};

class DatabaseBackup {
  private supabase = getSupabaseAdmin();
  private timestamp = new Date().toISOString().split('T')[0];
  
  async createFullBackup(): Promise<string> {
    console.log('🔄 Starting full database backup...');
    
    const backup = {
      timestamp: new Date().toISOString(),
      type: 'full',
      version: '1.0',
      metadata: {
        created_by: 'Summit Chronicles Backup System',
        tables_count: config.tables.length,
        backup_size: 0
      },
      data: {} as Record<string, any[]>
    };

    // Ensure backup directory exists
    await this.ensureBackupDirectory();

    // Backup each table
    for (const table of config.tables) {
      try {
        console.log(`📄 Backing up table: ${table.name}`);
        const { data, error } = await this.supabase
          .from(table.name)
          .select('*');

        if (error) {
          console.error(`❌ Error backing up ${table.name}:`, error);
          if (table.critical) {
            throw new Error(`Critical table backup failed: ${table.name}`);
          }
          continue;
        }

        backup.data[table.name] = data || [];
        console.log(`✅ Backed up ${data?.length || 0} records from ${table.name}`);
      } catch (error) {
        console.error(`❌ Failed to backup ${table.name}:`, error);
        if (table.critical) {
          throw error;
        }
      }
    }

    // Calculate backup size
    const backupJson = JSON.stringify(backup, null, 2);
    backup.metadata.backup_size = Buffer.byteLength(backupJson, 'utf8');

    // Save backup file
    const filename = `backup-full-${this.timestamp}.json`;
    const filepath = path.join(config.backupPath, filename);
    
    await fs.writeFile(filepath, backupJson, 'utf8');
    
    console.log(`✅ Full backup completed: ${filename}`);
    console.log(`📊 Backup size: ${(backup.metadata.backup_size / 1024 / 1024).toFixed(2)} MB`);
    
    // Clean up old backups
    await this.cleanupOldBackups();
    
    return filepath;
  }

  async createIncrementalBackup(sinceDate?: string): Promise<string> {
    console.log('🔄 Starting incremental database backup...');
    
    const since = sinceDate || this.getLastBackupDate();
    if (!since) {
      console.log('📝 No previous backup found, creating full backup instead...');
      return this.createFullBackup();
    }

    const backup = {
      timestamp: new Date().toISOString(),
      type: 'incremental',
      since_date: since,
      version: '1.0',
      metadata: {
        created_by: 'Summit Chronicles Backup System',
        tables_count: 0,
        backup_size: 0
      },
      data: {} as Record<string, any[]>
    };

    await this.ensureBackupDirectory();

    // Backup only changed records
    for (const table of config.tables) {
      if (!table.incrementalKey) {
        console.log(`⏭️  Skipping ${table.name} (no incremental key)`);
        continue;
      }

      try {
        console.log(`📄 Backing up incremental data from: ${table.name}`);
        const { data, error } = await this.supabase
          .from(table.name)
          .select('*')
          .gte(table.incrementalKey, since);

        if (error) {
          console.error(`❌ Error backing up ${table.name}:`, error);
          if (table.critical) {
            throw new Error(`Critical table backup failed: ${table.name}`);
          }
          continue;
        }

        if (data && data.length > 0) {
          backup.data[table.name] = data;
          backup.metadata.tables_count++;
          console.log(`✅ Backed up ${data.length} changed records from ${table.name}`);
        } else {
          console.log(`📝 No changes in ${table.name} since ${since}`);
        }
      } catch (error) {
        console.error(`❌ Failed to backup ${table.name}:`, error);
        if (table.critical) {
          throw error;
        }
      }
    }

    const backupJson = JSON.stringify(backup, null, 2);
    backup.metadata.backup_size = Buffer.byteLength(backupJson, 'utf8');

    const filename = `backup-incremental-${this.timestamp}.json`;
    const filepath = path.join(config.backupPath, filename);
    
    await fs.writeFile(filepath, backupJson, 'utf8');
    
    console.log(`✅ Incremental backup completed: ${filename}`);
    console.log(`📊 Backup size: ${(backup.metadata.backup_size / 1024).toFixed(2)} KB`);
    
    return filepath;
  }

  async restoreFromBackup(backupPath: string): Promise<void> {
    console.log(`🔄 Starting database restore from: ${backupPath}`);
    
    // Read backup file
    const backupContent = await fs.readFile(backupPath, 'utf8');
    const backup = JSON.parse(backupContent);
    
    console.log(`📝 Restore info: ${backup.type} backup from ${backup.timestamp}`);
    console.log(`📊 Tables to restore: ${Object.keys(backup.data).length}`);
    
    // Confirm restore operation
    console.log('\n⚠️  WARNING: This will overwrite existing data!');
    console.log('🔄 Proceeding with restore in 5 seconds...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Restore each table
    for (const [tableName, records] of Object.entries(backup.data)) {
      if (!Array.isArray(records) || records.length === 0) {
        console.log(`⏭️  Skipping empty table: ${tableName}`);
        continue;
      }

      try {
        console.log(`📄 Restoring ${records.length} records to: ${tableName}`);
        
        // For full backups, clear table first
        if (backup.type === 'full') {
          const { error: deleteError } = await this.supabase
            .from(tableName)
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
          
          if (deleteError) {
            console.warn(`⚠️  Could not clear ${tableName}:`, deleteError.message);
          }
        }

        // Insert records in batches
        const batchSize = 100;
        for (let i = 0; i < records.length; i += batchSize) {
          const batch = records.slice(i, i + batchSize);
          
          const { error } = await this.supabase
            .from(tableName)
            .upsert(batch, { onConflict: 'id' });

          if (error) {
            console.error(`❌ Error restoring batch ${Math.floor(i/batchSize) + 1} to ${tableName}:`, error);
            throw error;
          }
        }
        
        console.log(`✅ Restored ${records.length} records to ${tableName}`);
      } catch (error) {
        console.error(`❌ Failed to restore ${tableName}:`, error);
        throw error;
      }
    }

    console.log('✅ Database restore completed successfully!');
  }

  async testBackupIntegrity(backupPath: string): Promise<boolean> {
    console.log(`🔍 Testing backup integrity: ${backupPath}`);
    
    try {
      const backupContent = await fs.readFile(backupPath, 'utf8');
      const backup = JSON.parse(backupContent);
      
      // Validate backup structure
      if (!backup.timestamp || !backup.type || !backup.data) {
        console.error('❌ Invalid backup structure');
        return false;
      }

      // Validate data integrity
      let totalRecords = 0;
      for (const [tableName, records] of Object.entries(backup.data)) {
        if (!Array.isArray(records)) {
          console.error(`❌ Invalid data format for table: ${tableName}`);
          return false;
        }
        totalRecords += records.length;
      }

      console.log(`✅ Backup integrity check passed`);
      console.log(`📊 Total records: ${totalRecords}`);
      console.log(`📅 Backup date: ${backup.timestamp}`);
      console.log(`📋 Backup type: ${backup.type}`);
      
      return true;
    } catch (error) {
      console.error('❌ Backup integrity test failed:', error);
      return false;
    }
  }

  private async ensureBackupDirectory(): Promise<void> {
    try {
      await fs.access(config.backupPath);
    } catch {
      await fs.mkdir(config.backupPath, { recursive: true });
      console.log(`📁 Created backup directory: ${config.backupPath}`);
    }
  }

  private async cleanupOldBackups(): Promise<void> {
    try {
      const files = await fs.readdir(config.backupPath);
      const backupFiles = files
        .filter(file => file.startsWith('backup-') && file.endsWith('.json'))
        .map(file => ({
          name: file,
          path: path.join(config.backupPath, file),
          date: this.extractDateFromFilename(file)
        }))
        .filter(file => file.date)
        .sort((a, b) => b.date!.getTime() - a.date!.getTime());

      if (backupFiles.length > config.maxBackups) {
        const filesToDelete = backupFiles.slice(config.maxBackups);
        
        for (const file of filesToDelete) {
          await fs.unlink(file.path);
          console.log(`🗑️  Deleted old backup: ${file.name}`);
        }
      }
    } catch (error) {
      console.warn('⚠️  Could not cleanup old backups:', error);
    }
  }

  private getLastBackupDate(): string | null {
    // This would typically check the last backup file
    // For now, return yesterday as a safe default
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString();
  }

  private extractDateFromFilename(filename: string): Date | null {
    const match = filename.match(/backup-\w+-(\d{4}-\d{2}-\d{2})/);
    return match ? new Date(match[1]) : null;
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const backup = new DatabaseBackup();

  try {
    if (args.includes('--help')) {
      console.log(`
Summit Chronicles Database Backup Tool

Usage:
  npx tsx scripts/database-backup.ts                    Create full backup
  npx tsx scripts/database-backup.ts --type=incremental Create incremental backup
  npx tsx scripts/database-backup.ts --restore=FILE     Restore from backup
  npx tsx scripts/database-backup.ts --test=FILE        Test backup integrity
  npx tsx scripts/database-backup.ts --help             Show this help

Examples:
  npx tsx scripts/database-backup.ts
  npx tsx scripts/database-backup.ts --type=incremental
  npx tsx scripts/database-backup.ts --restore=./backups/backup-full-2025-01-01.json
  npx tsx scripts/database-backup.ts --test=./backups/backup-full-2025-01-01.json
      `);
      return;
    }

    const restoreFile = args.find(arg => arg.startsWith('--restore='))?.split('=')[1];
    const testFile = args.find(arg => arg.startsWith('--test='))?.split('=')[1];
    const backupType = args.find(arg => arg.startsWith('--type='))?.split('=')[1];

    if (restoreFile) {
      await backup.restoreFromBackup(restoreFile);
    } else if (testFile) {
      const isValid = await backup.testBackupIntegrity(testFile);
      process.exit(isValid ? 0 : 1);
    } else if (backupType === 'incremental') {
      await backup.createIncrementalBackup();
    } else {
      await backup.createFullBackup();
    }

  } catch (error) {
    console.error('❌ Backup operation failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export { DatabaseBackup };