/**
 * Tiny isometric engine for the line-art illustrations.
 * World units: x to the right-down, y to the left-down, z up. One unit = U px.
 * Everything returns SVG markup strings, rendered server-side (no runtime JS).
 */
const C = Math.cos(Math.PI / 6);
const S = 0.5;
export const U = 14;

export type V3 = readonly [number, number, number];
export interface Tone {
  top: string;
  left: string;
  right: string;
}

const f = (n: number) => +n.toFixed(2);

/** Project a world point to screen coordinates. */
export const P = (x: number, y: number, z: number): [number, number] => [f((x - y) * C * U), f((x + y) * S * U - z * U)];

/** World point from a screen-ish placement: s = left/right, t = depth. */
export const at = (s: number, t: number): [number, number] => [(t + s) / 2, (t - s) / 2];

const pts = (list: readonly V3[]) => list.map((p) => P(p[0], p[1], p[2]).join(',')).join(' ');

const STROKE = 'stroke="var(--il-stroke)" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"';

export const poly = (list: readonly V3[], fill: string) => `<polygon points="${pts(list)}" fill="${fill}" ${STROKE}/>`;

/** A box standing on (x, y, z), size w × d × h. Draws the three visible faces. */
export function box(x: number, y: number, z: number, w: number, d: number, h: number, t: Tone): string {
  return [
    poly(
      [
        [x, y + d, z],
        [x + w, y + d, z],
        [x + w, y + d, z + h],
        [x, y + d, z + h]
      ],
      t.left
    ),
    poly(
      [
        [x + w, y, z],
        [x + w, y + d, z],
        [x + w, y + d, z + h],
        [x + w, y, z + h]
      ],
      t.right
    ),
    poly(
      [
        [x, y, z + h],
        [x + w, y, z + h],
        [x + w, y + d, z + h],
        [x, y + d, z + h]
      ],
      t.top
    )
  ].join('');
}

/** Staircase going down along +x from (x, y, z). */
export function stairs(x: number, y: number, z: number, steps: number, run: number, rise: number, d: number, t: Tone): string {
  let out = '';
  for (let i = 0; i < steps; i++) {
    out += box(x + i * run, y, 0, run, d, Math.max(0.2, z - i * rise), t);
  }
  return out;
}

const plane = (m: [number, number, number, number], x: number, y: number, z: number, inner: string) => {
  const [ox, oy] = P(x, y, z);
  return `<g transform="matrix(${m.map(f).join(' ')} ${ox} ${oy})">${inner}</g>`;
};

/**
 * Draw flat 2D shapes on a vertical plane facing the viewer's left (y = const).
 * Local units: a to the right (along +x), b up. Use small numbers (1 = 1 world unit).
 */
export const onLeft = (x: number, y: number, z: number, inner: string) => plane([C * U, S * U, 0, -U], x, y, z, inner);

/** Same on a vertical plane facing the viewer's right (x = const); a runs along -y. */
export const onRight = (x: number, y: number, z: number, inner: string) => plane([C * U, -S * U, 0, -U], x, y, z, inner);

/** Flat on the ground plane (z = const); a along +x, b along +y. */
export const onTop = (x: number, y: number, z: number, inner: string) => plane([C * U, S * U, -C * U, S * U], x, y, z, inner);

/** Stroke style for shapes inside plane groups (keeps the line width constant). */
export const LS = 'stroke="var(--il-stroke)" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"';

/**
 * Arch outline for plane groups (local units, b up), sampled so it survives the iso transform.
 * horseshoe > 0 extends the curve below the springing line, as in Moroccan arches.
 */
export function archPath(x0: number, w: number, h: number, horseshoe = 0): string {
  const r = w / 2;
  const cx = x0 + r;
  const cy = h - r;
  const a0 = Math.PI + horseshoe;
  const a1 = -horseshoe;
  const steps = 24;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const a = a0 + ((a1 - a0) * i) / steps;
    pts.push(`${f(cx + Math.cos(a) * r)} ${f(cy + Math.sin(a) * r)}`);
  }
  const startX = f(cx + Math.cos(a0) * r);
  const endX = f(cx + Math.cos(a1) * r);
  return `M${startX} 0 L${pts.join(' L')} L${endX} 0 Z`;
}

/** Hollow arch frame: outer arch minus inner opening (even-odd). */
export function archFrame(x0: number, w: number, h: number, t: number, horseshoe = 0.28): string {
  return `${archPath(x0, w, h, horseshoe)} ${archPath(x0 + t, w - 2 * t, h - t, horseshoe)}`;
}

/** Floating steps (no risers), going down along +x from (x, y, z). */
export function floatSteps(x: number, y: number, z: number, n: number, run: number, rise: number, d: number, t: Tone): string {
  let out = '';
  for (let i = 0; i < n; i++) out += box(x + i * run, y, z - i * rise, run, d, 0.45, t);
  return out;
}

/** Four-point sparkle in screen space. */
export const sparkle = (cx: number, cy: number, r: number, cls = 'spark') =>
  `<path class="${cls}" d="M${cx} ${cy - r}C${cx + r * 0.12} ${cy - r * 0.12} ${cx + r * 0.12} ${cy - r * 0.12} ${cx + r} ${cy}C${cx + r * 0.12} ${cy + r * 0.12} ${cx + r * 0.12} ${cy + r * 0.12} ${cx} ${cy + r}C${cx - r * 0.12} ${cy + r * 0.12} ${cx - r * 0.12} ${cy + r * 0.12} ${cx - r} ${cy}C${cx - r * 0.12} ${cy - r * 0.12} ${cx - r * 0.12} ${cy - r * 0.12} ${cx} ${cy - r}Z" fill="var(--il-slate-2)"/>`;

/** Ring (key ring / coin) in screen space, slightly flattened as if tilted. */
export const ring = (cx: number, cy: number, r: number) =>
  `<g class="ring"><ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.86}" fill="var(--il-amber)" ${STROKE}/><ellipse cx="${cx}" cy="${cy}" rx="${r * 0.42}" ry="${r * 0.36}" fill="var(--page)" ${STROKE}/></g>`;

/** Bounding box of screen points, for an automatic viewBox. */
export function extent(markup: string, pad = 24): string {
  const nums = [...markup.matchAll(/points="([^"]+)"/g)].flatMap((m) => (m[1] ?? '').split(' ').map((p) => p.split(',').map(Number)));
  const xs = nums.map((p) => p[0] ?? 0);
  const ys = nums.map((p) => p[1] ?? 0);
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  return `${f(minX)} ${f(minY)} ${f(Math.max(...xs) - minX + pad)} ${f(Math.max(...ys) - minY + pad)}`;
}

/** Tones used across the scenes (CSS variables, so the palette lives in global.css). */
export const T = {
  slate: { top: 'var(--il-slate-3)', left: 'var(--il-slate-2)', right: 'var(--il-slate)' },
  indigo: { top: 'var(--il-indigo-2)', left: 'var(--il-indigo)', right: '#5c62cf' },
  amber: { top: 'var(--il-amber-2)', left: 'var(--il-amber)', right: '#d8954f' },
  cream: { top: 'var(--white)', left: 'var(--il-cream)', right: '#e6dfcf' },
  sage: { top: '#d5eadf', left: 'var(--il-sage)', right: '#6f9f8a' },
  ink: { top: '#4b4f78', left: '#2f3360', right: '#232650' }
} satisfies Record<string, Tone>;
