/**
 * iranbanks - detect Iranian banks from card numbers
 * Node entry: icons are resolved to absolute file paths.
 * Browsers get browser.js instead (see the "exports" map in package.json).
 */

const fs = require("fs");
const path = require("path");
const { createApi } = require("./core");

const ICONS_DIR = path.join(__dirname, "icons");

// The icon files ship inside the package and never change at runtime, so each
// lookup hits the disk at most once.
const iconCache = new Map();

function resolveIcon(code, variant) {
  const key = `${variant}/${code}`;
  if (!iconCache.has(key)) {
    const file = path.join(ICONS_DIR, variant, `${code}.svg`);
    iconCache.set(key, fs.existsSync(file) ? file : null);
  }
  return iconCache.get(key);
}

const {
  detectBank,
  isValidIranianCard,
  getSupportedBanks,
  getBanks,
  getBankByCode,
  getBankIcon,
  IRANIAN_BANKS,
} = createApi(resolveIcon);

// Keep this a plain object literal of identifiers: Node's CommonJS lexer only
// detects named exports for `import { detectBank } from "iranbanks"` this way.
module.exports = {
  detectBank,
  isValidIranianCard,
  getSupportedBanks,
  getBanks,
  getBankByCode,
  getBankIcon,
  IRANIAN_BANKS,
};
