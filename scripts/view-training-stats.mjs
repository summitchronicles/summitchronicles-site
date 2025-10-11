#!/usr/bin/env node

/**
 * View training statistics from Supabase
 */

import { createClient } from '@supabase/supabase-js';
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

console.log('📊 Training Data Statistics\n');
console.log('='.repeat(60));

// Total count
const { count: total } = await supabase
  .from('historical_workouts')
  .select('*', { count: 'exact', head: true });

console.log(`\n📈 Total Workouts: ${total}`);

// Date range
const { data: dateRange } = await supabase
  .from('historical_workouts')
  .select('date')
  .order('date', { ascending: true })
  .limit(1);

const { data: dateRangeEnd } = await supabase
  .from('historical_workouts')
  .select('date')
  .order('date', { ascending: false })
  .limit(1);

console.log(`📅 Date Range: ${dateRange[0]?.date} to ${dateRangeEnd[0]?.date}`);

// Exercise types
const { data: workouts } = await supabase
  .from('historical_workouts')
  .select('exercise_type, actual_duration, intensity, distance, heart_rate_avg');

const exerciseTypes = {};
let totalDuration = 0;
let totalDistance = 0;
let avgIntensity = 0;
let intensityCount = 0;

workouts?.forEach(w => {
  exerciseTypes[w.exercise_type] = (exerciseTypes[w.exercise_type] || 0) + 1;
  if (w.actual_duration) totalDuration += w.actual_duration;
  if (w.distance) totalDistance += w.distance;
  if (w.intensity) {
    avgIntensity += w.intensity;
    intensityCount++;
  }
});

console.log(`\n🏋️  Exercise Types:`);
Object.entries(exerciseTypes)
  .sort((a, b) => b[1] - a[1])
  .forEach(([type, count]) => {
    console.log(`   ${type.padEnd(30)} ${count} workouts`);
  });

console.log(`\n⏱️  Total Training Time: ${(totalDuration / 60).toFixed(1)} hours`);
console.log(`🏃 Total Distance: ${totalDistance.toFixed(1)} km`);
console.log(`💪 Average Intensity: ${(avgIntensity / intensityCount).toFixed(1)}/10`);

// Recent workouts
console.log(`\n📝 Latest 10 Workouts:`);
const { data: recent } = await supabase
  .from('historical_workouts')
  .select('*')
  .order('date', { ascending: false })
  .limit(10);

recent?.forEach((w, i) => {
  const duration = w.actual_duration || w.planned_duration || 'N/A';
  const intensity = w.intensity || 'N/A';
  console.log(`   ${i + 1}. ${w.date} - ${w.exercise_type.padEnd(25)} ${String(duration).padStart(3)}min, RPE ${intensity}`);
});

console.log('\n' + '='.repeat(60));
console.log('\n✅ Data loaded successfully from Supabase!');
console.log('\n🚀 Next: Query this data from your training dashboard\n');
