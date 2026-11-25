// Regenerates public/og.png (1200×630) from an SVG template. Run: node scripts/og.mjs
import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#fbf8f3"/>
  <rect x="0" y="0" width="16" height="630" fill="#1f7a4d"/>
  <g font-family="Segoe UI, Roboto, Helvetica, Arial, sans-serif">
    <text x="96" y="250" font-size="96" font-weight="800" fill="#1c1a17" letter-spacing="-3">Fel Cardini</text>
    <text x="96" y="330" font-size="48" font-weight="600" fill="#5c564e">Software engineer</text>
    <text x="96" y="430" font-size="32" fill="#1c1a17">Node · React · TypeScript · MongoDB</text>
    <text x="96" y="540" font-size="30" font-weight="700" fill="#1f7a4d">cardini.dev</text>
  </g>
</svg>`;

const info = await sharp(Buffer.from(svg))
  .png({ palette: true, colours: 32, compressionLevel: 9 })
  .toFile('public/og.png');
console.log(`public/og.png: ${(info.size / 1024).toFixed(1)} KB`);
