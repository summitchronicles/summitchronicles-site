#!/usr/bin/env node

/**
 * Test Excel parsing locally (faster than API call)
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Import the parser (need to compile TS first, so we'll do it manually)
const EXCEL_FILE_PATH = '/Users/sunith/Downloads/Training for the 7 summits.xlsx';

console.log('🏔️  Testing Excel Parsing Locally\n');

// Read workbook
const workbook = XLSX.readFile(EXCEL_FILE_PATH);
console.log('📊 Sheets found:', workbook.SheetNames.join(', '));

// Process first sheet
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const rawData = XLSX.utils.sheet_to_json(worksheet, {
  header: 1,
  defval: null,
  blankrows: false
});

console.log(`\n📝 Sheet "${sheetName}":`);
console.log(`   Total rows: ${rawData.length}`);
console.log(`   Headers:`, rawData[0]);

// Parse headers
const headers = rawData[0].map(h =>
  String(h || '').toLowerCase().trim().replace(/\s+/g, '_').replace(/[()]/g, '')
);

console.log(`\n🔍 Normalized headers:`, headers);

// Map to our schema
const columnMapping = {
  date: headers.indexOf('column_1'),
  exercise_type: headers.indexOf('activity') >= 0 ? headers.indexOf('activity') : headers.indexOf('type'),
  actual_duration: headers.indexOf('duration_mins'),
  distance: headers.indexOf('distance_km'),
  heart_rate_avg: headers.indexOf('average_hr_bpm'),
  intensity: headers.indexOf('intensity_rpe'),
  notes: headers.indexOf('notes')
};

console.log(`\n📋 Column mapping:`, columnMapping);

// Parse first 5 workouts
console.log(`\n📝 Sample workouts (first 5):\n`);

for (let i = 1; i <= Math.min(5, rawData.length - 1); i++) {
  const row = rawData[i];

  const workout = {
    date: row[columnMapping.date],
    exercise_type: row[columnMapping.exercise_type],
    actual_duration: row[columnMapping.actual_duration],
    distance: row[columnMapping.distance],
    heart_rate_avg: row[columnMapping.heart_rate_avg],
    intensity: row[columnMapping.intensity],
    notes: row[columnMapping.notes]
  };

  // Parse Excel date
  if (typeof workout.date === 'number') {
    const excelDate = XLSX.SSF.parse_date_code(workout.date);
    workout.date = `${excelDate.y}-${String(excelDate.m).padStart(2, '0')}-${String(excelDate.d).padStart(2, '0')}`;
  }

  console.log(`${i}. ${workout.date} - ${workout.exercise_type}`);
  console.log(`   Duration: ${workout.actual_duration} mins, Intensity: ${workout.intensity}, HR Avg: ${workout.heart_rate_avg}`);
  console.log(`   Notes: ${(workout.notes || 'N/A').substring(0, 60)}...\n`);
}

console.log(`✅ Excel parsing test complete!`);
console.log(`\n💡 Ready to upload ${rawData.length - 1} workouts to database`);
