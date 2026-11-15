/**
 * Portfolio cards (order from site-content.md).
 * Text lives in the messages files under `work.items.<id>`.
 * `url: null` + `demo: true` → "Demo" badge and a "coming soon" state instead of a link.
 */
export const workItems = [
  { id: 'tableware', image: '/images/work/tableware-store.webp', url: 'https://gd-tableware.com/ar', demo: false },
  { id: 'kids', image: '/images/work/kids-clothing-store.webp', url: 'https://dudu-kids.vercel.app/', demo: false },
  { id: 'bakery', image: '/images/work/bakery-shop.webp', url: 'https://lovan.vercel.app/', demo: false },
  // Live URL is to be renamed later.
  { id: 'hara', image: '/images/work/hara-oven-pizza.webp', url: 'https://papajohns-rebrand.vercel.app/', demo: false },
  // Live URL is to be renamed later.
  { id: 'waraqa', image: '/images/work/waraqa-tea.webp', url: 'https://ahmed-tea.vercel.app/ar', demo: false },
  { id: 'rakaez', image: '/images/work/rakaez-engineering.webp', url: null, demo: true },
  { id: 'wasan', image: '/images/work/wasan-suites.webp', url: null, demo: true },
];
