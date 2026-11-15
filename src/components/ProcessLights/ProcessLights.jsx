'use client';

import { addState } from '@/lib/thread/draw';
import { useThreadPiece } from '@/lib/thread/useThreadPiece';

/**
 * Process timeline (renders nothing): here the thread IS the timeline.
 * It runs through the four markers in reading order (right to left in Arabic);
 * each step lights up — the marker fills, the copy comes to full strength —
 * at the moment the thread reaches it.
 *
 * Styles are written directly (transform and opacity only), never read.
 */
export default function ProcessLights() {
  useThreadPiece('process', ({ timeline, marks, onRevert }) => {
    const steps = [...document.querySelectorAll('[data-process-step]')];

    steps.forEach((step, index) => {
      const at = Math.min(marks[`step-${index}`] ?? (index + 1) / (steps.length + 1), 0.93);
      const lit = step.querySelector('[data-step-lit]');
      const copy = step.querySelector('[data-step-copy]');

      addState(timeline, { at, duration: 0.045, ease: 'back.out(2)' }, (t) => {
        lit.style.transform = `scale(${Math.max(0, t)})`;
      });
      addState(timeline, { at, duration: 0.06, ease: 'power1.out' }, (t) => {
        copy.style.opacity = 0.3 + 0.7 * t;
      });

      onRevert(() => {
        lit.style.removeProperty('transform');
        copy.style.removeProperty('opacity');
      });
    });
  });

  return null;
}
