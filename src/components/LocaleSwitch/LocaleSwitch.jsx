'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import styles from './LocaleSwitch.module.css';

const LOCALES = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ar', label: 'AR', name: 'العربية' },
];

export default function LocaleSwitch({ className = '' }) {
  const activeLocale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('ui');

  return (
    <div className={`${styles.localeSwitch} ${className}`} role="group" aria-label={t('language')}>
      {LOCALES.map(({ code, label, name }) => (
        <Link
          key={code}
          href={pathname}
          locale={code}
          lang={code}
          aria-current={code === activeLocale ? 'true' : undefined}
          className={`${styles.localeLink} ${code === activeLocale ? styles.localeLinkActive : ''}`}
        >
          {label}
          <span className="visually-hidden"> — {name}</span>
        </Link>
      ))}
    </div>
  );
}
