// Builds the site icons from the neon "C" (assets/neon-c.png, from the first cardini.dev).
// Run: node scripts/icons.mjs
import sharp from 'sharp';
import { statSync } from 'node:fs';

const SRC = 'assets/neon-c.png';
const icons = [
  { out: 'public/favicon.png', size: 48 }, // browser tab
  { out: 'public/apple-touch-icon.png', size: 180 }, // phone home screen
];

for (const { out, size } of icons) {
  await sharp(SRC)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ palette: true, compressionLevel: 9 })
    .toFile(out);
  console.log(`${out}: ${size}×${size}, ${(statSync(out).size / 1024).toFixed(1)} KB`);
}
