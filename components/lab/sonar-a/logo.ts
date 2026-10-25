/** Hand-made 5x5 block font for the screensaver logo "MTY / AGENTIC LABS". '#' = lit pixel. */
const FONT: Record<string, string[]> = {
  M: ['#...#', '##.##', '#.#.#', '#...#', '#...#'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..'],
  Y: ['#...#', '.#.#.', '..#..', '..#..', '..#..'],
  A: ['.###.', '#...#', '#####', '#...#', '#...#'],
  G: ['.####', '#....', '#.###', '#...#', '.###.'],
  E: ['#####', '#....', '####.', '#....', '#####'],
  N: ['#...#', '##..#', '#.#.#', '#..##', '#...#'],
  I: ['#####', '..#..', '..#..', '..#..', '#####'],
  C: ['.####', '#....', '#....', '#....', '.####'],
  L: ['#....', '#....', '#....', '#....', '#####'],
  B: ['####.', '#...#', '####.', '#...#', '####.'],
  S: ['.####', '#....', '.###.', '....#', '####.'],
};

export interface LogoPixel { c: number; r: number }
export interface Logo { cols: number; rows: number; px: LogoPixel[] }

const GLYPH_W = 5;
const LETTER_GAP = 1;
const WORD_GAP = 3;
const LINE_GAP = 2;

const wordWidth = (w: string) => w.length * GLYPH_W + (w.length - 1) * LETTER_GAP;

/** wide: "MTY" over "AGENTIC LABS"; narrow: three stacked words. */
export function buildLogo(wide: boolean): Logo {
  const lines = wide ? [['MTY'], ['AGENTIC', 'LABS']] : [['MTY'], ['AGENTIC'], ['LABS']];
  const widths = lines.map((ws) => ws.reduce((a, w) => a + wordWidth(w), 0) + (ws.length - 1) * WORD_GAP);
  const cols = Math.max(...widths);
  const px: LogoPixel[] = [];
  lines.forEach((ws, li) => {
    let x = Math.floor((cols - widths[li]) / 2);
    const y0 = li * (GLYPH_W + LINE_GAP);
    ws.forEach((w) => {
      for (const ch of w) {
        FONT[ch].forEach((row, r) => {
          for (let c = 0; c < GLYPH_W; c++) if (row[c] === '#') px.push({ c: x + c, r: y0 + r });
        });
        x += GLYPH_W + LETTER_GAP;
      }
      x += WORD_GAP - LETTER_GAP;
    });
  });
  return { cols, rows: lines.length * GLYPH_W + (lines.length - 1) * LINE_GAP, px };
}
