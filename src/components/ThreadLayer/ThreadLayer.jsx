'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { createNoise2D } from 'simplex-noise';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap';
import { buildBundle, strandStyle } from '@/lib/thread/bundle';
import { addDraw, scrollTracking, THREAD_SCRUB } from '@/lib/thread/draw';
import { buildRoute } from '@/lib/thread/routes';
import { useIdleReady } from '@/lib/useIdleReady';
import styles from './ThreadLayer.module.css';

/**
 * The traveling thread: one bundle of fine strands that grows out of the hero
 * roots and runs down the whole page behind the content.
 *
 *  - The route is measured from the real layout (lib/thread/routes.js) and
 *    re-measured when the page changes size.
 *  - It is built in pieces, one per section. Each piece is drawn with a
 *    smoothed, scroll-scrubbed timeline (stroke only): the strands arrive one
 *    after another, so the bundle grows with a soft tip, and the tip keeps
 *    pace with the scroll line even where the route runs sideways.
 *  - Each piece is announced with a "thread:piece" event so its section can
 *    hook its own motion onto it.
 *  - Visible pieces "breathe": four groups of strands drift by a few px with
 *    simplex noise (transform only). Off-screen pieces are left alone.
 *  - Reduced motion: the whole thread is simply shown, with no animation.
 *
 * The layer never takes pointer events and sits behind every section.
 */

// ===== Numbers to play with =====
const STRANDS_DESKTOP = 26;
const STRANDS_MOBILE = 7;
const BREATH_GROUPS = 4;
const BREATH_AMOUNT = 2.6; // px
const BREATH_SPEED = 0.22;

const MOBILE_QUERY = '(max-width: 860px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export default function ThreadLayer() {
  const isRtl = useLocale() === 'ar';
  const svgRef = useRef(null);
  const [thread, setThread] = useState({ version: 0, pieces: [], mobile: false, reduced: false });
  const latest = useRef(thread);
  latest.current = thread;
  // Set up after the page is interactive, and after the sections that pin (they change the page height).
  const ready = useIdleReady(3);

  // ---- Measure the route; re-measure when the page changes size ----
  useEffect(() => {
    if (!ready) return undefined;
    const main = svgRef.current.closest('main');
    let lastWidth = -1;
    let lastLayout = '';
    let timer;
    let frame = 0;

    const measure = () => {
      frame = 0;
      // Nothing the route depends on has moved: keep the thread as it is.
      const layout = `${main.offsetWidth}|${[...main.querySelectorAll('[data-thread]')].map((el) => `${el.offsetTop}:${el.offsetHeight}`).join(',')}`;
      if (layout === lastLayout) return;
      lastLayout = layout;

      const mobile = window.matchMedia(MOBILE_QUERY).matches;
      const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
      const baseStrands = mobile ? STRANDS_MOBILE : STRANDS_DESKTOP;
      const pieces = buildRoute({ main, isRtl, mobile }).map((piece, index) => {
        const strands = Math.max(4, Math.round(baseStrands * (piece.strandsScale ?? 1)));
        return {
          ...piece,
          strands,
          ...buildBundle(piece.points, {
            strands,
            seed: 11 + index * 7,
            taperStart: piece.taperStart,
            taperEnd: piece.taperEnd,
            smooth: piece.smooth,
          }),
        };
      });

      // A new width means a new layout: rebuild the timelines too.
      // A new height only (an FAQ opening, fonts loading) just moves the paths.
      const widthChanged = main.offsetWidth !== lastWidth;
      lastWidth = main.offsetWidth;
      setThread((previous) => ({
        pieces,
        mobile,
        reduced,
        version: widthChanged || previous.reduced !== reduced ? previous.version + 1 : previous.version,
      }));
      if (!widthChanged) ScrollTrigger.refresh();
    };

    measure();
    const observer = new ResizeObserver(() => {
      clearTimeout(timer);
      // Height only (an FAQ answer opening): follow the content in the same frame.
      // A new width is a new layout: wait until the resize has settled.
      if (main.offsetWidth !== lastWidth) timer = setTimeout(measure, 220);
      else if (!frame) frame = requestAnimationFrame(measure);
    });
    observer.observe(main);
    const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const onMotionChange = () => {
      lastLayout = '';
      measure();
    };
    motionQuery.addEventListener('change', onMotionChange);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      observer.disconnect();
      motionQuery.removeEventListener('change', onMotionChange);
    };
  }, [isRtl, ready]);

  // ---- Draw each piece with the scroll, and let sections hook onto it ----
  useGSAP(
    () => {
      const { pieces, mobile, reduced } = latest.current;
      const svg = svgRef.current;
      if (!pieces.length || reduced) return undefined;
      const undo = [];

      pieces.forEach((piece) => {
        const group = svg.querySelector(`[data-piece="${piece.key}"]`);
        const timeline = gsap.timeline({ defaults: { ease: 'none' }, paused: true });
        const { fractionAt, timeAt } = scrollTracking(piece.profile);

        undo.push(addDraw(timeline, [...group.querySelectorAll('[data-strand]')], { length: piece.length, fractionAt }));

        // Marks, converted from "fraction of the path" to "moment on the timeline".
        const marks = Object.fromEntries(Object.entries(piece.marks).map(([name, fraction]) => [name, timeAt(fraction)]));

        // Knots tied along the thread pop in as it reaches them.
        group.querySelectorAll('[data-knot]').forEach((knot) => {
          // (The radius is animated, not a transform: no bounding-box measuring.)
          timeline.fromTo(
            knot,
            { attr: { r: 0 } },
            { attr: { r: 4.5 }, duration: 0.03, ease: 'back.out(2)' },
            Math.max(0, marks[knot.dataset.mark] - 0.02),
          );
        });

        // Sections add their own tweens to this timeline (see useThreadPiece).
        window.dispatchEvent(
          new CustomEvent('thread:piece', {
            detail: { key: piece.key, timeline, marks, mobile, isRtl, onRevert: (restore) => undo.push(restore) },
          }),
        );

        ScrollTrigger.create({
          trigger: piece.trigger,
          start: piece.start,
          endTrigger: piece.endTrigger,
          end: piece.end,
          scrub: THREAD_SCRUB,
          animation: timeline,
          invalidateOnRefresh: true,
        });
      });

      // Pinned sections sit between these triggers: sort them by position.
      ScrollTrigger.sort();
      ScrollTrigger.refresh();

      // ---- Breathing: only for the pieces currently on screen ----
      const main = svg.closest('main');
      const noise = createNoise2D();
      const breathing = pieces.map((piece, pieceIndex) => ({
        top: piece.top,
        bottom: piece.bottom,
        groups: [...svg.querySelectorAll(`[data-piece="${piece.key}"] [data-breath]`)],
        seed: pieceIndex * 5.3,
      }));
      const amount = mobile ? BREATH_AMOUNT * 0.5 : BREATH_AMOUNT;
      let frame = 0;
      // Measured once here; the loop below must not read layout.
      const mainOffset = main.getBoundingClientRect().top + window.scrollY;
      const viewport = { height: window.innerHeight };
      const onViewportResize = () => {
        viewport.height = window.innerHeight;
      };
      window.addEventListener('resize', onViewportResize);

      const breathe = (time) => {
        frame += 1;
        if (frame % 2) return; // every other frame is plenty for a slow drift
        const mainTop = mainOffset - window.scrollY; // (no layout read)
        const viewportHeight = viewport.height;
        for (const piece of breathing) {
          if (piece.bottom + mainTop < -80 || piece.top + mainTop > viewportHeight + 80) continue;
          piece.groups.forEach((group, index) => {
            const x = noise(piece.seed + index * 1.7, time * BREATH_SPEED) * amount;
            const y = noise(piece.seed + index * 1.7 + 40, time * BREATH_SPEED) * amount;
            group.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px)`;
          });
        }
      };
      gsap.ticker.add(breathe);
      return () => {
        gsap.ticker.remove(breathe);
        window.removeEventListener('resize', onViewportResize);
        undo.forEach((restore) => restore());
      };
    },
    { dependencies: [thread.version, thread.reduced], revertOnUpdate: true },
  );

  return (
    <svg ref={svgRef} className={styles.threadLayer} aria-hidden="true" focusable="false">
      {thread.pieces.map((piece) => (
        <g key={piece.key} data-piece={piece.key}>
          {Array.from({ length: BREATH_GROUPS }, (_, groupIndex) => (
            <g key={groupIndex} data-breath>
              {piece.paths.map((d, strand) =>
                strand % BREATH_GROUPS === groupIndex ? (
                  <path
                    key={strand}
                    data-strand
                    className="thread-strand"
                    d={d}
                    pathLength="1"
                    {...strandStyle(strand, piece.paths.length, piece.tone)}
                  />
                ) : null,
              )}
            </g>
          ))}
          {piece.markPoints
            .filter((mark) => mark.knot)
            .map((mark) => (
              <circle key={mark.mark} data-knot data-mark={mark.mark} className={styles.knot} cx={mark.x} cy={mark.y} r="4.5" />
            ))}
        </g>
      ))}
    </svg>
  );
}
