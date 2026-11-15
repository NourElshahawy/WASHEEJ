import { THREAD_LINE } from './draw';

/**
 * The route of the traveling thread, measured from the real page layout.
 *
 * The thread is built in "pieces", one per section. Each piece has its own
 * waypoints and scroll range, so it is drawn while its section passes through
 * the viewport:
 *
 *   { key, trigger, start, end, endTrigger?, tone?, taperStart?, taperEnd?, points: [{ x, y, w, mark? }] }
 *
 * Two pieces that meet share exactly the same point and width, so they join
 * without a seam. A piece that has nothing to join (before/after a pinned
 * section) tapers off instead of stopping dead.
 *
 * Everything is expressed with "start side" / "end side" helpers, so Arabic
 * (start = right) and English (start = left) get mirror-image routes.
 *
 * Services and Work are pinned while they play, so they carry their own piece
 * of thread inside the pinned element (see buildServicesRoute and WorkRail).
 */

/** Layout box of an element relative to root, ignoring CSS transforms. */
export function layoutBox(element, root) {
  let left = 0;
  let top = 0;
  let node = element;
  while (node && node !== root) {
    left += node.offsetLeft;
    top += node.offsetTop;
    node = node.offsetParent;
  }
  const width = element.offsetWidth;
  const height = element.offsetHeight;
  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    cx: left + width / 2,
    cy: top + height / 2,
  };
}

/** Groups boxes (already in reading order) into visual rows. */
function toRows(boxes) {
  const rows = [];
  boxes.forEach((box) => {
    const row = rows[rows.length - 1];
    if (row && Math.abs(row[0].top - box.top) < 12) row.push(box);
    else rows.push([box]);
  });
  return rows;
}

const point = (x, y, w, extra) => ({ x, y, w, ...extra });

/** Shared measurements: gutters, direction helpers and the About knot. */
function frame(main, isRtl, mobile) {
  const container = main.querySelector('.page-container');
  const width = main.offsetWidth;
  const gutter = layoutBox(container, main).left + parseFloat(getComputedStyle(container).paddingLeft);
  const dir = isRtl ? -1 : 1; // +dir points toward the inline-end side
  const toStart = -dir;
  const startGutter = isRtl ? width - gutter / 2 : gutter / 2;
  const endGutter = width - startGutter;
  const lane = mobile ? 4 : 9; // bundle half-width when it simply travels
  const sway = Math.min(mobile ? 3 : 9, gutter * 0.2);

  /** Points for a run down a gutter, with a slight side-to-side sway. */
  const runDown = (x, fromY, toY, w = lane) => {
    const points = [];
    // Fixed spacing from the top: if the run gets longer (an FAQ answer opening),
    // it only grows at its end and the part above does not move.
    for (let k = 1; fromY + k * 230 < toY - 110; k += 1) {
      points.push(point(x + (k % 2 ? sway : -sway), fromY + k * 230, w));
    }
    return points;
  };

  // The About knot: a ring in the empty half that the two bundles wind around
  // in opposite directions.
  const space = layoutBox(main.querySelector('[data-thread-space]'), main);
  const ry = Math.min(space.height * 0.4, space.width * 0.19);
  const rx = ry;
  const cx = space.cx + dir * space.width * (mobile ? 0 : 0.07);
  const cy = space.cy;
  const farX = cx + toStart * rx * 2.15;
  const exitX = mobile ? startGutter : isRtl ? Math.min(farX, space.right - 12) : Math.max(farX, space.left + 12);

  return {
    width,
    gutter,
    dir,
    toStart,
    startGutter,
    endGutter,
    lane,
    runDown,
    knot: { space, cx, cy, rx, ry, exitX, wide: mobile ? ry * 0.3 : Math.min(26, ry * 0.26) },
    startOf: (b) => (isRtl ? b.right : b.left),
    endOf: (b) => (isRtl ? b.left : b.right),
    fromEndEdge: (fraction) => (isRtl ? width * fraction : width * (1 - fraction)),
  };
}

export function buildRoute({ main, isRtl, mobile }) {
  const find = (selector) => main.querySelector(selector);
  const findAll = (selector) => [...main.querySelectorAll(selector)];
  const box = (element) => layoutBox(element, main);
  const { width, gutter, dir, toStart, startGutter, endGutter, lane, runDown, knot, startOf, endOf, fromEndEdge } = frame(
    main,
    isRtl,
    mobile,
  );

  const section = (name) => find(`[data-thread="${name}"]`);
  const hero = box(section('hero'));
  const about = box(section('about'));
  const why = box(section('why'));
  const process = box(section('process'));
  const sectors = box(section('sectors'));
  const testimonials = box(section('testimonials'));
  const faq = box(section('faq'));

  const pieces = [];
  const lastPoint = () => {
    const { points } = pieces[pieces.length - 1];
    return points[points.length - 1];
  };
  // Each piece starts a little before the previous one has finished, so a joint
  // is always covered by the soft tip of the next piece.
  const range = (name) => ({ trigger: section(name), start: 'top 97%', end: `bottom ${THREAD_LINE}` });

  // ------------------------------------------------------------------
  // Lead: the thread grows out of the hero roots, slips into the gutter
  // (clear of the hero strip) and runs down to About.
  // ------------------------------------------------------------------
  {
    const art = box(find('[data-hero-art]'));
    const rootsY = mobile ? art.bottom - 24 : hero.bottom - 205;
    pieces.push({
      key: 'lead',
      trigger: section('hero'),
      start: 0,
      endTrigger: section('about'),
      end: `top ${THREAD_LINE}`,
      taperStart: true,
      points: [
        point(fromEndEdge(mobile ? 0.3 : 0.2), rootsY, 2),
        point(fromEndEdge(mobile ? 0.16 : 0.11), rootsY + (mobile ? 26 : 34), 4),
        point(endGutter - dir * 4, rootsY + (mobile ? 70 : 104), lane - 1),
        point(endGutter, rootsY + (mobile ? 130 : 190), lane),
        ...runDown(endGutter, rootsY + (mobile ? 130 : 190), about.top),
        point(endGutter, about.top, lane),
      ],
    });
  }

  // ------------------------------------------------------------------
  // About: two bundles tie into one knot.
  //   A (the brand) arrives from above — it is the traveling thread itself.
  //   B (the customers) comes in from the side of the page.
  // They meet at the ring and wind around it one and a half times in opposite
  // directions, crossing each other on every pass, then leave together;
  // B thins out along A.
  // ------------------------------------------------------------------
  {
    const { cx, cy, rx: r, exitX, wide } = knot;
    const at = (ux, uy, w) => point(cx + toStart * ux * r, cy + uy * r, w);
    const pageEdge = isRtl ? -40 : width + 40;

    /** Points around the ring from the end-side point, `turns` times (the sign sets the direction). */
    const wind = (turns) => {
      const steps = Math.round(Math.abs(turns) * 10);
      const points = [];
      for (let k = 0; k <= steps; k += 1) {
        const done = (Math.abs(turns) * k) / steps; // turns so far
        const theta = Math.PI + Math.sign(turns) * done * Math.PI * 2;
        const radius = 1 - 0.09 * done; // each pass sits a little inside the last
        const onSide = Math.abs(Math.cos(theta)) > 0.98; // where the bundles cross
        points.push(at(Math.cos(theta) * radius, Math.sin(theta) * radius, onSide ? wide * 0.55 : wide));
      }
      return points;
    };

    const afterKnot = mobile
      ? [
          at(1.5, -0.4, wide * 0.7),
          point(startGutter + dir * 12, cy + r * 0.5, lane + 1),
          point(startGutter, knot.space.bottom + 14, lane),
          ...runDown(startGutter, knot.space.bottom + 14, about.bottom),
        ]
      : [at(1.42, -0.55, wide * 0.7), at(1.9, -0.32, wide * 0.7), point(exitX, cy + r * 0.6, lane + 2)];

    pieces.push({
      key: 'about',
      ...range('about'),
      smooth: 1,
      points: [
        lastPoint(),
        point(endGutter + toStart * 10, cy - r * 1.25, lane + 1),
        at(-1.6, -0.72, wide * 0.7),
        ...wind(-1.5), // down and around: under first
        ...afterKnot,
        point(exitX, about.bottom, lane),
      ],
    });

    pieces.push({
      key: 'about-b',
      ...range('about'),
      tone: 'peach',
      strandsScale: 0.75,
      taperEnd: true,
      smooth: 1,
      points: [
        point(pageEdge, cy + r * 0.98, wide * 0.8),
        at(-1.95, 0.86, wide * 0.8),
        at(-1.5, 0.55, wide * 0.6),
        ...wind(1.5), // up and around: over first
        at(1.4, 0.6, wide * 0.6),
        ...(mobile
          ? [point(startGutter + dir * 10, cy + r * 1.05, lane), point(startGutter, knot.space.bottom + 60, 2)]
          : [point(exitX + dir * 8, cy + r * 1.05, wide * 0.4), point(exitX, Math.min(about.bottom, cy + r * 1.9), 3)]),
      ],
    });
  }

  // (Services and Work carry their own thread while they are pinned.)

  // ------------------------------------------------------------------
  // Why Washeej: a gentle wave through the centre of every card, in reading
  // order. Each centre is a mark: the knot that blooms into that card.
  // ------------------------------------------------------------------
  {
    const cards = findAll('[data-why-card]').map(box);
    if (mobile) {
      pieces.push({
        key: 'why',
        ...range('why'),
        taperStart: true,
        points: [point(endGutter, why.top + 10, lane), ...runDown(endGutter, why.top + 10, why.bottom), point(endGutter, why.bottom, lane)],
      });
    } else {
      const rows = toRows(cards);
      const first = rows[0][0];
      const points = [
        point(startGutter, why.top + 24, lane - 1),
        ...runDown(startGutter, why.top + 24, first.cy - 70, lane - 1),
        point(startGutter, first.cy - 70, lane - 1),
        point(startGutter + dir * 10, first.cy - 16, lane - 1),
      ];

      let index = 0;
      let exit;
      rows.forEach((row, rowIndex) => {
        const rowY = row[0].cy;
        row.forEach((card, i) => {
          if (i > 0) points.push(point((endOf(row[i - 1]) + startOf(card)) / 2, rowY + (index % 2 ? 7 : -7), lane));
          points.push(point(card.cx, rowY + (index % 2 ? -9 : 9), lane + 1, { mark: `card-${index}`, knot: true }));
          index += 1;
        });

        const next = rows[rowIndex + 1];
        const lastCard = row[row.length - 1];
        if (next) {
          // Out past the row, back along the gap underneath, and down into the next row.
          const gapY = (lastCard.bottom + next[0].top) / 2;
          const outX = endOf(lastCard) + dir * 30;
          const backX = startOf(next[0]) - dir * 44;
          points.push(
            point(outX, rowY + 14, lane - 2),
            point(outX, (rowY + gapY) / 2 + 30, lane - 3),
            point(outX - dir * 60, gapY, lane - 4),
            point((outX + backX) / 2, gapY, lane - 4),
            point(backX + dir * 60, gapY, lane - 4),
            point(backX, (gapY + next[0].cy) / 2 - 20, lane - 3),
            point(backX + dir * 14, next[0].cy - 8, lane - 2),
          );
        } else {
          const outX = Math.min(Math.max(endOf(lastCard) + dir * 90, gutter * 0.5), width - gutter * 0.5);
          points.push(point(outX - dir * 30, rowY + 10, lane - 1), point(outX, rowY + 70, lane - 1), point(outX, why.bottom, lane - 1));
          exit = outX;
        }
      });
      if (exit === undefined) exit = endGutter;

      pieces.push({ key: 'why', ...range('why'), taperStart: true, points });
    }
  }

  // ------------------------------------------------------------------
  // Process: the thread is the timeline. It runs through the four markers in
  // reading order; each marker is a mark, so the step lights up on arrival.
  // ------------------------------------------------------------------
  {
    const markers = findAll('[data-process-marker]').map(box);
    const stacked = markers[1].top > markers[0].top + 10;
    const from = lastPoint();
    const points = [from];

    if (stacked) {
      const railX = markers[0].cx;
      points.push(point((from.x + railX) / 2, process.top + 26, lane), point(railX, markers[0].top - 30, lane));
      markers.forEach((marker, i) => {
        if (i > 0) points.push(point(railX + (i % 2 ? 3 : -3), (markers[i - 1].cy + marker.cy) / 2, lane));
        points.push(point(railX, marker.cy, lane, { mark: `step-${i}` }));
      });
      points.push(
        point(railX, process.bottom - 60, lane),
        point((railX + endGutter) / 2, process.bottom - 22, lane),
        point(endGutter, process.bottom, lane),
      );
    } else {
      const railY = markers[0].cy;
      const firstX = markers[0].cx;
      points.push(
        point(from.x + toStart * 70, process.top + 40, lane),
        point((from.x + startGutter) / 2, process.top + 46, lane),
        point(startGutter + dir * 80, process.top + 44, lane),
        point(startGutter, process.top + 120, lane - 1),
        ...runDown(startGutter, process.top + 120, railY - 80, lane - 1),
        point(startGutter, railY - 80, lane - 1),
        point(startGutter + dir * 8, railY - 22, lane - 1),
        point(firstX, railY, lane, { mark: 'step-0' }),
      );
      markers.slice(1).forEach((marker, i) => {
        points.push(point((markers[i].cx + marker.cx) / 2, railY + (i % 2 ? -5 : 5), lane + 1));
        points.push(point(marker.cx, railY, lane, { mark: `step-${i + 1}` }));
      });
      const lastMarker = markers[markers.length - 1];
      points.push(
        point((lastMarker.cx + endGutter) / 2, railY + 6, lane),
        point(endGutter - dir * 10, railY + 34, lane - 1),
        point(endGutter, railY + 110, lane - 1),
        ...runDown(endGutter, railY + 110, process.bottom, lane - 1),
        point(endGutter, process.bottom, lane - 1),
      );
    }
    pieces.push({ key: 'process', ...range('process'), points });
  }

  // ------------------------------------------------------------------
  // Sectors: the bundle passes down the side (the chips hang from their own threads).
  // ------------------------------------------------------------------
  pieces.push({
    key: 'sectors',
    ...range('sectors'),
    points: [lastPoint(), ...runDown(endGutter, sectors.top, sectors.bottom, lane - 1), point(endGutter, sectors.bottom, lane - 1)],
  });

  // ------------------------------------------------------------------
  // Testimonials: across the line the three source knots hang from.
  // ------------------------------------------------------------------
  {
    const line = find('[data-thread-anchor="testimonials-line"]');
    if (mobile || !line) {
      pieces.push({
        key: 'testimonials',
        ...range('testimonials'),
        points: [lastPoint(), ...runDown(endGutter, testimonials.top, testimonials.bottom), point(endGutter, testimonials.bottom, lane - 1)],
      });
    } else {
      const lineBox = box(line);
      const y = lineBox.cy;
      const across = [];
      for (let k = 1; k < 6; k += 1) {
        across.push(point(endOf(lineBox) - (dir * lineBox.width * k) / 6, y + (k % 2 ? 4 : -4), lane - 2));
      }
      pieces.push({
        key: 'testimonials',
        ...range('testimonials'),
        points: [
          lastPoint(),
          ...runDown(endGutter, testimonials.top, y - 110, lane - 1),
          point(endGutter, y - 110, lane - 1),
          point(endGutter - dir * 12, y - 30, lane - 2),
          point(endOf(lineBox) - dir * 50, y, lane - 2),
          ...across,
          point(startOf(lineBox) + dir * 50, y, lane - 2),
          point(startGutter + dir * 12, y + 30, lane - 2),
          point(startGutter, y + 110, lane - 1),
          point(startGutter, testimonials.bottom, lane - 1),
        ],
      });
    }
  }

  // ------------------------------------------------------------------
  // FAQ: down the outer side of the section, never over the questions. Under
  // the section's content (in its bottom padding) it sweeps across to where the
  // CTA's own strands come in from above.
  // ------------------------------------------------------------------
  {
    const stage = main.querySelector('[data-knot-stage]');
    const knotX = stage ? box(stage).cx : width / 2;
    const from = lastPoint();
    // The turn happens inside the section's bottom padding, below the last element.
    const padding = parseFloat(getComputedStyle(section('faq')).paddingBottom) || 60;
    const turnY = faq.bottom - Math.min(padding * 0.8, 80);
    pieces.push({
      key: 'faq',
      ...range('faq'),
      points: [
        from,
        ...runDown(from.x, faq.top, turnY - 40),
        point(from.x, turnY - 40, lane),
        point(from.x + Math.sign(knotX - from.x) * 46, turnY + (faq.bottom - turnY) * 0.45, lane),
        point((from.x + knotX) / 2, turnY + (faq.bottom - turnY) * 0.6, lane),
        point(knotX - Math.sign(knotX - from.x) * 60, turnY + (faq.bottom - turnY) * 0.6, lane),
        point(knotX, faq.bottom, lane),
      ],
    });
  }

  return pieces;
}

/**
 * The thread inside the Services section, in coordinates relative to `root`
 * (the element that gets pinned). Returns { lead, lane }:
 *   lead — from the top of the section (where About's thread ends) to the
 *          start of the lane between the two rows of cards;
 *   lane — through that lane, then down the far gutter, thinning out.
 * On mobile there is only `lead`: one run down the side.
 */
export function buildServicesRoute({ root, isRtl, mobile }) {
  const main = root.closest('main');
  const { dir, startGutter, endGutter, lane, runDown, knot, startOf, endOf } = frame(main, isRtl, mobile);
  const box = (element) => layoutBox(element, root);
  const height = root.offsetHeight;
  const entryX = knot.exitX;

  const grid = root.querySelector('[data-service-grid]');
  const gridBox = box(grid);
  const rows = toRows([...root.querySelectorAll('[data-service-card]')].map(box));

  if (mobile || rows.length < 2) {
    return {
      lead: {
        taperEnd: true,
        points: [point(entryX, 0, lane), ...runDown(entryX, 0, height), point(entryX, height, lane)],
      },
      lane: null,
    };
  }

  const laneY = (rows[0][0].bottom + rows[1][0].top) / 2;
  const amplitude = Math.min(9, (rows[1][0].top - rows[0][0].bottom) * 0.2);
  const laneStart = startOf(gridBox) + dir * 40;

  const across = [];
  for (let k = 1; k < 8; k += 1) {
    across.push(point(startOf(gridBox) + (dir * gridBox.width * k) / 8, laneY + (k % 2 ? -amplitude : amplitude), lane + (k % 2)));
  }

  return {
    lead: {
      points: [
        point(entryX, 0, lane),
        point(entryX - dir * 60, 46, lane),
        point((entryX + startGutter) / 2, 54, lane),
        point(startGutter + dir * 90, 54, lane),
        point(startGutter, 140, lane - 1),
        ...runDown(startGutter, 140, laneY - 90, lane - 1),
        point(startGutter, laneY - 90, lane - 1),
        point(startGutter + dir * 10, laneY - 24, lane - 1),
        point(laneStart, laneY, lane),
      ],
    },
    lane: {
      taperEnd: true,
      points: [
        point(laneStart, laneY, lane),
        ...across,
        point(endOf(gridBox) - dir * 30, laneY, lane),
        point(endGutter - dir * 10, laneY + 30, lane - 1),
        point(endGutter, laneY + 110, lane - 1),
        ...runDown(endGutter, laneY + 110, height, lane - 1),
        point(endGutter, height, lane - 1),
      ],
    },
  };
}
