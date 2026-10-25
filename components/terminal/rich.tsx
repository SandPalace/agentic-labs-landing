import { Fragment, type ReactNode } from 'react';

/**
 * Minimal emphasis markup for translated copy (server- and client-safe):
 *   [[key concept]] → accent colour + bold (`.em-hl`, colour from --hl, defaults to the brand colour)
 *   **phrase**      → bold only (`.em-b`)
 * Use sparingly: about one per heading or paragraph.
 */
const TOKEN = /\[\[(.+?)\]\]|\*\*(.+?)\*\*/g;

export function rich(text: string): ReactNode {
  if (!text.includes('[[') && !text.includes('**')) return text;
  const out: ReactNode[] = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(TOKEN)) {
    if (m.index > last) out.push(<Fragment key={i++}>{text.slice(last, m.index)}</Fragment>);
    out.push(m[1] !== undefined
      ? <strong key={i++} className="em-hl">{m[1]}</strong>
      : <strong key={i++} className="em-b">{m[2]}</strong>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(<Fragment key={i++}>{text.slice(last)}</Fragment>);
  return out;
}

/** Copy with the markup removed, for attributes, meta tags and other plain-text uses. */
export function plain(text: string): string {
  return text.replace(TOKEN, (_, a, b) => a ?? b);
}
