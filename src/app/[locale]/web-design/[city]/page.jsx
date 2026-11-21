import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { pageMetadata } from '@/lib/seo';
import { getPublishedProjects } from '@/lib/projects';
import { CITY_PAGES, getCityPage } from '@/content/servicePages';
import LandingContent from '@/components/LandingContent/LandingContent';

/** City pages ("web design company in Riyadh / Cairo"), copy in content/servicePages.js. */

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => CITY_PAGES.map(({ slug }) => ({ locale, city: slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }) {
  const { locale, city } = await params;
  const page = getCityPage(city);
  if (!page) return {};
  const copy = page[locale];
  return pageMetadata({ locale, path: `/web-design/${city}`, title: { absolute: copy.title }, description: copy.description });
}

export default async function CityPage({ params }) {
  const { locale, city } = await params;
  const page = getCityPage(city);
  if (!page) notFound();
  setRequestLocale(locale);

  // Only live sites built for real clients are shown as examples here.
  const live = getPublishedProjects().filter((project) => project.type === 'live');

  return <LandingContent locale={locale} path={`/web-design/${city}`} copy={page[locale]} projects={live} />;
}
