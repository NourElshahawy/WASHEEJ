import { projectSettings } from '@/lib/projects';

/**
 * Single place for contact details and site-wide constants.
 *
 * The WhatsApp number lives in ONE place: `settings.whatsappNumber` in
 * src/data/projects.json (international digits only, e.g. "9665XXXXXXXX").
 * While it is null, every WhatsApp button is hidden or falls back to the
 * contact page — no placeholder number is ever shown.
 */
export const siteConfig = {
  // Public URL of the site (used for metadata, canonical and Open Graph URLs).
  url: 'https://washeej.site',

  contact: {
    whatsappNumber: projectSettings.whatsappNumber,
    // Temporary inbox. Switch to 'hello@washeej.site' once its forwarding to this inbox is live.
    email: 'hellowasheej@gmail.com',
  },
};

/** "+966 5X XXX XXXX"-style display of the configured number (or null). */
function displayNumber(number) {
  if (!number) return null;
  return `+${number}`;
}

export const whatsappDisplay = displayNumber(siteConfig.contact.whatsappNumber);
export const whatsappUrl = siteConfig.contact.whatsappNumber ? `https://wa.me/${siteConfig.contact.whatsappNumber}` : null;
export const emailUrl = `mailto:${siteConfig.contact.email}`;

/** Main navigation (header, menu, footer). Labels are in the messages under `nav`. */
export const navLinks = [
  { key: 'home', href: '/' },
  { key: 'services', href: '/services' },
  { key: 'work', href: '/work' },
  { key: 'about', href: '/about' },
  { key: 'contact', href: '/contact' },
];
