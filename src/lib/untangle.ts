/**
 * Timeline for the three-chapter story told by the guide character (components/Guide.astro),
 * who stays fixed on screen while the story section scrolls around him:
 * 1. the problem: worried, a tangled thought above his head, chores floating around it;
 * 2. the search: he turns his back to us and searches on a screen; each method is crossed out;
 * 3. the answer: Hostay comes up, he opens it, turns back to us and says "Hostay !".
 * Shared by the server render (initial state) and the client scroll script.
 */

/** Centre of the "thinking" area inside the head (person space). */
export const BRAIN: [number, number] = [300, 186];

/** A scribbled ball of tangled thread centred on (cx, cy), scaled by k. */
export function tangle(cx: number, cy: number, k = 1): string {
  const n = 260;
  let d = '';
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = t * Math.PI * 2 * 9;
    const r = 44 * (0.4 + 0.6 * Math.abs(Math.sin(t * Math.PI * 5.7 + 0.4)));
    const x = cx + (r * Math.cos(a) * 1.2 + 16 * Math.sin(t * Math.PI * 3.1)) * k;
    const y = cy + (r * Math.sin(a * 0.93 + 1) * 0.9 + 12 * Math.cos(t * Math.PI * 2.3)) * k;
    d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return d;
}

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => {
  const k = clamp((x - a) / (b - a));
  return k * k * (3 - 2 * k);
};
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/** Scroll progress p (0..1) through the story section, split into its phases. */
export function phases(p: number, results: number) {
  const r0 = 0.44;
  const r1 = 0.58;
  const per = (r1 - r0) / results;
  return {
    chapter: p < 0.3 ? 0 : p < 0.6 ? 1 : 2,
    chores: 1 - smooth(0.26, 0.33, p), // the chores fade as he turns to search
    turn: smooth(0.3, 0.36, p) * (1 - smooth(0.68, 0.74, p)), // 1 = back to us
    search: smooth(0.27, 0.35, p) * (1 - smooth(0.68, 0.76, p)), // focused
    typing: p > 0.36 && p < 0.68, // hands busy on the keyboard
    screen: smooth(0.3, 0.37, p), // the screen lights up
    typed: clamp((p - 0.37) / 0.07), // share of the query typed
    shown: Math.max(0, (p - r0) / per), // results listed so far (fractional)
    struck: Math.max(0, (p - r0) / per - 0.45), // results crossed out so far (fractional)
    found: smooth(0.58, 0.62, p), // Hostay comes up
    use: smooth(0.62, 0.65, p), // he opens it: the planning view
    fill: smooth(0.64, 0.7, p), // ...and his bookings fill in
    calm: smooth(0.68, 0.78, p), // he relaxes and smiles
    thought: 1 - smooth(0.29, 0.35, p), // the tangled thought gives way to the screen
    say: p > 0.76 // "Hostay !"
  };
}

// Mouth control points: worried wave → focused "hmm" → smile.
const WORRIED = [276, 346, 290, 340, 310, 352, 324, 346];
const PONDER = [286, 349, 295, 347, 306, 347, 316, 342];
const SMILE = [276, 346, 290, 357, 310, 357, 324, 344];

/** Mouth for search s and calm c. */
export function mouthAt(s: number, c: number): string {
  const v = WORRIED.map((w, i) => lerp(lerp(w, PONDER[i]!, s), SMILE[i]!, c).toFixed(1));
  return `M${v[0]} ${v[1]} C${v[2]} ${v[3]} ${v[4]} ${v[5]} ${v[6]} ${v[7]}`;
}

/** Where each chore floats around the thought cloud (% of the cloud's box), and its tilt. */
export const CHORES: { x: number; y: number; r: number }[] = [
  { x: -6, y: 22, r: -7 },
  { x: 104, y: 18, r: 6 },
  { x: -14, y: 62, r: 5 },
  { x: 112, y: 60, r: -6 },
  { x: 50, y: -10, r: -3 }
];
