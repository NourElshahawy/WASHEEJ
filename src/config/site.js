/**
 * Single place for contact details and site-wide constants.
 * WhatsApp number and email are PLACEHOLDERS — replace before launch.
 */
export const siteConfig = {
  // Public URL of the site (used for metadata, canonical and Open Graph URLs).
  url: 'https://washeej.com',

  contact: {
    // International format, digits only (no "+", spaces or dashes) — used in wa.me links.
    whatsappNumber: '201000000000',
    // How the number is shown to visitors.
    whatsappDisplay: '+20 100 000 0000',
    email: 'hello@washeej.com',
  },
};

export const whatsappUrl = `https://wa.me/${siteConfig.contact.whatsappNumber}`;
export const emailUrl = `mailto:${siteConfig.contact.email}`;

/** Main navigation (header, menu, footer). Labels are in the messages under `nav`. */
export const navLinks = [
  { key: 'home', href: '/' },
  { key: 'services', href: '/services' },
  { key: 'work', href: '/work' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
];
