import { strandStyle } from './bundle';

/**
 * Shared helpers for drawing a bundle of strands.
 * Used by the page-wide ThreadLayer and by the sections that carry their own
 * piece of thread (Services, Work, the final CTA).
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

// ===== Numbers to play with =====
export const THREAD_SCRUB = 1.6; // seconds the drawing takes to catch up with the scroll
export const THREAD_LINE = '88%'; // the drawing tip stays around this height of the viewport
const TIP_LENGTH = 240; // px over which the strands arrive one after another (the soft tip)
const TRACKING = 0.6; // 1 = the tip follows the scroll line exactly, 0 = constant speed along the path

/** Creates the strand <path>s inside an <svg> or <g>. Returns the elements. */
export function renderStrands(container, paths, { tone = 'thread', widthScale = 1 } = {}) {
  const elements = paths.map((d, index) => {
    const style = strandStyle(index, paths.length, tone);
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('class', 'thread-strand');
    path.setAttribute('d', d);
    path.setAttribute('pathLength', '1');
    path.setAttribute('stroke', style.stroke);
    path.setAttribute('stroke-width', style.strokeWidth * widthScale);
    path.setAttribute('stroke-opacity', style.strokeOpacity);
    return path;
  });
  container.replaceChildren(...elements);
  return elements;
}

/**
 * Maps time (0–1, i.e. scroll progress through the piece) to the fraction of
 * the path that should be drawn, so the tip keeps pace with the scroll line
 * even when the route runs sideways or loops. Returns { fractionAt, timeAt }.
 */
export function scrollTracking(profile) {
  if (!profile || profile.length < 2) return { fractionAt: (t) => t, timeAt: (f) => f };
  const top = profile[0].y;
  let lowest = top;
  const span = Math.max(...profile.map((point) => point.y)) - top || 1;
  // For each point: when does the scroll line reach it? (running maximum of y)
  const table = profile.map((point) => {
    lowest = Math.max(lowest, point.y);
    return { f: point.f, t: TRACKING * ((lowest - top) / span) + (1 - TRACKING) * point.f };
  });

  const lookup = (value, from, to) => {
    if (value <= table[0][from]) return table[0][to];
    for (let i = 1; i < table.length; i += 1) {
      if (value <= table[i][from]) {
        const a = table[i - 1];
        const b = table[i];
        const local = (value - a[from]) / (b[from] - a[from] || 1);
        return a[to] + (b[to] - a[to]) * local;
      }
    }
    return table[table.length - 1][to];
  };

  return { fractionAt: (t) => lookup(t, 't', 'f'), timeAt: (f) => lookup(f, 'f', 't') };
}

/**
 * Adds the drawing of a bundle to a timeline: every strand is drawn from its
 * start, each a touch later than the last, so the bundle grows with a fine,
 * soft tip instead of a hard edge.
 */
export function addDraw(timeline, strands, { at = 0, duration = 1, length = 1000, fractionAt = (t) => t } = {}) {
  const spread = Math.min(0.16, Math.max(0.03, TIP_LENGTH / length));
  const delays = strands.map((_, index) => spread * ((index * 0.618) % 1)); // well-mixed order
  const last = new Array(strands.length).fill(-1);

  // One tween for the whole bundle. It writes each strand's dash offset directly:
  // no per-strand tweens, and no style reads (which would force the browser to
  // recalculate styles once per strand).
  const state = { progress: 0 };
  const draw = () => {
    for (let i = 0; i < strands.length; i += 1) {
      const local = Math.min(1, Math.max(0, (state.progress - delays[i]) / (1 - spread)));
      const offset = Math.round((1 - fractionAt(local)) * 1000) / 1000;
      if (offset !== last[i]) {
        last[i] = offset;
        strands[i].style.strokeDashoffset = offset;
      }
    }
  };
  draw(); // start hidden
  timeline.fromTo(state, { progress: 0 }, { progress: 1, duration, ease: 'none', onUpdate: draw }, at);
  // If the timeline is thrown away (resize, language change), show the thread again.
  return () => strands.forEach((strand) => strand.style.removeProperty('stroke-dashoffset'));
}

/**
 * Adds a "state" to a timeline: `apply(t)` is called with t going 0 → 1 (eased)
 * and writes the styles itself. The initial state is written at once.
 *
 * Used instead of per-element GSAP tweens for the many cards and steps: GSAP
 * reads each element's computed style before it writes, and with a hundred
 * elements that makes the browser recalculate styles a hundred times. Writing
 * only (transform / opacity) costs a single recalculation.
 */
export function addState(timeline, { at = 0, duration = 0.1, ease = 'none' }, apply) {
  const state = { t: 0 };
  apply(0);
  timeline.fromTo(state, { t: 0 }, { t: 1, duration, ease, onUpdate: () => apply(state.t) }, at);
}
