'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap';
import { useIdleReady } from '@/lib/useIdleReady';
import Icon from '@/components/Icon/Icon';
import card from '@/styles/card.module.css';
import styles from './TestimonialStage.module.css';

/**
 * "Written by the thread": one large testimonial at a time.
 *
 *  - Its text is written word by word when it first comes into view, and again
 *    each time another testimonial is chosen.
 *  - Three ways to switch: previous/next arrows beside the quote, a sideways
 *    swipe on touch screens, and the three sources, which hang as small knots
 *    on a line (the traveling thread runs along it). All are real buttons, and
 *    the quote is an aria-live region so the change is announced.
 *  - Reduced motion: the text simply changes.
 */

const WORD_STAGGER = 0.045; // seconds between words (their duration is in the CSS)
const SWIPE_DISTANCE = 48; // px a touch has to travel sideways to count as a swipe

export default function TestimonialStage({ items, label, previousLabel, nextLabel }) {
  const rootRef = useRef(null);
  const quoteRef = useRef(null);
  const hasEntered = useRef(false);
  const swipeStart = useRef(null);
  const isRtl = useLocale() === 'ar';
  const [active, setActive] = useState(0);
  const current = items[active];

  // SplitText is only needed here, so it is loaded once the page is idle.
  const idle = useIdleReady(5);
  const [SplitText, setSplitText] = useState(null);
  useEffect(() => {
    if (!idle) return undefined;
    let cancelled = false;
    import('gsap/SplitText').then((module) => {
      if (cancelled) return;
      gsap.registerPlugin(module.SplitText);
      setSplitText(() => module.SplitText);
    });
    return () => {
      cancelled = true;
    };
  }, [idle]);

  const step = (amount) => setActive((index) => (index + amount + items.length) % items.length);

  // Swipe: dragging toward the start side brings the next one (like turning a page).
  const onPointerDown = (event) => {
    if (event.pointerType === 'mouse') return;
    swipeStart.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < SWIPE_DISTANCE || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    const towardStart = isRtl ? dx > 0 : dx < 0;
    step(towardStart ? 1 : -1);
  };
  const onPointerCancel = () => {
    swipeStart.current = null;
  };

  useGSAP(
    () => {
      if (!SplitText || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

      // Split into words only: Arabic letters must stay joined.
      const quote = quoteRef.current;
      const split = new SplitText(quote, { type: 'words', aria: 'none', wordsClass: styles.word });
      // Each word waits a little longer than the one before it; the animation itself is CSS.
      split.words.forEach((word, index) => {
        word.style.animationDelay = `${index * WORD_STAGGER}s`;
      });
      const write = { play: () => quote.classList.add(styles.writing) };

      if (hasEntered.current) {
        write.play();
      } else {
        // First time: wait until the section is on screen.
        ScrollTrigger.create({
          trigger: rootRef.current,
          start: 'top 72%',
          once: true,
          onEnter: () => {
            hasEntered.current = true;
            write.play();
          },
        });
      }

      return () => {
        quote.classList.remove(styles.writing);
        split.revert();
      };
    },
    { scope: rootRef, dependencies: [active, SplitText], revertOnUpdate: true },
  );

  return (
    <div ref={rootRef} className={styles.stage}>
      <div className={styles.quoteRow}>
        <button
          type="button"
          className={`${styles.navButton} ${styles.navPrevious}`}
          aria-label={previousLabel}
          onClick={() => step(-1)}
        >
          <Icon name="arrow" size={22} />
        </button>

        <figure
          className={`${card.card} ${styles.quoteCard}`}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
        >
          {/* A large quote mark takes the place of the index numeral. */}
          <span className={`${card.mark} ${styles.quoteMark}`} aria-hidden="true">
            &rdquo;
          </span>
          <blockquote className={styles.quote} aria-live="polite" aria-atomic="true">
            <p ref={quoteRef} key={active}>
              {current.quote}
            </p>
          </blockquote>
          <figcaption className={styles.quoteSource}>
            <span className={styles.quoteSourceRole}>{current.role}</span>
            <span className={styles.quoteSourceOrg}>{current.org}</span>
          </figcaption>
        </figure>

        <button
          type="button"
          className={`${styles.navButton} ${styles.navNext}`}
          aria-label={nextLabel}
          onClick={() => step(1)}
        >
          <Icon name="arrow" size={22} />
        </button>
      </div>

      <div className={styles.sourceRail}>
        {/* The line the knots hang from; the traveling thread is routed along it. */}
        <span className={styles.sourceLine} data-thread-anchor="testimonials-line" aria-hidden="true" />
        <ul className={styles.sourceList} aria-label={label}>
          {items.map((item, index) => (
            <li key={item.org} className={styles.sourceItem}>
              <button
                type="button"
                className={styles.sourceKnot}
                aria-pressed={index === active}
                onClick={() => setActive(index)}
              >
                <span className={styles.knotString} aria-hidden="true" />
                <span className={styles.knotDot} aria-hidden="true" />
                <span className={styles.sourceRole}>{item.role}</span>
                <span className={styles.sourceOrg}>{item.org}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
