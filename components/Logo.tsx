/**
 * Mty Agentic Labs logo — 4-cube mark (blue, orange, purple, teal) + mono bold wordmark with a block cursor.
 * Geometry matches `.logo .mark` in Template-Cotizacion-MtyAgenticLabs.html (26×26 box).
 */
export function LogoMark({ size = 26, className }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 26 26"
      width={size}
      height={size}
      fill="none"
      aria-hidden="true"
      className={className}
      style={{ flex: 'none', display: 'block' }}
    >
      <rect x="0" y="2" width="13" height="13" rx="2" fill="#2D6BFF" />
      <rect x="16" y="0" width="10" height="10" rx="2" fill="#FF7A2F" />
      <rect x="13" y="14" width="12" height="12" rx="2" fill="#8B5CF6" />
      <rect x="3" y="17" width="8" height="8" rx="2" fill="#14B8A6" />
    </svg>
  );
}

export default function Logo({
  size = 26,
  fontSize = 17,
  className = '',
}: {
  size?: number;
  fontSize?: number;
  className?: string;
}) {
  return (
    <span
      className={`logo ${className}`}
      style={{ gap: Math.round(size * 0.42), fontSize }}
    >
      <LogoMark size={size} />
      <span className="logo__word">Mty Agentic Labs</span>
    </span>
  );
}
