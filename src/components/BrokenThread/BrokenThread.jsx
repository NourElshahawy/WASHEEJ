'use client';

import { useRef, useState } from 'react';
import { createNoise2D } from 'simplex-noise';
import { gsap, useGSAP } from '@/lib/gsap';
import { buildBundle } from '@/lib/thread/bundle';
import { renderStrands } from '@/lib/thread/draw';
import styles from './BrokenThread.module.css';

/**
 * "The thread broke" — the 404 illustration, with its button.
 *
 * A thread crosses the page but is broken in the middle: two loose, frayed
 * ends that sway. They drift toward each other as the cursor comes closer, and
 * when the button is hovered or focused they meet and tie into a knot.
 *
 * Only transforms and stroke are animated. On touch screens there is no
 * cursor, so the ends just sway (and tie when the button is focused/pressed).
 * Reduced motion: the broken thread is still; the knot simply appears.
 */

// ===== Numbers to play with =====
const GAP = 64; // half the gap between the two ends, in SVG units
const SWAY = 2.4; // degrees
const REACH = 440; // px around the break where the cursor starts to pull the ends together
const PULL = 0.62; // how much of the gap the cursor can close

// The two ends, in a 1000 × 240 box. Each is anchored far outside the box.
const LEFT_END = [
  { x: -400, y: 120, w: 7 },
  { x: 60, y: 112, w: 7 },
  { x: 300, y: 126, w: 8 },
  { x: 500 - GAP, y: 122, w: 15 },
];
const RIGHT_END = [
  { x: 1400, y: 120, w: 7 },
  { x: 940, y: 128, w: 7 },
  { x: 700, y: 114, w: 8 },
  { x: 500 + GAP, y: 118, w: 15 },
];
const KNOT = 'M452,120 C470,120 480,98 500,98 C524,98 528,128 506,134 C484,140 478,108 500,104 C520,101 530,120 548,120';

export default function BrokenThread({ children }) {
  const rootRef = useRef(null);
  const [tied, setTied] = useState(false);
  const tiedRef = useRef(false);
  tiedRef.current = tied;

  useGSAP(
    () => {
      const svg = rootRef.current.querySelector('svg');
      const [left, right] = svg.querySelectorAll('[data-thread-end]');
      renderStrands(left, buildBundle(LEFT_END, { strands: 9, seed: 3, taperEnd: true, smooth: 2 }).paths, { widthScale: 1.5 });
      renderStrands(right, buildBundle(RIGHT_END, { strands: 9, seed: 8, taperEnd: true, smooth: 2 }).paths, { widthScale: 1.5 });
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

      // Each end pivots far outside the picture (see the rotate() below), so only its loose tip moves.
      const noise = createNoise2D();
      const state = { pull: 0 }; // 0 = apart, 1 = touching
      let pointerPull = 0;

      const onMove = (event) => {
        const box = svg.getBoundingClientRect();
        const distance = Math.hypot(event.clientX - (box.left + box.width / 2), event.clientY - (box.top + box.height / 2));
        pointerPull = Math.max(0, 1 - distance / REACH) * PULL;
      };
      const followsCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      if (followsCursor) window.addEventListener('pointermove', onMove, { passive: true });

      const tick = (time) => {
        const target = tiedRef.current ? 1 : pointerPull;
        state.pull += (target - state.pull) * 0.07;
        const calm = 1 - state.pull; // the ends sway less as they come together
        const leftAngle = noise(0.3, time * 0.3) * SWAY * calm;
        const rightAngle = noise(7.1, time * 0.3) * SWAY * calm;
        left.setAttribute('transform', `translate(${(state.pull * GAP).toFixed(2)} 0) rotate(${leftAngle.toFixed(3)} -400 120)`);
        right.setAttribute('transform', `translate(${(-state.pull * GAP).toFixed(2)} 0) rotate(${rightAngle.toFixed(3)} 1400 120)`);
      };
      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
        window.removeEventListener('pointermove', onMove);
      };
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className={`${styles.brokenThread} ${tied ? styles.tied : ''}`}>
      <svg className={styles.threadArt} viewBox="0 0 1000 240" aria-hidden="true" focusable="false">
        <g data-thread-end />
        <g data-thread-end />
        <path className={styles.knot} pathLength="1" d={KNOT} />
      </svg>

      {/* Hovering or focusing what is inside ties the two ends together. */}
      <div
        className={styles.threadAction}
        onPointerEnter={() => setTied(true)}
        onPointerLeave={() => setTied(false)}
        onFocus={() => setTied(true)}
        onBlur={() => setTied(false)}
      >
        {children}
      </div>
    </div>
  );
}
