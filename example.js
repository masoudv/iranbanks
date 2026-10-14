const { detectBank, isValidIranianCard, getSupportedBanks } = require('./index');

console.log('🏦 Iran Bank Detector Usage Examples\n');

// Example 1: Detect different banks
console.log('📋 Example 1: Different Bank Detection');
const testCards = [
  '6037991234567890', // Bank Melli
  '6037691234567890', // Bank Saderat
  '6037701234567890', // Bank Keshavarzi
  '5892101234567890', // Bank Sepah
  '6104331234567890', // Bank Mellat
];

testCards.forEach((card, index) => {
  const result = detectBank(card);
  if (result.success) {
    console.log(`${index + 1}. Card ${card} → ${result.bank.name}`);
  } else {
    console.log(`${index + 1}. Card ${card} → ${result.message}`);
  }
});

console.log('\n' + '='.repeat(50) + '\n');

// Example 2: Cards with spaces and dashes
console.log('📋 Example 2: Formatted Card Numbers');
const formattedCards = [
  '6037-9912-3456-7890',
  '6037 7012 3456 7890',
  '6037 69 1234 567890'
];

formattedCards.forEach((card, index) => {
  const result = detectBank(card);
  if (result.success) {
    console.log(`${index + 1}. ${card} → ${result.bank.name}`);
  }
});

console.log('\n' + '='.repeat(50) + '\n');

// Example 3: Card validation
console.log('📋 Example 3: Card Validation');
const cardsToValidate = [
  '6037991234567890',
  '4000000000000002', // Valid test card
  '1234567890123456'  // Invalid card
];

cardsToValidate.forEach((card, index) => {
  const isValid = isValidIranianCard(card);
  const result = detectBank(card);
  console.log(`${index + 1}. ${card}:`);
  console.log(`   Valid: ${isValid ? '✅' : '❌'}`);
  console.log(`   Bank: ${result.success ? result.bank.name : 'Not detected'}`);
  console.log('');
});

console.log('='.repeat(50) + '\n');

// Example 4: Show all supported banks
console.log('📋 Example 4: Supported Banks');
const banks = getSupportedBanks();
console.log(`Total: ${banks.length} banks\n`);

banks.slice(0, 10).forEach((bank, index) => {
  console.log(`${index + 1}. ${bank.bin} → ${bank.name}`);
});

console.log(`\n... and ${banks.length - 10} more banks`);

console.log('\n' + '='.repeat(50) + '\n');

// Example 5: Error handling
console.log('📋 Example 5: Error Handling');

const invalidInputs = [
  '',           // Empty
  '123',        // Too short
  'abcd1234',   // Contains letters
  null          // null
];

invalidInputs.forEach((input, index) => {
  try {
    const result = detectBank(input);
    console.log(`${index + 1}. Input: "${input}" → Result: ${JSON.stringify(result)}`);
  } catch (error) {
    console.log(`${index + 1}. Input: "${input}" → Error: ${error.message}`);
  }
});

console.log('\n🎉 All examples completed!');