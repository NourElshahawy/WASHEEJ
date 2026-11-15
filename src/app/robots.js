import { siteConfig } from '@/config/site';

/** robots.txt: everything may be crawled; points at the sitemap. */
export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
