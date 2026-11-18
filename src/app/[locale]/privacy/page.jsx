import { setRequestLocale } from 'next-intl/server';
import { privacy, PRIVACY_UPDATED } from '@/content/privacy';
import { pageMetadata } from '@/lib/seo';
import PageHero from '@/components/PageHero/PageHero';
import StructuredData from '@/components/StructuredData/StructuredData';
import styles from './page.module.css';

/** Privacy policy (text in src/content/privacy.js). */

const DESCRIPTION = {
  ar: 'كيف تجمع وشيج بياناتك الشخصية وتستخدمها وتحميها عند زيارة الموقع أو إرسال طلب مشروع، ومع من نشاركها، وحقوقك وطريقة ممارستها.',
  en: 'How Washeej collects, uses and protects your personal data when you visit the site or send a project request, who we share it with, and your rights.',
};

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return pageMetadata({ locale, path: '/privacy', title: privacy[locale].title, description: DESCRIPTION[locale] });
}

// Emails and phone numbers become links, isolated as left-to-right text.
const CONTACT = /([\w.+-]+@[\w-]+\.[\w.]+|\+\d{8,15})/g;

function Inline({ text }) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => {
    if (i % 2) {
      // The label is isolated (Latin names with brackets, e.g. "Google (Gmail)",
      // keep their order inside Arabic text); its colon stays outside.
      const [, label, colon] = part.match(/^(.*?)(:?)$/);
      return (
        <strong key={i}>
          <bdi>{label}</bdi>
          {colon}
        </strong>
      );
    }
    return part.split(CONTACT).map((piece, j) => {
      if (j % 2 === 0) return piece;
      const href = piece.includes('@') ? `mailto:${piece}` : `https://wa.me/${piece.slice(1)}`;
      return (
        <a key={`${i}-${j}`} href={href} dir="ltr" {...(piece.includes('@') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}>
          {piece}
        </a>
      );
    });
  });
}

export default async function PrivacyPage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = privacy[locale];
  const updated = new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${PRIVACY_UPDATED}T12:00:00Z`));

  return (
    <>
      <PageHero
        label={
          <>
            {content.updatedLabel}: <time dateTime={PRIVACY_UPDATED}>{updated}</time>
          </>
        }
        title={content.title}
      />

      <article className={`page-container ${styles.policy}`}>
        {content.blocks.map((block, index) => {
          if (block.h) return <h2 key={index}>{block.h}</h2>;
          if (block.ul)
            return (
              <ul key={index}>
                {block.ul.map((item) => (
                  <li key={item}>
                    <Inline text={item} />
                  </li>
                ))}
              </ul>
            );
          return (
            <p key={index}>
              <Inline text={block.p} />
            </p>
          );
        })}
      </article>

      <StructuredData page={{ type: 'WebPage', path: '/privacy', name: content.title, description: DESCRIPTION[locale] }} />
    </>
  );
}
