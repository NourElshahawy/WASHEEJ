'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and Lenis
 * always agree on the scroll position (one clock, one smoothing). Renders nothing.
 * Skipped entirely when the visitor prefers reduced motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const headerHeight = () =>
      parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;

    const lenis = new Lenis({
      autoRaf: false,
      // In-page links (#services, #contact …) glide instead of jumping.
      anchors: { offset: -headerHeight() },
    });

    lenis.on('scroll', ScrollTrigger.update);
    const onTick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0); // Lenis is the only smoothing of the scroll position

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return null;
}
