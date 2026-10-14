const assert = require("node:assert/strict");
const test = require("node:test");
const {
  detectBank,
  isValidIranianCard,
  getSupportedBanks,
  getBanks,
  getBankByCode,
  getBankIcon,
  IRANIAN_BANKS,
} = require("./index");

test("detects banks by BIN", () => {
  const cases = {
    6037991234567890: "melli",
    6037691234567890: "saderat",
    6037701234567890: "keshavarzi",
    5892101234567890: "sepah",
    6104331234567890: "mellat",
    6273531234567890: "tejarat",
    5022291234567890: "pasargad",
    6391941234567890: "parsian",
    6369491234567890: "hekmat",
  };
  for (const [card, code] of Object.entries(cases)) {
    const r = detectBank(card);
    assert.equal(r.success, true, card);
    assert.equal(r.bank.code, code, card);
  }
});

test("result shape is backward compatible", () => {
  const r = detectBank("6037-9912 3456 7890");
  assert.equal(r.bank.name, "بانک ملی");
  assert.equal(r.bank.bin, "603799");
  assert.equal(r.bank.cardNumber, "6037991234567890");
  assert.equal(r.bank.nameEn, "Bank Melli Iran");
  assert.equal(r.bank.shebaCode, "017");
});

test("merged banks point to their acquirer", () => {
  const r = detectBank("6273811234567890");
  assert.equal(r.bank.code, "ansar");
  assert.equal(r.bank.status, "merged");
  assert.equal(r.bank.mergedInto, "sepah");
});

test("unknown BIN and bad input", () => {
  assert.deepEqual(detectBank("1234567890123456"), {
    success: false,
    message: "بانک شناسایی نشد",
    bin: "123456",
  });
  assert.throws(() => detectBank(""), /الزامی/);
  assert.throws(() => detectBank("123"), /6 رقم/);
  assert.throws(() => detectBank("60379a1234567890"), /اعداد/);
});

test("Luhn validation", () => {
  assert.equal(isValidIranianCard("6037991234567890"), false);
  assert.equal(isValidIranianCard("1234"), false);
  assert.equal(isValidIranianCard(null), false);
  // build a valid number from a melli BIN
  const body = "603799123456789";
  let sum = 0;
  for (let i = 0; i < body.length; i++) {
    let n = +body[body.length - 1 - i];
    if (i % 2 === 0) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
  }
  const valid = body + ((10 - (sum % 10)) % 10);
  assert.equal(isValidIranianCard(valid), true);
});

test("data integrity", () => {
  const banks = getBanks();
  assert.equal(banks.length, 37);
  assert.equal(getBanks({ status: "merged" }).length, 6);

  const codes = new Set();
  const bins = new Set();
  for (const b of banks) {
    assert.ok(!codes.has(b.code), `duplicate code ${b.code}`);
    codes.add(b.code);
    assert.ok(b.name && b.nameEn, `names missing for ${b.code}`);
    for (const bin of b.bins) {
      assert.match(bin, /^\d{6}$/, `${b.code} bin`);
      assert.ok(!bins.has(bin), `duplicate BIN ${bin}`);
      bins.add(bin);
    }
    if (b.mergedInto) {
      assert.ok(codes.has(b.mergedInto) || getBankByCode(b.mergedInto), b.code);
    }
  }
  assert.equal(getSupportedBanks().length, bins.size);
  assert.equal(Object.keys(IRANIAN_BANKS).length, bins.size);
});

test("lookup helpers", () => {
  assert.equal(getBankByCode("melli").name, "بانک ملی");
  assert.equal(getBankByCode("nope"), null);
  assert.equal(getBankIcon("nope"), null);
  assert.equal(getBankIcon("melli", "bogus"), null);
});

test("every bank has a color and a mono SVG icon", () => {
  const fs = require("node:fs");
  for (const b of getBanks()) {
    for (const variant of ["color", "mono"]) {
      const file = getBankIcon(b.code, variant);
      assert.ok(file, `missing ${variant} icon for ${b.code}`);
      assert.match(fs.readFileSync(file, "utf8"), /<svg[\s>]/, file);
    }
    assert.deepEqual(Object.keys(b.icon), ["color", "mono"], b.code);
  }
  assert.equal(detectBank("6037991234567890").bank.icon.color, getBankIcon("melli"));
});

test("browser entry loads without Node built-ins", () => {
  const { execFileSync } = require("node:child_process");
  const script = `
    const Module = require("module");
    const load = Module._load;
    Module._load = function (request, ...rest) {
      if (/^(node:)?(fs|path|os|child_process)$/.test(request)) {
        throw new Error("browser entry required " + request);
      }
      return load.call(this, request, ...rest);
    };
    const api = require("./browser");
    process.stdout.write(api.detectBank("6037991234567890").bank.icon.color);
  `;
  const out = execFileSync(process.execPath, ["-e", script], {
    cwd: __dirname,
    encoding: "utf8",
  });
  assert.equal(out, "iranbanks/icons/color/melli.svg");
});

test("browser and node entries expose the same API and data", () => {
  const browser = require("./browser");
  assert.deepEqual(Object.keys(browser).sort(), Object.keys(require("./index")).sort());
  assert.deepEqual(browser.IRANIAN_BANKS, IRANIAN_BANKS);
  assert.deepEqual(
    browser.getBanks().map(({ icon, ...b }) => b),
    getBanks().map(({ icon, ...b }) => b)
  );
  // every icon the browser entry advertises is a real file in the package
  for (const b of browser.getBanks()) {
    for (const location of Object.values(b.icon)) {
      assert.doesNotThrow(() => require.resolve(location), location);
    }
  }
});

test('package "exports" resolve to existing files', () => {
  for (const id of [
    "iranbanks",
    "iranbanks/browser",
    "iranbanks/banks",
    "iranbanks/banks.js",
    "iranbanks/icons/mono/noor.svg",
    "iranbanks/package.json",
  ]) {
    assert.doesNotThrow(() => require.resolve(id), id);
  }
  assert.equal(require("iranbanks/banks").BANKS.length, 37);
});

test("bank data is immutable", () => {
  const { BANKS } = require("./banks");
  assert.ok(Object.isFrozen(BANKS));
  assert.ok(Object.isFrozen(BANKS[0]));
  assert.ok(Object.isFrozen(BANKS[0].bins));
  // results handed to callers are copies: mutating one must not leak
  const a = getBankByCode("melli");
  a.bins.push("000000");
  assert.equal(getBankByCode("melli").bins.length, 2);
});

test("named ESM imports work for every entry", () => {
  const { execFileSync } = require("node:child_process");
  const names = Object.keys(require("./index"));
  for (const entry of ["iranbanks", "iranbanks/browser"]) {
    const script = `import { ${names.join(", ")} } from "${entry}";
      process.stdout.write(detectBank("6037991234567890").bank.code);`;
    const out = execFileSync(
      process.execPath,
      ["--input-type=module", "-e", script],
      { cwd: __dirname, encoding: "utf8" }
    );
    assert.equal(out, "melli", entry);
  }
});

test("icon lookups are cached", () => {
  const fs = require("node:fs");
  const original = fs.existsSync;
  let calls = 0;
  fs.existsSync = (...args) => (calls++, original(...args));
  try {
    getBankIcon("sepah", "mono");
    const first = calls;
    getBankIcon("sepah", "mono");
    getBanks();
    getBanks();
    assert.ok(first <= 1);
    assert.ok(calls <= first + 74, "getBanks should hit the disk once per icon");
  } finally {
    fs.existsSync = original;
  }
});

test("numbers that already lost precision are rejected", () => {
  assert.throws(() => detectBank(9919751234567890), /string/);
  assert.equal(isValidIranianCard(9919751234567890), false);
  assert.equal(detectBank(6037991234567890).bank.code, "melli");
  assert.equal(detectBank("9919751234567890").bank.code, "mellat");
});
