const { detectBank, isValidIranianCard, getSupportedBanks } = require('./index');

console.log('🏦 مثال‌های استفاده از Iran Bank Detector\n');

// مثال 1: تشخیص بانک‌های مختلف
console.log('📋 مثال 1: تشخیص بانک‌های مختلف');
const testCards = [
  '6037991234567890', // بانک ملی
  '6037701234567890', // بانک صادرات
  '6037691234567890', // بانک کشاورزی
  '5892101234567890', // بانک سپه
  '6104331234567890', // بانک ملت
];

testCards.forEach((card, index) => {
  const result = detectBank(card);
  if (result.success) {
    console.log(`${index + 1}. کارت ${card} → ${result.bank.name}`);
  } else {
    console.log(`${index + 1}. کارت ${card} → ${result.message}`);
  }
});

console.log('\n' + '='.repeat(50) + '\n');

// مثال 2: کار با کارت‌های دارای فاصله و خط تیره
console.log('📋 مثال 2: کارت‌های دارای فاصله و خط تیره');
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

// مثال 3: بررسی معتبر بودن کارت
console.log('📋 مثال 3: بررسی معتبر بودن کارت');
const cardsToValidate = [
  '6037991234567890',
  '4000000000000002', // کارت تست معتبر
  '1234567890123456'  // کارت نامعتبر
];

cardsToValidate.forEach((card, index) => {
  const isValid = isValidIranianCard(card);
  const result = detectBank(card);
  console.log(`${index + 1}. ${card}:`);
  console.log(`   معتبر: ${isValid ? '✅' : '❌'}`);
  console.log(`   بانک: ${result.success ? result.bank.name : 'شناسایی نشد'}`);
  console.log('');
});

console.log('='.repeat(50) + '\n');

// مثال 4: نمایش تمام بانک‌های پشتیبانی شده
console.log('📋 مثال 4: بانک‌های پشتیبانی شده');
const banks = getSupportedBanks();
console.log(`تعداد کل: ${banks.length} بانک\n`);

banks.slice(0, 10).forEach((bank, index) => {
  console.log(`${index + 1}. ${bank.bin} → ${bank.name}`);
});

console.log(`\n... و ${banks.length - 10} بانک دیگر`);

console.log('\n' + '='.repeat(50) + '\n');

// مثال 5: مدیریت خطاها
console.log('📋 مثال 5: مدیریت خطاها');

const invalidInputs = [
  '',           // خالی
  '123',        // کوتاه
  'abcd1234',   // شامل حروف
  null          // null
];

invalidInputs.forEach((input, index) => {
  try {
    const result = detectBank(input);
    console.log(`${index + 1}. ورودی: "${input}" → نتیجه: ${JSON.stringify(result)}`);
  } catch (error) {
    console.log(`${index + 1}. ورودی: "${input}" → خطا: ${error.message}`);
  }
});

console.log('\n🎉 تمام مثال‌ها اجرا شد!');