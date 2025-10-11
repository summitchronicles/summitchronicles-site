#!/usr/bin/env node

/**
 * Directly upload workouts from Excel to Supabase (bypassing API)
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

console.log('🏔️  Direct Upload: 7 Summits Training Data to Supabase\n');

// Read Excel
const workbook = XLSX.readFile(EXCEL_FILE);
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });

console.log(`📊 Found ${rawData.length - 1} workouts in sheet "${workbook.SheetNames[0]}"`);

// Parse headers
const headers = rawData[0].map(h =>
  String(h || '').toLowerCase().trim().replace(/\s+/g, '_').replace(/[()]/g, '')
);

// Map columns
const col = {
  date: headers.indexOf('column_1'),
  activity: headers.indexOf('activity'),
  duration: headers.indexOf('duration_mins'),
  distance: headers.indexOf('distance_km'),
  hr_avg: headers.indexOf('average_hr_bpm'),
  intensity: headers.indexOf('intensity_rpe'),
  notes: headers.indexOf('notes')
};

// Parse workouts
const workouts = [];
const errors = [];

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

    const workout = {
      date,
      exercise_type: String(row[col.activity] || 'unknown').toLowerCase(),
      actual_duration: row[col.duration] ? Math.round(row[col.duration]) : null,
      distance: row[col.distance] || null,
      heart_rate_avg: row[col.hr_avg] ? Math.round(row[col.hr_avg]) : null,
      intensity: row[col.intensity] || null,
      notes: row[col.notes] || null
    };

    // Validate required fields
    if (!workout.date || !workout.exercise_type) {
      errors.push(`Row ${i + 1}: Missing required fields`);
      continue;
    }

    workouts.push(workout);
  } catch (error) {
    errors.push(`Row ${i + 1}: ${error.message}`);
  }
}

console.log(`✅ Parsed ${workouts.length} workouts`);
if (errors.length > 0) {
  console.log(`⚠️  ${errors.length} errors`);
}

// Check for duplicates
console.log('\n🔍 Checking for existing workouts...');
const { data: existing } = await supabase
  .from('historical_workouts')
  .select('date, exercise_type')
  .in('date', workouts.map(w => w.date));

const existingKeys = new Set((existing || []).map(w => `${w.date}-${w.exercise_type}`));
const newWorkouts = workouts.filter(w => !existingKeys.has(`${w.date}-${w.exercise_type}`));

console.log(`📦 ${existing?.length || 0} workouts already in database`);
console.log(`📝 ${newWorkouts.length} new workouts to insert`);

if (newWorkouts.length === 0) {
  console.log('\n✅ No new workouts to upload!');
  process.exit(0);
}

// Insert in batches of 50
console.log('\n🚀 Uploading to Supabase...\n');

const BATCH_SIZE = 50;
let uploaded = 0;

for (let i = 0; i < newWorkouts.length; i += BATCH_SIZE) {
  const batch = newWorkouts.slice(i, i + BATCH_SIZE);

  process.stdout.write(`   Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(newWorkouts.length / BATCH_SIZE)}: `);

  const { error } = await supabase
    .from('historical_workouts')
    .insert(batch);

  if (error) {
    console.log(`❌ Error: ${error.message}`);
    break;
  } else {
    uploaded += batch.length;
    console.log(`✅ ${batch.length} workouts`);
  }
}

console.log(`\n🎉 Upload complete! ${uploaded}/${newWorkouts.length} workouts uploaded`);

// Show summary
const { data: allWorkouts } = await supabase
  .from('historical_workouts')
  .select('*')
  .order('date', { ascending: false })
  .limit(5);

console.log('\n📊 Latest workouts in database:');
allWorkouts?.forEach((w, i) => {
  console.log(`   ${i + 1}. ${w.date} - ${w.exercise_type} (${w.actual_duration || 'N/A'}min)`);
});

// Stats
const { count } = await supabase
  .from('historical_workouts')
  .select('*', { count: 'exact', head: true });

console.log(`\n✅ Total workouts in database: ${count}`);
