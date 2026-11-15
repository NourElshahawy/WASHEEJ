import { createRandom } from '@/lib/thread/bundle';
import styles from './TornEdge.module.css';

/**
 * A torn-paper edge. Placed at the bottom of a section, it makes the paper of
 * the next section look torn across it instead of meeting it in a straight line.
 * Two layers: soft peach fibres just above the tear, then the paper itself.
 * The shape is generated once from a fixed seed (same on server and client).
 */

const WIDTH = 1440;
const HEIGHT = 40;

/** Jagged top edge across the width; the shape is filled from there down. */
function tornPath(seed, { top, roughness }) {
  const random = createRandom(seed);
  let d = `M0,${HEIGHT} L0,${top}`;
  let x = 0;
  let drift = 0;
  while (x < WIDTH) {
    x = Math.min(WIDTH, x + 5 + random() * 15);
    drift = Math.max(-1, Math.min(1, drift + (random() - 0.5) * 0.8)); // slow wander
    const y = top + drift * roughness * 0.6 + (random() - 0.5) * roughness;
    d += ` L${x.toFixed(1)},${Math.max(1, y).toFixed(1)}`;
  }
  return `${d} L${WIDTH},${HEIGHT} Z`;
}

const FIBRES = tornPath(17, { top: 13, roughness: 13 });
const PAPER = tornPath(5, { top: 20, roughness: 14 });

export default function TornEdge() {
  return (
    <svg
      className={styles.tornEdge}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path className={styles.fibres} d={FIBRES} />
      <path className={styles.paper} d={PAPER} />
    </svg>
  );
}
