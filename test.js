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
