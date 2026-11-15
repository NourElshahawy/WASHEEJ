'use client';

import { useEffect, useRef, useState } from 'react';
import { createNoise2D } from 'simplex-noise';
import { gsap, useGSAP } from '@/lib/gsap';
import { createRandom, sampleLine, toPathData } from '@/lib/thread/bundle';
import { renderStrands, THREAD_SCRUB } from '@/lib/thread/draw';
import { layoutBox } from '@/lib/thread/routes';
import styles from './CtaKnot.module.css';

/**
 * The knot in the final CTA.
 *
 * The strands arrive from above — exactly where the page's traveling thread
 * ends at the bottom of the FAQ — and drift loosely into the empty side of
 * the burgundy section. As the user scrolls on, they are pulled together and
 * tie into an infinity-like knot (MorphSVG from the loose lines to the knot),
 * and then the knot breathes gently.
 *
 * Every strand has two shapes built from the same number of points (loose and
 * tied), so the morph is a clean point-to-point move.
 * Reduced motion: the tied knot is simply shown.
 */

// ===== Numbers to play with =====
const STRANDS = { desktop: 20, mobile: 7 };
const POINTS = 84; // points per strand (same for both shapes)
const ARRIVE = 0.46; // part of the scroll range spent drawing the loose strands in
const TIE_START = 0.4; // when the strands start to tie
const TIE = 0.52; // how long the tying takes
const LOOSENESS = 46; // px each loose strand wanders on its own

const MOBILE_QUERY = '(max-width: 860px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const smoothstep = (edge0, edge1, value) => {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

/** Picks `count` points, evenly spaced along the sampled line. */
function resample(samples, count) {
  const total = samples[samples.length - 1].s;
  const result = [];
  let i = 0;
  for (let k = 0; k < count; k += 1) {
    const target = (total * k) / (count - 1);
    while (i < samples.length - 2 && samples[i + 1].s < target) i += 1;
    const a = samples[i];
    const b = samples[i + 1];
    const t = Math.min(1, Math.max(0, (target - a.s) / (b.s - a.s || 1)));
    const mix = (key) => a[key] + (b[key] - a[key]) * t;
    result.push({ x: mix('x'), y: mix('y'), w: mix('w'), nx: mix('nx'), ny: mix('ny') });
  }
  return result;
}

/** One path per strand around a centre line; `looseness` lets each wander on its own. */
function strandPaths(waypoints, { strands, seed, looseness = 0 }) {
  const line = resample(sampleLine(waypoints, { smooth: 2 }).samples, POINTS);
  const random = createRandom(seed);
  const noise = createNoise2D(createRandom(seed + 9));
  const paths = [];
  for (let j = 0; j < strands; j += 1) {
    const lane = -1 + (2 * (j + 0.5)) / strands;
    const phase = random() * Math.PI * 2;
    const points = line.map((sample, k) => {
      const t = k / (POINTS - 1);
      const weave = lane * (0.62 + 0.38 * Math.sin(phase + t * 11));
      const wander = looseness * noise(j * 2.3, t * 2.4) * smoothstep(0, 0.2, t);
      const offset = sample.w * weave + wander;
      return [sample.x + sample.nx * offset, sample.y + sample.ny * offset];
    });
    paths.push(toPathData(points));
  }
  return paths;
}

export default function CtaKnot() {
  const svgRef = useRef(null);
  const [layout, setLayout] = useState(0);
  // The knot (strands + morph shapes) is only built once the section is getting close.
  const [near, setNear] = useState(false);
  // MorphSVG is only needed here, so it is loaded when the section is getting close.
  const [morphReady, setMorphReady] = useState(false);

  useEffect(() => {
    if (!near) return undefined;
    let cancelled = false;
    import('gsap/MorphSVGPlugin').then(({ MorphSVGPlugin }) => {
      if (cancelled) return;
      gsap.registerPlugin(MorphSVGPlugin);
      setMorphReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [near]);

  // Rebuild when the section changes width, or the motion preference changes.
  useEffect(() => {
    const section = svgRef.current.closest('section');
    let lastWidth = section.offsetWidth;
    const bump = () => setLayout((value) => value + 1);
    const observer = new ResizeObserver(() => {
      if (section.offsetWidth === lastWidth) return;
      lastWidth = section.offsetWidth;
      bump();
    });
    observer.observe(section);
    const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    motionQuery.addEventListener('change', bump);

    // Breathe only while the section is on screen.
    const visibility = new IntersectionObserver(([entry]) => {
      svgRef.current?.classList.toggle(styles.resting, !entry.isIntersecting);
    });
    visibility.observe(section);

    const approach = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        approach.disconnect();
      },
      { rootMargin: '150% 0px' },
    );
    approach.observe(section);

    return () => {
      observer.disconnect();
      visibility.disconnect();
      approach.disconnect();
      motionQuery.removeEventListener('change', bump);
    };
  }, []);

  useGSAP(
    () => {
      if (!near || !morphReady) return;
      const svg = svgRef.current;
      const section = svg.closest('section');
      const group = svg.querySelector('g');
      const stage = layoutBox(section.querySelector('[data-knot-stage]'), section);
      const height = section.offsetHeight;
      const mobile = window.matchMedia(MOBILE_QUERY).matches;
      const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
      const strands = mobile ? STRANDS.mobile : STRANDS.desktop;

      // ---- Geometry ----
      const entryX = stage.cx; // the page thread ends at this x, at the bottom of the FAQ
      // Half-width of the knot. On mobile the stage is a short band above the copy.
      const a = mobile ? Math.min(stage.width * 0.3, stage.height * 0.5) : Math.min(stage.width * 0.42, stage.height * 0.95, 210);
      // Where the strands may run to: off the bottom of the section on desktop (the
      // empty side), but on mobile they stay in the band so they never cross the copy.
      const floor = mobile ? stage.bottom - 4 : height + 40;
      const knot = { x: stage.cx, y: stage.cy + (mobile ? 6 : 14) };
      const thin = mobile ? 3 : 5;
      const full = mobile ? 7 : 15;

      // The infinity shape (a lemniscate), traced from the crossing, around both loops, back to the crossing.
      const loops = [];
      for (let k = 0; k <= 16; k += 1) {
        const theta = Math.PI / 2 - (k * Math.PI) / 8;
        const scale = 1 + Math.sin(theta) ** 2;
        loops.push({
          x: knot.x + (a * Math.cos(theta)) / scale,
          y: knot.y + (1.3 * a * Math.sin(theta) * Math.cos(theta)) / scale,
          w: k % 8 === 0 ? thin : full,
        });
      }

      const tied = [
        { x: entryX, y: -30, w: thin + 4 },
        { x: entryX - a * 0.12, y: knot.y - a * 1.1, w: thin + 4 },
        { x: knot.x - a * 0.42, y: knot.y - a * 0.5, w: thin + 2 },
        ...loops,
        { x: knot.x + a * 0.46, y: knot.y + a * 0.56, w: thin + 2 },
        ...(mobile
          ? // A short tail that fans out like a tassel.
            [{ x: knot.x + a * 0.72, y: Math.min(floor, knot.y + a * 0.95), w: full * 1.5 }]
          : [
              { x: knot.x + a * 0.6, y: Math.min(height - 40, knot.y + a * 1.25), w: thin + 2 },
              { x: knot.x + a * 0.52, y: floor, w: thin + 3 },
            ]),
      ];
      const loose = [
        { x: entryX, y: -30, w: thin + 4 },
        { x: knot.x - a * 0.8, y: floor * 0.24, w: full * 2.6 },
        { x: knot.x + a * 0.7, y: floor * 0.5, w: full * 3.4 },
        { x: knot.x - a * 0.4, y: floor * 0.78, w: full * 3 },
        { x: knot.x + a * 0.3, y: floor, w: full * 2.4 },
      ];

      const tiedPaths = strandPaths(tied, { strands, seed: 23 });
      const loosePaths = strandPaths(loose, { strands, seed: 29, looseness: mobile ? LOOSENESS * 0.4 : LOOSENESS });

      // Reduced motion: just the knot.
      if (reduced) {
        renderStrands(group, tiedPaths, { tone: 'light', widthScale: 1.3 });
        return;
      }

      const elements = renderStrands(group, loosePaths, { tone: 'light', widthScale: 1.3 });
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: section, start: 'top 97%', end: 'center 52%', scrub: THREAD_SCRUB },
      });
      // The strands arrive one after another (drawn by one tween, written directly).
      const delays = elements.map((_, index) => ((index * 0.618) % 1) * 0.12);
      const arrival = { time: 0 };
      const draw = () => {
        elements.forEach((element, index) => {
          element.style.strokeDashoffset = 1 - Math.min(1, Math.max(0, (arrival.time - delays[index]) / ARRIVE));
        });
      };
      draw();
      timeline.to(arrival, { time: ARRIVE + 0.12, duration: ARRIVE + 0.12, onUpdate: draw }, 0);

      elements.forEach((element, index) => {
        const delay = delays[index];
        timeline.to(
          element,
          { morphSVG: { shape: tiedPaths[index], shapeIndex: 0 }, duration: TIE, ease: 'power2.inOut' },
          TIE_START + delay * 0.5,
        );
      });
    },
    { dependencies: [layout, near, morphReady], revertOnUpdate: true },
  );

  return (
    <svg ref={svgRef} className={styles.ctaKnot} aria-hidden="true" focusable="false">
      <g className={styles.breathing} />
    </svg>
  );
}
