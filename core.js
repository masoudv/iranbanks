/**
 * Environment-independent core of iranbanks.
 *
 * This file must not touch Node built-ins (fs, path, ...): it is shared by the
 * Node entry (index.js) and the browser entry (browser.js). The only thing that
 * differs between the two is how an icon location is resolved, so that is
 * injected by the caller.
 */

const { BANKS } = require("./banks");

const ICON_VARIANTS = ["color", "mono"];

// A 16-digit card can exceed Number.MAX_SAFE_INTEGER; such a number has already
// lost digits before we see it, so it must be passed as a string instead.
const isLossyNumber = (value) =>
  typeof value === "number" && !Number.isSafeInteger(value);

function assertNotLossyNumber(value) {
  if (isLossyNumber(value)) {
    throw new Error("شماره کارت را به صورت رشته (string) وارد کنید");
  }
}

/**
 * @param {(code: string, variant: "color"|"mono") => string|null} resolveIcon
 *   returns the icon location for a bank, or null when there is none
 */
function createApi(resolveIcon) {
  const banksByCode = new Map(BANKS.map((b) => [b.code, b]));

  const banksByBin = new Map();
  for (const b of BANKS) {
    for (const bin of b.bins) {
      banksByBin.set(bin, b);
    }
  }

  /**
   * BIN -> Persian bank name map (kept for 1.x compatibility).
   */
  const IRANIAN_BANKS = Object.fromEntries(
    [...banksByBin].map(([bin, b]) => [bin, b.name])
  );

  /**
   * Location of a bank's SVG icon, or null when there is none.
   * @param {string} code - bank code, e.g. "melli"
   * @param {"color"|"mono"} [variant="color"]
   * @returns {string|null}
   */
  function getBankIcon(code, variant = "color") {
    if (!banksByCode.has(code) || !ICON_VARIANTS.includes(variant)) return null;
    return resolveIcon(code, variant);
  }

  function getIcons(code) {
    const icons = {};
    for (const variant of ICON_VARIANTS) {
      const location = getBankIcon(code, variant);
      if (location) icons[variant] = location;
    }
    return Object.keys(icons).length ? icons : null;
  }

  function toPublicBank(b) {
    return { ...b, bins: [...b.bins], icon: getIcons(b.code) };
  }

  /**
   * Detect the issuing bank from a card number.
   * @param {string|number} cardNumber - at least the first 6 digits. Prefer a
   *   string: numbers above Number.MAX_SAFE_INTEGER are rejected.
   * @returns {object} `{ success: true, bank }` or `{ success: false, message, bin }`
   * @throws {Error} when the input is empty, too short or not numeric
   */
  function detectBank(cardNumber) {
    if (!cardNumber) {
      throw new Error("شماره کارت الزامی است");
    }

    // strip spaces and dashes
    assertNotLossyNumber(cardNumber);
    const cleanCardNumber = cardNumber.toString().replace(/\s|-/g, "");

    if (cleanCardNumber.length < 6) {
      throw new Error("شماره کارت باید حداقل 6 رقم باشد");
    }

    if (!/^\d+$/.test(cleanCardNumber)) {
      throw new Error("شماره کارت باید فقط شامل اعداد باشد");
    }

    // the BIN is the first 6 digits
    const bin = cleanCardNumber.slice(0, 6);

    const found = banksByBin.get(bin);

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
   * Check a 16-digit card number with the Luhn algorithm.
   * @param {string|number} cardNumber - prefer a string (unsafe numbers return false)
   * @returns {boolean}
   */
  function isValidIranianCard(cardNumber) {
    if (cardNumber === null || cardNumber === undefined) {
      return false;
    }

    if (isLossyNumber(cardNumber)) {
      return false;
    }

    const cleanCardNumber = cardNumber.toString().replace(/\s|-/g, "");

    if (!/^\d{16}$/.test(cleanCardNumber)) {
      return false;
    }

    // Luhn checksum
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
   * List every supported BIN, one row per BIN (kept for 1.x compatibility).
   * @returns {Array<{bin: string, name: string}>}
   */
  function getSupportedBanks() {
    return Object.entries(IRANIAN_BANKS).map(([bin, name]) => ({
      bin,
      name,
    }));
  }

  /**
   * List banks, one row per bank.
   * @param {{status?: "active"|"merged"}} [options]
   * @returns {object[]}
   */
  function getBanks(options = {}) {
    return BANKS.filter(
      (b) => !options.status || b.status === options.status
    ).map(toPublicBank);
  }

  /**
   * Look up one bank by its code.
   * @param {string} code - e.g. "melli"
   * @returns {object|null}
   */
  function getBankByCode(code) {
    const b = banksByCode.get(code);
    return b ? toPublicBank(b) : null;
  }

  return {
    detectBank,
    isValidIranianCard,
    getSupportedBanks,
    getBanks,
    getBankByCode,
    getBankIcon,
    IRANIAN_BANKS,
  };
}

module.exports = { createApi };
