// Builds public/fonts/neon.woff2: Monoton (OFL-1.1) cut down to the glyphs of the
// name and role. Run: node scripts/font.mjs
import { readFile, writeFile, copyFile } from 'node:fs/promises';
import subsetFont from 'subset-font';

const TEXT = 'Felipe Cardini' + 'Full-stack engineer.';
const pkg = 'node_modules/@fontsource/monoton';
const src = await readFile(`${pkg}/files/monoton-latin-400-normal.woff2`);
const out = await subsetFont(src, TEXT, { targetFormat: 'woff2' });
await writeFile('public/fonts/neon.woff2', out);
await copyFile(`${pkg}/LICENSE`, 'public/fonts/OFL.txt');
console.log(`public/fonts/neon.woff2: ${(out.length / 1024).toFixed(1)} KB for "${TEXT}"`);
