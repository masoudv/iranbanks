/**
 * iranbanks - detect Iranian banks from card numbers
 * Browser entry: no Node built-ins. An icon is reported as its package
 * subpath ("iranbanks/icons/<variant>/<code>.svg"). That string is an import
 * specifier, not a URL: import the file statically so the bundler emits it,
 * e.g. `import melli from "iranbanks/icons/color/melli.svg"`.
 */

const { createApi } = require("./core");

function resolveIcon(code, variant) {
  return `iranbanks/icons/${variant}/${code}.svg`;
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

// Keep this a plain object literal of identifiers (see index.js).
module.exports = {
  detectBank,
  isValidIranianCard,
  getSupportedBanks,
  getBanks,
  getBankByCode,
  getBankIcon,
  IRANIAN_BANKS,
};
