/**
 * Portfolio projects (order from site-content.md).
 * Text lives in the messages files under `work.items.<id>`.
 *
 *  - slug: the project's page, /work/<slug>
 *  - type: used by the filters on /work and for the short category line
 *          ("store" | "story" | "company" | "platform")
 *  - service: the matching service on /services (see services.items[].icon)
 *  - url: the live site, or null for a demo ("coming soon")
 *  - languages: only where site-content.md states it; null = not stated yet
 *
 * Sector, country, the idea/challenge, highlights beyond the card text and the
 * tech used are not in site-content.md yet: the project page shows a visible
 * [TO FILL] placeholder for each.
 */
export const workItems = [
  { id: 'tableware', slug: 'tableware-store', type: 'store', service: 'store', image: '/images/work/tableware-store.webp', url: 'https://gd-tableware.com/ar', demo: false, languages: ['ar', 'en'] },
  { id: 'kids', slug: 'kids-clothing-store', type: 'store', service: 'store', image: '/images/work/kids-clothing-store.webp', url: 'https://dudu-kids.vercel.app/', demo: false, languages: null },
  { id: 'bakery', slug: 'bakery-shop', type: 'store', service: 'store', image: '/images/work/bakery-shop.webp', url: 'https://lovan.vercel.app/', demo: false, languages: null },
  // Live URL is to be renamed later.
  { id: 'hara', slug: 'hara-oven-pizza', type: 'store', service: 'store', image: '/images/work/hara-oven-pizza.webp', url: 'https://papajohns-rebrand.vercel.app/', demo: false, languages: null },
  // Live URL is to be renamed later.
  { id: 'waraqa', slug: 'waraqa-tea', type: 'story', service: 'story', image: '/images/work/waraqa-tea.webp', url: 'https://ahmed-tea.vercel.app/ar', demo: false, languages: null },
  { id: 'rakaez', slug: 'rakaez-engineering', type: 'company', service: 'company', image: '/images/work/rakaez-engineering.webp', url: null, demo: true, languages: null },
  { id: 'wasan', slug: 'wasan-suites', type: 'platform', service: 'booking', image: '/images/work/wasan-suites.webp', url: null, demo: true, languages: null },
];

export const workTypes = ['store', 'story', 'company', 'platform'];

export const findProject = (slug) => workItems.find((item) => item.slug === slug);

/** The project shown as an example on /services for a given service, if there is one. */
export const projectForService = (service) => workItems.find((item) => item.service === service) ?? null;
