/**
 * A simple map for "Made in Morocco": the coastline (Mediterranean and Atlantic) from the east
 * edge round to the south edge, the land behind it, and a route through the cities from Tangier
 * to Agadir. No borders are drawn: the land simply fades out to the east and south.
 * Equirectangular, scaled for ~32°N. Shared by the server render and the scroll script.
 */
export const MW = 540;
export const MH = 500;
const LON0 = -11.4;
const LAT0 = 36.3;
const S = 62;
const COS = Math.cos((32 * Math.PI) / 180);

/** Longitude/latitude to map units. */
export const proj = (lon: number, lat: number): [number, number] => [(lon - LON0) * COS * S, (LAT0 - lat) * S];

// Coastline, east to west along the Mediterranean, then south along the Atlantic.
const COAST: [number, number][] = [
  [-1.3, 35.15], [-2.2, 35.1], [-2.93, 35.17], [-2.97, 35.44], [-3.4, 35.2], [-3.93, 35.25], [-4.67, 35.2],
  [-5.32, 35.68], [-5.32, 35.9], [-5.6, 35.83], [-5.8, 35.79], [-5.92, 35.79], [-6.03, 35.47], [-6.16, 35.19],
  [-6.65, 34.27], [-6.84, 34.02], [-7.39, 33.69], [-7.62, 33.6], [-8.5, 33.25], [-9.0, 32.8], [-9.24, 32.3],
  [-9.6, 31.9], [-9.77, 31.51], [-9.85, 31.0], [-9.89, 30.63], [-9.71, 30.54], [-9.6, 30.42], [-9.65, 30.0],
  [-9.9, 29.7], [-10.17, 29.38], [-10.6, 28.95], [-11.0, 28.6], [-11.4, 28.35]
];

const toD = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('');

const coastXY = COAST.map(([lon, lat]) => proj(lon, lat));
export const COAST_D = toD(coastXY);
/** Land: the coast closed off along the east and south edges (hidden by a fade). */
export const LAND_D = `${COAST_D}L${MW + 20} ${MH + 20}L${MW + 20} ${coastXY[0]![1]}Z`;

/** Cities in route order (same order as CITIES), with where their label sits. */
export const CITY_POS: { lon: number; lat: number; side: 'r' | 'l' | 'u' }[] = [
  { lon: -5.8, lat: 35.77, side: 'r' }, // Tangier
  { lon: -5.0, lat: 34.03, side: 'r' }, // Fez
  { lon: -6.84, lat: 34.02, side: 'l' }, // Rabat
  { lon: -7.59, lat: 33.57, side: 'r' }, // Casablanca
  { lon: -8.0, lat: 31.63, side: 'r' }, // Marrakech
  { lon: -9.77, lat: 31.51, side: 'l' }, // Essaouira
  { lon: -9.71, lat: 30.54, side: 'u' }, // Taghazout
  { lon: -9.6, lat: 30.42, side: 'r' } // Agadir
];
const cityXY = CITY_POS.map((c) => proj(c.lon, c.lat));

/** The route through the cities: a smooth Catmull-Rom curve, sampled evenly. */
const ROUTE_PTS: [number, number][] = (() => {
  const out: [number, number][] = [];
  const P = cityXY;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)]!;
    const p1 = P[i]!;
    const p2 = P[i + 1]!;
    const p3 = P[Math.min(P.length - 1, i + 2)]!;
    for (let k = 0; k < 24; k++) {
      const t = k / 24;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(P[P.length - 1]!);
  return out;
})();
export const ROUTE_D = toD(ROUTE_PTS);

/** Where on the route (0..1) each city sits. */
export const CITY_T = cityXY.map((_, i) => (i * 24) / (ROUTE_PTS.length - 1));
export const CITY_XY = cityXY;

/** Point on the route at t (0..1). */
export function routeAt(t: number): [number, number] {
  const f = Math.min(1, Math.max(0, t)) * (ROUTE_PTS.length - 1);
  const i = Math.floor(f);
  const a = ROUTE_PTS[i]!;
  const b = ROUTE_PTS[Math.min(ROUTE_PTS.length - 1, i + 1)]!;
  const k = f - i;
  return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];
}
