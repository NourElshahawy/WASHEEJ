'use client';

import { useId, useRef } from 'react';
import { Link } from '@/i18n/navigation';
import { gsap, useGSAP } from '@/lib/gsap';
import styles from './Button.module.css';

/**
 * Link styled as a button. Two designs:
 *
 *  - variant="primary"   "ink & root": a peach button that burgundy ink bleeds
 *                        into from the exact point the cursor entered. It is
 *                        slightly magnetic, its arrow is a tiny root that grows
 *                        two branches, and a click shoots a few fine threads.
 *  - variant="secondary" "stitched": an outlined pill; on hover a running stitch
 *                        sews itself around it and ends in a knot (CSS only).
 *
 * tone="dark" inverts the colours for the burgundy CTA section.
 * brand="whatsapp" uses WhatsApp green ink and the WhatsApp icon.
 * With reduced motion both designs fall back to a simple colour change.
 */

// ===== Numbers to play with =====
const MAGNET_RANGE = 80; // px around the button where it starts to follow the cursor
const MAGNET_PULL = 6; // px, the furthest it moves
const INK_IN = 0.6; // seconds for the ink to fill the button
const INK_OUT = 0.45;
const THREAD_COUNT = 5;
const CLICK_DELAY = 220; // ms the threads get before the link is followed

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

/** A tiny root: one stem, and two fine branches that grow on hover. */
function RootArrow() {
  return (
    <svg className={styles.rootArrow} viewBox="0 0 30 16" aria-hidden="true" focusable="false">
      <path className={styles.rootStem} d="M2,8 C9,8.6 16,7.4 27,8" />
      <path className={styles.rootBranch} pathLength="1" d="M15,7.9 C19,7.2 22,5.2 24.5,1.8" />
      <path className={styles.rootBranch} pathLength="1" d="M15,7.9 C19,8.8 22,10.8 24.5,14.2" />
    </svg>
  );
}

function LineArrow() {
  return (
    <svg className={styles.lineArrow} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 12h15 M13.5 6.5L19 12l-5.5 5.500" />
    </svg>
  );
}

/** WhatsApp mark: the bubble's tail is a separate stroke so it can draw itself. */
function WhatsAppIcon() {
  return (
    <svg className={styles.brandIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M7.9 19.4A8.5 8.5 0 1 0 4.7 16.3" />
      <path className={styles.bubbleTail} pathLength="1" d="M4.7 16.3L3.5 20.5l4.400-1.100" />
      <path d="M9.2 8.4c-.6 1.600.1 3.400 1.600 4.900s3.300 2.200 4.900 1.600l.3-1.600-1.8-.9-.9.900c-.9-.4-1.8-1.300-2.200-2.200l.9-.9-.9-1.8z" />
    </svg>
  );
}

export default function Button({
  href,
  variant = 'primary',
  tone = 'light',
  brand,
  size = 'regular',
  newTab = false,
  className = '',
  children,
}) {
  const rootRef = useRef(null);
  const followClick = useRef(false);
  const maskId = useId();
  const isPrimary = variant === 'primary';

  const { contextSafe } = useGSAP(
    () => {
      const button = rootRef.current;
      if (!isPrimary || window.matchMedia(REDUCED_MOTION_QUERY).matches) return undefined;

      // ---- Ink: grows from where the cursor came in, drains toward where it left ----
      const setInkPoint = (clientX, clientY) => {
        const box = button.getBoundingClientRect();
        const x = clientX - box.left;
        const y = clientY - box.top;
        gsap.set(button, { '--ink-x': `${x}px`, '--ink-y': `${y}px` });
        // Far enough to reach the furthest corner (plus the roughened edge).
        return Math.hypot(Math.max(x, box.width - x), Math.max(y, box.height - y)) + 14;
      };
      const fill = (clientX, clientY) => {
        const radius = setInkPoint(clientX, clientY);
        gsap.to(button, { '--ink-r': `${radius}px`, duration: INK_IN, ease: 'power2.out', overwrite: 'auto' });
      };
      const drain = (clientX, clientY) => {
        if (clientX !== undefined) setInkPoint(clientX, clientY);
        gsap.to(button, { '--ink-r': '0px', duration: INK_OUT, ease: 'power2.inOut', overwrite: 'auto' });
      };

      const onEnter = (event) => fill(event.clientX, event.clientY);
      const onLeave = (event) => drain(event.clientX, event.clientY);
      const onFocus = () => {
        if (!button.matches(':focus-visible')) return;
        const box = button.getBoundingClientRect();
        fill(box.left + box.width / 2, box.top + box.height / 2);
      };
      const onBlur = () => drain();

      button.addEventListener('pointerenter', onEnter);
      button.addEventListener('pointerleave', onLeave);
      button.addEventListener('focus', onFocus);
      button.addEventListener('blur', onBlur);

      // ---- Magnet: follows the cursor a little, then springs back ----
      let onMove;
      if (window.matchMedia(FINE_POINTER_QUERY).matches) {
        const moveX = gsap.quickTo(button, 'x', { duration: 0.5, ease: 'power3.out' });
        const moveY = gsap.quickTo(button, 'y', { duration: 0.5, ease: 'power3.out' });
        let pulled = false;

        onMove = (event) => {
          const box = button.getBoundingClientRect();
          // Distance from the cursor to the button's edge (0 when inside it).
          const dx = Math.max(box.left - event.clientX, 0, event.clientX - box.right);
          const dy = Math.max(box.top - event.clientY, 0, event.clientY - box.bottom);
          const distance = Math.hypot(dx, dy);

          if (distance < MAGNET_RANGE) {
            const strength = 1 - distance / MAGNET_RANGE;
            const offsetX = event.clientX - (box.left + box.width / 2);
            const offsetY = event.clientY - (box.top + box.height / 2);
            const length = Math.hypot(offsetX, offsetY) || 1;
            const reach = Math.min(1, length / (box.width / 2));
            moveX((offsetX / length) * MAGNET_PULL * strength * reach);
            moveY((offsetY / length) * MAGNET_PULL * strength * reach);
            pulled = true;
          } else if (pulled) {
            pulled = false;
            gsap.to(button, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)', overwrite: 'auto' });
          }
        };
        window.addEventListener('pointermove', onMove, { passive: true });
      }

      return () => {
        button.removeEventListener('pointerenter', onEnter);
        button.removeEventListener('pointerleave', onLeave);
        button.removeEventListener('focus', onFocus);
        button.removeEventListener('blur', onBlur);
        if (onMove) window.removeEventListener('pointermove', onMove);
      };
    },
    { scope: rootRef, dependencies: [isPrimary] },
  );

  // Click on a primary button: a few fine threads shoot toward the cursor, then the link is followed.
  const onClick = contextSafe((event) => {
    if (!isPrimary) return;
    if (followClick.current) {
      followClick.current = false; // this is our own delayed click: let it through
      return;
    }
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    const button = rootRef.current;
    const overlay = button.querySelector('[data-threads]');
    const box = button.getBoundingClientRect();
    // Keyboard activation has no pointer position: aim at the centre.
    const targetX = event.clientX ? event.clientX - box.left : box.width / 2;
    const targetY = event.clientY ? event.clientY - box.top : box.height / 2;

    for (let index = 0; index < THREAD_COUNT; index += 1) {
      const angle = (index / THREAD_COUNT) * Math.PI * 2 + Math.random() * 0.9;
      const reach = Math.max(box.width, box.height);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', targetX + Math.cos(angle) * reach);
      line.setAttribute('y1', targetY + Math.sin(angle) * reach);
      line.setAttribute('x2', targetX);
      line.setAttribute('y2', targetY);
      overlay.appendChild(line);
      gsap
        .timeline({ onComplete: () => line.remove() })
        .fromTo(line, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.17, ease: 'power2.in', delay: index * 0.012 })
        .to(line, { opacity: 0, duration: 0.11 });
    }

    // New tabs open at once (browsers block delayed pop-ups); same-tab links wait for the threads.
    const plainClick = event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
    if (newTab || !plainClick) return;
    event.preventDefault();
    window.setTimeout(() => {
      followClick.current = true;
      button.click();
    }, CLICK_DELAY);
  });

  const classes = [
    styles.button,
    isPrimary ? styles.primary : styles.secondary,
    tone === 'dark' ? styles.onDark : '',
    brand === 'whatsapp' ? styles.whatsapp : '',
    size === 'large' ? styles.large : '',
    className,
  ].join(' ');

  const content = (
    <>
      {brand === 'whatsapp' ? <WhatsAppIcon /> : null}
      <span className={styles.label}>{children}</span>
      {brand === 'whatsapp' ? null : (
        <span className={styles.arrowSlot}>{isPrimary ? <RootArrow /> : <LineArrow />}</span>
      )}
    </>
  );

  const body = (
    <span className={styles.body}>
      {isPrimary ? (
        <>
          {/* Ink: the pool is clipped to a growing circle; the wrapper roughens its edge. */}
          <span className={styles.inkEdge} aria-hidden="true">
            <span className={styles.inkPool} />
          </span>
          <span className={styles.content}>{content}</span>
          {/* Same content in the inked colour, revealed by the same circle. */}
          <span className={`${styles.content} ${styles.contentInked}`} aria-hidden="true">
            {content}
          </span>
          <svg className={styles.threads} data-threads aria-hidden="true" focusable="false" />
        </>
      ) : (
        <>
          <svg className={styles.stitch} aria-hidden="true" focusable="false">
            <defs>
              <mask id={maskId} maskUnits="userSpaceOnUse" x="-10" y="-10" width="2000" height="400">
                <rect className={styles.stitchReveal} pathLength="1" width="100%" height="100%" rx="22" />
              </mask>
            </defs>
            <rect className={styles.stitchLine} mask={`url(#${maskId})`} width="100%" height="100%" rx="22" />
          </svg>
          <span className={styles.knot} aria-hidden="true" />
          <span className={styles.content}>{content}</span>
        </>
      )}
    </span>
  );

  if (href.startsWith('/')) {
    return (
      <Link ref={rootRef} href={href} className={classes} onClick={onClick}>
        {body}
      </Link>
    );
  }

  return (
    <a
      ref={rootRef}
      href={href}
      className={classes}
      onClick={onClick}
      {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {body}
    </a>
  );
}
