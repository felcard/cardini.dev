// Re-hosts the TRACE screenshots isla has published on traceyour.events, cropped
// and compressed (AVIF + WebP fallback). Credit "Image: isla" wherever they're used.
// Run: node scripts/images.mjs <folder with the downloaded originals>
import sharp from 'sharp';
import { join } from 'node:path';
import { statSync } from 'node:fs';

const dir = process.argv[2];
if (!dir) throw new Error('Usage: node scripts/images.mjs <originals folder>');

const jobs = [
  // Results dashboard: totals, Scope 1-3, emissions by category.
  { src: 'Screenshot-at-Mar-22-17-38-25-1.png', out: 'trace-dashboard' },
  // Data entry ("Energy" page): just the app window, without the decorative background.
  {
    src: 'measure-img.png',
    out: 'trace-data-entry',
    crop: { left: 49, top: 272, width: 1349, height: 826 },
  },
];

const WIDTH = 1200; // ~2× the 680px column, scaled down for phones by the browser.
for (const job of jobs) {
  let img = sharp(join(dir, job.src)).flatten({ background: '#ffffff' });
  if (job.crop) img = img.extract(job.crop);
  img = img.resize({ width: WIDTH, withoutEnlargement: true });
  const info = await img
    .clone()
    .avif({ quality: 45, effort: 9 })
    .toFile(`public/images/${job.out}.avif`);
  await img.clone().webp({ quality: 58, effort: 6 }).toFile(`public/images/${job.out}.webp`);
  const kb = (f) => (statSync(f).size / 1024).toFixed(1);
  console.log(
    `${job.out}: ${info.width}×${info.height}, avif ${kb(`public/images/${job.out}.avif`)} KB, webp ${kb(`public/images/${job.out}.webp`)} KB`,
  );
}
