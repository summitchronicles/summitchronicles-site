#!/usr/bin/env node

/**
 * Create a small test Excel file from the original
 */

const XLSX = require('xlsx');
const fs = require('fs');

const INPUT_FILE = '/Users/sunith/Downloads/Training for the 7 summits.xlsx';
const OUTPUT_FILE = '/Users/sunith/Downloads/Training-Test-10rows.xlsx';

console.log('📄 Creating test Excel file with 10 rows...\n');

// Read original workbook
const workbook = XLSX.readFile(INPUT_FILE);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert to array
const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// Keep header + first 10 data rows
const testData = data.slice(0, 11);

console.log(`✂️  Extracted ${testData.length} rows (1 header + 10 data rows)`);

// Create new workbook
const newWorkbook = XLSX.utils.book_new();
const newWorksheet = XLSX.utils.aoa_to_sheet(testData);
XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);

// Write file
XLSX.writeFile(newWorkbook, OUTPUT_FILE);

console.log(`✅ Test file created: ${OUTPUT_FILE}`);
console.log(`\nYou can now test upload with:`);
console.log(`  curl -X POST http://localhost:3000/api/training/upload-excel \\`);
console.log(`    -F "excel_file=@${OUTPUT_FILE}" \\`);
console.log(`    -F "generate_insights=false"`);
