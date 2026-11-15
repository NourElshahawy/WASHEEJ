import { createNoise2D } from 'simplex-noise';

/**
 * Turns a centre line (a few waypoints) into a bundle of fine, silky strands.
 *
 * Each waypoint is { x, y, w, mark? }: w is the half-width of the bundle there
 * (strands spread out where w is large and pinch together where it is small);
 * mark names a spot whose position along the thread other code wants to know
 * (a card, a timeline step …).
 *
 * The centre line is a Catmull-Rom spline through the waypoints, then relaxed
 * so that no corner is ever sharper than a soft curve.
 */

const SAMPLE_STEP = 26; // px between samples along the centre line
const SMOOTH_RADIUS = 3; // samples on each side used to relax corners (≈ 80px)
const END_BLEND = 150; // px over which strands settle into fixed lanes at a joined end
const TAPER = 280; // px over which a free end thins out, strand by strand

/** Small deterministic PRNG (mulberry32). */
export function createRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (value) => Math.round(value * 10) / 10;
const smoothstep = (edge0, edge1, value) => {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0 || 1)));
  return t * t * (3 - 2 * t);
};

/** Catmull-Rom interpolation between b and c (a and d are the neighbours). */
function spline(a, b, c, d, t) {
  const t2 = t * t;
  const t3 = t2 * t;
  return 0.5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (3 * b - a - 3 * c + d) * t3);
}

/** Smooth path through points (quadratic curves through the midpoints). */
export function toPathData(points) {
  let d = `M${round(points[0][0])},${round(points[0][1])}`;
  for (let i = 1; i < points.length - 1; i += 1) {
    const [cx, cy] = points[i];
    const [nx, ny] = points[i + 1];
    const isLast = i === points.length - 2;
    d += `Q${round(cx)},${round(cy)} ${round(isLast ? nx : (cx + nx) / 2)},${round(isLast ? ny : (cy + ny) / 2)}`;
  }
  return d;
}

/**
 * Samples a smooth centre line through the waypoints.
 * Returns points with their distance along the line (s) and unit normal.
 */
export function sampleLine(waypoints, { smooth = 3 } = {}) {
  const samples = [];
  const markIndex = [];
  for (let i = 0; i < waypoints.length - 1; i += 1) {
    const a = waypoints[Math.max(0, i - 1)];
    const b = waypoints[i];
    const c = waypoints[i + 1];
    const d = waypoints[Math.min(waypoints.length - 1, i + 2)];
    const steps = Math.max(2, Math.ceil(Math.hypot(c.x - b.x, c.y - b.y) / SAMPLE_STEP));
    if (b.mark) markIndex.push({ ...b, index: samples.length });
    for (let k = 0; k < steps; k += 1) {
      const t = k / steps;
      samples.push({
        x: spline(a.x, b.x, c.x, d.x, t),
        y: spline(a.y, b.y, c.y, d.y, t),
        w: b.w + (c.w - b.w) * t,
      });
    }
  }
  const last = waypoints[waypoints.length - 1];
  if (last.mark) markIndex.push({ ...last, index: samples.length });
  samples.push({ x: last.x, y: last.y, w: last.w });

  // Relax corners: a few passes of a moving average (the window shrinks toward
  // the ends, so the end points — where pieces join — do not move).
  for (let pass = 0; pass < smooth; pass += 1) {
    const before = samples.map(({ x, y }) => ({ x, y }));
    for (let i = 1; i < samples.length - 1; i += 1) {
      const radius = Math.min(SMOOTH_RADIUS, i, samples.length - 1 - i);
      let x = 0;
      let y = 0;
      for (let k = i - radius; k <= i + radius; k += 1) {
        x += before[k].x;
        y += before[k].y;
      }
      samples[i].x = x / (radius * 2 + 1);
      samples[i].y = y / (radius * 2 + 1);
    }
  }

  let length = 0;
  samples.forEach((sample, i) => {
    if (i > 0) length += Math.hypot(sample.x - samples[i - 1].x, sample.y - samples[i - 1].y);
    sample.s = length;
  });
  samples.forEach((sample, i) => {
    const before = samples[Math.max(0, i - 1)];
    const after = samples[Math.min(samples.length - 1, i + 1)];
    const tangent = Math.hypot(after.x - before.x, after.y - before.y) || 1;
    sample.nx = -(after.y - before.y) / tangent;
    sample.ny = (after.x - before.x) / tangent;
  });

  return { samples, length, markIndex };
}

/**
 * Builds the strands.
 *  - taperStart / taperEnd: a free end thins out gracefully — the strands end
 *    one after another while the bundle narrows — instead of stopping dead.
 *  - Ends that are not tapered settle into fixed lanes, so two pieces that
 *    meet at the same point (with the same width) join without a seam.
 */
export function buildBundle(waypoints, { strands = 28, seed = 1, taperStart = false, taperEnd = false, smooth = 3 } = {}) {
  const random = createRandom(seed);
  const noise = createNoise2D(createRandom(seed * 17 + 3));
  const { samples, length, markIndex } = sampleLine(waypoints, { smooth });
  const taper = Math.min(TAPER, length * 0.45);

  // Each strand keeps its own lane across the bundle, but drifts and weaves a
  // little so the strands cross softly like silk.
  const paths = [];
  for (let j = 0; j < strands; j += 1) {
    const lane = strands > 1 ? -1 + (2 * (j + 0.5)) / strands : 0;
    const phase = random() * Math.PI * 2;
    const frequency = 0.004 + random() * 0.004;
    const reach = random(); // how far into a tapered end this strand runs (0 = all the way)
    const from = taperStart ? taper * reach : -1;
    const to = taperEnd ? length - taper * reach : length + 1;

    const points = [];
    for (const sample of samples) {
      if (sample.s < from || sample.s > to) continue;
      const free = Math.sin(phase + sample.s * frequency) * 0.38 + 0.62;
      const drift = 0.3 * noise(j * 3.17, sample.s * 0.0035);
      // 1 in the body of the piece, 0 at a joined end (fixed lanes there).
      const body =
        (taperStart ? 1 : smoothstep(0, END_BLEND, sample.s)) * (taperEnd ? 1 : smoothstep(0, END_BLEND, length - sample.s));
      const narrow =
        (taperStart ? 0.2 + 0.8 * smoothstep(0, taper, sample.s) : 1) *
        (taperEnd ? 0.2 + 0.8 * smoothstep(0, taper, length - sample.s) : 1);
      const offset = sample.w * narrow * (lane * 0.8 * (1 - body) + (lane * free + drift) * body);
      points.push([sample.x + sample.nx * offset, sample.y + sample.ny * offset]);
    }
    if (points.length >= 3) paths.push(toPathData(points));
  }

  const marks = {};
  const markPoints = [];
  markIndex.forEach(({ mark, index, x, y, knot }) => {
    marks[mark] = length > 0 ? samples[Math.min(index, samples.length - 1)].s / length : 0;
    markPoints.push({ mark, x, y, knot: Boolean(knot), at: marks[mark] });
  });

  // A light profile of the centre line (fraction along it → y), used to keep
  // the drawing tip in step with the scroll position.
  const profile = samples.filter((_, i) => i % 3 === 0 || i === samples.length - 1).map((sample) => ({
    f: length > 0 ? sample.s / length : 0,
    y: sample.y,
  }));

  const ys = samples.map((sample) => sample.y);
  return { paths, marks, markPoints, profile, length, top: Math.min(...ys), bottom: Math.max(...ys) };
}

/** Colour ramps. Each is three RGB stops, from the first strand to the last. */
const TONES = {
  // burgundy → terracotta → peach (the traveling thread on paper)
  thread: [
    [89, 23, 27],
    [194, 107, 85],
    [246, 180, 142],
  ],
  // terracotta → peach (the second bundle in About)
  peach: [
    [180, 87, 74],
    [240, 169, 131],
    [254, 215, 184],
  ],
  // peach → off-white (on the burgundy CTA)
  light: [
    [246, 180, 142],
    [254, 215, 184],
    [250, 246, 242],
  ],
};

/** Colour, weight and opacity of strand j of n. */
export function strandStyle(j, n, tone = 'thread') {
  const stops = TONES[tone] ?? TONES.thread;
  const t = n > 1 ? j / (n - 1) : 0;
  const [from, to] = t < 0.5 ? [stops[0], stops[1]] : [stops[1], stops[2]];
  const local = t < 0.5 ? t * 2 : (t - 0.5) * 2;
  const channel = (i) => Math.round(from[i] + (to[i] - from[i]) * local);
  return {
    stroke: `rgb(${channel(0)},${channel(1)},${channel(2)})`,
    strokeWidth: round(0.8 - 0.25 * t),
    strokeOpacity: tone === 'light' ? round(0.8 - 0.2 * t) : round(0.62 - 0.14 * t),
  };
}
