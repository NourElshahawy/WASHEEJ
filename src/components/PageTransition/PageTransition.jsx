'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from '@/i18n/navigation';
import styles from './PageTransition.module.css';

/**
 * A short thread sweep when moving between pages (about half a second).
 * It plays as the new page appears, and never delays navigation.
 * Not shown on the first load, and switched off with reduced motion (CSS).
 */
export default function PageTransition() {
  const pathname = usePathname();
  const first = useRef(true);
  const [sweep, setSweep] = useState(0);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setSweep((count) => count + 1);
  }, [pathname]);

  if (!sweep) return null;

  return (
    // A new key restarts the animation for every navigation.
    <svg key={sweep} className={styles.sweep} viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path pathLength="1" d="M0,20 C160,6 320,34 500,20 S840,6 1000,20" />
      <path pathLength="1" d="M0,24 C170,12 330,36 510,24 S850,12 1000,16" />
      <path pathLength="1" d="M0,16 C150,2 310,30 490,16 S830,2 1000,24" />
    </svg>
  );
}
