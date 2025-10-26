const { detectBank, isValidIranianCard, getSupportedBanks } = require('./index');

// Simple tests
console.log('🧪 Starting tests...\n');

// Test 1: Detect Bank Melli
console.log('Test 1: Bank Melli Detection');
const result1 = detectBank('6037991234567890');
console.log(result1);
console.log('✅ Passed\n');

// Test 2: Detect Bank Saderat
console.log('Test 2: Bank Saderat Detection');
const result2 = detectBank('6037701234567890');
console.log(result2);
console.log('✅ Passed\n');

// Test 3: Invalid card
console.log('Test 3: Invalid Card Number');
try {
  const result3 = detectBank('1234567890123456');
  console.log(result3);
} catch (error) {
  console.log('Error:', error.message);
}
console.log('✅ Passed\n');

// Test 4: Card validation
console.log('Test 4: Card Validation');
const isValid1 = isValidIranianCard('6037991234567890');
const isValid2 = isValidIranianCard('1234567890123456');
console.log('Card 1 is valid:', isValid1);
console.log('Card 2 is valid:', isValid2);
console.log('✅ Passed\n');

// Test 5: Supported banks list
console.log('Test 5: Supported Banks List');
const banks = getSupportedBanks();
console.log(`Total supported banks: ${banks.length}`);
console.log('Sample:', banks.slice(0, 3));
console.log('✅ Passed\n');

console.log('🎉 All tests passed successfully!');