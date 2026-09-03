import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const src = "public/jawed-logo.png";
const image = sharp(src).ensureAlpha();
const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const brightness = r + g + b;
  if (brightness < 70) {
    data[i + 3] = 0;
  } else if (brightness < 160) {
    data[i + 3] = Math.round(((brightness - 70) / 90) * 255);
  }
}

const png = await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .trim()
  .png()
  .toBuffer();

await writeFile("public/jawed-logo-email.png", png);
await writeFile(
  "src/lib/jawed-logo-base64.ts",
  `/** Transparent Jawed wordmark, inlined so order emails can embed the logo. */\nexport const JAWED_LOGO_PNG_BASE64 = "${png.toString("base64")}";\n`
);
console.log("Wrote public/jawed-logo-email.png and src/lib/jawed-logo-base64.ts");
