/** Real Omarchy palettes (basecamp/omarchy each theme colors.toml), with the text roles nudged to hold AA on each background. */
export interface SbTheme {
  id: string;
  mode: 'light' | 'dark';
  vars: Record<string, string>;
  rings: string[];
  base: string;
  baseOpacity: number;
}

const mk = (
  id: string, mode: 'light' | 'dark',
  c: { bg: string; fg: string; dim: string; accent: string; accentFg: string; line: string; panel: string; ok: string },
  rings: string[], base: string,
): SbTheme => ({
  id, mode, rings, base, baseOpacity: mode === 'light' ? 0.6 : 0.6,
  vars: {
    '--sb-bg': c.bg, '--sb-fg': c.fg, '--sb-dim': c.dim, '--sb-accent': c.accent,
    '--sb-accent-fg': c.accentFg, '--sb-line': c.line, '--sb-panel': c.panel, '--sb-ok': c.ok,
  },
});

export const THEMES: SbTheme[] = [
  mk('brand-light', 'light',
    { bg: '#F4F6F9', fg: '#0F172A', dim: '#4B5563', accent: '#1D4FD8', accentFg: '#FFFFFF', line: '#C9D1DC', panel: '#FFFFFF', ok: '#0B6B61' },
    ['#2D6BFF', '#FF7A2F', '#8B5CF6', '#14B8A6'], '#7A8494'),
  mk('catppuccin-latte', 'light',
    { bg: '#eff1f5', fg: '#4c4f69', dim: '#5c5f77', accent: '#1a56d6', accentFg: '#eff1f5', line: '#ccd0da', panel: '#e6e9ef', ok: '#2a7a1a' },
    ['#1e66f5', '#ea76cb', '#179299', '#df8e1d'], '#8c8fa1'),
  mk('flexoki-light', 'light',
    { bg: '#FFFCF0', fg: '#100F0F', dim: '#5E5C57', accent: '#205EA6', accentFg: '#FFFCF0', line: '#CECDC3', panel: '#F2F0E5', ok: '#566B08' },
    ['#205EA6', '#D14D41', '#3AA99F', '#D0A215'], '#878580'),
  mk('tokyo-night', 'dark',
    { bg: '#1a1b26', fg: '#c0caf5', dim: '#9aa5ce', accent: '#7aa2f7', accentFg: '#1a1b26', line: '#3b4261', panel: '#24283b', ok: '#9ece6a' },
    ['#7aa2f7', '#ad8ee6', '#9ece6a', '#e0af68'], '#565f89'),
  mk('kanagawa', 'dark',
    { bg: '#1f1f28', fg: '#dcd7ba', dim: '#a6a28c', accent: '#7e9cd8', accentFg: '#1f1f28', line: '#363646', panel: '#2a2a37', ok: '#98bb6c' },
    ['#7e9cd8', '#957fb8', '#98bb6c', '#e6c384'], '#727169'),
];
