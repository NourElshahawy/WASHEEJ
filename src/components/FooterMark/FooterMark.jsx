'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { gsap, useGSAP } from '@/lib/gsap';
import { generateRoots, flattenRoots } from '@/lib/roots/generateRoots';
import { buildBundle, strandStyle } from '@/lib/thread/bundle';
import { LOGO_FULL } from '@/components/Logo/logoPaths';
import styles from './FooterMark.module.css';

/**
 * "The end of the thread": the large logo at the foot of the page.
 * A few strands come down from the top of the footer and end in the Arabic
 * mark, then fine roots grow beneath the logo — the page closes the way it
 * opened. Plays once when the footer scrolls into view; static with reduced motion.
 *
 *  - Arabic: the large calligraphic وشيج.
 *  - English: the Latin wordmark WASHEEJ as the main logo, with the small
 *    Arabic mark beside it (the thread still ends at the Arabic mark).
 *
 * Coordinates are in the logo's own SVG units (viewBox 0 0 1001 554).
 */

const DOWN = Math.PI / 2;

const ROOTS = {
  ar: {
    seed: 31,
    density: 0.85,
    roots: [
      { start: [150, 505], angle: DOWN + 0.35, length: 250, waypoints: [[70, 760]], delay: 0 },
      { start: [420, 452], angle: DOWN - 0.1, length: 300, waypoints: [[470, 790]], delay: 0.15 },
      { start: [640, 398], angle: DOWN - 0.45, length: 280, waypoints: [[840, 700]], delay: 0.3 },
    ],
  },
  en: {
    seed: 37,
    density: 0.85,
    roots: [
      { start: [110, 372], angle: DOWN + 0.3, length: 250, waypoints: [[40, 640]], delay: 0 },
      { start: [395, 372], angle: DOWN - 0.1, length: 300, waypoints: [[440, 690]], delay: 0.15 },
      { start: [650, 372], angle: DOWN - 0.4, length: 270, waypoints: [[830, 620]], delay: 0.3 },
    ],
  },
};

// The incoming thread: from far above, down into the Arabic mark.
const INCOMING = {
  ar: [
    { x: 1180, y: -1700, w: 34 },
    { x: 1090, y: -1050, w: 26 },
    { x: 930, y: -520, w: 18 },
    { x: 965, y: -150, w: 9 },
    { x: 925, y: 185, w: 2 },
  ],
  en: [
    { x: 1180, y: -1700, w: 34 },
    { x: 1090, y: -1050, w: 26 },
    { x: 950, y: -520, w: 18 },
    { x: 985, y: -100, w: 9 },
    { x: 962, y: 262, w: 2 },
  ],
};
const INCOMING_STRANDS = 8;
const ROOT_WEIGHT = 2.1; // the footer logo is small, so its roots need heavier lines

function RootBranch({ node }) {
  return (
    <>
      <path data-root-path className="thread-strand" pathLength="1" d={node.d} strokeWidth={node.width * ROOT_WEIGHT} strokeOpacity={node.opacity} />
      {node.children.map((child) => (
        <RootBranch key={child.id} node={child} />
      ))}
    </>
  );
}

export default function FooterMark() {
  const locale = useLocale() === 'en' ? 'en' : 'ar';
  const rootRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const rootSystem = useMemo(() => (mounted ? generateRoots(ROOTS[locale]) : null), [mounted, locale]);
  const incoming = useMemo(
    () => (mounted ? buildBundle(INCOMING[locale], { strands: INCOMING_STRANDS, seed: 5 }).paths : []),
    [mounted, locale],
  );

  useGSAP(
    () => {
      if (!rootSystem || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

      const strands = gsap.utils.toArray('[data-strand]', rootRef.current);
      const rootPaths = gsap.utils.toArray('[data-root-path]', rootRef.current);
      const nodes = flattenRoots(rootSystem);

      // Hidden until the footer comes into view (written directly: no measuring).
      const hide = (path) => {
        path.style.strokeDashoffset = 1;
      };
      strands.forEach(hide);
      rootPaths.forEach(hide);

      const play = () => {
        const timeline = gsap.timeline({ defaults: { ease: 'none' } });
        timeline.to(strands, { strokeDashoffset: 0, duration: 1.1, ease: 'power1.inOut', stagger: 0.02 }, 0);
        nodes.forEach((node, index) => {
          timeline.to(
            rootPaths[index],
            { strokeDashoffset: 0, duration: node.duration * 1.4, ease: node.depth >= 2 ? 'power1.out' : 'none' },
            1 + node.startTime * 1.4,
          );
        });
      };
      const visibility = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          visibility.disconnect();
          play();
        },
        { rootMargin: '0px 0px -10% 0px' },
      );
      visibility.observe(rootRef.current);
      return () => visibility.disconnect();
    },
    { scope: rootRef, dependencies: [rootSystem] },
  );

  return (
    <div ref={rootRef} className={styles.footerMark} aria-hidden="true">
      <svg className={styles.markSvg} viewBox={LOGO_FULL.viewBox} focusable="false">
        <g>
          {incoming.map((d, index) => (
            <path
              key={index}
              data-strand
              className="thread-strand"
              d={d}
              pathLength="1"
              {...strandStyle(index, INCOMING_STRANDS)}
              strokeWidth="2.4"
            />
          ))}
        </g>
        <g className={styles.rootLayer}>
          {rootSystem?.map(({ tree }) => (
            <RootBranch key={tree.id} node={tree} />
          ))}
        </g>

        {locale === 'en' ? (
          <>
            {/* Latin wordmark, with the small Arabic mark beside it. */}
            <text className={styles.wordmark} x="0" y="362" textLength="800" lengthAdjust="spacing">
              WASHEEJ
            </text>
            <g transform="translate(838 262) scale(0.16)">
              {LOGO_FULL.paths.map((d) => (
                <path key={d.slice(0, 24)} d={d} fill="currentColor" fillRule="evenodd" />
              ))}
            </g>
          </>
        ) : (
          LOGO_FULL.paths.map((d) => <path key={d.slice(0, 24)} d={d} fill="currentColor" fillRule="evenodd" />)
        )}
      </svg>
    </div>
  );
}
