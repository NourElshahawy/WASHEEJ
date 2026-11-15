'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap';
import { buildBundle } from '@/lib/thread/bundle';
import { addState, renderStrands } from '@/lib/thread/draw';
import { useIdleReady } from '@/lib/useIdleReady';

/**
 * Scroll behaviour for the Work cards. It chooses a mode and drives the motion;
 * the markup and all styling stay in the Work component.
 *
 *  - "grid"  default / no JS / reduced motion: the 4 + 3 card grid.
 *  - "swipe" mobile: one row you swipe sideways, with CSS scroll-snap.
 *  - "rail"  desktop: the section pins and vertical scrolling slides the row
 *            sideways, card by card. In Arabic the next card comes in from the
 *            left, in English from the right. As the section arrives, the cards
 *            fan out of a loose pile into the row.
 *
 * In both single-row modes a bundle of thread runs along the row in a clear
 * wave: it dips below each card and rises in the gaps between them. It is part
 * of the row, so it moves with it.
 */

// ===== Numbers to play with =====
const SCRUB_SMOOTHING = 0.6; // seconds for the row to catch up with the scroll
const SNAP_DELAY = 0.12; // pause after scrolling stops before settling on a card
const SNAP_DURATION = { min: 0.25, max: 0.6 };
const PILE_VISIBLE = 5; // how many cards show while they are still piled up
const PILE_TILT = [-6, 4, -2, 7, -9, 3, -4]; // degrees, per card, in the pile
const PILE_SHIFT = [0, 14, -10, 18, -16, 8, -6]; // px sideways, per card, in the pile

const MOBILE_QUERY = '(max-width: 860px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const THREAD_STRANDS = { rail: 20, swipe: 6 };
const THREAD_DIP = { rail: 30, swipe: 12 }; // px the thread dips below the row
const MIN_RAIL_HEIGHT = 560; // below this viewport height the pinned row has no room

const twoDigits = (value) => String(value).padStart(2, '0');

function pickMode() {
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return 'grid';
  if (window.matchMedia(MOBILE_QUERY).matches) return 'swipe';
  return window.innerHeight >= MIN_RAIL_HEIGHT ? 'rail' : 'grid';
}

export default function WorkRail({ className, children }) {
  const rootRef = useRef(null);
  const isRtl = useLocale() === 'ar';
  const [mode, setMode] = useState('grid');
  const ready = useIdleReady(2); // set up after the page is interactive

  // Decide the mode before the first paint, and again when the screen changes.
  useLayoutEffect(() => {
    const update = () => setMode(pickMode());
    update();
    const queries = [window.matchMedia(MOBILE_QUERY), window.matchMedia(REDUCED_MOTION_QUERY)];
    queries.forEach((query) => query.addEventListener('change', update));
    window.addEventListener('resize', update);
    return () => {
      queries.forEach((query) => query.removeEventListener('change', update));
      window.removeEventListener('resize', update);
    };
  }, []);

  useGSAP(
    () => {
      if (!ready) return undefined;
      const root = rootRef.current;
      const viewport = root.querySelector('[data-work-viewport]');
      const track = root.querySelector('[data-work-track]');
      const cards = gsap.utils.toArray('[data-work-card]', root);
      const current = root.querySelector('[data-work-current]');
      const progressBar = root.querySelector('[data-work-progress]');
      const count = cards.length;

      const showStep = (progress) => {
        current.textContent = twoDigits(Math.round(progress * (count - 1)) + 1);
        gsap.set(progressBar, { scaleX: progress });
      };
      showStep(0);

      // ---- The row's own thread: it dips below each card and rises in the gaps between them ----
      const threadLayer = root.querySelector('[data-work-thread]');
      if (mode !== 'grid') {
        const rowWidth = track.scrollWidth;
        const rowHeight = track.offsetHeight;
        const dip = THREAD_DIP[mode];
        const gap = cards.length > 1 ? Math.abs(cards[1].offsetLeft - cards[0].offsetLeft) - cards[0].offsetWidth : 24;
        const inOrder = [...cards].sort((first, second) => first.offsetLeft - second.offsetLeft);
        const waypoints = [{ x: -340, y: rowHeight * 0.74, w: 10 }];
        inOrder.forEach((card) => {
          waypoints.push(
            { x: card.offsetLeft - gap / 2, y: rowHeight * 0.42, w: 8 }, // up in the gap before the card
            { x: card.offsetLeft + card.offsetWidth * 0.22, y: rowHeight + dip, w: 16 }, // down under the card…
            { x: card.offsetLeft + card.offsetWidth * 0.78, y: rowHeight + dip, w: 16 }, // …and along its bottom edge
          );
        });
        const lastCard = inOrder[inOrder.length - 1];
        waypoints.push(
          { x: lastCard.offsetLeft + lastCard.offsetWidth + gap / 2, y: rowHeight * 0.42, w: 8 },
          { x: rowWidth + 340, y: rowHeight * 0.74, w: 10 },
        );
        const { paths } = buildBundle(waypoints, { strands: THREAD_STRANDS[mode], seed: 41, smooth: 1 });
        renderStrands(threadLayer, paths);
      }
      const clearThread = () => threadLayer.replaceChildren();

      // ---- Mobile: native sideways scrolling; only the counter needs JS ----
      if (mode === 'swipe') {
        const onScroll = () => {
          const range = viewport.scrollWidth - viewport.clientWidth;
          showStep(range > 0 ? Math.min(1, Math.abs(viewport.scrollLeft) / range) : 0);
        };
        viewport.addEventListener('scroll', onScroll, { passive: true });
        return () => {
          viewport.removeEventListener('scroll', onScroll);
          clearThread();
        };
      }

      if (mode !== 'rail') return clearThread;

      // ---- Desktop: pinned row ----
      const direction = isRtl ? 1 : -1; // Arabic: the row moves right, new cards enter from the left

      // How far the row has to travel for the last card to reach the edge.
      const getTravel = () => {
        const style = getComputedStyle(viewport);
        const visible = viewport.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        return Math.max(0, track.scrollWidth - visible);
      };

      // 1) Arriving: the cards fan out of a pile into the row (no extra scroll length).
      const fanOut = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root,
          start: 'top 92%',
          end: 'top top',
          scrub: SCRUB_SMOOTHING,
          invalidateOnRefresh: true,
        },
      });
      // Where each card sits in the pile, measured once (the row is rebuilt on resize).
      const pile = cards.map((card, index) => ({
        x:
          viewport.clientWidth / 2 -
          (track.offsetLeft + card.offsetLeft + card.offsetWidth / 2) +
          PILE_SHIFT[index % PILE_SHIFT.length],
        y: index * 3,
        rotate: PILE_TILT[index % PILE_TILT.length],
      }));
      // Written directly (transform / opacity only): no style reads.
      cards.forEach((card, index) => {
        const from = pile[index];
        const hiddenInPile = index >= PILE_VISIBLE;
        addState(fanOut, { at: 0, duration: 1 }, (t) => {
          const rest = 1 - t;
          card.style.transform = `translate(${from.x * rest}px, ${from.y * rest}px) rotate(${from.rotate * rest}deg)`;
          if (hiddenInPile) card.style.opacity = Math.min(1, t / 0.7);
        });
      });

      // The thread fades in as the cards settle into the row.
      fanOut.fromTo(threadLayer, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0.5);

      // 2) Pinned: vertical scroll slides the row. Pin length = the row's travel.
      const slide = gsap.to(track, { x: () => direction * getTravel(), ease: 'none', paused: true });
      const pin = ScrollTrigger.create({
        trigger: root,
        start: 'top top',
        end: () => `+=${getTravel()}`,
        pin: true,
        scrub: SCRUB_SMOOTHING,
        animation: slide,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: {
          snapTo: 1 / (count - 1),
          delay: SNAP_DELAY,
          duration: SNAP_DURATION,
          ease: 'power2.inOut',
        },
        onUpdate: (self) => showStep(self.progress),
      });

      // Keyboard: tabbing to a card that is off-screen scrolls the row to it.
      const onFocusIn = (event) => {
        const index = cards.indexOf(event.target.closest('[data-work-card]'));
        if (index < 0 || !event.target.matches(':focus-visible')) return;
        pin.scroll(pin.start + (index / (count - 1)) * (pin.end - pin.start));
      };
      track.addEventListener('focusin', onFocusIn);
      return () => {
        track.removeEventListener('focusin', onFocusIn);
        clearThread();
        cards.forEach((card) => card.removeAttribute('style'));
      };
    },
    { scope: rootRef, dependencies: [mode, isRtl, ready], revertOnUpdate: true },
  );

  return (
    <div ref={rootRef} className={className} data-mode={mode}>
      {children}
    </div>
  );
}
