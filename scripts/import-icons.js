/**
 * Import bank logos from zegond/logos-per-banks (CC0) into icons/.
 *
 * Usage: node scripts/import-icons.js "<path>/SVG Assets/Bank"
 *
 * Needs the `svgo` devDependency. Output: icons/color/<code>.svg, icons/mono/<code>.svg
 */
const fs = require("fs");
const path = require("path");
const { optimize } = require("svgo");
const { BANKS } = require("../banks");

// bank code -> source file name (without .svg) when it differs from the default
const SOURCE_NAMES = {
  markazi: "Bank_Markazi",
  post: "Postbank",
  day: "Dey",
  khavarmiane: "Khavar_Mianeh",
  melal: "Melall",
  "sanat-madan": "Sanat_Madan",
  "tosee-taavon": "Tosee_Taavon",
  "tosee-saderat": "Tosee_Saderat",
  "eghtesad-novin": "Eghtesad_Novin",
  "iran-zamin": "Iran_Zamin",
  "iran-venezuela": "Iran_Venezuela",
  "mehr-iran": "Mehr_Iran",
  "mehr-eghtesad": "Mehr_Eghtesad",
};

const defaultName = (code) => code.charAt(0).toUpperCase() + code.slice(1);

const svgoConfig = {
  multipass: true,
  plugins: [
    {
      name: "preset-default",
      params: { overrides: { removeViewBox: false } },
    },
    "removeDimensions",
  ],
};

const src = process.argv[2];
if (!src) {
  console.error('Usage: node scripts/import-icons.js "<path>/SVG Assets/Bank"');
  process.exit(1);
}

let before = 0;
let after = 0;
const missing = [];

for (const variant of ["color", "mono"]) {
  const outDir = path.join(__dirname, "..", "icons", variant);
  fs.mkdirSync(outDir, { recursive: true });

  for (const { code } of BANKS) {
    const file = path.join(
      src,
      variant === "color" ? "Color" : "Mono",
      `${SOURCE_NAMES[code] || defaultName(code)}.svg`
    );
    if (!fs.existsSync(file)) {
      missing.push(`${variant}/${code} (${path.basename(file)})`);
      continue;
    }
    const input = fs.readFileSync(file, "utf8");
    const { data } = optimize(input, { path: file, ...svgoConfig });
    fs.writeFileSync(path.join(outDir, `${code}.svg`), data);
    before += Buffer.byteLength(input);
    after += Buffer.byteLength(data);
  }
}

console.log(
  `Imported. ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`
);
if (missing.length) {
  console.error("Missing sources:\n  " + missing.join("\n  "));
  process.exit(1);
}
