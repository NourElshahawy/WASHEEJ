import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');

/**
 * Content-Security-Policy, in REPORT-ONLY mode: browsers log what would be
 * blocked, nothing is blocked. Watch the console (and later a report
 * endpoint) before switching to an enforcing Content-Security-Policy.
 *  - 'unsafe-inline' scripts: Next.js inline bootstrap + the loader script
 *  - api.web3forms.com: the contact form
 *  - /_vercel/insights (same origin) + va.vercel-scripts.com: Vercel Web Analytics
 *  - GSAP and Lenis need nothing extra (no eval, no external requests)
 */
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.web3forms.com https://va.vercel-scripts.com",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://api.web3forms.com",
  "frame-ancestors 'self'",
].join('; ');

const SECURITY_HEADERS = [
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // The site uses none of these browser features.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()' },
  { key: 'Content-Security-Policy-Report-Only', value: CSP_REPORT_ONLY },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Optimized images are immutable per URL (the source files are versioned by
    // their path), so /_next/image results can be cached for a year instead of
    // being revalidated on every visit.
    minimumCacheTTL: 31536000,
  },
  async headers() {
    return [{ source: '/:path*', headers: SECURITY_HEADERS }];
  },
  async redirects() {
    const moved = {
      'tableware-store': 'gd-tableware',
      'kids-clothing-store': 'dudu-kids',
      'bakery-shop': 'lovan',
      'hara-oven-pizza': 'papajohns-redesign',
      'waraqa-tea': 'ahmed-tea-redesign',
    };
    // Paths without a language go to Arabic, the default (and only) entry point.
    // Permanent, since the site never picks a language per visitor (localeDetection: false).
    const unprefixed = ['/work', '/services', '/about', '/contact', '/faq', '/privacy'];
    return [
      { source: '/', destination: '/ar', permanent: true },
      ...unprefixed.map((path) => ({ source: path, destination: `/ar${path}`, permanent: true })),
      // Project pages moved to the slugs in src/data/projects.json.
      ...Object.entries(moved).map(([from, to]) => ({
        source: `/:locale(ar|en)/work/${from}`,
        destination: `/:locale/work/${to}`,
        permanent: true,
      })),
      // Demos that are no longer in the portfolio: their visitors land on all the work.
      ...['rakaez-engineering', 'wasan-suites'].map((from) => ({
        source: `/:locale(ar|en)/work/${from}`,
        destination: '/:locale/work',
        permanent: true,
      })),
    ];
  },
};

export default withNextIntl(nextConfig);
