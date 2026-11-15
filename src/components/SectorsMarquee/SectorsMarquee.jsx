'use client';

import { useRef, useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { gsap, useGSAP } from '@/lib/gsap';
import { useIdleReady } from '@/lib/useIdleReady';

/**
 * Two marquee rows for the Sectors chips.
 *
 *  - The top row drifts slowly to the right and the bottom row to the left
 *    (mirrored in English), endlessly and without a seam: each row's chips are
 *    repeated enough times to fill the screen, and the row moves by exactly
 *    one set before starting over.
 *  - The chips hang from their thread with a very soft sway (CSS).
 *  - Hover: the row eases to a stop, the hovered chip swings gently like a
 *    spring, and the row eases back into motion when the pointer leaves.
 *  - Off-screen the rows are paused. With reduced motion nothing moves and the
 *    chips simply wrap (this component then does nothing).
 */

// ===== Numbers to play with =====
const SPEED = 26; // px per second
const EASE_STOP = 0.7; // seconds for a row to ease to a stop, or back into motion
const SWING = 7; // degrees of the hovered chip's swing

export default function SectorsMarquee({ className, children }) {
  const rootRef = useRef(null);
  const isRtl = useLocale() === 'ar';
  const [width, setWidth] = useState(0);
  const ready = useIdleReady(4); // set up after the page is interactive

  // Rebuild when the page width changes.
  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!ready || !width || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

      root.setAttribute('data-marquee', '');
      const tweens = [];
      const cleanups = [];

      root.querySelectorAll('[data-sector-row]').forEach((row, rowIndex) => {
        const track = row.querySelector('[data-sector-track]');
        const originals = [...track.children];
        const oneSet = track.scrollWidth; // width of one set, including the gap after its last chip

        // Repeat the set until the row is longer than the screen plus one set.
        const copies = Math.ceil(row.offsetWidth / oneSet) + 1;
        const clones = [];
        for (let copy = 0; copy < copies; copy += 1) {
          originals.forEach((chip) => {
            const clone = chip.cloneNode(true);
            clone.setAttribute('aria-hidden', 'true'); // decorative repeat; the originals carry the text
            track.appendChild(clone);
            clones.push(clone);
          });
        }

        // Arabic: top row → right, bottom row → left. English: mirrored.
        const toRight = (rowIndex % 2 === 0) === isRtl;
        const drift = gsap.fromTo(
          track,
          { x: toRight ? -oneSet : 0 },
          { x: toRight ? 0 : -oneSet, duration: oneSet / SPEED, ease: 'none', repeat: -1 },
        );
        tweens.push(drift);

        // Hover: ease the row to a stop, swing the chip; ease back when leaving.
        const setPace = (pace) => gsap.to(drift, { timeScale: pace, duration: EASE_STOP, ease: 'power2.out', overwrite: true });
        const onOver = (event) => {
          const chip = event.target.closest('[data-sector-chip]');
          if (!chip || chip.contains(event.relatedTarget)) return;
          setPace(0);
          gsap
            .timeline({ overwrite: true })
            .to(chip, { rotate: toRight ? -SWING : SWING, duration: 0.35, ease: 'sine.out' })
            .to(chip, { rotate: 0, duration: 2.4, ease: 'elastic.out(1, 0.32)' });
        };
        const onLeave = () => setPace(1);
        row.addEventListener('pointerover', onOver);
        row.addEventListener('pointerleave', onLeave);

        cleanups.push(() => {
          row.removeEventListener('pointerover', onOver);
          row.removeEventListener('pointerleave', onLeave);
          clones.forEach((clone) => clone.remove());
        });
      });

      // Rest while the section is off-screen.
      const visibility = new IntersectionObserver(([entry]) => {
        tweens.forEach((tween) => (entry.isIntersecting ? tween.resume() : tween.pause()));
        root.toggleAttribute('data-resting', !entry.isIntersecting);
      });
      visibility.observe(root);

      return () => {
        visibility.disconnect();
        cleanups.forEach((cleanup) => cleanup());
        root.removeAttribute('data-marquee');
        root.removeAttribute('data-resting');
      };
    },
    { scope: rootRef, dependencies: [width, isRtl, ready], revertOnUpdate: true },
  );

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
