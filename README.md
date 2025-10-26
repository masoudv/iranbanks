# Iran Bank Detector 🏦

[![npm version](https://badge.fury.io/js/iranbanks.svg)](https://badge.fury.io/js/iranbanks)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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
//     name: 'بانک ملی',
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
import {
  detectBank,
  isValidIranianCard,
  DetectionResult,
} from "iranbanks";

const result: DetectionResult = detectBank("6037991234567890");

if (result.success) {
  console.log(`Bank: ${result.bank?.name}`);
}
```

## API Reference

### `detectBank(cardNumber: string)`

Detects the bank from a card number using BIN codes.

**Parameters:**

- `cardNumber`: Card number (16 digits)

**Returns:**

```typescript
{
  success: boolean;
  bank?: {
    name: string;      // Bank name (in Persian)
    bin: string;       // First 6 digits of card
    cardNumber: string; // Cleaned card number
  };
  message?: string;    // Error message if bank not detected
  bin?: string;        // BIN code if bank not detected
}
```

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

## Supported Banks

- Bank Melli Iran (بانک ملی ایران)
- Bank Saderat Iran (بانک صادرات ایران)
- Bank Keshavarzi (بانک کشاورزی)
- Bank Sepah (بانک سپه)
- Bank Mellat (بانک ملت)
- Bank Maskan (بانک مسکن)
- Bank Tosee Saderat (بانک توسعه صادرات)
- Bank Sanat va Madan (بانک صنعت و معدن)
- Bank Tejarat (بانک تجارت)
- Bank Refah Kargaran (بانک رفاه کارگران)
- Bank Pasargad (بانک پاسارگاد)
- Bank Eghtesad Novin (بانک اقتصاد نوین)
- Bank Parsian (بانک پارسیان)
- Bank Karafarin (بانک کارآفرین)
- Bank Saman (بانک سامان)
- Bank Sina (بانک سینا)
- Bank Sarmayeh (بانک سرمایه)
- Bank Shahr (بانک شهر)
- Bank Day (بانک دی)
- Bank Ansar (بانک انصار)
- Bank Ghavamin (بانک قوامین)
- Post Bank Iran (پست بانک ایران)
- And more...

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
