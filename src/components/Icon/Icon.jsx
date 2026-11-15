/** Thin line icons drawn on a 24×24 grid; stroke follows currentColor. */
const ICON_PATHS = {
  // Services
  landing: 'M4 5h16v14H4z M4 9h16 M12 11.5v4.5 M9.8 14l2.2 2.2 2.2-2.2',
  company: 'M3 20.5h18 M6 20.5V4.5h8v16 M14 10h4.5v10.5 M9 8.5h2 M9 12h2 M9 15.5h2',
  story: 'M12 6.2C10 4.8 7 4.3 4 4.8v13c3-.5 6 0 8 1.4 2-1.4 5-1.9 8-1.4v-13c-3-.5-6 0-8 1.4z M12 6.2v13',
  store: 'M3 4h2.6l2.1 10.4h10.4L20 7.2H6.4 M9 18.4a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z M17 18.4a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z',
  booking: 'M4 6h16v14H4z M4 10.5h16 M8 3.8v4 M16 3.8v4 M8 14.5h2.2 M13.8 14.5H16',
  portal: 'M9 5H6v16h12V5h-3 M9 3.5h6v3H9z M9 11h6 M9 14.5h6 M9 18h3.5',
  systems: 'M4 7h9 M17.5 7H20 M15.2 4.8v4.4 M4 12h2.5 M11 12h9 M8.8 9.8v4.4 M4 17h8 M16.5 17H20 M14.2 14.8v4.4',
  ai: 'M7 7h10v10H7z M10 10h4v4h-4z M9.5 4v3 M14.5 4v3 M9.5 17v3 M14.5 17v3 M4 9.5h3 M4 14.5h3 M17 9.5h3 M17 14.5h3',
  // Why Washeej
  team: 'M8.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M2.5 19c.5-3.2 2.9-5 6-5s5.5 1.8 6 5 M15.5 11a2.6 2.6 0 1 0 0-5.2 M17.3 14.2c2.3.5 3.8 2.1 4.2 4.8',
  rtl: 'M20 6H9 M20 12H4 M20 18h-7 M7.5 15.3L4.3 18l3.2 2.7',
  unique: 'M11 3.5l1.9 5.1 5.1 1.9-5.1 1.9L11 17.5l-1.9-5.1L4 10.5l5.1-1.9z M18.5 15.5v5 M16 18h5',
  fast: 'M13 3L5 13.5h6L10 21l8.5-11H12z',
  screens: 'M3 5h13v9H3z M6.5 18h6 M9.5 14v4 M18 8.5h3.5v11H16V17',
  control: 'M7 4.5h10a3 3 0 0 1 0 6H7a3 3 0 0 1 0-6z M7.2 7.5h.01 M7 13.5h10a3 3 0 0 1 0 6H7a3 3 0 0 1 0-6z M16.8 16.5h.01',
  support: 'M4.5 14v-2a7.5 7.5 0 0 1 15 0v2 M4.5 13.5H7v5H5.5a1 1 0 0 1-1-1z M19.5 13.5H17v5h1.5a1 1 0 0 0 1-1z M19 18.5c0 1.5-1.5 2.5-4 2.5h-2',
  // UI
  whatsapp: 'M12 3.5a8.5 8.5 0 0 0-7.3 12.8L3.5 20.5l4.4-1.1A8.5 8.5 0 1 0 12 3.5z M9.2 8.4c-.6 1.6.1 3.4 1.6 4.9s3.3 2.200 4.900 1.600l.3-1.600-1.800-.9-.9.9c-.9-.4-1.800-1.300-2.200-2.200l.9-.9-.9-1.800z',
  mail: 'M3.5 6h17v12h-17z M3.5 7l8.5 6.5L20.5 7',
  arrow: 'M4 12h15 M13.5 6.5L19 12l-5.5 5.5',
  external: 'M9 5H5v14h14v-4 M13 5h6v6 M19 5l-8.5 8.5',
  chevron: 'M6 9.5l6 6 6-6',
};

export default function Icon({ name, className, size = 24, strokeWidth = 1.4 }) {
  const d = ICON_PATHS[name];
  if (!d) return null;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={d} />
    </svg>
  );
}
