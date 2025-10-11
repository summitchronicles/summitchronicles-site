#!/usr/bin/env node

/**
 * Test Excel upload with actual training data
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import FormData from 'form-data';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXCEL_FILE_PATH = '/Users/sunith/Downloads/Training for the 7 summits.xlsx';
const API_URL = 'http://localhost:3000/api/training/upload-excel';

console.log('🏔️  Testing Excel Upload for 7 Summits Training Data\n');

// Check if file exists
if (!fs.existsSync(EXCEL_FILE_PATH)) {
  console.error('❌ Excel file not found:', EXCEL_FILE_PATH);
  process.exit(1);
}

console.log('📁 File found:', EXCEL_FILE_PATH);
const stats = fs.statSync(EXCEL_FILE_PATH);
console.log(`📊 File size: ${(stats.size / 1024).toFixed(2)} KB\n`);

// Create form data
const form = new FormData();
form.append('excel_file', fs.createReadStream(EXCEL_FILE_PATH));
form.append('generate_insights', 'true');

console.log('🚀 Uploading to API...\n');

try {
  const response = await fetch(API_URL, {
    method: 'POST',
    body: form,
    headers: form.getHeaders()
  });

  const result = await response.json();

  if (response.ok && result.success) {
    console.log('✅ Upload successful!\n');
    console.log('📊 Summary:');
    console.log(`   Total rows: ${result.data.summary.totalRows}`);
    console.log(`   Valid rows: ${result.data.summary.validRows}`);
    console.log(`   Invalid rows: ${result.data.summary.invalidRows}`);
    console.log(`   Date range: ${result.data.summary.dateRange.start} to ${result.data.summary.dateRange.end}`);

    if (result.data.workouts.length > 0) {
      console.log(`\n📝 Sample workouts uploaded (first 3):`);
      result.data.workouts.slice(0, 3).forEach((w, i) => {
        console.log(`   ${i + 1}. ${w.date} - ${w.exercise_type} (${w.actual_duration || w.planned_duration}min, intensity ${w.intensity || 'N/A'})`);
      });
    }

    if (result.data.insights) {
      console.log(`\n🤖 AI Insights:\n`);
      console.log(result.data.insights);
    }

  } else {
    console.log('❌ Upload failed\n');
    console.log('Error:', result.error);
    if (result.errors) {
      console.log('\nDetailed errors:');
      result.errors.slice(0, 10).forEach(err => console.log('  -', err));
      if (result.errors.length > 10) {
        console.log(`  ... and ${result.errors.length - 10} more errors`);
      }
    }
  }

} catch (error) {
  console.error('❌ Request failed:', error.message);
  console.error('\nMake sure the dev server is running:');
  console.error('  npm run dev');
}
