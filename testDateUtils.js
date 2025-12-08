// Test script to verify date handling fix
// Run this in browser console to test date parsing

import { 
  parseDate, 
  parseDateFromSessionStorage, 
  formatDateTimeForDisplay, 
  formatDateTimeForDB,
  formatDateForInput 
} from './lib/dateUtils.js';

console.log('🗓️ Testing Date Utilities...\n');

// Test 1: Parse ISO format (correct format)
console.log('Test 1: ISO format parsing');
const isoDate = '2025-11-22T15:30:00.000Z';
const parsed1 = parseDate(isoDate);
console.log(`Input: ${isoDate}`);
console.log(`Parsed: ${parsed1}`);
console.log(`Formatted: ${formatDateTimeForDisplay(parsed1)}`);
console.log(`DB Format: ${formatDateTimeForDB(parsed1)}`);
console.log(`Input Format: ${formatDateForInput(parsed1)}\n`);

// Test 2: Parse DD/MM/YYYY format (from sessionStorage)
console.log('Test 2: DD/MM/YYYY format parsing');
const ddmmyyyy = '22/11/2025 15:30';
const parsed2 = parseDateFromSessionStorage(ddmmyyyy);
console.log(`Input: ${ddmmyyyy}`);
console.log(`Parsed: ${parsed2}`);
console.log(`Formatted: ${formatDateTimeForDisplay(parsed2)}\n`);

// Test 3: Parse various date formats
console.log('Test 3: Various date formats');
const formats = [
  '2025-11-22T15:30:00+00:00',
  '2025-11-22 15:30:00',
  '22/11/2025 15:30',
  '22-11-2025 15:30',
  '2025/11/22 15:30',
  '22.11.2025 15:30'
];

formats.forEach((format, index) => {
  const parsed = parseDate(format);
  console.log(`Format ${index + 1}: ${format} -> ${parsed}`);
});

console.log('\n✅ Date utilities test completed!');
console.log('Expected behavior: All formats should parse correctly and display as DD/MM/YYYY HH:MM');

// Export for manual testing
if (typeof window !== 'undefined') {
  window.testDateUtils = {
    parseDate,
    parseDateFromSessionStorage,
    formatDateTimeForDisplay,
    formatDateTimeForDB,
    formatDateForInput
  };
}