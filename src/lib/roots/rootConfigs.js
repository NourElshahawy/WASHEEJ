/**
 * Where the roots leave the وشيج letterform and where they head.
 * Coordinates are in the logo's SVG units (viewBox 0 0 1001 554); the roots
 * run far outside that box — above and below the hero copy.
 *
 * Angles are in radians: 0 = right, π/2 = down, -π/2 = up.
 * Each layout has exactly four labelled roots (01–04), foreshadowing the four
 * process steps.
 */

const UP = -Math.PI / 2;
const DOWN = Math.PI / 2;

/** Arabic, desktop: the word sits at the left edge; roots reach right toward the copy. */
const rtlDesktop = {
  seed: 11,
  density: 1,
  keepClear: { x: [1085, 4000], y: [-125, 655] },
  roots: [
    {
      // 01 — climbs from the top of the ج, over the paper.
      start: [236, 180],
      angle: UP - 0.35,
      length: 330,
      waypoints: [[150, -160]],
      delay: 0.1,
      widthScale: 0.85,
      label: { text: '(01)', at: 0.55, offset: [-120, -70] },
    },
    {
      // 02 — from the teeth of the ش, up and across above the headline.
      start: [826, 176],
      angle: UP + 0.5,
      length: 1180,
      waypoints: [
        [1090, -150],
        [1500, -230],
        [2050, -250],
      ],
      delay: 0,
      label: { text: '(02)', at: 0.36, offset: [50, -85] },
    },
    {
      // 03 — from the tip of the swash, under the copy.
      start: [585, 462],
      angle: 0.55,
      length: 1150,
      waypoints: [
        [980, 705],
        [1400, 740],
        [1900, 728],
      ],
      delay: 0.25,
      label: { text: '(03)', at: 0.24, offset: [90, -95] },
    },
    {
      // Unlabelled long runner along the bottom of the hero.
      start: [250, 518],
      angle: DOWN - 0.5,
      length: 1750,
      waypoints: [
        [520, 800],
        [1200, 862],
        [2300, 835],
      ],
      delay: 0.4,
    },
    {
      // 04 — drops from the bowl of the ج toward the bottom corner.
      start: [112, 490],
      angle: DOWN + 0.35,
      length: 400,
      waypoints: [[-40, 860]],
      delay: 0.5,
      widthScale: 0.85,
      label: { text: '(04)', at: 0.4, offset: [115, 40] },
    },
  ],
};

/** English, desktop: the word sits at the right edge; roots reach left toward the copy. */
const ltrDesktop = {
  seed: 23,
  density: 1,
  keepClear: { x: [-4000, -95], y: [-150, 690] },
  roots: [
    {
      // 01 — from the top bar of the ج, up and across above the headline.
      start: [120, 172],
      angle: UP - 0.6,
      length: 1150,
      waypoints: [
        [-30, -200],
        [-520, -265],
        [-1100, -275],
      ],
      delay: 0,
      label: { text: '(01)', at: 0.3, offset: [70, -62] },
    },
    {
      // 02 — climbs from the ش over the paper.
      start: [826, 176],
      angle: UP + 0.3,
      length: 330,
      waypoints: [[940, -170]],
      delay: 0.1,
      widthScale: 0.85,
      label: { text: '(02)', at: 0.55, offset: [110, -60] },
    },
    {
      // 03 — from the bowl of the ج, under the copy.
      start: [70, 452],
      angle: DOWN + 0.5,
      length: 1150,
      waypoints: [
        [-50, 715],
        [-500, 745],
        [-1000, 735],
      ],
      delay: 0.25,
      label: { text: '(03)', at: 0.1, offset: [-105, -42] },
    },
    {
      // Unlabelled long runner along the bottom of the hero.
      start: [230, 520],
      angle: DOWN + 0.3,
      length: 1750,
      waypoints: [
        [90, 815],
        [-600, 865],
        [-1500, 840],
      ],
      delay: 0.4,
    },
    {
      // 04 — drops from the tip of the swash toward the bottom corner.
      start: [585, 462],
      angle: DOWN - 0.5,
      length: 420,
      waypoints: [[900, 800]],
      delay: 0.5,
      widthScale: 0.85,
      label: { text: '(04)', at: 0.6, offset: [150, -78] },
    },
  ],
};

/** Mobile (both languages): fewer, shorter roots that stay inside the art block. */
const mobile = {
  seed: 5,
  density: 0.8,
  roots: [
    {
      start: [236, 180],
      angle: UP - 0.3,
      length: 190,
      waypoints: [[170, -120]],
      delay: 0.1,
      label: { text: '(01)', at: 0.7, offset: [-95, -40] },
    },
    {
      start: [826, 176],
      angle: UP + 0.45,
      length: 260,
      waypoints: [[1010, -110]],
      delay: 0,
      label: { text: '(02)', at: 0.6, offset: [70, 70] },
    },
    {
      start: [585, 462],
      angle: 0.6,
      length: 520,
      waypoints: [
        [820, 620],
        [1080, 660],
      ],
      delay: 0.25,
      label: { text: '(03)', at: 0.45, offset: [70, -80] },
    },
    {
      start: [150, 505],
      angle: DOWN + 0.2,
      length: 330,
      waypoints: [
        [110, 680],
        [330, 760],
      ],
      delay: 0.4,
      label: { text: '(04)', at: 0.5, offset: [-105, 50] },
    },
  ],
};

export function getRootConfig(direction, layout) {
  if (layout === 'mobile') return mobile;
  return direction === 'rtl' ? rtlDesktop : ltrDesktop;
}

/**
 * Thick strokes used as a mask to "write" the letterform, in writing order:
 * و → ش and the baseline → the top of the ج → its bowl and the swash → the dots.
 * They only need to cover the ink; the logo shape itself does the clipping.
 */
export const WRITING_STROKES = [
  { d: 'M925,175 C928,235 935,290 890,335 C830,385 740,400 640,398', width: 165, duration: 0.55 },
  { d: 'M818,170 L806,262 C640,280 420,268 245,280', width: 150, duration: 0.6 },
  { d: 'M345,200 C250,180 140,185 55,195', width: 118, duration: 0.3 },
  { d: 'M300,232 C170,245 70,300 48,385 C36,470 130,500 250,490 C370,470 470,428 600,462', width: 128, duration: 0.75 },
  { d: 'M790,85 L640,85', width: 150, duration: 0.16 },
  { d: 'M470,372 L330,372', width: 78, duration: 0.14 },
  { d: 'M232,357 L150,357', width: 84, duration: 0.12 },
];
