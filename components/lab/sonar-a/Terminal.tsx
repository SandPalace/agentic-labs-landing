import type { CSSProperties } from 'react';

export interface TerminalLabels {
  inputs: string; hub: string; outputs: string; human: string; status: string;
  sources: string[]; teams: string[];
}

interface Line { text: string; tone?: 'blue' | 'teal' | 'orange' | 'purple' | 'dim' }

const chunk = (xs: string[], n: number) => Array.from({ length: Math.ceil(xs.length / n) }, (_, i) => xs.slice(i * n, i * n + n).join(' · '));
const CMD = 'agentic status';
const PROMPT = '~/mty-agentic-labs ❯';

/** Pure-CSS typing sequence (no state): the command types, then the tree prints line by line. Echoes hero.console. */
export default function Terminal({ labels }: { labels: TerminalLabels }) {
  const lines: Line[] = [
    { text: `┌ ${labels.inputs}`, tone: 'blue' },
    ...chunk(labels.sources, 3).map((t) => ({ text: `│  ${t}`, tone: 'dim' as const })),
    { text: `├ ${labels.hub}  ${labels.status} ●`, tone: 'teal' },
    { text: `├ ${labels.outputs}`, tone: 'purple' },
    ...chunk(labels.teams, 2).map((t) => ({ text: `│  ${t}`, tone: 'dim' as const })),
    { text: `└ ${labels.human} ✓`, tone: 'orange' },
  ];
  const typeStart = 0.7;
  const typeDur = 1.0;
  const plain = [`${PROMPT} ${CMD}`, ...lines.map((l) => l.text)].join('\n');

  return (
    <>
      <p className="sr-only">{plain}</p>
      <pre className="sa-term" aria-hidden="true">
        <span className="sa-term__row">
          <span className="sa-c-teal">{PROMPT}</span>{' '}
          <span
            className="sa-type"
            style={{ ['--n' as string]: CMD.length, ['--d' as string]: `${typeStart}s`, ['--t' as string]: `${typeDur}s` } as CSSProperties}
          >{CMD}</span>
        </span>
        {lines.map((l, i) => (
          <span
            key={i}
            className={`sa-term__row sa-line sa-c-${l.tone ?? 'dim'}`}
            style={{ ['--d' as string]: `${typeStart + typeDur + 0.25 + i * 0.22}s` } as CSSProperties}
          >{l.text}</span>
        ))}
        <span
          className="sa-term__row sa-line"
          style={{ ['--d' as string]: `${typeStart + typeDur + 0.25 + lines.length * 0.22}s` } as CSSProperties}
        >
          <span className="sa-c-teal">{PROMPT}</span> <span className="sa-cursor" />
        </span>
      </pre>
    </>
  );
}
