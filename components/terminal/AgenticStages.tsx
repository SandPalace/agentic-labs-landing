"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";
import "./stages.css";

export type AgenticStage = { label: string; text: string };
type Props = { stages: AgenticStage[]; ariaLabel: string };

/* Node primitives (10x10 squares centred on cx, cy). Person = solid fg; agent = accent with inner hole. */
function Person({ x, y }: { x: number; y: number }) {
  return <rect className="st-person" x={x - 5} y={y - 5} width="10" height="10" />;
}
function Agent({ x, y, c, d = 0 }: { x: number; y: number; c: string; d?: number }) {
  return (
    <g className="st-agent" style={{ "--c": `var(--color-${c})`, "--d": `${d}s` } as React.CSSProperties}>
      <rect x={x - 5} y={y - 5} width="10" height="10" />
      <rect className="st-hole" x={x - 1.5} y={y - 1.5} width="3" height="3" />
    </g>
  );
}
function Link({ d, c, delay = 0 }: { d: string; c: string; delay?: number }) {
  return (
    <>
      <path className="st-link" d={d} />
      <path
        className="st-flow"
        d={d}
        style={{ "--c": `var(--color-${c})`, "--d": `${delay}s` } as React.CSSProperties}
      />
    </>
  );
}

function Personal() {
  const xs = [38, 110, 182];
  return (
    <>
      {xs.map((x, i) => (
        <g key={x}>
          <rect className="st-box" x={x - 20} y="8" width="40" height="114" />
          <Link d={`M${x} 34V92`} c="blue" delay={i * 0.5} />
          <Person x={x} y={28} />
          <Agent x={x} y={98} c="blue" d={i * 0.5} />
        </g>
      ))}
    </>
  );
}

function Teams() {
  const xs = [30, 83, 137, 190];
  return (
    <>
      <Link d="M110 34V66" c="teal" />
      <Link d={`M${xs[0]} 66H${xs[3]}`} c="teal" delay={0.4} />
      {xs.map((x, i) => (
        <g key={x}>
          <Link d={`M${x} 66V92`} c="teal" delay={0.8 + i * 0.15} />
          <Agent x={x} y={98} c="teal" d={0.8 + i * 0.25} />
        </g>
      ))}
      <Person x={110} y={28} />
    </>
  );
}

function Operation() {
  const hx = [62, 110, 158];
  const cols = [30, 62, 94, 126, 158, 190];
  const accents = ["blue", "teal", "purple", "orange"];
  const agents: ReactElement[] = [];
  [78, 104].forEach((y, r) =>
    cols.forEach((x, i) => {
      agents.push(<Agent key={`${x}-${y}`} x={x} y={y} c={accents[(i + r * 2) % 4]} d={(i + r * 3) * 0.3} />);
    }),
  );
  return (
    <>
      <rect className="st-box st-box--dash" x="12" y="56" width="196" height="64" />
      {hx.map((x, i) => (
        <Link key={x} d={`M${x} 34V56`} c="purple" delay={i * 0.3} />
      ))}
      <Link d="M30 91H190" c="purple" delay={0.6} />
      {cols.map((x) => (
        <path key={x} className="st-link st-link--faint" d={`M${x} 78V104`} />
      ))}
      {agents}
      {hx.map((x) => (
        <Person key={x} x={x} y={28} />
      ))}
    </>
  );
}

const DIAGRAMS = [Personal, Teams, Operation];
const ACCENTS = ["blue", "teal", "purple"];

export default function AgenticStages({ stages, ariaLabel }: Props) {
  const ref = useRef<HTMLOListElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setPlay(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ol ref={ref} className={`st${play ? " st--play" : ""}`} aria-label={ariaLabel}>
      {stages.map((s, i) => {
        const Diagram = DIAGRAMS[i % DIAGRAMS.length];
        const c = ACCENTS[i % ACCENTS.length];
        return (
          <li key={s.label} className="st-item" style={{ "--c": `var(--color-${c})` } as React.CSSProperties}>
            <div className="st-head">
              <span className="st-num">{String(i + 1).padStart(2, "0")}</span>
              <span className="st-label">[ {s.label.toLowerCase()} ]</span>
            </div>
            <svg className="st-svg" viewBox="0 0 220 130" aria-hidden="true" focusable="false">
              <Diagram />
            </svg>
            <p className="st-text">{s.text}</p>
            {i < stages.length - 1 && (
              <span className="st-arrow" aria-hidden="true">
                <span className="st-arrow__h">──▶</span>
                <span className="st-arrow__v">▼</span>
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
