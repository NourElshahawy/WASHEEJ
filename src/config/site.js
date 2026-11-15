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

/** In-page anchors used by the header, footer and hero buttons. */
export const navLinks = [
  { key: 'home', hash: 'top' },
  { key: 'services', hash: 'services' },
  { key: 'work', hash: 'work' },
  { key: 'about', hash: 'about' },
  { key: 'contact', hash: 'contact' },
];
