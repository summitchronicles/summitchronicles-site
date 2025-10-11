#!/usr/bin/env node

/**
 * Upload all sheets from Excel to Supabase
 */

import { createClient } from '@supabase/supabase-js';
import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read environment variables
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const SUPABASE_URL = envContent.match(/SUPABASE_URL=(.+)/)?.[1]?.trim();
const SUPABASE_SERVICE_ROLE_KEY = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/)?.[1]?.trim();

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const EXCEL_FILE = '/Users/sunith/Downloads/Training for the 7 summits.xlsx';

console.log('🏔️  Uploading All Sheets: 7 Summits Training Data\n');

const workbook = XLSX.readFile(EXCEL_FILE);

for (const sheetName of workbook.SheetNames) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 Processing Sheet: "${sheetName}"`);
  console.log('='.repeat(60));

  const sheet = workbook.Sheets[sheetName];
  const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

  console.log(`   Total rows: ${rawData.length - 1}`);

  // Parse headers
  const headers = rawData[0].map(h =>
    String(h || '').toLowerCase().trim().replace(/\s+/g, '_').replace(/[()]/g, '')
  );

  const workouts = [];
  const errors = [];

  // Different parsing logic based on sheet
  if (sheetName === '7') {
    // Already processed - skip
    console.log('   ✓ Already uploaded (skipping)');
    continue;

  } else if (sheetName === 'Uphill Athlete' || sheetName === 'Everest 2027') {
    // TrainingPeaks export format
    const col = {
      title: headers.indexOf('title'),
      workout_type: headers.indexOf('workouttype'),
      description: headers.indexOf('workoutdescription'),
      planned_duration: headers.indexOf('plannedduration'),
      date: headers.indexOf('workoutday'),
      actual_duration: headers.indexOf('timetotalinhours'),
      distance: headers.indexOf('distanceinmeters'),
      hr_avg: headers.indexOf('heartrateaverage'),
      hr_max: headers.indexOf('heartratemax'),
      rpe: headers.indexOf('rpe'),
      tss: headers.indexOf('tss'),
      notes: headers.indexOf('athletecomments'),
      coach_notes: headers.indexOf('coachcomments')
    };

    for (let i = 1; i < rawData.length; i++) {
      const row = rawData[i];

      try {
        // Parse date from Excel serial
        let date;
        if (typeof row[col.date] === 'number') {
          const excelDate = XLSX.SSF.parse_date_code(row[col.date]);
          date = `${excelDate.y}-${String(excelDate.m).padStart(2, '0')}-${String(excelDate.d).padStart(2, '0')}`;
        } else {
          date = row[col.date];
        }

        // Convert hours to minutes for duration
        const actual_duration = row[col.actual_duration]
          ? Math.round(row[col.actual_duration] * 60)
          : null;

        const planned_duration = row[col.planned_duration]
          ? Math.round(row[col.planned_duration] * 60)
          : null;

        // Convert meters to km for distance
        const distance = row[col.distance]
          ? (row[col.distance] / 1000)
          : null;

        const workout = {
          date,
          exercise_type: String(row[col.workout_type] || row[col.title] || 'unknown').toLowerCase(),
          planned_duration,
          actual_duration,
          distance,
          heart_rate_avg: row[col.hr_avg] ? Math.round(row[col.hr_avg]) : null,
          intensity: row[col.rpe] || null,
          notes: [
            row[col.title],
            row[col.notes],
            row[col.coach_notes]
          ].filter(Boolean).join(' | ').substring(0, 500) || null,
          source: sheetName.toLowerCase().replace(/\s+/g, '_')
        };

        // Validate required fields
        if (!workout.date || !workout.exercise_type) {
          errors.push(`Row ${i + 1}: Missing required fields`);
          continue;
        }

        // Skip if no actual workout data (just planned)
        if (!workout.actual_duration && !workout.planned_duration) {
          continue;
        }

        workouts.push(workout);
      } catch (error) {
        errors.push(`Row ${i + 1}: ${error.message}`);
      }
    }
  }

  console.log(`   ✅ Parsed ${workouts.length} workouts`);
  if (errors.length > 0) {
    console.log(`   ⚠️  ${errors.length} errors`);
  }

  if (workouts.length === 0) {
    console.log('   ⏭️  No workouts to upload');
    continue;
  }

  // Check for duplicates
  const { data: existing } = await supabase
    .from('historical_workouts')
    .select('date, exercise_type, source')
    .in('date', workouts.map(w => w.date))
    .eq('source', workouts[0].source);

  const existingKeys = new Set(
    (existing || []).map(w => `${w.date}-${w.exercise_type}-${w.source}`)
  );

  const newWorkouts = workouts.filter(
    w => !existingKeys.has(`${w.date}-${w.exercise_type}-${w.source}`)
  );

  console.log(`   📦 ${existing?.length || 0} already in database`);
  console.log(`   📝 ${newWorkouts.length} new workouts to insert`);

  if (newWorkouts.length === 0) {
    console.log('   ✓ No new workouts to upload');
    continue;
  }

  // Insert in batches
  const BATCH_SIZE = 50;
  let uploaded = 0;

  console.log('   🚀 Uploading...');

  for (let i = 0; i < newWorkouts.length; i += BATCH_SIZE) {
    const batch = newWorkouts.slice(i, i + BATCH_SIZE);

    const { error } = await supabase
      .from('historical_workouts')
      .insert(batch);

    if (error) {
      console.log(`   ❌ Batch error: ${error.message}`);
      break;
    } else {
      uploaded += batch.length;
      process.stdout.write(`   ✓ ${uploaded}/${newWorkouts.length}\r`);
    }
  }

  console.log(`   ✅ Uploaded ${uploaded} workouts                    `);
}

// Final summary
console.log(`\n${'='.repeat(60)}`);
console.log('📊 Final Summary');
console.log('='.repeat(60));

const { count: total } = await supabase
  .from('historical_workouts')
  .select('*', { count: 'exact', head: true });

console.log(`\n✅ Total workouts in database: ${total}`);

// Count by source
const { data: bySources } = await supabase
  .from('historical_workouts')
  .select('source');

const sourceCounts = {};
bySources?.forEach(w => {
  sourceCounts[w.source || 'unknown'] = (sourceCounts[w.source || 'unknown'] || 0) + 1;
});

console.log('\n📦 Workouts by source:');
Object.entries(sourceCounts).forEach(([source, count]) => {
  console.log(`   ${source.padEnd(25)} ${count} workouts`);
});

console.log('\n🎉 All sheets processed!\n');
