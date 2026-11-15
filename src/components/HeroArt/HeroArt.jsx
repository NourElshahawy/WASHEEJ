'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { createNoise2D } from 'simplex-noise';
import { gsap, useGSAP } from '@/lib/gsap';
import { generateRoots, flattenRoots } from '@/lib/roots/generateRoots';
import { getRootConfig, WRITING_STROKES } from '@/lib/roots/rootConfigs';
import { LOGO_FULL } from '@/components/Logo/logoPaths';
import styles from './HeroArt.module.css';

const MOBILE_QUERY = '(max-width: 860px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

// The roots are designed at this on-screen scale (px per SVG unit); stroke and
// label sizes are corrected for the real scale so lines stay hair-thin everywhere.
const DESIGN_SCALE = 0.6;

// Sway, in degrees, by branch depth (0 = main chain, 1 = side branches).
const IDLE_SWAY = [0.32, 0.85];
const CURSOR_PULL = [1.25, 3.2];
const CURSOR_REACH = 620; // SVG units over which the pull fades

function angleDelta(target, current) {
  let delta = target - current;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  return delta;
}

/** One root segment: its path, then everything that grows out of it. */
function RootBranch({ node, weight }) {
  const content = (
    <>
      <path
        data-root-path
        className="thread-strand"
        pathLength="1"
        d={node.d}
        strokeWidth={node.width * weight}
        strokeOpacity={node.opacity}
      />
      {node.children.map((child) => (
        <RootBranch key={child.id} node={child} weight={weight} />
      ))}
    </>
  );

  // Only the thicker branches get their own group to sway; twigs ride along.
  return node.sways ? <g data-sway-node>{content}</g> : content;
}

function RootLabel({ label, weight }) {
  const [px, py] = label.point;
  const [lx, ly] = label.position;
  const distance = Math.hypot(lx - px, ly - py) || 1;
  const gap = 20 * weight;
  const endX = px + ((lx - px) * (distance - gap)) / distance;
  const endY = py + ((ly - py) * (distance - gap)) / distance;

  return (
    <g data-root-label className={styles.rootLabel}>
      <line
        x1={px}
        y1={py}
        x2={endX}
        y2={endY}
        className={styles.labelLeader}
        strokeWidth={2 * weight}
        strokeDasharray={`0.1 ${8 * weight}`}
      />
      <circle cx={px} cy={py} r={4.5 * weight} className={styles.labelDot} />
      <text
        x={lx}
        y={ly}
        fontSize={31 * weight}
        textAnchor={lx < px ? 'end' : 'start'}
        dominantBaseline="middle"
        className={styles.labelText}
      >
        {label.text}
      </text>
    </g>
  );
}

export default function HeroArt() {
  const direction = useLocale() === 'ar' ? 'rtl' : 'ltr';
  const stageRef = useRef(null);
  const svgRef = useRef(null);
  const introPlayed = useRef(false);
  const [layout, setLayout] = useState(null); // 'desktop' | 'mobile' — known after mount
  const [weight, setWeight] = useState(1);

  // Pick the root layout for this screen and keep line weights tied to the real scale.
  useEffect(() => {
    const mobileQuery = window.matchMedia(MOBILE_QUERY);
    const applyLayout = () => setLayout(mobileQuery.matches ? 'mobile' : 'desktop');
    applyLayout();
    mobileQuery.addEventListener('change', applyLayout);

    const svg = svgRef.current;
    const measure = () => {
      const scale = svg.getBoundingClientRect().width / 1001;
      if (scale > 0) setWeight(Math.round(Math.min(2.4, Math.max(0.7, DESIGN_SCALE / scale)) * 10) / 10);
    };
    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(svg);

    return () => {
      mobileQuery.removeEventListener('change', applyLayout);
      resizeObserver.disconnect();
    };
  }, []);

  const rootSystem = useMemo(
    () => (layout ? generateRoots(getRootConfig(direction, layout)) : null),
    [direction, layout],
  );

  useGSAP(
    () => {
      if (!rootSystem) return undefined;
      const stage = stageRef.current;
      const svg = svgRef.current;
      const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;

      // From here on JS owns the reveal (see the CSS fallback for the no-JS case).
      stage.dataset.state = 'ready';
      if (reducedMotion) return undefined; // final state, no motion at all

      const nodes = flattenRoots(rootSystem);
      const rootPaths = gsap.utils.toArray('[data-root-path]', svg);
      const labels = gsap.utils.toArray('[data-root-label]', svg);
      const writingStrokes = gsap.utils.toArray('[data-writing-stroke]', svg);
      const sway = { amount: 0 };

      let stopWaitingForLoader = () => {};

      // ---- Intro: the word is written, then the roots grow out of it ----
      if (!introPlayed.current) {
        gsap.set(writingStrokes, { drawSVG: '0%', opacity: 0 });
        // Every root path has pathLength="1": dash offset 1 = hidden, 0 = fully drawn.
        rootPaths.forEach((path) => {
          path.style.strokeDashoffset = 1;
        });
        gsap.set(labels, { autoAlpha: 0 });

        const intro = gsap.timeline({
          defaults: { ease: 'none' },
          onComplete: () => {
            introPlayed.current = true;
          },
        });

        // On the first visit the loading screen comes first: start writing as it lifts.
        if (document.documentElement.dataset.loader === 'show') {
          intro.pause();
          const start = () => intro.play();
          window.addEventListener('loader:done', start, { once: true });
          stopWaitingForLoader = () => window.removeEventListener('loader:done', start);
        }

        let cursor = 0.2;
        writingStrokes.forEach((stroke, index) => {
          const { duration } = WRITING_STROKES[index];
          const isDot = index >= 4;
          intro.set(stroke, { opacity: 1 }, cursor);
          intro.to(stroke, { drawSVG: '100%', duration, ease: isDot ? 'power2.out' : 'power1.inOut' }, cursor);
          cursor += duration * (isDot ? 1 : 0.84);
        });

        // Roots start while the last strokes are still being written.
        const rootsStart = cursor - 0.75;
        // One tween grows all the roots: it writes each path's dash offset directly
        // (hundreds of separate tweens would each make the browser recalculate styles).
        const growth = { time: 0 };
        const rootsEnd = Math.max(...nodes.map((node) => node.startTime + node.duration));
        const drawn = new Float32Array(nodes.length);
        intro.to(
          growth,
          {
            time: rootsEnd,
            duration: rootsEnd,
            onUpdate: () => {
              for (let i = 0; i < nodes.length; i += 1) {
                const node = nodes[i];
                let part = Math.min(1, Math.max(0, (growth.time - node.startTime) / node.duration));
                if (node.depth >= 2) part = 1 - (1 - part) * (1 - part); // twigs ease out
                if (part !== drawn[i]) {
                  drawn[i] = part;
                  rootPaths[i].style.strokeDashoffset = 1 - part;
                }
              }
            },
          },
          rootsStart,
        );
        rootSystem.forEach(({ label }, index) => {
          if (!label) return;
          const element = labels[rootSystem.slice(0, index).filter((root) => root.label).length];
          intro.to(element, { autoAlpha: 1, duration: 0.6, ease: 'power1.out' }, rootsStart + label.time + 0.15);
        });
        intro.to(sway, { amount: 1, duration: 2, ease: 'power1.inOut' }, rootsStart + 1);
      } else {
        // Layout changed after the intro (e.g. rotation): show the new roots, keep swaying.
        gsap.to(sway, { amount: 1, duration: 1 });
      }

      // ---- Living sway: simplex-noise breathing + a gentle lean toward the cursor ----
      const noise = createNoise2D();
      const swayElements = gsap.utils.toArray('[data-sway-node]', svg);
      const swayNodes = nodes
        .filter((node) => node.sways)
        .map((node, index) => ({
          element: swayElements[index],
          originX: node.origin[0],
          originY: node.origin[1],
          heading: node.heading,
          depth: node.depth,
          seed: index * 1.37,
          angle: 0,
        }));

      const followsCursor = layout === 'desktop' && window.matchMedia(FINE_POINTER_QUERY).matches;
      const pointer = { clientX: 0, clientY: 0, active: false };
      const onPointerMove = (event) => {
        pointer.clientX = event.clientX;
        pointer.clientY = event.clientY;
        pointer.active = true;
      };
      const onPointerLeave = () => {
        pointer.active = false;
      };
      if (followsCursor) {
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        document.documentElement.addEventListener('pointerleave', onPointerLeave);
      }

      // Pause the loop whenever the hero is off-screen.
      let inView = true;
      const visibility = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
      });
      visibility.observe(stage);

      const tick = (time) => {
        if (!inView || sway.amount === 0) return;

        let pointerX = null;
        let pointerY = null;
        if (pointer.active) {
          const matrix = svg.getScreenCTM();
          if (matrix) {
            const inverse = matrix.inverse();
            pointerX = inverse.a * pointer.clientX + inverse.c * pointer.clientY + inverse.e;
            pointerY = inverse.b * pointer.clientX + inverse.d * pointer.clientY + inverse.f;
          }
        }

        for (const node of swayNodes) {
          let target = noise(node.seed, time * 0.22) * IDLE_SWAY[node.depth];
          if (pointerX !== null) {
            const dx = pointerX - node.originX;
            const dy = pointerY - node.originY;
            const falloff = 1 / (1 + (Math.hypot(dx, dy) / CURSOR_REACH) ** 2);
            target += Math.sin(angleDelta(Math.atan2(dy, dx), node.heading)) * CURSOR_PULL[node.depth] * falloff;
          }
          node.angle += (target * sway.amount - node.angle) * 0.055;
          node.element.setAttribute(
            'transform',
            `rotate(${node.angle.toFixed(3)} ${node.originX} ${node.originY})`,
          );
        }
      };
      gsap.ticker.add(tick);

      return () => {
        stopWaitingForLoader();
        gsap.ticker.remove(tick);
        visibility.disconnect();
        window.removeEventListener('pointermove', onPointerMove);
        document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      };
    },
    { scope: stageRef, dependencies: [rootSystem], revertOnUpdate: true },
  );

  return (
    <div ref={stageRef} className={styles.heroArt} data-hero-art aria-hidden="true">
      <div className={styles.paperSheet}>
        <Image
          src="/images/hero/paper-peach.webp"
          alt=""
          fill
          preload
          fetchPriority="high"
          sizes="(max-width: 860px) 56vw, 44vw"
          className={styles.paperImage}
        />
      </div>

      <svg ref={svgRef} className={styles.artSvg} viewBox={LOGO_FULL.viewBox} focusable="false">
        <defs>
          {/* Thick strokes drawn in writing order reveal the letterform. */}
          <mask id="letterform-writing-mask" maskUnits="userSpaceOnUse" x="-40" y="-40" width="1081" height="634">
            {WRITING_STROKES.map((stroke) => (
              <path
                key={stroke.d}
                data-writing-stroke
                d={stroke.d}
                fill="none"
                stroke="#fff"
                strokeWidth={stroke.width}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </mask>
        </defs>

        {/* Roots sit under the ink so they appear to grow out of the letters. */}
        <g className={styles.rootLayer}>
          {rootSystem?.map(({ tree }) => (
            <RootBranch key={tree.id} node={tree} weight={weight} />
          ))}
        </g>

        <g className={styles.inkLayer} mask="url(#letterform-writing-mask)">
          {LOGO_FULL.paths.map((d) => (
            <path key={d.slice(0, 24)} d={d} fill="currentColor" fillRule="evenodd" />
          ))}
        </g>

        <g className={styles.labelLayer}>
          {rootSystem?.map(({ label }) =>
            label ? <RootLabel key={label.text} label={label} weight={weight} /> : null,
          )}
        </g>
      </svg>
    </div>
  );
}
