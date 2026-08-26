/**
 * Generates search-engine-friendly favicons from the source brand image.
 * Run: node scripts/generate-favicons.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import toIco from "to-ico";

const root = path.resolve(import.meta.dirname, "..");
const source = path.join(root, "src/app/icon.jpg");

if (!fs.existsSync(source)) {
  console.error("Source icon not found:", source);
  process.exit(1);
}

const sizes = [16, 32, 48, 192, 512];
const pngBuffers = await Promise.all(
  sizes.map((size) =>
    sharp(source)
      .resize(size, size, { fit: "contain", background: { r: 253, g: 248, b: 240, alpha: 1 } })
      .png()
      .toBuffer()
  )
);

const icoBuffer = await toIco(pngBuffers.slice(0, 3));

const outputs = [
  [path.join(root, "public/favicon.ico"), icoBuffer],
  [path.join(root, "src/app/favicon.ico"), icoBuffer],
  [path.join(root, "public/icon-48.png"), pngBuffers[2]],
  [path.join(root, "public/icon-192.png"), pngBuffers[3]],
  [path.join(root, "src/app/icon.png"), pngBuffers[2]],
  [path.join(root, "src/app/apple-icon.png"), pngBuffers[3]],
];

for (const [file, buf] of outputs) {
  fs.writeFileSync(file, buf);
  console.log("wrote", path.relative(root, file));
}

// Remove legacy jpg app icons (Next prefers ico/png).
for (const legacy of ["src/app/icon.jpg", "src/app/apple-icon.jpg", "public/favicon.jpg"]) {
  const p = path.join(root, legacy);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log("removed", legacy);
  }
}

console.log("Done.");
