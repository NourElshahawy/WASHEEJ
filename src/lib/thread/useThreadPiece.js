'use client';

import { useEffect, useRef } from 'react';

/**
 * Lets a section tie its own motion to the traveling thread.
 *
 * When the thread layer (re)builds the piece that runs through a section, it
 * announces it with a "thread:piece" event carrying:
 *
 *   { key, timeline, marks, mobile, isRtl, onRevert }
 *
 * `timeline` is that piece's scroll-scrubbed timeline (0 → 1 = the thread
 * being drawn through the section) and `marks` are the positions, as 0–1
 * fractions, where the thread reaches named spots. The handler adds tweens to
 * the timeline, so cards and steps move exactly when the thread arrives.
 * `onRevert(fn)` registers clean-up for when the thread is rebuilt (resize).
 *
 * With reduced motion the thread is static and no event is sent, so sections
 * simply stay in their final layout.
 */
export function useThreadPiece(key, handler) {
  const latest = useRef(handler);
  latest.current = handler;

  useEffect(() => {
    const onPiece = (event) => {
      if (event.detail.key === key) latest.current(event.detail);
    };
    window.addEventListener('thread:piece', onPiece);
    return () => window.removeEventListener('thread:piece', onPiece);
  }, [key]);
}
