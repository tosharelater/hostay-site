/**
 * The map of Morocco used by "Made in Morocco" and the Morocco page: the whole country as
 * one outline, from the Mediterranean to the southern provinces. Simplified, for illustration.
 * Equirectangular, scaled for ~29°N. Shared by the server render and the scroll script.
 */
export const MW = 540;
export const MH = 590;
const LON0 = -17.6;
const LAT0 = 36.3;
const S = 37;
const COS = Math.cos((29 * Math.PI) / 180);

/** Longitude/latitude to map units. */
export const proj = (lon: number, lat: number): [number, number] => [(lon - LON0) * COS * S, (LAT0 - lat) * S];

// One closed outline, clockwise from the east of the Mediterranean coast.
const OUTLINE: [number, number][] = [
  // Mediterranean coast, east to west
  [-2.2, 35.1], [-2.93, 35.17], [-2.97, 35.44], [-3.4, 35.2], [-3.93, 35.25], [-4.67, 35.2], [-5.32, 35.68],
  [-5.32, 35.9], [-5.6, 35.83], [-5.92, 35.79],
  // Atlantic coast, north to south
  [-6.03, 35.47], [-6.16, 35.19], [-6.65, 34.27], [-6.84, 34.02], [-7.39, 33.69], [-7.62, 33.6], [-8.5, 33.25],
  [-9.0, 32.8], [-9.24, 32.3], [-9.6, 31.9], [-9.77, 31.51], [-9.85, 31.0], [-9.89, 30.63], [-9.6, 30.42],
  [-9.65, 30.0], [-9.9, 29.7], [-10.17, 29.38], [-10.6, 28.95], [-11.1, 28.45], [-11.6, 28.25], [-12.4, 28.0],
  [-12.92, 27.94], [-13.2, 27.6], [-13.4, 27.1], [-13.9, 26.6], [-14.5, 26.13], [-14.85, 25.4], [-15.0, 24.8],
  [-15.5, 24.2], [-15.9, 23.7], [-16.2, 23.2], [-16.5, 22.5], [-16.9, 21.8], [-17.05, 20.85],
  // land, south then east and north back to the Mediterranean
  [-16.95, 21.33], [-13.0, 21.33], [-13.0, 23.0], [-12.0, 23.45], [-12.0, 26.0], [-8.67, 26.0], [-8.67, 27.67],
  [-8.67, 28.7], [-7.6, 29.4], [-6.0, 29.6], [-5.0, 29.9], [-4.0, 30.4], [-3.6, 31.0], [-2.9, 31.5], [-1.7, 32.1],
  [-1.2, 32.4], [-1.3, 33.0], [-1.7, 33.7], [-1.8, 34.5]
];

/** The country as one closed path. */
export const MOROCCO_D = OUTLINE.map(([lon, lat], i) => {
  const [x, y] = proj(lon, lat);
  return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
}).join('') + 'Z';

/** Where the name and the Hostay mark sit, inside the country. */
export const LABEL: [number, number] = proj(-7.6, 30.0);
