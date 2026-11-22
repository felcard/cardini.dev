// Checks WCAG AA contrast for the design tokens in both themes.
const themes = {
  light: {
    bg: '#fbf8f3',
    surface: '#ffffff',
    text: '#1c1a17',
    muted: '#5c564e',
    accent: '#1f7a4d',
    accentInk: '#ffffff',
    pink: '#b3157f',
  },
  dark: {
    bg: '#141311',
    surface: '#1c1b18',
    text: '#ece8e1',
    muted: '#aaa298',
    accent: '#5cc48e',
    accentInk: '#0d1f15',
    pink: '#ff6fe0',
  },
  receiptLight: { paper: '#fffdf8', ink: '#2a2723', faded: '#5f5a52', co2: '#1a6b43' },
  receiptDark: { paper: '#ece6da', ink: '#2a2723', faded: '#5f5a52', co2: '#1a6b43' },
};
const receiptPairs = [
  ['ink', 'paper'],
  ['faded', 'paper'],
  ['co2', 'paper'],
];
const pairs = [
  ['text', 'bg'],
  ['text', 'surface'],
  ['muted', 'bg'],
  ['muted', 'surface'],
  ['accent', 'bg'],
  ['accent', 'surface'],
  ['accentInk', 'accent'],
  ['pink', 'bg'],
  ['bg', 'pink'],
];
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
let fail = false;
for (const [name, t] of Object.entries(themes)) {
  for (const [fg, bg] of name.startsWith('receipt') ? receiptPairs : pairs) {
    const r = ratio(t[fg], t[bg]);
    const ok = r >= 4.5;
    fail ||= !ok;
    console.log(
      `${name.padEnd(5)} ${`${fg} on ${bg}`.padEnd(22)} ${r.toFixed(2)} ${ok ? 'AA' : 'FAIL'}`,
    );
  }
}
process.exit(fail ? 1 : 0);
