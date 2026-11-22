// Weight of the built home page: HTML (with inlined CSS/JS), favicon, neon font and the
// AVIF screenshots (lazy-loaded, but a full visit fetches them).
// Fails if over budget. Run after `npm run build`.
import { readFileSync, readdirSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const BUDGET_KB = 100;
const files = [
  'dist/index.html',
  'dist/favicon.svg',
  'dist/fonts/neon.woff2',
  ...readdirSync('dist/images')
    .filter((f) => f.endsWith('.avif'))
    .map((f) => `dist/images/${f}`),
];

let raw = 0;
let gz = 0;
for (const f of files) {
  const buf = readFileSync(f);
  raw += buf.length;
  gz += gzipSync(buf, { level: 9 }).length;
  console.log(`${f.padEnd(32)} ${(buf.length / 1024).toFixed(1).padStart(6)} KB raw`);
}
console.log(
  `Full page: ${(raw / 1024).toFixed(1)} KB raw, ${(gz / 1024).toFixed(1)} KB gzipped (budget ${BUDGET_KB} KB)`,
);
if (raw / 1024 > BUDGET_KB) {
  console.error('Over budget.');
  process.exit(1);
}
