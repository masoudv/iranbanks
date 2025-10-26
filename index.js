/**
 * Iran Bank Detector - تشخیص بانک‌های ایران
 * Detect Iranian banks from card numbers
 */

const IRANIAN_BANKS = {
  '603799': 'بانک ملی',
  '603770': 'بانک صادرات',
  '603769': 'بانک کشاورزی',
  '589210': 'بانک سپه',
  '610433': 'بانک ملت',
  '628023': 'بانک مسکن',
  '627648': 'بانک توسعه صادرات',
  '627961': 'بانک صنعت و معدن',
  '627353': 'بانک تجارت',
  '589463': 'بانک رفاه',
  '639347': 'بانک پاسارگاد',
  '627412': 'بانک اقتصاد نوین',
  '622106': 'بانک پارسیان',
  '627488': 'بانک کارآفرین',
  '621986': 'بانک سامان',
  '639346': 'بانک سینا',
  '639607': 'بانک سرمایه',
  '502806': 'بانک شهر',
  '502938': 'بانک دی',
  '627381': 'بانک انصار',
  '639599': 'بانک قوامین',
  '627760': 'پست بانک ایران',
  '627593': 'بانک ایران زمین',
  '627039': 'بانک حکمت ایرانیان',
  '627381': 'بانک انصار',
  '505785': 'بانک ایران و ونزوئلا',
  '627412': 'بانک اقتصاد نوین',
  '622106': 'بانک پارسیان',
  '627884': 'بانک کرسان',
  '606373': 'بانک مهر ایران',
  '627593': 'بانک ایران زمین',
  '627648': 'بانک توسعه صادرات ایران',
  '627412': 'بانک اقتصاد نوین'
};

/**
 * تشخیص بانک از روی شماره کارت
 * @param {string} cardNumber - شماره کارت (16 رقمی)
 * @returns {object} اطلاعات بانک شامل نام فارسی و انگلیسی
 */
function detectBank(cardNumber) {
  if (!cardNumber) {
    throw new Error('شماره کارت الزامی است');
  }

  // حذف فاصله‌ها و کاراکترهای غیرضروری
  const cleanCardNumber = cardNumber.toString().replace(/\s|-/g, '');
  
  if (cleanCardNumber.length < 6) {
    throw new Error('شماره کارت باید حداقل 6 رقم باشد');
  }

  if (!/^\d+$/.test(cleanCardNumber)) {
    throw new Error('شماره کارت باید فقط شامل اعداد باشد');
  }

  // استخراج 6 رقم اول (BIN)
  const bin = cleanCardNumber.slice(0, 6);
  
  const bankName = IRANIAN_BANKS[bin];
  
  if (bankName) {
    return {
      success: true,
      bank: {
        name: bankName,
        bin: bin,
        cardNumber: cleanCardNumber
      }
    };
  }

  return {
    success: false,
    message: 'بانک شناسایی نشد',
    bin: bin
  };
}

/**
 * بررسی معتبر بودن شماره کارت ایرانی
 * @param {string} cardNumber - شماره کارت
 * @returns {boolean} معتبر بودن کارت
 */
function isValidIranianCard(cardNumber) {
  const cleanCardNumber = cardNumber.toString().replace(/\s|-/g, '');
  
  if (cleanCardNumber.length !== 16) {
    return false;
  }

  if (!/^\d{16}$/.test(cleanCardNumber)) {
    return false;
  }

  // بررسی الگوریتم Luhn
  let sum = 0;
  let alternate = false;
  
  for (let i = cleanCardNumber.length - 1; i >= 0; i--) {
    let n = parseInt(cleanCardNumber.charAt(i), 10);
    
    if (alternate) {
      n *= 2;
      if (n > 9) {
        n = (n % 10) + 1;
      }
    }
    
    sum += n;
    alternate = !alternate;
  }
  
  return (sum % 10) === 0;
}

/**
 * دریافت لیست تمام بانک‌های پشتیبانی شده
 * @returns {object} لیست بانک‌ها
 */
function getSupportedBanks() {
  return Object.entries(IRANIAN_BANKS).map(([bin, name]) => ({
    bin,
    name
  }));
}

module.exports = {
  detectBank,
  isValidIranianCard,
  getSupportedBanks,
  IRANIAN_BANKS
};