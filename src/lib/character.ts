/**
 * The Hostay guide: a seasoned property manager in a navy suit, drawn as one line-art bust.
 * Salt-and-pepper side-parted hair, glasses, a trimmed beard; seen from the front or the back.
 * Drawn in "person space": 600 × 560, centred on x = 300, shoulders on the bottom edge.
 */
export const PW = 600;
export const PH = 560;

/* head */
export const HEAD = 'M300 104 C366 104 412 152 414 236 C416 300 398 352 366 382 C346 400 324 410 300 410 C276 410 254 400 234 382 C202 352 184 300 186 236 C188 152 234 104 300 104 Z';
export const EARS: [number, number][] = [
  [186, 262],
  [414, 262]
];
export const NECK = 'M268 384 L268 440 Q300 458 332 440 L332 384 Z';

/* hair: side-parted, greying at the temples; from the back it covers down to the nape */
export const HAIR = 'M188 238 C180 150 230 90 304 90 C374 90 422 140 414 238 C408 204 398 182 382 168 C356 148 318 152 288 146 C256 140 230 150 214 168 C200 186 193 210 188 238 Z';
export const PART = 'M254 98 C262 120 280 136 300 146';
export const TEMPLES = ['M190 236 C190 214 196 196 206 182 L214 214 C206 222 198 230 190 236 Z', 'M410 236 C410 214 404 196 394 182 L386 214 C394 222 402 230 410 236 Z'];
export const HAIR_BACK = 'M186 240 C182 150 232 90 304 90 C374 90 420 142 414 240 C414 300 404 330 388 346 Q300 372 212 346 C196 330 186 300 186 240 Z';
export const STRANDS = ['M286 94 C280 78 288 66 276 54', 'M304 92 C308 74 300 62 310 46', 'M322 96 C330 82 326 72 338 60'];

/* face */
export const BROWS = ['M232 252 Q254 242 278 250', 'M322 250 Q346 242 368 252'];
export const EYES: [number, number][] = [
  [257, 281],
  [343, 281]
];
export const LENSES: { x: number; y: number }[] = [
  { x: 229, y: 263 },
  { x: 315, y: 263 }
];
export const BRIDGE = 'M285 280 Q300 271 315 280';
export const GLASS_ARMS = ['M229 276 L192 266', 'M371 276 L408 266'];
export const NOSE = 'M302 286 Q290 312 298 318 Q306 322 312 316';
export const CHEEKS: [number, number][] = [
  [234, 318],
  [366, 318]
];
export const BEARD = 'M198 296 C204 350 244 404 300 408 C356 404 396 350 402 296 C396 336 368 366 336 374 C322 362 278 362 264 374 C232 366 204 336 198 296 Z';
export const MOUSTACHE = 'M266 334 Q284 320 300 328 Q316 320 334 334 Q318 340 300 335 Q282 340 266 334 Z';

/* suit: navy jacket, white shirt, indigo tie */
export const JACKET = 'M96 560 C104 476 176 446 244 434 L356 434 C424 446 496 476 504 560 Z';
export const SHIRT_V = 'M262 434 L300 548 L338 434 Z';
export const LAPELS = ['M246 434 L300 552 L276 476 L292 452 L262 432 Z', 'M354 434 L300 552 L324 476 L308 452 L338 432 Z'];
export const SHIRT_COLLAR = ['M264 430 L284 466 L300 446 Z', 'M336 430 L316 466 L300 446 Z'];
export const TIE_KNOT = 'M290 446 L310 446 L306 464 L294 464 Z';
export const TIE = 'M294 464 L306 464 L314 538 L300 556 L286 538 Z';
export const POCKET = 'M392 500 L426 492 L428 500 L394 508 Z';
/** Seen from the back: shirt collar above the jacket collar, and the centre seam. */
export const COLLAR_BACK = 'M262 434 Q300 452 338 434 L340 446 Q300 466 260 446 Z';
export const BACK_SEAM = 'M300 462 L300 560';

/** Raised arm (his left, on our right) for waving: sleeve, shirt cuff and hand, pivoting at the shoulder. */
export const ARM_PIVOT: [number, number] = [452, 486];
export const SLEEVE = 'M418 500 L486 372 Q500 350 524 360 Q546 372 536 396 L480 528 Z';
export const CUFF = 'M488 368 Q510 352 532 366 L526 380 Q508 368 492 382 Z';
/** Open palm with four fingers and a thumb, around (518, 322). */
export const PALM = 'M496 352 C488 330 494 306 518 302 C542 300 552 322 546 344 C540 362 506 370 496 352 Z';
export const FINGERS: { x: number; y: number; r: number; h: number }[] = [
  { x: 500, y: 312, r: -24, h: 34 },
  { x: 514, y: 306, r: -8, h: 40 },
  { x: 529, y: 307, r: 8, h: 38 },
  { x: 542, y: 314, r: 22, h: 30 }
];
export const THUMB = 'M498 340 C482 336 470 322 476 312 C482 304 494 316 502 324';

/* ---------- Full figure (the Miftah chat): same head and suit, standing; 600 × 1160 ---------- */
export const FULL_H = 1160;
export const FULL_JACKET = 'M96 560 C104 476 176 446 244 434 L356 434 C424 446 496 476 504 560 L486 784 L300 806 L114 784 Z';
export const FULL_TIE = 'M294 464 L306 464 L318 616 L300 640 L282 616 Z';
export const FULL_SHIRT_V = 'M262 434 L300 650 L338 434 Z';
export const FULL_LAPELS = ['M246 434 L300 652 L272 500 L292 452 L262 432 Z', 'M354 434 L300 652 L328 500 L308 452 L338 432 Z'];
export const BUTTONS: [number, number][] = [
  [300, 690],
  [300, 740]
];
export const TROUSERS = ['M150 784 L294 800 L284 1108 L212 1108 Z', 'M306 800 L450 784 L388 1108 L316 1108 Z'];
export const SHOES = ['M206 1104 L288 1104 Q298 1140 262 1146 L186 1146 Q170 1128 206 1104 Z', 'M312 1104 L394 1104 Q430 1128 414 1146 L338 1146 Q302 1140 312 1104 Z'];
/** Arms hanging at his sides (sleeve, cuff, hand). */
export const ARM_DOWN = [
  { sleeve: 'M104 522 C88 600 90 700 102 770 L148 772 C150 690 150 610 158 540 Z', cuff: 'M102 760 L148 762 L148 776 L102 774 Z', hand: [125, 796] as [number, number] },
  { sleeve: 'M496 522 C512 600 510 700 498 770 L452 772 C450 690 450 610 442 540 Z', cuff: 'M498 760 L452 762 L452 776 L498 774 Z', hand: [475, 796] as [number, number] }
];
/** Thinking: his right hand (on our left) brought up to his chin. */
export const THINK_UPPER = 'M104 522 C92 600 108 680 150 716 L190 692 C162 650 152 600 158 540 Z';
export const THINK_FORE = 'M150 716 L190 692 L282 444 L246 430 Z';
export const THINK_CUFF = 'M238 452 L276 466 L282 444 L246 430 Z';
export const THINK_HAND: [number, number] = [262, 412];
