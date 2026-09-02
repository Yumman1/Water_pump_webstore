/**
 * Generates favicons from public/brand/favicon-source.png
 * Run: npm run favicons
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pngToIco from "png-to-ico";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const source = path.join(root, "public/brand/favicon-source.png");

if (!fs.existsSync(source)) {
  console.error("Missing source image:", source);
  console.error("Add a square PNG/JPG at public/brand/favicon-source.png first.");
  process.exit(1);
}

const BG = { r: 253, g: 248, b: 240, alpha: 1 };

async function square(size) {
  return sharp(source)
    .resize(size, size, { fit: "contain", background: BG, kernel: sharp.kernel.lanczos3 })
    .ensureAlpha()
    .png()
    .toBuffer();
}

const png48 = await square(48);
const png32 = await sharp(png48).resize(32, 32).png().toBuffer();
const png16 = await sharp(png48).resize(16, 16).png().toBuffer();
const png180 = await square(180);
const png192 = await square(192);
const png512 = await square(512);

// Small multi-size ICO for browsers and search crawlers (full-source ICOs are often rejected).
const icoBuffer = await pngToIco([png16, png32, png48]);

const outputs = [
  [path.join(root, "public/favicon.ico"), icoBuffer],
  [path.join(root, "public/icon-48.png"), png48],
  [path.join(root, "public/icon-192.png"), png192],
  [path.join(root, "src/app/icon.png"), png512],
  [path.join(root, "src/app/apple-icon.png"), png180],
];

for (const [file, buf] of outputs) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, buf);
  console.log("wrote", path.relative(root, file));
}

console.log("Done. (No src/app/favicon.ico — avoids broken ICO in <head>.)");
