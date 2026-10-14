# Iran Bank Detector 🏦

[![npm version](https://img.shields.io/npm/v/iranbanks?logo=npm&color=cb3837)](https://www.npmjs.com/package/iranbanks)
[![npm downloads](https://img.shields.io/npm/dm/iranbanks?color=blue)](https://www.npmjs.com/package/iranbanks)
[![install size](https://img.shields.io/npm/unpacked-size/iranbanks?label=size)](https://www.npmjs.com/package/iranbanks)
[![types](https://img.shields.io/npm/types/iranbanks)](https://www.npmjs.com/package/iranbanks)
[![node](https://img.shields.io/node/v/iranbanks)](https://www.npmjs.com/package/iranbanks)
[![License: MIT](https://img.shields.io/npm/l/iranbanks?color=yellow)](https://opensource.org/licenses/MIT)

Detect Iranian banks from card numbers - تشخیص بانک‌های ایران از روی شماره کارت

A lightweight, fast, and reliable npm package to identify Iranian banks from card numbers using BIN (Bank Identification Number) codes.

## Installation

```bash
npm install iranbanks
```

## Usage

### JavaScript

```javascript
const {
  detectBank,
  isValidIranianCard,
  getSupportedBanks,
} = require("iranbanks");

// Detect bank from card number
const result = detectBank("6037991234567890");
console.log(result);
// {
//   success: true,
//   bank: {
//     code: 'melli',
//     name: 'بانک ملی',
//     nameEn: 'Bank Melli Iran',
//     shebaCode: '017',
//     status: 'active',
//     icon: { color: '…/icons/color/melli.svg', mono: '…/icons/mono/melli.svg' },
//     bin: '603799',
//     cardNumber: '6037991234567890'
//   }
// }

// Validate Iranian card number
const isValid = isValidIranianCard("6037991234567890");
console.log(isValid); // true or false

// Get list of supported banks
const banks = getSupportedBanks();
console.log(banks);
```

### TypeScript

```typescript
import { detectBank, isValidIranianCard, DetectionResult } from "iranbanks";

const result: DetectionResult = detectBank("6037991234567890");

if (result.success) {
  console.log(`Bank: ${result.bank?.name}`);
}
```

## API Reference

### `detectBank(cardNumber: string)`

Detects the bank from a card number using BIN codes.

**Parameters:**

- `cardNumber`: Card number (at least the first 6 digits). Pass it as a **string**: JS numbers above 2^53 have already lost digits, so such numbers are rejected.

**Returns:** `{ success, bank?, message?, bin? }` where `bank` is `{ code, name, nameEn, shebaCode, status, mergedInto?, icon, bin, cardNumber }`.

### `isValidIranianCard(cardNumber: string)`

Validates Iranian card number using Luhn algorithm.

**Parameters:**

- `cardNumber`: Card number to validate

**Returns:** `boolean`

### `getSupportedBanks()`

Returns list of all supported Iranian banks.

**Returns:**

```typescript
Array<{
  bin: string; // Bank BIN code
  name: string; // Bank name (in Persian)
}>;
```

### `getBanks(options?)`

Returns every bank (one row per bank) with `code`, `name`, `nameEn`, `bins`, `shebaCode`, `status`, `mergedInto?` and `icon` (paths of the SVG icons). Pass `{ status: "active" | "merged" }` to filter.

### `getBankByCode(code)`

Returns one bank by its code (e.g. `"melli"`) or `null`.

### `getBankIcon(code)`

Returns the location of the bank's SVG icon, or `null`. `variant` is `"color"` (default) or `"mono"`. In Node this is an absolute file path; in the browser entry it is a package subpath (see [Browser usage](#browser-usage)).

```javascript
const { getBankIcon, detectBank } = require("iranbanks");

getBankIcon("melli");           // …/icons/color/melli.svg
getBankIcon("melli", "mono");   // …/icons/mono/melli.svg
detectBank(card).bank.icon;     // { color: "…", mono: "…" }
```

The icon files themselves live at `iranbanks/icons/<variant>/<code>.svg`.

## Browser usage

The package ships a browser-safe entry (no `fs`/`path`). Bundlers that honor the `"browser"` export condition (Vite, webpack 5, esbuild, Rollup) pick it automatically:

```javascript
import { detectBank } from "iranbanks";
import melliIcon from "iranbanks/icons/color/melli.svg"; // let the bundler emit the file
```

You can also import it explicitly with `import { detectBank } from "iranbanks/browser"`. In this entry `bank.icon` holds package subpaths such as `"iranbanks/icons/color/melli.svg"`: these are import specifiers, not URLs, so import the SVGs statically.

The raw data is available as `import { BANKS } from "iranbanks/banks"` (frozen, read-only).

## Supported Banks (37)

| بانک | Name | Code | BIN | Sheba | Status |
|---|---|---|---|---|---|
| بانک مرکزی | Central Bank of Iran | `markazi` | `636795` `636797` | 010 | active |
| بانک ملی | Bank Melli Iran | `melli` | `603799` `170019` | 017 | active |
| بانک سپه | Bank Sepah | `sepah` | `589210` | 015 | active |
| بانک صادرات | Bank Saderat Iran | `saderat` | `603769` `903769` | 019 | active |
| بانک ملت | Bank Mellat | `mellat` | `610433` `991975` | 012 | active |
| بانک تجارت | Tejarat Bank | `tejarat` | `627353` `585983` | 018 | active |
| بانک مسکن | Bank Maskan | `maskan` | `628023` | 014 | active |
| بانک کشاورزی | Agriculture Bank (Keshavarzi) | `keshavarzi` | `603770` `639217` | 016 | active |
| بانک رفاه کارگران | Refah Bank | `refah` | `589463` | 013 | active |
| پست بانک ایران | Post Bank of Iran | `post` | `627760` | 021 | active |
| بانک توسعه تعاون | Cooperative Development Bank | `tosee-taavon` | `502908` | 022 | active |
| بانک توسعه صادرات | Export Development Bank of Iran | `tosee-saderat` | `627648` `207177` | 020 | active |
| بانک صنعت و معدن | Bank of Industry and Mine | `sanat-madan` | `627961` | 011 | active |
| بانک قرض‌الحسنه مهر ایران | Mehr Iran Bank | `mehr-iran` | `606373` | 060 | active |
| بانک قرض‌الحسنه رسالت | Resalat Bank | `resalat` | `504172` | 070 | active |
| موسسه اعتباری توسعه | Tose'e Credit Institution | `tosee` | `628157` | 051 | active |
| بانک پارسیان | Parsian Bank | `parsian` | `622106` `627884` `639194` | 054 | active |
| بانک پاسارگاد | Bank Pasargad | `pasargad` | `502229` `639347` | 057 | active |
| بانک سامان | Saman Bank | `saman` | `621986` | 056 | active |
| بانک اقتصاد نوین | EN Bank (Eghtesad Novin) | `eghtesad-novin` | `627412` | 055 | active |
| بانک آینده | Ayandeh Bank | `ayandeh` | `636214` | 062 | active |
| بانک شهر | Shahr Bank | `shahr` | `502806` `504706` | 061 | active |
| بانک دی | Day Bank | `day` | `502938` | 066 | active |
| بانک سینا | Sina Bank | `sina` | `639346` | 059 | active |
| بانک سرمایه | Sarmayeh Bank | `sarmayeh` | `639607` | 058 | active |
| بانک گردشگری | Tourism Bank (Gardeshgari) | `gardeshgari` | `505416` `505426` | 064 | active |
| بانک ایران زمین | Iran Zamin Bank | `iran-zamin` | `505785` | 069 | active |
| بانک کارآفرین | Karafarin Bank | `karafarin` | `627488` `502910` | 053 | active |
| بانک خاورمیانه | Middle East Bank | `khavarmiane` | `585947` | 078 | active |
| بانک ملل | Melal Credit Institution | `melal` | `606256` | 075 | active |
| بانک ایران و ونزوئلا | Iran-Venezuela Bilateral Bank | `iran-venezuela` | — | 095 | active |
| بانک انصار | Ansar Bank | `ansar` | `627381` | 063 | merged → `sepah` |
| بانک قوامین | Ghavamin Bank | `ghavamin` | `639599` | 052 | merged → `sepah` |
| بانک حکمت ایرانیان | Hekmat Iranian Bank | `hekmat` | `636949` | 065 | merged → `sepah` |
| بانک مهر اقتصاد | Mehr Eghtesad Bank | `mehr-eghtesad` | `639370` | 079 | merged → `sepah` |
| موسسه اعتباری کوثر | Kosar Credit Institution | `kosar` | `505801` | 073 | merged → `sepah` |
| موسسه اعتباری نور | Noor Credit Institution | `noor` | `507677` | 080 | merged → `melli` |

BIN data is compiled from public, unofficial sources; please open an issue if you find a mismatch.

## Examples

### React Component

```jsx
import React, { useState } from "react";
import { detectBank } from "iranbanks";

function BankDetector() {
  const [cardNumber, setCardNumber] = useState("");
  const [result, setResult] = useState(null);

  const handleDetect = () => {
    try {
      const detection = detectBank(cardNumber);
      setResult(detection);
    } catch (error) {
      setResult({ success: false, message: error.message });
    }
  };

  return (
    <div>
      <input
        type="text"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        placeholder="Enter card number"
      />
      <button onClick={handleDetect}>Detect Bank</button>

      {result && (
        <div>
          {result.success ? (
            <p>Bank: {result.bank.name}</p>
          ) : (
            <p>Error: {result.message}</p>
          )}
        </div>
      )}
    </div>
  );
}
```

### Express.js API

```javascript
const express = require("express");
const { detectBank } = require("iranbanks");

const app = express();
app.use(express.json());

app.post("/detect-bank", (req, res) => {
  try {
    const { cardNumber } = req.body;
    const result = detectBank(cardNumber);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000);
```

### Vue.js Component

```vue
<template>
  <div>
    <input
      v-model="cardNumber"
      placeholder="Enter card number"
      @input="detectBankInfo"
    />
    <div v-if="result">
      <p v-if="result.success">Bank: {{ result.bank.name }}</p>
      <p v-else>{{ result.message }}</p>
    </div>
  </div>
</template>

<script>
import { detectBank } from "iranbanks";

export default {
  data() {
    return {
      cardNumber: "",
      result: null,
    };
  },
  methods: {
    detectBankInfo() {
      if (this.cardNumber.length >= 6) {
        try {
          this.result = detectBank(this.cardNumber);
        } catch (error) {
          this.result = { success: false, message: error.message };
        }
      }
    },
  },
};
</script>
```

## Features

- ✅ **Lightweight**: No dependencies, small bundle size
- ✅ **Fast**: Instant bank detection using BIN lookup
- ✅ **TypeScript Support**: Full type definitions included
- ✅ **Error Handling**: Comprehensive error management
- ✅ **Card Validation**: Luhn algorithm validation
- ✅ **Format Flexible**: Handles spaces, dashes in card numbers
- ✅ **Persian Names**: Bank names in Persian (Farsi)
- ✅ **Well Tested**: Comprehensive test coverage

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all Iranian developers who contribute to this project 🇮🇷
- Bank information sourced from official Central Bank of Iran data
- Inspired by the need for better financial tools in Iranian web development

---

Made with ❤️ for the Iranian developer community


## Migrating from 1.x

2.0 is backward compatible for `detectBank`, `isValidIranianCard`, `getSupportedBanks` and `IRANIAN_BANKS`, but note the data fixes:

- `603769` is **Saderat** and `603770` is **Keshavarzi** (they were swapped in 1.x).
- `627039`, `627593` and `627884` were wrong and are removed (`627884` is Parsian).
- `505785` is **Iran Zamin** (was labelled Iran-Venezuela).
- Many new banks and BINs were added; duplicates were removed.

## Icons

All 37 banks ship with a full-color SVG (`icons/color`) and a monochrome one (`icons/mono`, solid white — meant for dark backgrounds; recolor it with CSS `filter` or a `mask`). Both are optimized with SVGO. Logos come from [zegond/logos-per-banks](https://github.com/zegond/logos-per-banks) (CC0 1.0). Bank logos remain trademarks of their respective owners.

To refresh them: `node scripts/import-icons.js "<path>/SVG Assets/Bank"`.
