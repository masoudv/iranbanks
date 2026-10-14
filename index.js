/**
 * Iran Bank Detector - تشخیص بانک‌های ایران
 * Detect Iranian banks from card numbers
 */

const fs = require("fs");
const path = require("path");
const { BANKS } = require("./banks");

const ICONS_DIR = path.join(__dirname, "icons");

const BANKS_BY_CODE = new Map(BANKS.map((b) => [b.code, b]));

const BANKS_BY_BIN = new Map();
for (const b of BANKS) {
  for (const bin of b.bins) {
    BANKS_BY_BIN.set(bin, b);
  }
}

/**
 * نگاشت BIN به نام فارسی بانک (سازگار با نسخه ۱)
 */
const IRANIAN_BANKS = Object.fromEntries(
  [...BANKS_BY_BIN].map(([bin, b]) => [bin, b.name])
);

const ICON_VARIANTS = ["color", "mono"];

/**
 * مسیر مطلق فایل آیکون SVG بانک؛ اگر آیکون موجود نباشد null
 * @param {string} code - کد بانک (مثلا "melli")
 * @param {"color"|"mono"} [variant="color"] - نسخه رنگی یا تک‌رنگ
 * @returns {string|null}
 */
function getBankIcon(code, variant = "color") {
  if (!BANKS_BY_CODE.has(code) || !ICON_VARIANTS.includes(variant)) return null;
  const file = path.join(ICONS_DIR, variant, `${code}.svg`);
  return fs.existsSync(file) ? file : null;
}

function getIcons(code) {
  const icons = {};
  for (const variant of ICON_VARIANTS) {
    const file = getBankIcon(code, variant);
    if (file) icons[variant] = file;
  }
  return Object.keys(icons).length ? icons : null;
}

function toPublicBank(b) {
  return { ...b, bins: [...b.bins], icon: getIcons(b.code) };
}

/**
 * تشخیص بانک از روی شماره کارت
 * @param {string} cardNumber - شماره کارت (16 رقمی)
 * @returns {object} اطلاعات بانک
 */
function detectBank(cardNumber) {
  if (!cardNumber) {
    throw new Error("شماره کارت الزامی است");
  }

  // حذف فاصله‌ها و کاراکترهای غیرضروری
  const cleanCardNumber = cardNumber.toString().replace(/\s|-/g, "");

  if (cleanCardNumber.length < 6) {
    throw new Error("شماره کارت باید حداقل 6 رقم باشد");
  }

  if (!/^\d+$/.test(cleanCardNumber)) {
    throw new Error("شماره کارت باید فقط شامل اعداد باشد");
  }

  // استخراج 6 رقم اول (BIN)
  const bin = cleanCardNumber.slice(0, 6);

  const found = BANKS_BY_BIN.get(bin);

  if (found) {
    const { bins, ...info } = toPublicBank(found);
    return {
      success: true,
      bank: {
        ...info,
        bin: bin,
        cardNumber: cleanCardNumber,
      },
    };
  }

  return {
    success: false,
    message: "بانک شناسایی نشد",
    bin: bin,
  };
}

/**
 * بررسی معتبر بودن شماره کارت ایرانی
 * @param {string} cardNumber - شماره کارت
 * @returns {boolean} معتبر بودن کارت
 */
function isValidIranianCard(cardNumber) {
  if (cardNumber === null || cardNumber === undefined) {
    return false;
  }

  const cleanCardNumber = cardNumber.toString().replace(/\s|-/g, "");

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

  return sum % 10 === 0;
}

/**
 * دریافت لیست BINهای پشتیبانی شده (سازگار با نسخه ۱؛ یک ردیف برای هر BIN)
 * @returns {Array<{bin: string, name: string}>}
 */
function getSupportedBanks() {
  return Object.entries(IRANIAN_BANKS).map(([bin, name]) => ({
    bin,
    name,
  }));
}

/**
 * دریافت لیست کامل بانک‌ها (یک ردیف برای هر بانک)
 * @param {{status?: "active"|"merged"}} [options]
 * @returns {object[]}
 */
function getBanks(options = {}) {
  return BANKS.filter((b) => !options.status || b.status === options.status).map(
    toPublicBank
  );
}

/**
 * دریافت اطلاعات یک بانک با کد آن
 * @param {string} code - مثلا "melli"
 * @returns {object|null}
 */
function getBankByCode(code) {
  const b = BANKS_BY_CODE.get(code);
  return b ? toPublicBank(b) : null;
}

module.exports = {
  detectBank,
  isValidIranianCard,
  getSupportedBanks,
  getBanks,
  getBankByCode,
  getBankIcon,
  IRANIAN_BANKS,
};
