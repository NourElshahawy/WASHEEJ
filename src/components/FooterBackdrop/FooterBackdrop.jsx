'use client';

import { useMemo } from 'react';
import { generateRoots } from '@/lib/roots/generateRoots';
import { useIdleReady } from '@/lib/useIdleReady';
import styles from './FooterBackdrop.module.css';

/**
 * Background of the footer: faint, large roots spreading down from the torn
 * edge, behind the content. (The paper grain is a CSS texture on the footer.)
 * Purely decorative, so it is generated in the browser once the page is idle:
 * it adds nothing to the HTML or to the first layout.
 */

const DOWN = Math.PI / 2;

const ROOT_CONFIG = {
  seed: 47,
  density: 0.9,
  roots: [
    {
      start: [1210, -20],
      angle: DOWN + 0.5,
      length: 1250,
      waypoints: [
        [940, 250],
        [470, 420],
        [40, 540],
      ],
    },
    {
      start: [250, -20],
      angle: DOWN - 0.45,
      length: 900,
      waypoints: [
        [520, 230],
        [1000, 430],
      ],
    },
    { start: [760, -20], angle: DOWN + 0.1, length: 480, waypoints: [[700, 460]] },
  ],
};

function RootBranch({ node }) {
  return (
    <>
      <path d={node.d} strokeWidth={node.width * 2.6} />
      {node.children.map((child) => (
        <RootBranch key={child.id} node={child} />
      ))}
    </>
  );
}

export default function FooterBackdrop() {
  const ready = useIdleReady(6);
  const roots = useMemo(() => (ready ? generateRoots(ROOT_CONFIG) : []), [ready]);

  return (
    <svg
      className={styles.footerBackdrop}
      viewBox="0 0 1440 560"
      preserveAspectRatio="xMidYMin slice"
      aria-hidden="true"
      focusable="false"
    >
      {roots.map(({ tree }) => (
        <RootBranch key={tree.id} node={tree} />
      ))}
    </svg>
  );
}
