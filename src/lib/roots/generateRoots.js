import { createNoise2D } from 'simplex-noise';

/**
 * Procedural root generator.
 *
 * Each root is a guided random walk: it heads for its waypoints, wanders with
 * simplex noise and throws off thinner side branches as it goes. The result is
 * a tree of "segments"; long branches are cut into a chain of segments so that
 * the sway can bend them progressively instead of pivoting them like a stick.
 *
 * All coordinates are in the logo's own SVG units (viewBox 0 0 1001 554).
 */

const STEP = 14; // distance between walk points
const MAX_DEPTH = 3;
const CHAIN_LENGTH = [18, 14]; // points per chain segment for depth 0 and 1
const GROW_SPEED = [520, 420, 330, 280]; // units per second, by depth
const STROKE_WIDTH = [1.9, 1.2, 0.85, 0.62];
const STROKE_OPACITY = [0.92, 0.8, 0.66, 0.52];
const WANDER = [0.13, 0.2, 0.27, 0.32]; // radians of noise per step
const BRANCH_CHANCE = [0.2, 0.22, 0.15, 0];

/** Small deterministic PRNG (mulberry32). */
function createRandom(seed) {
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

/** Shortest signed difference between two angles. */
function angleDelta(target, current) {
  let delta = target - current;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
}

/** Smooth path through points (quadratic curves through the midpoints). */
function toPathData(points) {
  if (points.length < 3) {
    return points.map(([x, y], index) => `${index ? 'L' : 'M'}${round(x)},${round(y)}`).join('');
  }
  let d = `M${round(points[0][0])},${round(points[0][1])}`;
  for (let i = 1; i < points.length - 1; i += 1) {
    const [cx, cy] = points[i];
    const [nx, ny] = points[i + 1];
    const isLast = i === points.length - 2;
    const ex = isLast ? nx : (cx + nx) / 2;
    const ey = isLast ? ny : (cy + ny) / 2;
    d += `Q${round(cx)},${round(cy)} ${round(ex)},${round(ey)}`;
  }
  return d;
}

export function generateRoots({ seed = 7, roots, density = 1, keepClear = null }) {
  // keepClear: { x: [min, max], y: [min, max] } — the hero copy; side branches stop at its edge.
  const isBlocked = (px, py) =>
    keepClear !== null &&
    px > keepClear.x[0] &&
    px < keepClear.x[1] &&
    py > keepClear.y[0] &&
    py < keepClear.y[1];

  const random = createRandom(seed);
  const noise = createNoise2D(createRandom(seed * 31 + 5));
  let nextId = 0;

  /**
   * Walks one branch and returns it as a chain of segment nodes.
   * startTime: when (seconds) the growth reaches the start of this branch.
   */
  function growBranch({ start, angle, length, depth, waypoints = [], startTime, widthScale = 1 }) {
    const pointCount = Math.max(3, Math.round(length / STEP));
    const points = [start];
    const spawns = []; // { index, angle, length }
    const targets = [...waypoints];
    const noiseOffset = random() * 1000;
    let heading = angle;
    let [x, y] = start;
    let lastSpawn = -3;
    let side = random() < 0.5 ? -1 : 1;

    for (let i = 1; i <= pointCount; i += 1) {
      if (targets.length) {
        const [tx, ty] = targets[0];
        heading += angleDelta(Math.atan2(ty - y, tx - x), heading) * 0.16;
        if (Math.hypot(tx - x, ty - y) < STEP * 6 && targets.length > 1) targets.shift();
      }
      heading += noise(noiseOffset + i * 0.11, depth * 9.7) * WANDER[depth];
      x += Math.cos(heading) * STEP;
      y += Math.sin(heading) * STEP;
      if (depth > 0 && isBlocked(x, y)) break; // do not grow twigs across the copy
      points.push([x, y]);

      const remaining = (pointCount - i) * STEP;
      const canSpawn = depth < MAX_DEPTH && i > 1 && i - lastSpawn >= 3 && remaining > STEP * 2;
      if (canSpawn && random() < BRANCH_CHANCE[depth] * density) {
        const reach = depth === 0 ? Math.min(remaining, 520) : remaining;
        const childLength = Math.max(34, reach * (0.28 + random() * 0.4));
        spawns.push({
          index: i,
          angle: heading + side * (0.42 + random() * 0.55),
          length: childLength,
        });
        side = random() < 0.78 ? -side : side;
        lastSpawn = i;
      }
    }

    if (points.length < 3) return null; // cut off almost immediately by the keep-clear zone

    // Cut the walk into a chain of segments (deeper branches stay in one piece).
    const chainSize = CHAIN_LENGTH[depth] ?? points.length;
    const speed = GROW_SPEED[depth];
    const segments = [];
    for (let from = 0; from < points.length - 1; from += chainSize) {
      const to = Math.min(points.length - 1, from + chainSize);
      // Avoid a tiny leftover segment at the end.
      const isTail = points.length - 1 - to < 4;
      const end = isTail ? points.length - 1 : to;
      const chainIndex = segments.length;
      const segmentPoints = points.slice(from, end + 1);
      const segmentLength = (segmentPoints.length - 1) * STEP;
      const first = segmentPoints[0];
      const last = segmentPoints[segmentPoints.length - 1];

      const node = {
        id: `root-${nextId}`,
        depth,
        d: toPathData(segmentPoints),
        origin: [round(first[0]), round(first[1])],
        tip: [round(last[0]), round(last[1])],
        heading: Math.atan2(last[1] - first[1], last[0] - first[0]),
        length: segmentLength,
        startTime: startTime + (from * STEP) / speed,
        duration: segmentLength / speed,
        width: Math.max(STROKE_WIDTH[depth] * widthScale - chainIndex * 0.16 * (depth === 0 ? 1 : 0.5), 0.6),
        opacity: STROKE_OPACITY[depth],
        sways: depth <= 1,
        children: [],
        fromIndex: from,
        toIndex: end,
      };
      nextId += 1;
      segments.push(node);
      if (isTail) break;
    }

    // Attach side branches to the segment they sprout from.
    for (const spawn of spawns) {
      const owner = segments.find((segment) => spawn.index >= segment.fromIndex && spawn.index <= segment.toIndex);
      if (!owner || !points[spawn.index]) continue;
      const child = growBranch({
        start: points[spawn.index],
        angle: spawn.angle,
        length: spawn.length,
        depth: depth + 1,
        startTime: startTime + (spawn.index * STEP) / speed,
      });
      if (child) owner.children.push(child);
    }

    // Link the chain: each segment carries the next one.
    for (let i = segments.length - 2; i >= 0; i -= 1) segments[i].children.push(segments[i + 1]);

    const head = segments[0];
    head.walk = points; // kept on the head so labels can be placed along the whole branch
    head.speed = speed;
    return head;
  }

  return roots.map((root) => {
    const tree = growBranch({
      start: root.start,
      angle: root.angle,
      length: root.length,
      depth: 0,
      waypoints: root.waypoints,
      startTime: root.delay ?? 0,
      widthScale: root.widthScale ?? 1,
    });

    let label = null;
    if (root.label) {
      const index = Math.min(tree.walk.length - 1, Math.round((tree.walk.length - 1) * root.label.at));
      const [px, py] = tree.walk[index];
      label = {
        text: root.label.text,
        point: [round(px), round(py)],
        position: [round(px + root.label.offset[0]), round(py + root.label.offset[1])],
        time: (root.delay ?? 0) + (index * STEP) / tree.speed,
      };
    }

    return { tree, label };
  });
}

/** Flattens a root tree into a list (for timelines and counting). */
export function flattenRoots(rootSystem) {
  const list = [];
  const visit = (node) => {
    list.push(node);
    node.children.forEach(visit);
  };
  rootSystem.forEach(({ tree }) => visit(tree));
  return list;
}
