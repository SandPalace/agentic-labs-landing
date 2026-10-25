import localFont from 'next/font/local';

// Site font: Bitstream Vera Mono, shipped as DejaVu Mono (its open descendant, same Latin glyphs; covers box drawing,
// blocks and the ❯ ↵ ■ glyphs the terminal UI uses).
export const veraMono = localFont({
  variable: '--font-vera-mono',
  display: 'swap',
  src: [
    { path: '../node_modules/@fontsource/dejavu-mono/files/dejavu-mono-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../node_modules/@fontsource/dejavu-mono/files/dejavu-mono-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
});

// Heading font: Bitstream Vera Sans, shipped as DejaVu Sans (Vera Mono's sibling). Mono stays the body font.
export const veraSans = localFont({
  variable: '--font-vera-sans',
  display: 'swap',
  src: [
    { path: '../node_modules/@fontsource/dejavu-sans/files/dejavu-sans-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: '../node_modules/@fontsource/dejavu-sans/files/dejavu-sans-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
});
