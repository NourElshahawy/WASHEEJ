'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { gsap, useGSAP } from '@/lib/gsap';
import { createRandom, sampleLine, toPathData } from '@/lib/thread/bundle';
import LocaleSwitch from '@/components/LocaleSwitch/LocaleSwitch';
import styles from './MenuPanel.module.css';

/**
 * The full-screen menu: a peach paper panel.
 * Roots grow from the corner where the menu button sits, one to each link, so
 * every link sits at a root tip; the links then appear as if written.
 * Closing plays the same thing in reverse.
 *
 * It is a modal dialog: focus moves into it and is kept there (Tab cycles),
 * Escape closes it, and the page behind does not scroll.
 * Reduced motion: it simply appears and disappears.
 */

const SVG_NS = 'http://www.w3.org/2000/svg';
const FOCUSABLE = 'a[href], button:not([disabled])';

/** One root from the corner to a link's tip, with a few fine twigs. */
function rootPaths(from, to, seed) {
  const random = createRandom(seed);
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  const nx = -dy / length;
  const ny = dx / length;
  const bulge = length * (0.1 + random() * 0.08) * (seed % 2 ? 1 : -1);
  const { samples } = sampleLine(
    [
      { x: from.x, y: from.y, w: 0 },
      { x: from.x + dx * 0.35 + nx * bulge, y: from.y + dy * 0.35 + ny * bulge, w: 0 },
      { x: from.x + dx * 0.72 - nx * bulge * 0.5, y: from.y + dy * 0.72 - ny * bulge * 0.5, w: 0 },
      { x: to.x, y: to.y, w: 0 },
    ],
    { smooth: 2 },
  );

  const twigs = [0.3, 0.5, 0.68, 0.84].map((at, index) => {
    const sample = samples[Math.round((samples.length - 1) * at)];
    const side = index % 2 ? 1 : -1;
    const reach = 26 + random() * 46;
    // Leave the root at an angle, leaning the way the root is growing.
    const tx = sample.ny;
    const ty = -sample.nx;
    const ex = sample.x + (tx * 0.75 + sample.nx * side * 0.65) * reach;
    const ey = sample.y + (ty * 0.75 + sample.ny * side * 0.65) * reach;
    const mx = sample.x + tx * reach * 0.5 + sample.nx * side * reach * 0.12;
    const my = sample.y + ty * reach * 0.5 + sample.ny * side * reach * 0.12;
    return `M${sample.x.toFixed(1)},${sample.y.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)}`;
  });

  return { main: toPathData(samples.map((sample) => [sample.x, sample.y])), twigs };
}

export default function MenuPanel({ open, onClose, links }) {
  const t = useTranslations('ui');
  const isRtl = useLocale() === 'ar';
  const panelRef = useRef(null);
  const timelineRef = useRef(null);
  // The panel stays mounted while it plays its closing animation.
  const [present, setPresent] = useState(false);

  useEffect(() => {
    if (open) setPresent(true);
    else if (timelineRef.current) timelineRef.current.timeScale(1.7).reverse();
    else setPresent(false);
  }, [open]);

  // Always call the latest onClose without re-running the modal effect.
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  // Modal behaviour: lock the page, trap focus, close on Escape.
  useEffect(() => {
    if (!present) return undefined;
    const panel = panelRef.current;
    const root = document.documentElement;
    // Lock the page behind the menu (both elements: browsers differ on which one scrolls).
    const previousOverflow = [root.style.overflow, document.body.style.overflow];
    root.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    panel.querySelector('[data-menu-close]').focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = [...panel.querySelectorAll(FOCUSABLE)];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      [root.style.overflow, document.body.style.overflow] = previousOverflow;
    };
  }, [present]);

  // Roots grow from the corner to each link; then the links are written.
  useGSAP(
    () => {
      if (!present) return undefined;
      const panel = panelRef.current;
      const svg = panel.querySelector('[data-menu-roots]');
      const box = panel.getBoundingClientRect();
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // The corner where the menu button sits (the inline-end top corner).
      const corner = { x: isRtl ? 44 : box.width - 44, y: -16 };
      const mains = [];
      const twigs = [];
      const fragment = document.createDocumentFragment();
      panel.querySelectorAll('[data-root-tip]').forEach((tip, index) => {
        const tipBox = tip.getBoundingClientRect();
        const target = { x: tipBox.left + tipBox.width / 2 - box.left, y: tipBox.top + tipBox.height / 2 - box.top };
        const paths = rootPaths(corner, target, index + 3);
        const main = document.createElementNS(SVG_NS, 'path');
        main.setAttribute('d', paths.main);
        main.setAttribute('class', styles.rootMain);
        fragment.appendChild(main);
        mains.push(main);
        paths.twigs.forEach((d) => {
          const twig = document.createElementNS(SVG_NS, 'path');
          twig.setAttribute('d', d);
          twig.setAttribute('class', styles.rootTwig);
          fragment.appendChild(twig);
          twigs.push(twig);
        });
      });
      svg.replaceChildren(fragment);

      if (reduced) {
        timelineRef.current = null;
        return undefined;
      }

      const covers = gsap.utils.toArray('[data-write-cover]', panel);
      const tips = gsap.utils.toArray('[data-root-tip]', panel);
      const extras = gsap.utils.toArray('[data-menu-extra]', panel);

      const timeline = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onReverseComplete: () => {
          timelineRef.current = null;
          setPresent(false);
        },
      });
      timeline
        .fromTo(panel, { yPercent: -100 }, { yPercent: 0, duration: 0.55, ease: 'power3.out' })
        .fromTo(mains, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.75, stagger: 0.08, ease: 'power1.inOut' }, 0.3)
        .fromTo(twigs, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.4, stagger: 0.015 }, 0.6)
        .fromTo(tips, { scale: 0 }, { scale: 1, duration: 0.3, stagger: 0.08, ease: 'back.out(2.5)' }, 0.95)
        // "Written": a cover the colour of the paper slides off each word, from where the writing starts.
        .fromTo(covers, { scaleX: 1 }, { scaleX: 0, duration: 0.55, stagger: 0.08, ease: 'power1.inOut' }, 1)
        .fromTo(extras, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 1.2);
      timelineRef.current = timeline;

      return () => {
        timelineRef.current = null;
      };
    },
    { scope: panelRef, dependencies: [present, isRtl] },
  );

  if (!present) return null;

  return (
    <div
      ref={panelRef}
      className={styles.menuPanel}
      role="dialog"
      aria-modal="true"
      aria-label={t('mainNav')}
      data-lenis-prevent
    >
      <svg className={styles.menuRoots} data-menu-roots aria-hidden="true" focusable="false" />

      <button type="button" className={styles.closeButton} data-menu-close aria-label={t('closeMenu')} onClick={onClose}>
        {/* The knot, undone: two loose threads crossing. */}
        <svg viewBox="0 0 30 30" aria-hidden="true" focusable="false">
          <path d="M6,7 C11,11 18,18 24,23" />
          <path d="M24,7 C19,12 12,17 6,23" />
        </svg>
      </button>

      <nav className={styles.menuNav} aria-label={t('mainNav')}>
        <ul className={styles.menuList}>
          {links.map(({ key, href, label, current }, index) => (
            <li key={key} className={styles.menuItem}>
              <Link
                href={href}
                className={styles.menuLink}
                aria-current={current ? 'page' : undefined}
                onClick={onClose}
              >
                <span className={styles.menuIndex} data-menu-extra aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={styles.menuWord}>
                  {label}
                  <span className={styles.writeCover} data-write-cover aria-hidden="true" />
                </span>
                {/* The tip of this link's root: after the word, on the side the roots grow from. */}
                <span className={styles.rootTip} data-root-tip aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.menuFoot} data-menu-extra>
        <LocaleSwitch />
      </div>
    </div>
  );
}
