'use client';

import { addState } from '@/lib/thread/draw';
import { useThreadPiece } from '@/lib/thread/useThreadPiece';

/**
 * "Knots that bloom" for Why Washeej (renders nothing).
 *
 * The thread crosses the section through the centre of every card and has a
 * knot tied at each centre. When the thread reaches a knot, that card blooms
 * out of it: the empty card (border and surface) scales up from the knot
 * first, then its content appears. The thread stays behind the cards.
 * On mobile the cards bloom one by one as they come up the screen.
 *
 * Styles are written directly (transform and opacity only), never read.
 */

// ===== Numbers to play with (fractions of the section's scroll range) =====
const BLOOM = 0.07; // how long the card takes to open
const CONTENT_DELAY = 0.045; // the content follows the border by this much
const CONTENT = 0.05;

export default function WhyBloom() {
  useThreadPiece('why', ({ timeline, marks, mobile, onRevert }) => {
    const grid = document.querySelector('[data-why-grid]');
    const cards = [...grid.querySelectorAll('[data-why-card]')];
    const startScale = mobile ? 0.6 : 0.12;

    cards.forEach((card, index) => {
      // Desktop: the moment the thread reaches this card's knot.
      // Mobile: the thread runs down the side, so use the card's place in the column.
      const reached = marks[`card-${index}`] ?? 0.03 + (card.offsetTop / grid.offsetHeight) * 0.8;
      const at = Math.min(reached, 1 - CONTENT_DELAY - CONTENT - 0.02);
      const content = [...card.firstElementChild.children];

      // The empty card opens from its knot…
      addState(timeline, { at, duration: BLOOM, ease: 'back.out(1.5)' }, (t) => {
        card.style.transform = `scale(${startScale + (1 - startScale) * t})`;
        card.style.opacity = Math.min(1, Math.max(0, t * 3));
        card.style.visibility = t <= 0 ? 'hidden' : 'visible';
      });
      // …then its content appears.
      addState(timeline, { at: at + CONTENT_DELAY, duration: CONTENT, ease: 'power1.out' }, (t) => {
        content.forEach((element) => {
          element.style.opacity = t;
          element.style.translate = `0 ${(1 - t) * 10}px`;
        });
      });

      onRevert(() => {
        card.removeAttribute('style');
        content.forEach((element) => {
          element.style.removeProperty('opacity');
          element.style.removeProperty('translate');
        });
      });
    });
  });

  return null;
}
