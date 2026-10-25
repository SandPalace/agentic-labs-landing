import './avatars.css';

/* 16x16 pixel maps. K=fg  S=face  E=eye  T=antenna tip  A=accent  W=panel  .=empty/keep */
const BASE = [
  '.......TT.......',
  '.......KK.......',
  '.......KK.......',
  '..KKKKKKKKKKKK..',
  '..KSSSSSSSSSSK..',
  '..KSSEESSEESSK..',
  '..KSSEESSEESSK..',
  '..KSSSSSSSSSSK..',
  '..KSSSKSSKSSSK..',
  '..KSSSSKKSSSSK..',
  '..KKKKKKKKKKKK..',
  '...KKKKKKKKKK...',
  '...KAAAAAAAAK...',
  '...KAAAAAAAAK...',
  '...KAAAAAAAAK...',
  '...KKKKKKKKKK...',
];

type Patch = Record<number, string>;

const PATCHES: Record<string, { tone: string; patch: Patch }> = {
  // headset + mic
  asistente: {
    tone: 'blue',
    patch: {
      3: '..AAAAAAAAAAAA..',
      4: 'AA............AA',
      5: 'AA............AA',
      6: 'AA............AA',
      7: 'AA............AA',
      8: 'AA............AA',
      9: '..............AA',
      10: '...........AAAAA',
    },
  },
  // sparks + megaphone
  marketing: {
    tone: 'orange',
    patch: {
      0: '...A.......A....',
      1: '..AAA.....AAA...',
      2: '...A.......A....',
      12: '.........WW.....',
      13: '.....WWWWWWW....',
      14: '.........WW.....',
    },
  },
  // tie
  ventas: {
    tone: 'teal',
    patch: {
      12: '......WKKW......',
      13: '.......KK.......',
      14: '.......KK.......',
    },
  },
  // receipt
  cobranza: {
    tone: 'purple',
    patch: {
      0: '..........AAAA..',
      1: '..........AWKA..',
      2: '..........AAAA..',
      12: '.....WKKKKW.....',
      13: '.....WWWWWW.....',
      14: '.....WKKKKW.....',
    },
  },
  // glasses + bar chart
  finanzas: {
    tone: 'orange',
    patch: {
      4: '....AAAAAAAA....',
      5: '....AEEAAEEA....',
      6: '....AEEAAEEA....',
      7: '....AAAAAAAA....',
      12: '.........W......',
      13: '.......W.W......',
      14: '.....W.W.W......',
    },
  },
  // crown + star
  direccion: {
    tone: 'purple',
    patch: {
      0: '....A..AA..A....',
      1: '....AAAAAAAA....',
      2: '....AAAAAAAA....',
      12: '.......WW.......',
      13: '.....WWWWWW.....',
      14: '......WWWW......',
    },
  },
  // </> visor
  web: {
    tone: 'blue',
    patch: {
      4: '...KKKKKKKKKK...',
      5: '...KKWKKWKWKK...',
      6: '...KWKKWWKKWK...',
      7: '...KKWKWKKWKK...',
      8: '...KKKKKKKKKK...',
    },
  },
};

export type TeamId = keyof typeof PATCHES;

function build(id: string) {
  const patch = PATCHES[id]?.patch ?? {};
  return BASE.map((row, y) => {
    const p = patch[y];
    if (!p) return row;
    return row.split('').map((c, x) => (p[x] && p[x] !== '.' ? p[x] : c)).join('');
  });
}

export default function TeamAvatar({ team }: { team: string }) {
  const def = PATCHES[team];
  if (!def) return null;
  const rects: React.ReactNode[] = [];
  build(team).forEach((row, y) => {
    let x = 0;
    while (x < 16) {
      const c = row[x];
      if (c === '.') { x++; continue; }
      let n = 1;
      // eyes and tip stay separate so they can animate
      if (c !== 'E' && c !== 'T') while (x + n < 16 && row[x + n] === c) n++;
      else while (x + n < 16 && row[x + n] === c && n < 2) n++;
      rects.push(<rect key={`${x}-${y}`} className={`av-${c.toLowerCase()}`} x={x} y={y} width={n} height={1} />);
      x += n;
    }
  });
  return (
    <svg className="av" viewBox="0 -1 16 16" aria-hidden="true" focusable="false" style={{ ['--av' as string]: `var(--color-${def.tone})`, ['--av-bg' as string]: `var(--color-${def.tone}-soft)` }}>
      {rects}
    </svg>
  );
}
