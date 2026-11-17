import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Project pages moved to the slugs in src/data/projects.json.
  async redirects() {
    const moved = {
      'tableware-store': 'gd-tableware',
      'kids-clothing-store': 'dudu-kids',
      'bakery-shop': 'lovan',
      'hara-oven-pizza': 'papajohns-redesign',
      'waraqa-tea': 'ahmed-tea-redesign',
    };
    return [
      ...Object.entries(moved).map(([from, to]) => ({
        source: `/:locale(ar|en)/work/${from}`,
        destination: `/:locale/work/${to}`,
        permanent: true,
      })),
      // Demos that are no longer in the portfolio.
      ...['rakaez-engineering', 'wasan-suites'].map((from) => ({
        source: `/:locale(ar|en)/work/${from}`,
        destination: '/:locale/work',
        permanent: false,
      })),
    ];
  },
};

export default withNextIntl(nextConfig);
