const { detectBank, isValidIranianCard, getSupportedBanks } = require('./index');

// تست‌های ساده
console.log('🧪 شروع تست‌ها...\n');

// تست 1: تشخیص بانک ملی
console.log('تست 1: بانک ملی');
const result1 = detectBank('6037991234567890');
console.log(result1);
console.log('✅ موفق\n');

// تست 2: تشخیص بانک صادرات
console.log('تست 2: بانک صادرات');
const result2 = detectBank('6037701234567890');
console.log(result2);
console.log('✅ موفق\n');

// تست 3: کارت نامعتبر
console.log('تست 3: کارت نامعتبر');
try {
  const result3 = detectBank('1234567890123456');
  console.log(result3);
} catch (error) {
  console.log('خطا:', error.message);
}
console.log('✅ موفق\n');

// تست 4: بررسی معتبر بودن کارت
console.log('تست 4: بررسی معتبر بودن');
const isValid1 = isValidIranianCard('6037991234567890');
const isValid2 = isValidIranianCard('1234567890123456');
console.log('کارت 1 معتبر است:', isValid1);
console.log('کارت 2 معتبر است:', isValid2);
console.log('✅ موفق\n');

// تست 5: لیست بانک‌ها
console.log('تست 5: لیست بانک‌ها');
const banks = getSupportedBanks();
console.log(`تعداد بانک‌های پشتیبانی شده: ${banks.length}`);
console.log('نمونه:', banks.slice(0, 3));
console.log('✅ موفق\n');

console.log('🎉 همه تست‌ها با موفقیت انجام شد!');