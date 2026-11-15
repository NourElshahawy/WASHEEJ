import styles from './LinePreview.module.css';

/**
 * Small line drawings: what each service actually is (Services) and what each
 * promise means (Why Washeej).
 * At rest they sit in their finished state; while the card (any ancestor with
 * `data-preview-host`) is hovered or focused, they play from the start.
 * Motion is CSS-only: transform, opacity and stroke-dashoffset.
 */

const delay = (seconds) => ({ '--delay': `${seconds}s` });

/** Shared browser-window frame for the page previews. */
function BrowserFrame() {
  return (
    <>
      <rect className={styles.line} x="20" y="10" width="160" height="100" rx="7" />
      <path className={styles.line} d="M20,25 H180" />
      <circle className={styles.ink} cx="29" cy="17.5" r="1.7" />
      <circle className={styles.ink} cx="36" cy="17.5" r="1.7" />
      <circle className={styles.ink} cx="43" cy="17.5" r="1.7" />
    </>
  );
}

const PREVIEWS = {
  // A landing page assembling itself: headline, text, button, picture.
  landing: (
    <>
      <BrowserFrame />
      <rect className={`${styles.ink} ${styles.rise}`} style={delay(0.05)} x="31" y="40" width="68" height="7" rx="2" />
      <rect className={`${styles.ink} ${styles.rise}`} style={delay(0.18)} x="31" y="52" width="50" height="7" rx="2" />
      <path className={`${styles.soft} ${styles.rise}`} style={delay(0.32)} d="M31,69 H92 M31,76 H78" />
      <rect className={`${styles.peach} ${styles.pop}`} style={delay(0.62)} x="31" y="87" width="36" height="12" rx="2.5" />
      <rect className={`${styles.peachSoft} ${styles.rise}`} style={delay(0.28)} x="116" y="37" width="52" height="62" rx="4" />
      <path
        className={`${styles.line} ${styles.draw}`}
        style={delay(0.7)}
        pathLength="1"
        d="M123,86 C132,62 146,94 161,50"
      />
    </>
  ),

  // A company site whose content is being updated from a dashboard.
  company: (
    <>
      <BrowserFrame />
      <circle className={styles.line} cx="35" cy="37" r="4.5" />
      <path className={styles.soft} d="M118,37 H132 M140,37 H154 M162,37 H170" />
      <rect className={`${styles.peachSoft} ${styles.rise}`} style={delay(0.05)} x="30" y="47" width="140" height="22" rx="3" />
      <rect className={`${styles.ink} ${styles.growX}`} style={delay(0.75)} x="38" y="55" width="62" height="6" rx="2" />
      <rect className={`${styles.line} ${styles.rise}`} style={delay(0.2)} x="30" y="76" width="42" height="24" rx="3" />
      <rect className={`${styles.line} ${styles.rise}`} style={delay(0.32)} x="79" y="76" width="42" height="24" rx="3" />
      <rect className={`${styles.line} ${styles.rise}`} style={delay(0.44)} x="128" y="76" width="42" height="24" rx="3" />
      <path className={`${styles.soft} ${styles.rise}`} style={delay(0.5)} d="M36,84 H58 M36,91 H50 M85,84 H107 M85,91 H99 M134,84 H156 M134,91 H148" />
    </>
  ),

  // A story told along a thread: chapters appear as the line is drawn.
  story: (
    <>
      <path
        className={`${styles.line} ${styles.draw} ${styles.drawSlow}`}
        pathLength="1"
        d="M12,98 C40,98 42,34 74,34 S104,86 132,86 S160,44 190,26"
      />
      <rect className={`${styles.peachSoft} ${styles.rise}`} style={delay(0.35)} x="58" y="46" width="32" height="22" rx="3" />
      <path className={`${styles.line} ${styles.rise}`} style={delay(0.4)} d="M63,62 L70,54 L76,60 L80,56 L85,62" />
      <rect className={`${styles.peachSoft} ${styles.rise}`} style={delay(0.75)} x="116" y="52" width="32" height="22" rx="3" />
      <circle className={`${styles.line} ${styles.rise}`} style={delay(0.8)} cx="132" cy="63" r="5" />
      <rect className={`${styles.peachSoft} ${styles.rise}`} style={delay(1.1)} x="150" y="54" width="32" height="22" rx="3" />
      <path className={`${styles.line} ${styles.rise}`} style={delay(1.15)} d="M157,69 C161,60 171,60 175,69" />
      <circle className={`${styles.ink} ${styles.pop}`} style={delay(0.3)} cx="74" cy="34" r="3.2" />
      <circle className={`${styles.ink} ${styles.pop}`} style={delay(0.7)} cx="132" cy="86" r="3.2" />
      <circle className={`${styles.ink} ${styles.pop}`} style={delay(1.05)} cx="190" cy="26" r="3.2" />
    </>
  ),

  // A cart filling up with products.
  store: (
    <>
      <rect className={styles.soft} x="38" y="12" width="26" height="26" rx="3" />
      <rect className={styles.soft} x="87" y="12" width="26" height="26" rx="3" />
      <rect className={styles.soft} x="136" y="12" width="26" height="26" rx="3" />
      <path className={styles.soft} d="M30,44 H170" />
      <path className={styles.line} d="M44,62 H58 L68,98 H140 L150,72 H61" />
      <circle className={styles.line} cx="80" cy="107" r="4" />
      <circle className={styles.line} cx="130" cy="107" r="4" />
      <rect className={`${styles.peach} ${styles.drop}`} style={delay(0.1)} x="74" y="77" width="16" height="16" rx="2.5" />
      <rect className={`${styles.peach} ${styles.drop}`} style={delay(0.38)} x="95" y="75" width="16" height="18" rx="2.5" />
      <rect className={`${styles.peach} ${styles.drop}`} style={delay(0.66)} x="116" y="78" width="16" height="15" rx="2.5" />
      <circle className={`${styles.ink} ${styles.pop}`} style={delay(1.05)} cx="156" cy="60" r="9" />
      <g className={styles.keepUpright}>
        <path className={`${styles.onInk} ${styles.pop}`} style={delay(1.15)} d="M151.5,60 L154.8,63.4 L160.6,56.8" />
      </g>
    </>
  ),

  // A calendar getting booked.
  booking: (
    <>
      <rect className={styles.line} x="32" y="16" width="136" height="94" rx="7" />
      <path className={styles.line} d="M32,36 H168 M62,10 V21 M138,10 V21" />
      {[0, 1, 2].flatMap((row) =>
        [0, 1, 2, 3, 4, 5].map((column) => (
          <rect
            key={`${row}-${column}`}
            className={styles.soft}
            x={42 + column * 20}
            y={45 + row * 20}
            width="15"
            height="14"
            rx="2.5"
          />
        )),
      )}
      <rect className={`${styles.peachFill} ${styles.pop}`} style={delay(0.15)} x="62" y="45" width="15" height="14" rx="2.5" />
      <rect className={`${styles.peachFill} ${styles.pop}`} style={delay(0.3)} x="82" y="45" width="15" height="14" rx="2.5" />
      <rect className={`${styles.peachFill} ${styles.pop}`} style={delay(0.45)} x="102" y="45" width="15" height="14" rx="2.5" />
      <rect className={`${styles.peachFill} ${styles.pop}`} style={delay(0.7)} x="42" y="85" width="15" height="14" rx="2.5" />
      <rect className={`${styles.peachFill} ${styles.pop}`} style={delay(0.85)} x="62" y="85" width="15" height="14" rx="2.5" />
      <rect className={`${styles.ink} ${styles.pop}`} style={delay(1.1)} x="122" y="65" width="15" height="14" rx="2.5" />
      <g className={styles.keepUpright}>
        <path className={`${styles.onInk} ${styles.pop}`} style={delay(1.2)} d="M125.8,72 L128.6,74.8 L133.4,69.4" />
      </g>
    </>
  ),

  // A request moving through clear steps, with its reference number.
  portal: (
    <>
      <path className={styles.soft} d="M34,40 H166" />
      <path className={`${styles.line} ${styles.draw} ${styles.drawSlow}`} pathLength="1" d="M34,40 H166" />
      <circle className={styles.paperDisc} cx="34" cy="40" r="9" />
      <circle className={styles.paperDisc} cx="78" cy="40" r="9" />
      <circle className={styles.paperDisc} cx="122" cy="40" r="9" />
      <circle className={styles.paperDisc} cx="166" cy="40" r="9" />
      <circle className={`${styles.ink} ${styles.pop}`} style={delay(0.05)} cx="34" cy="40" r="9" />
      <circle className={`${styles.ink} ${styles.pop}`} style={delay(0.42)} cx="78" cy="40" r="9" />
      <circle className={`${styles.ink} ${styles.pop}`} style={delay(0.8)} cx="122" cy="40" r="9" />
      <circle className={`${styles.peachFill} ${styles.pop}`} style={delay(1.18)} cx="166" cy="40" r="9" />
      <g className={styles.keepUpright}>
        <path className={`${styles.line} ${styles.pop}`} style={delay(1.28)} d="M161.6,40 L164.8,43.2 L170.6,36.6" />
      </g>
      <rect className={`${styles.line} ${styles.rise}`} style={delay(0.2)} x="50" y="70" width="100" height="30" rx="5" />
      <g className={styles.keepUpright}>
        <path className={`${styles.line} ${styles.rise}`} style={delay(0.3)} d="M62,79 L60,91 M68,79 L66,91 M58,83 H70 M57,87.5 H69" />
      </g>
      <rect className={`${styles.ink} ${styles.growX}`} style={delay(0.55)} x="80" y="79" width="56" height="5" rx="2" />
      <path className={`${styles.soft} ${styles.rise}`} style={delay(0.7)} d="M80,91 H120" />
    </>
  ),

  // A dashboard chart drawing itself.
  systems: (
    <>
      <path className={styles.line} d="M28,16 V100 H178" />
      <path className={styles.soft} d="M28,72 H178 M28,44 H178" />
      <rect className={`${styles.peach} ${styles.growY}`} style={delay(0.05)} x="42" y="68" width="17" height="32" rx="2" />
      <rect className={`${styles.peach} ${styles.growY}`} style={delay(0.17)} x="69" y="54" width="17" height="46" rx="2" />
      <rect className={`${styles.peach} ${styles.growY}`} style={delay(0.29)} x="96" y="62" width="17" height="38" rx="2" />
      <rect className={`${styles.peach} ${styles.growY}`} style={delay(0.41)} x="123" y="40" width="17" height="60" rx="2" />
      <rect className={`${styles.peach} ${styles.growY}`} style={delay(0.53)} x="150" y="26" width="17" height="74" rx="2" />
      <path
        className={`${styles.line} ${styles.heavy} ${styles.draw}`}
        style={delay(0.7)}
        pathLength="1"
        d="M50,58 L77,44 L104,50 L131,30 L158,17"
      />
      <circle className={`${styles.ink} ${styles.pop}`} style={delay(1.35)} cx="158" cy="17" r="3.6" />
    </>
  ),

  // A question, a moment of thinking, then the answer.
  ai: (
    <>
      <rect className={`${styles.line} ${styles.rise}`} style={delay(0)} x="78" y="12" width="98" height="27" rx="11" />
      <path className={`${styles.soft} ${styles.rise}`} style={delay(0.1)} d="M92,22 H160 M92,30 H140" />
      <rect className={`${styles.peachSoft} ${styles.rise}`} style={delay(0.4)} x="24" y="50" width="124" height="56" rx="12" />
      <circle className={`${styles.ink} ${styles.typing}`} style={delay(0.55)} cx="44" cy="78" r="2.8" />
      <circle className={`${styles.ink} ${styles.typing}`} style={delay(0.67)} cx="55" cy="78" r="2.8" />
      <circle className={`${styles.ink} ${styles.typing}`} style={delay(0.79)} cx="66" cy="78" r="2.8" />
      <rect className={`${styles.ink} ${styles.growX}`} style={delay(1.35)} x="38" y="63" width="94" height="5" rx="2" />
      <rect className={`${styles.ink} ${styles.growX}`} style={delay(1.5)} x="38" y="75.5" width="78" height="5" rx="2" />
      <rect className={`${styles.ink} ${styles.growX}`} style={delay(1.65)} x="38" y="88" width="54" height="5" rx="2" />
      <path
        className={`${styles.ink} ${styles.pop}`}
        style={delay(1.2)}
        d="M164,56 L166.6,63.4 L174,66 L166.6,68.6 L164,76 L161.4,68.6 L154,66 L161.4,63.4 Z"
      />
    </>
  ),

  // ---------------- Why Washeej ----------------

  // One team: a single thread runs through everyone and ties off in one knot.
  team: (
    <>
      <circle className={`${styles.peachSoft} ${styles.pop}`} style={delay(0.05)} cx="40" cy="32" r="11" />
      <circle className={`${styles.peachSoft} ${styles.pop}`} style={delay(0.2)} cx="100" cy="32" r="11" />
      <circle className={`${styles.peachSoft} ${styles.pop}`} style={delay(0.35)} cx="160" cy="32" r="11" />
      <path
        className={`${styles.line} ${styles.draw} ${styles.drawSlow}`}
        style={delay(0.3)}
        pathLength="1"
        d="M40,43 C40,78 100,58 100,92 C100,58 160,78 160,43"
      />
      <path
        className={`${styles.line} ${styles.draw}`}
        style={delay(1.2)}
        pathLength="1"
        d="M100,92 C90,104 110,110 104,98 C100,90 92,96 100,102"
      />
      <circle className={`${styles.ink} ${styles.pop}`} style={delay(1.3)} cx="100" cy="92" r="3.6" />
    </>
  ),

  // Native Arabic: lines start at the right, and the arrow runs right-to-left.
  rtl: (
    <>
      <path className={styles.soft} d="M178,20 V72" />
      <rect className={`${styles.ink} ${styles.growXEnd}`} style={delay(0.05)} x="66" y="26" width="104" height="7" rx="2" />
      <rect className={`${styles.ink} ${styles.growXEnd}`} style={delay(0.2)} x="96" y="42" width="74" height="7" rx="2" />
      <rect className={`${styles.peach} ${styles.growXEnd}`} style={delay(0.35)} x="82" y="58" width="88" height="7" rx="2" />
      <path className={`${styles.line} ${styles.heavy} ${styles.draw}`} style={delay(0.6)} pathLength="1" d="M172,94 H34" />
      <path className={`${styles.line} ${styles.heavy} ${styles.pop}`} style={delay(1.2)} d="M47,83 L33,94 L47,105" />
    </>
  ),

  // Not a template: identical dashed boxes, and one piece that is clearly its own.
  unique: (
    <>
      <rect className={styles.dashed} x="20" y="38" width="36" height="50" rx="4" />
      <rect className={styles.dashed} x="64" y="38" width="36" height="50" rx="4" />
      <rect className={styles.dashed} x="108" y="38" width="36" height="50" rx="4" />
      <g className={styles.pop} style={delay(0.15)}>
        <rect className={styles.peachSoft} x="147" y="24" width="40" height="62" rx="7" transform="rotate(-7 167 55)" />
        <path
          className={`${styles.line} ${styles.draw}`}
          style={delay(0.55)}
          pathLength="1"
          d="M154,72 C160,44 172,78 181,40"
        />
      </g>
      <path
        className={`${styles.ink} ${styles.pop}`}
        style={delay(0.9)}
        d="M150,4 L152,10 L158,12 L152,14 L150,20 L148,14 L142,12 L148,10 Z"
      />
    </>
  ),

  // Fast: one quick stroke.
  fast: (
    <>
      <path className={`${styles.soft} ${styles.rise}`} style={delay(0)} d="M22,58 H54 M34,72 H72 M18,100 H46" />
      <path
        className={`${styles.line} ${styles.heavy} ${styles.draw} ${styles.drawFast}`}
        style={delay(0.15)}
        pathLength="1"
        d="M18,88 C72,88 98,72 122,52 S166,24 184,22"
      />
      <circle className={`${styles.ink} ${styles.pop}`} style={delay(0.45)} cx="184" cy="22" r="4.2" />
      <path className={`${styles.line} ${styles.pop}`} style={delay(0.55)} d="M170,40 L176,34 M186,38 L190,32 M172,12 L176,16" />
    </>
  ),

  // Every screen: desktop, tablet and phone outlines.
  screens: (
    <>
      <g className={styles.rise} style={delay(0.05)}>
        <rect className={styles.line} x="20" y="20" width="96" height="62" rx="5" />
        <path className={styles.line} d="M56,98 H80 M68,82 V98" />
        <rect className={styles.peachSoft} x="30" y="30" width="34" height="24" rx="3" />
        <path className={styles.soft} d="M72,34 H106 M72,42 H98 M30,64 H106 M30,72 H86" />
      </g>
      <g className={styles.rise} style={delay(0.3)}>
        <rect className={styles.paperCard} x="120" y="38" width="38" height="52" rx="5" />
        <rect className={styles.peachSoft} x="126" y="45" width="26" height="16" rx="2.5" />
        <path className={styles.soft} d="M126,69 H152 M126,77 H144" />
      </g>
      <g className={styles.rise} style={delay(0.55)}>
        <rect className={styles.paperCard} x="162" y="54" width="22" height="40" rx="5" />
        <rect className={styles.peachSoft} x="166.5" y="60" width="13" height="10" rx="2" />
        <path className={styles.soft} d="M166.5,77 H179.5 M166.5,84 H175" />
      </g>
    </>
  ),

  // You're in control: sliders and a switch you set yourself.
  control: (
    <>
      <path className={styles.soft} d="M28,30 H172 M28,60 H172" />
      <path className={`${styles.line} ${styles.heavy} ${styles.draw}`} style={delay(0.05)} pathLength="1" d="M28,30 H112" />
      <circle className={`${styles.peachFill} ${styles.slide}`} style={{ ...delay(0.05), '--from': '-70px' }} cx="112" cy="30" r="8.5" />
      <path className={`${styles.line} ${styles.heavy} ${styles.draw}`} style={delay(0.3)} pathLength="1" d="M28,60 H146" />
      <circle className={`${styles.peachFill} ${styles.slide}`} style={{ ...delay(0.3), '--from': '-100px' }} cx="146" cy="60" r="8.5" />
      <rect className={styles.peachSoft} x="28" y="84" width="38" height="20" rx="10" />
      <circle className={`${styles.ink} ${styles.slide}`} style={{ ...delay(0.6), '--from': '-18px' }} cx="56" cy="94" r="6.5" />
      <path className={`${styles.soft} ${styles.rise}`} style={delay(0.7)} d="M78,90 H140 M78,99 H118" />
    </>
  ),

  // With you after launch: the site is live, and a hand keeps hold of the thread.
  support: (
    <>
      <rect className={styles.line} x="14" y="36" width="50" height="40" rx="5" />
      <path className={styles.line} d="M14,46 H64" />
      <path className={styles.soft} d="M22,56 H56 M22,64 H46" />
      <circle className={`${styles.ink} ${styles.pop}`} style={delay(0.05)} cx="64" cy="60" r="3.4" />
      <path
        className={`${styles.line} ${styles.draw} ${styles.drawSlow}`}
        style={delay(0.15)}
        pathLength="1"
        d="M64,60 C86,60 92,88 114,84 S136,58 150,62"
      />
      <g className={styles.rise} style={delay(0.9)}>
        <path
          className={styles.peachSoft}
          d="M150,48 C150,42 156,40 160,42 L176,42 C184,42 188,48 188,56 L188,74 C188,84 182,90 172,90 L160,90 C152,90 148,84 148,76 Z"
        />
        <path className={styles.line} d="M148,58 H170 M148,68 H172 M148,78 H168" />
        <path className={styles.line} d="M158,42 C156,32 172,30 172,42" />
      </g>
    </>
  ),
};

// Drawings that describe a direction and must not be mirrored in Arabic.
const NEVER_MIRRORED = new Set(['rtl']);

export default function LinePreview({ name }) {
  const drawing = PREVIEWS[name];
  if (!drawing) return null;

  return (
    <svg
      className={`${styles.previewSvg} ${NEVER_MIRRORED.has(name) ? styles.neverMirrored : ''}`}
      viewBox="0 0 200 120" aria-hidden="true" focusable="false">
      {drawing}
    </svg>
  );
}
