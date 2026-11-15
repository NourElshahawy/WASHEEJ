'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { navLinks } from '@/config/site';
import Brand from '@/components/Brand/Brand';
import LocaleSwitch from '@/components/LocaleSwitch/LocaleSwitch';
import MenuPanel from '@/components/MenuPanel/MenuPanel';
import styles from './Header.module.css';

/**
 * Header and navigation.
 *
 *  - At the top of the page there is no nav bar: only the logo in one corner
 *    and, in the other, the language switch and a menu button shaped as a
 *    small knot — so the hero roots are fully visible.
 *  - After the first scroll (~80px) the nav slides down as a floating pill with
 *    a paper texture, and a thread draws its outline. Back at the very top it
 *    hides again.
 *  - Link hover: a tiny root sprouts above the word and a thread draws itself
 *    underneath, ending in a knot. The current page's link keeps its knot.
 *  - The knot button opens the full-screen menu (MenuPanel).
 */

const SHOW_NAV_AFTER = 80; // px scrolled before the floating nav appears

/** The menu button: a small knot. */
function KnotButton({ label, expanded, onClick, buttonRef, className = '' }) {
  return (
    <button
      ref={buttonRef}
      type="button"
      className={`${styles.knotButton} ${className}`}
      aria-label={label}
      aria-haspopup="dialog"
      aria-expanded={expanded}
      onClick={onClick}
    >
      <svg viewBox="0 0 30 30" aria-hidden="true" focusable="false">
        <path d="M3,15 C8,15 11,9 16,9 C21.5,9 22.5,16.5 17,18 C11.5,19.5 10,11.5 15.5,10.5 C20,9.7 23,15 27,15" />
      </svg>
    </button>
  );
}

export default function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  // The current page: its link (or its section's link, e.g. /work/… → Work) keeps its knot.
  const isCurrent = (href) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`));
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const opener = useRef(null);

  // Show the floating nav after the first scroll.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > SHOW_NAV_AFTER);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, [pathname]);

  const openMenu = (event) => {
    opener.current = event.currentTarget;
    setMenuOpen(true);
  };
  const closeMenu = () => {
    setMenuOpen(false);
    opener.current?.focus();
  };

  const links = navLinks.map(({ key, href }) => ({ key, href, label: t(`nav.${key}`), current: isCurrent(href) }));

  return (
    <>
      {/* Top of the page: logo, language and the knot button only. */}
      <header className={styles.siteHeader}>
        <div className={`page-container ${styles.topBar}`}>
          <Link href="/" className={styles.brandLink} aria-label={t('ui.homeLink')}>
            <Brand />
          </Link>
          <div className={styles.topTools}>
            <LocaleSwitch />
            <KnotButton label={t('ui.openMenu')} expanded={menuOpen} onClick={openMenu} />
          </div>
        </div>
      </header>

      {/* After the first scroll: the floating pill. */}
      <div
        className={`${styles.floatingNav} ${scrolled ? styles.floatingNavVisible : ''}`}
        inert={!scrolled}
        data-floating-nav
      >
        <div className={styles.pill}>
          {/* The thread that draws the pill's outline as it appears. */}
          <svg className={styles.pillOutline} aria-hidden="true" focusable="false">
            <rect pathLength="1" />
          </svg>

          <Link href="/" className={styles.pillBrand} aria-label={t('ui.homeLink')}>
            <Brand size="small" />
          </Link>

          <nav className={styles.pillNav} aria-label={t('ui.mainNav')}>
            <ul className={styles.navList}>
              {links.map(({ key, href, label, current }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className={styles.navLink}
                    aria-current={current ? 'page' : undefined}
                  >
                    {/* A tiny root that sprouts above the word. */}
                    <svg className={styles.sprout} viewBox="0 0 24 14" aria-hidden="true" focusable="false">
                      <path pathLength="1" d="M12,14 C12,10 11.4,7.5 12,4" />
                      <path pathLength="1" d="M12,9.5 C10.5,7.5 8.5,6.5 5.5,6" />
                      <path pathLength="1" d="M12,7.5 C13.5,5.5 15.5,4.2 18.5,3.6" />
                    </svg>
                    <span>{label}</span>
                    {/* The thread underneath, ending in a knot. */}
                    <span className={styles.underThread} aria-hidden="true">
                      <svg viewBox="0 0 100 6" preserveAspectRatio="none" focusable="false">
                        <path pathLength="1" d="M0,3 C20,0.8 38,5.2 58,3 S86,1.4 100,3" />
                      </svg>
                      <span className={styles.underKnot} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.pillTools}>
            <LocaleSwitch />
            <KnotButton
              className={styles.pillKnot}
              label={t('ui.openMenu')}
              expanded={menuOpen}
              onClick={openMenu}
            />
          </div>
        </div>
      </div>

      <MenuPanel open={menuOpen} onClose={closeMenu} links={links} />
    </>
  );
}
