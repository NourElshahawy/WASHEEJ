import { ImageResponse } from 'next/og';
import { LOGO_FULL } from '@/components/Logo/logoPaths';
import { routing } from '@/i18n/routing';

/**
 * Open Graph image, one per locale: the وشيج logo on the brand colours
 * (burgundy on a peach sheet over paper), with the Latin wordmark underneath.
 * Twitter uses the same image (see twitter-image.jsx).
 */
export const alt = 'Washeej — وشيج';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const TAGLINE = {
  ar: 'WEB STUDIO  ·  ARABIC & ENGLISH WEBSITES',
  en: 'WEB STUDIO  ·  ARABIC & ENGLISH WEBSITES',
};

export default async function OpenGraphImage({ params }) {
  const { locale } = await params;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#faf6f2',
        }}
      >
        {/* The peach sheet */}
        <div
          style={{
            width: 1080,
            height: 510,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fed7b8',
            borderRadius: 28,
          }}
        >
          <svg width="560" height="310" viewBox={LOGO_FULL.viewBox}>
            {LOGO_FULL.paths.map((d) => (
              <path key={d.slice(0, 24)} d={d} fill="#59171b" fillRule="evenodd" />
            ))}
          </svg>
          <div style={{ display: 'flex', marginTop: 18, fontSize: 44, letterSpacing: 22, color: '#59171b' }}>WASHEEJ</div>
          <div style={{ display: 'flex', marginTop: 14, fontSize: 20, letterSpacing: 6, color: '#59171b', opacity: 0.8 }}>
            {TAGLINE[locale] ?? TAGLINE.en}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
