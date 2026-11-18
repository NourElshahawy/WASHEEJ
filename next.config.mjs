import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
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
