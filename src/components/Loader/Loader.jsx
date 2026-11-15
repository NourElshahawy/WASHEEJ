'use client';

import { useEffect, useRef } from 'react';
import styles from './Loader.module.css';

/**
 * Intro screen — first visit of a browser session only (see loaderScript.js).
 *
 * The whole intro is a fixed CSS sequence (~2.2s), so it starts with the very
 * first paint and always plays in full, whatever the scripts are doing:
 *   the thread draws across the screen → ties a knot → the knot holds →
 *   the screen lifts away.
 * The page is fully covered until the lift.
 *
 * This component only reports the end: when the lift starts it marks
 * html[data-loader="done"] and sends "loader:done", which is when the hero
 * starts writing وشيج. Reduced motion: the screen simply fades.
 */
export default function Loader() {
  const screenRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.loader !== 'show') return undefined;
    const screen = screenRef.current;
    let cancelled = false;

    const finish = () => {
      if (cancelled) return;
      root.dataset.loader = 'done';
      window.dispatchEvent(new Event('loader:done'));
    };

    // The lift is the only animation on the screen element itself; it has a delay,
    // so "it has started" = its current time has passed that delay.
    const [lift] = screen.getAnimations();
    if (!lift) {
      finish();
      return undefined;
    }
    const delay = lift.effect.getTiming().delay;
    const remaining = delay - (lift.currentTime ?? delay);
    const timer = window.setTimeout(finish, Math.max(0, remaining));

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={screenRef} className={styles.loader} aria-hidden="true">
      <svg className={styles.line} viewBox="0 0 1000 40" preserveAspectRatio="none" focusable="false">
        <path pathLength="1" d="M0,20 C160,12 320,28 500,20 S840,12 1000,20" />
      </svg>
      <svg className={styles.knot} viewBox="0 0 30 30" focusable="false">
        <path
          pathLength="1"
          d="M3,15 C8,15 11,9 16,9 C21.5,9 22.5,16.5 17,18 C11.5,19.5 10,11.5 15.5,10.5 C20,9.7 23,15 27,15"
        />
      </svg>
    </div>
  );
}
