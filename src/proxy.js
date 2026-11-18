import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import data from './data/projects.json';

const handleI18n = createMiddleware(routing);

// Project pages that exist (old slugs are redirected in next.config.mjs first).
const PROJECT_SLUGS = new Set(data.projects.filter((project) => project.published).map((project) => project.slug));
const PROJECT_PATH = /^\/(ar|en)\/work\/([^/]+)\/?$/;

/**
 * Language routing (next-intl), plus one rule: an unknown project slug is
 * sent to a path no route matches, so Next.js renders app/not-found.jsx on
 * the server — the full localized 404 with a 404 status — instead of
 * failing inside the project template.
 */
export default function proxy(request) {
  const match = request.nextUrl.pathname.match(PROJECT_PATH);
  if (match && !PROJECT_SLUGS.has(decodeURIComponent(match[2]))) {
    const url = request.nextUrl.clone();
    url.pathname = `/${match[1]}/work/${match[2]}/__missing`;
    const headers = new Headers(request.headers);
    headers.set('x-next-intl-locale', match[1]);
    return NextResponse.rewrite(url, { request: { headers } });
  }
  return handleI18n(request);
}

export const config = {
  // Everything except API routes, Next internals and files with an extension.
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
