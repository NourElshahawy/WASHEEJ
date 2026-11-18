/**
 * Pass-through root layout. The real document (<html lang dir>, fonts,
 * header, footer) is in [locale]/layout.jsx.
 *
 * It exists so that [locale] is a nested segment: that makes
 * [locale]/not-found.jsx a real boundary, and a 404 (unknown project,
 * unknown path) is rendered on the server inside the localized layout —
 * with the right lang/dir — instead of Next's bare error shell.
 */
export default function RootLayout({ children }) {
  return children;
}
