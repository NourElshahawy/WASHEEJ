'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap';
import { buildBundle } from '@/lib/thread/bundle';
import { addDraw, addState, renderStrands, THREAD_LINE, THREAD_SCRUB } from '@/lib/thread/draw';
import { buildServicesRoute } from '@/lib/thread/routes';
import { useIdleReady } from '@/lib/useIdleReady';
import styles from './ServicesMotion.module.css';

/**
 * Motion for the Services section. It renders the section's own piece of
 * thread (an SVG behind the cards) and drives:
 *
 *  - Arriving: the thread comes in from About and runs down to the lane
 *    between the two rows of cards, where the deck of eight cards waits.
 *  - Pinned "dealt cards" (desktop): when the grid reaches the top, the
 *    section pins. Scrolling draws the thread through the lane and it pulls
 *    the cards out of the deck one by one, in reading order; each flies to its
 *    place, its small rotation settling to 0, and its preview plays once as it
 *    lands. When all eight have landed the section un-pins. Reversible.
 *  - Mobile: no pin; the cards are dealt into the single column as they come up.
 *  - Hover: a soft burgundy glow follows the cursor inside the card
 *    (the lift and the wrapping threads are CSS).
 *  - Reduced motion: final layout, the thread simply shown.
 *
 * The thread lives inside the pinned element, so it stays with the cards.
 */

// ===== Numbers to play with =====
const DEAL_SCROLL = 1.7; // length of the pin, in viewport heights
const PIN_GAP = 4; // px between the floating nav and the top of the grid while pinned
const DEAL_START = 0.06; // on the pinned timeline (0–1): when the first card leaves the deck
const DEAL_STAGGER = 0.088;
const DEAL_FLIGHT = 0.26;
const FAN_SPREAD = 11; // px between cards in the deck
const FAN_TILT = 2.4; // degrees between cards in the deck
const PREVIEW_PLAY_MS = 2600;
const STRANDS = { desktop: 26, mobile: 7 };

const MOBILE_QUERY = '(max-width: 860px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function playPreview(card) {
  const host = card.querySelector('[data-preview-host]');
  if (!host || host.hasAttribute('data-preview-play')) return;
  host.setAttribute('data-preview-play', '');
  window.setTimeout(() => host.removeAttribute('data-preview-play'), PREVIEW_PLAY_MS);
}

export default function ServicesMotion() {
  const svgRef = useRef(null);
  const isRtl = useLocale() === 'ar';
  // Layout version: bumps when the width or the motion preference changes.
  const [layout, setLayout] = useState(0);
  const ready = useIdleReady(1); // set up after the page is interactive

  useLayoutEffect(() => {
    let lastSize = `${window.innerWidth}x${window.innerHeight}`;
    const bump = () => setLayout((value) => value + 1);
    const onResize = () => {
      const size = `${window.innerWidth}x${window.innerHeight}`;
      if (size === lastSize) return;
      lastSize = size;
      bump();
    };
    const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    window.addEventListener('resize', onResize);
    motionQuery.addEventListener('change', bump);
    return () => {
      window.removeEventListener('resize', onResize);
      motionQuery.removeEventListener('change', bump);
    };
  }, []);

  useGSAP(
    () => {
      if (!ready) return undefined;
      const svg = svgRef.current;
      const root = svg.parentElement; // the element that gets pinned
      const grid = root.querySelector('[data-service-grid]');
      const cards = [...grid.querySelectorAll('[data-service-card]')];
      const mobile = window.matchMedia(MOBILE_QUERY).matches;
      const reduced = window.matchMedia(REDUCED_MOTION_QUERY).matches;
      const strands = mobile ? STRANDS.mobile : STRANDS.desktop;
      const [leadGroup, laneGroup] = svg.querySelectorAll('g');
      // Styles are written by hand below, so they are cleared by hand when this is rebuilt.
      const clearCards = () => cards.forEach((card) => card.removeAttribute('style'));

      // ---- Build this section's thread ----
      const route = buildServicesRoute({ root, isRtl, mobile });
      const lead = buildBundle(route.lead.points, { strands, seed: 71, taperEnd: route.lead.taperEnd });
      const lane = route.lane ? buildBundle(route.lane.points, { strands, seed: 73, taperEnd: route.lane.taperEnd }) : null;
      const leadStrands = renderStrands(leadGroup, lead.paths);
      const laneStrands = lane ? renderStrands(laneGroup, lane.paths) : (laneGroup.replaceChildren(), []);
      if (reduced) return undefined;

      const whenLanded = (card, timeline) => () => {
        // Only on the way down: scrolling back up should not replay previews.
        if (timeline.scrollTrigger && timeline.scrollTrigger.direction < 0) return;
        playPreview(card);
      };

      // ---- Mobile: one scrubbed timeline, cards dealt into the column ----
      if (mobile) {
        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: root, start: `top ${THREAD_LINE}`, end: `bottom ${THREAD_LINE}`, scrub: THREAD_SCRUB },
        });
        addDraw(timeline, leadStrands, { length: lead.length });
        const fromThread = isRtl ? 1 : -1; // the thread runs down the start side
        cards.forEach((card, index) => {
          const at = 0.02 + ((grid.offsetTop + card.offsetTop) / root.offsetHeight) * 0.9;
          const tilt = fromThread * (index % 2 ? 5 : 3);
          addState(timeline, { at: Math.min(at, 0.9), duration: 0.08, ease: 'power2.out' }, (t) => {
            const rest = 1 - t;
            card.style.transform = `translate(${fromThread * 56 * rest}px, ${44 * rest}px) rotate(${tilt * rest}deg)`;
            card.style.opacity = t;
            card.style.visibility = t <= 0 ? 'hidden' : 'visible';
          });
          timeline.call(whenLanded(card, timeline), null, Math.min(at, 0.9) + 0.08);
        });
        return clearCards;
      }

      // ---- Desktop ----
      // The floating nav sits over the top of the page: keep the grid clear of it.
      const nav = document.querySelector('[data-floating-nav]');
      const headerHeight = () => (nav ? nav.offsetTop + nav.offsetHeight : 0);
      // Pin with the whole grid on screen: centred if there is room, otherwise just under the floating nav.
      const pinTop = () => Math.max(headerHeight() + PIN_GAP, (window.innerHeight - grid.offsetHeight) / 2);

      // 1) Arriving: the thread runs in while the section scrolls up to its pin point.
      const arrive = gsap.timeline({ defaults: { ease: 'none' }, paused: true });
      addDraw(arrive, leadStrands, { length: lead.length });
      ScrollTrigger.create({
        trigger: root,
        start: `top ${THREAD_LINE}`,
        endTrigger: grid,
        end: () => `top ${pinTop()}px`,
        scrub: THREAD_SCRUB,
        animation: arrive,
        invalidateOnRefresh: true,
      });

      // 2) Pinned: the thread crosses the lane and deals the cards.
      const deal = gsap.timeline({ defaults: { ease: 'none' }, paused: true });
      addDraw(deal, laneStrands, { length: lane.length, duration: 0.92 });

      const middle = (cards.length - 1) / 2;
      // The deck sits in the middle of what is visible while pinned.
      const deckY = () => Math.min(grid.offsetHeight / 2, (window.innerHeight - pinTop()) / 2);
      // Where each card sits in the deck, measured once (the section is rebuilt on resize).
      const deck = cards.map((card, index) => ({
        x: grid.offsetWidth / 2 - (card.offsetLeft + card.offsetWidth / 2) + (index - middle) * FAN_SPREAD,
        y: deckY() - (card.offsetTop + card.offsetHeight / 2) - index * 1.5,
        rotate: (index - middle) * FAN_TILT,
      }));
      cards.forEach((card, index) => {
        const at = DEAL_START + index * DEAL_STAGGER;
        const from = deck[index];
        card.style.zIndex = cards.length - index;
        addState(deal, { at, duration: DEAL_FLIGHT, ease: 'power3.out' }, (t) => {
          const rest = 1 - t;
          card.style.transform = `translate(${from.x * rest}px, ${from.y * rest}px) rotate(${from.rotate * rest}deg) scale(${1 - 0.14 * rest})`;
        });
        deal.call(whenLanded(card, deal), null, at + DEAL_FLIGHT * 0.9);
      });

      ScrollTrigger.create({
        trigger: grid,
        start: () => `top ${pinTop()}px`,
        end: () => `+=${window.innerHeight * DEAL_SCROLL}`,
        pin: root,
        scrub: 1,
        animation: deal,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      });
    },
    { dependencies: [layout, isRtl, ready], revertOnUpdate: true },
  );

  // Cursor glow: move a soft disc to the pointer (transform only).
  useGSAP(() => {
    const grid = svgRef.current.parentElement.querySelector('[data-service-grid]');
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return undefined;

    const onMove = (event) => {
      const surface = event.target.closest('[data-preview-host]');
      if (!surface) return;
      const box = surface.getBoundingClientRect();
      gsap.to(surface.querySelector('[data-cursor-glow]'), {
        x: event.clientX - box.left,
        y: event.clientY - box.top,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };
    grid.addEventListener('pointermove', onMove, { passive: true });
    return () => grid.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <svg ref={svgRef} className={styles.servicesThread} aria-hidden="true" focusable="false">
      <g />
      <g />
    </svg>
  );
}
