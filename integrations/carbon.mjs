// Astro integration: after the build, itemises each page's first load (HTML, inlined
// CSS and JS, font, icon), measures what is actually transferred (gzipped), and estimates
// CO₂ per visit with CO2.js (Sustainable Web Design model v4, the model Website Carbon
// uses). The receipt and footer render placeholder tokens that are replaced here, so the
// figures always describe the page as built.
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { co2 } from '@tgwf/co2';
import { transform } from 'esbuild';
import { token } from './tokens.mjs';

const swd = new co2({ model: 'swd', version: 4 });
const gz = (buf) => gzipSync(buf, { level: 9 }).length;
const bytes = (s) => Buffer.byteLength(s, 'utf8');
const kb = (n) => (n / 1024).toFixed(1);
const inner = (html, tag) => {
  const re = new RegExp(String.raw`<${tag}(?:\s[^>]*)?>([\s\S]*?)</${tag}>`, 'g');
  return [...html.matchAll(re)].reduce((sum, m) => sum + bytes(m[1]), 0);
};

// Astro leaves is:inline scripts as written; minify them so comments and
// whitespace never ship.
async function minifyScripts(html) {
  let out = '';
  let last = 0;
  for (const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
    const { code } = await transform(m[1], { minify: true, target: 'es2020' });
    out += `${html.slice(last, m.index)}<script>${code.trim()}</script>`;
    last = m.index + m[0].length;
  }
  return out + html.slice(last);
}

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

export default function carbon() {
  return {
    name: 'carbon-receipt',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const icon = await readFile(join(root, 'favicon.svg'));
        const font = await readFile(join(root, 'fonts/neon.woff2'));

        for (const file of await htmlFiles(root)) {
          const html = await minifyScripts(await readFile(file, 'utf8'));
          if (!html.includes(token('TOTAL'))) {
            await writeFile(file, html);
            continue;
          }

          const css = inner(html, 'style');
          const js = inner(html, 'script');
          const fontBytes = html.includes('/fonts/neon.woff2') ? font.length : 0;
          // Images: modern browsers fetch the AVIF of each <picture>. They're lazy-loaded,
          // but a full visit scrolls past them, so they count.
          const avifs = new Set([...html.matchAll(/srcset="(\/[^"]+\.avif)"/g)].map((m) => m[1]));
          let imgBytes = 0;
          for (const src of avifs) imgBytes += (await readFile(join(root, src))).length;
          const raw = bytes(html) + icon.length + fontBytes + imgBytes;
          // woff2 and AVIF are already compressed, so they go over the wire as they are.
          const sent = gz(Buffer.from(html)) + gz(icon) + fontBytes + imgBytes;
          // Not counted as green hosting: GitHub Pages isn't verified by the Green Web Foundation.
          const grams = Number(swd.perVisit(sent, false).toPrecision(1)).toString();

          const values = {
            HTML: kb(bytes(html) - css - js),
            CSS: kb(css),
            JS: kb(js),
            FONT: kb(fontBytes),
            ICON: kb(icon.length),
            IMG: kb(imgBytes),
            IMGN: String(avifs.size),
            SUB: kb(raw),
            SAVED: kb(raw - sent),
            TOTAL: kb(sent),
            CO2: grams,
          };
          let out = html;
          for (const [k, v] of Object.entries(values)) out = out.replaceAll(token(k), v);
          await writeFile(file, out);
          logger.info(`${file.slice(root.length)}: ${values.TOTAL} KB sent, ~${grams} g CO₂/visit`);
        }
      },
    },
  };
}
