#!/usr/bin/env node

/**
 * Test the workout parser directly
 */

import { parseWorkoutExcel, validateWorkoutData } from '../lib/excel/workout-parser.js';
import fs from 'fs';

const EXCEL_FILE = '/Users/sunith/Downloads/Training-Test-10rows.xlsx';

console.log('🧪 Testing workout parser directly...\n');

try {
  const fileBuffer = fs.readFileSync(EXCEL_FILE);

  console.log('📄 File loaded, parsing...');

  const result = await parseWorkoutExcel(fileBuffer, { useAI: false });

  console.log('\n✅ Parse successful!');
  console.log(`   Total rows: ${result.summary.totalRows}`);
  console.log(`   Valid rows: ${result.summary.validRows}`);
  console.log(`   Invalid rows: ${result.summary.invalidRows}`);
  console.log(`   Date range: ${result.summary.dateRange.start} to ${result.summary.dateRange.end}`);

  if (result.errors.length > 0) {
    console.log(`\n⚠️  Errors (${result.errors.length}):`);
    result.errors.slice(0, 5).forEach(err => console.log(`   - ${err}`));
  }

  if (result.workouts.length > 0) {
    console.log(`\n📝 Sample workouts (first 3):`);
    result.workouts.slice(0, 3).forEach((w, i) => {
      console.log(`   ${i + 1}. ${w.date} - ${w.exercise_type} (${w.actual_duration}min, intensity ${w.intensity})`);
    });
  }

  // Test validation
  const validation = validateWorkoutData(result.workouts);
  console.log(`\n✔️  Validation: ${validation.valid.length} valid, ${validation.invalid.length} invalid`);

} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.error(error.stack);
}
