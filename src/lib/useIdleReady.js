'use client';

import { useEffect, useState } from 'react';

/**
 * Spreads the set-up of decorative, below-the-fold motion over idle time.
 *
 * Every section that needs heavy set-up (measuring, building strands, creating
 * scroll timelines) asks `useIdleReady(order)` and does nothing until it returns
 * true. The page first becomes interactive and the hero starts; then, one
 * section per idle slot and in `order`, they are switched on. This keeps the
 * work out of the hydration task (no long blocking task on load).
 *
 * Lower `order` goes first. Sections that pin (and so change the page's
 * height) go before the thread that is measured from the layout.
 */

const queue = [];
let pumping = false;
let started = false;

const idle = (run) =>
  typeof window.requestIdleCallback === 'function' ? window.requestIdleCallback(run, { timeout: 700 }) : window.setTimeout(run, 60);

function pump() {
  const next = queue.shift();
  if (!next) {
    pumping = false;
    return;
  }
  pumping = true;
  idle(() => {
    next.run();
    // Leave a frame between two sections, so each is its own short task.
    requestAnimationFrame(() => pump());
  });
}

function start() {
  started = true;
  if (!pumping) pump();
}

/** Wait for the page to load and for the intro screen (if it is playing) to lift. */
function whenPageIsUp(run) {
  const afterLoad = () => {
    if (document.documentElement.dataset.loader === 'show') {
      window.addEventListener('loader:done', () => window.setTimeout(run, 250), { once: true });
    } else {
      run();
    }
  };
  if (document.readyState === 'complete') afterLoad();
  else window.addEventListener('load', afterLoad, { once: true });
}

export function useIdleReady(order = 0) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    queue.push({ order, run: () => !cancelled && setReady(true) });
    queue.sort((a, b) => a.order - b.order);
    if (started) {
      if (!pumping) pump();
    } else if (queue.length === 1) {
      whenPageIsUp(start);
    }
    return () => {
      cancelled = true;
    };
  }, [order]);

  return ready;
}
