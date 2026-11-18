'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { sendProjectRequest } from '@/lib/projectRequest';
import styles from './ContactForm.module.css';

/**
 * Project request form: name, phone/WhatsApp, email (optional), company,
 * country, service type (chips) and a message. It validates on submit, sends
 * the request through Web3Forms (lib/projectRequest.js), and shows the
 * "request received" state only when Web3Forms confirms it.
 *
 * If sending fails, the form stays as it is (nothing typed is lost), with a
 * clear error and a WhatsApp button as another way to reach the studio.
 *
 * Arriving from a project (/contact?project=<slug>), the service and a first
 * message are filled in from `prefills` (built from projects.json).
 */

// Accepts Arabic-Indic digits too; spaces, dashes, dots and brackets are ignored.
const toLatinDigits = (value) =>
  value
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0));
const normalizePhone = (value) => toLatinDigits(value).replace(/[\s\-().]/g, '');
const isPhone = (value) => /^(\+|00)?\d{7,15}$/.test(value);
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

export default function ContactForm({ services, prefills = {}, whatsappUrl = null }) {
  const t = useTranslations('pages.contact');
  const locale = useLocale();
  const formRef = useRef(null);
  const successRef = useRef(null);
  const failureRef = useRef(null);
  const [service, setService] = useState('');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | failed
  const [project, setProject] = useState('');

  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('project');
    const prefill = slug ? prefills[slug] : null;
    if (!prefill) return;
    setProject(slug);
    if (prefill.service) setService(prefill.service);
    const message = formRef.current?.querySelector('textarea[name="message"]');
    if (message && !message.value) message.value = prefill.message;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (status === 'sending') return;
    const data = new FormData(event.currentTarget);
    const text = (key) => String(data.get(key) || '').trim();
    const payload = {
      name: text('name'),
      phone: normalizePhone(text('phone')),
      email: text('email'),
      company: text('company'),
      country: text('country'),
      service: services.find((option) => option.key === service)?.title ?? '',
      ...(project ? { project } : {}),
      message: text('message'),
      locale,
    };

    const found = {};
    if (!payload.name) found.name = t('errors.name');
    if (!payload.phone) found.phone = t('errors.phone');
    else if (!isPhone(payload.phone)) found.phone = t('errors.phoneFormat');
    if (payload.email && !isEmail(payload.email)) found.email = t('errors.email');
    if (!payload.service) found.service = t('errors.service');
    if (!payload.message) found.message = t('errors.message');
    setErrors(found);
    if (Object.keys(found).length) {
      // Move focus to the first field that needs attention.
      const first = ['name', 'phone', 'email', 'service', 'message'].find((key) => found[key]);
      formRef.current.querySelector(`[data-field="${first}"]`)?.focus();
      return;
    }

    setStatus('sending');
    try {
      await sendProjectRequest(payload, { botcheck: data.get('botcheck') === 'on' });
      setStatus('sent');
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setStatus('failed');
      requestAnimationFrame(() => failureRef.current?.focus());
    }
  };

  if (status === 'sent') {
    return (
      <div ref={successRef} className={styles.success} role="status" tabIndex={-1}>
        {/* Two ends of a thread meet and tie into a knot. */}
        <svg className={styles.successKnot} viewBox="0 0 200 60" aria-hidden="true" focusable="false">
          <path pathLength="1" d="M4,30 C40,30 60,30 82,30" />
          <path pathLength="1" d="M196,30 C160,30 140,30 118,30" />
          <path
            className={styles.successTie}
            pathLength="1"
            d="M82,30 C92,30 96,14 106,14 C118,14 120,32 108,35 C96,38 93,20 105,18 C114,16.5 118,30 118,30"
          />
        </svg>
        <h2 className={styles.successTitle}>{t('successTitle')}</h2>
        <button
          type="button"
          className={styles.againButton}
          onClick={() => {
            setService('');
            setStatus('idle');
          }}
        >
          {t('successAgain')}
        </button>
      </div>
    );
  }

  const describedBy = (key) => (errors[key] ? `error-${key}` : undefined);
  const fieldError = (key) =>
    errors[key] ? (
      <span id={`error-${key}`} className={styles.error}>
        {errors[key]}
      </span>
    ) : null;

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate aria-labelledby="contact-form-title">
      <h2 id="contact-form-title" className={styles.formTitle}>
        {t('formTitle')}
      </h2>

      {/* Honeypot for Web3Forms: hidden from people, ticked only by bots. */}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: 'none' }} />

      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.label}>{t('name')}</span>
          <input
            className={styles.input}
            name="name"
            type="text"
            autoComplete="name"
            data-field="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy('name')}
          />
          {fieldError('name')}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>{t('phone')}</span>
          <input
            className={styles.input}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            placeholder="+966 5x xxx xxxx"
            data-field="phone"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy('phone')}
          />
          {fieldError('phone')}
        </label>
      </div>

      <div className={styles.row}>
        <label className={styles.field}>
          <span className={styles.label}>
            {t('email')} <span className={styles.optional}>({t('optional')})</span>
          </span>
          <input
            className={styles.input}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            dir="ltr"
            data-field="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy('email')}
          />
          {fieldError('email')}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>
            {t('company')} <span className={styles.optional}>({t('optional')})</span>
          </span>
          <input className={styles.input} name="company" type="text" autoComplete="organization" />
        </label>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>
          {t('country')} <span className={styles.optional}>({t('optional')})</span>
        </span>
        <input className={styles.input} name="country" type="text" autoComplete="country-name" />
      </label>

      {/* Service type: one choice, shown as chips. */}
      <fieldset className={styles.fieldset} aria-describedby={describedBy('service')}>
        <legend className={styles.label}>{t('service')}</legend>
        <div className={styles.chips}>
          {services.map((option, index) => (
            <label key={option.key} className={styles.chip}>
              <input
                className="visually-hidden"
                type="radio"
                name="service"
                value={option.key}
                checked={service === option.key}
                onChange={() => setService(option.key)}
                data-field={index === 0 ? 'service' : undefined}
              />
              <span>{option.title}</span>
            </label>
          ))}
        </div>
        {fieldError('service')}
      </fieldset>

      <label className={styles.field}>
        <span className={styles.label}>{t('message')}</span>
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          name="message"
          rows={5}
          data-field="message"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy('message')}
        />
        {fieldError('message')}
      </label>

      <div className={styles.actions}>
        <button type="submit" className={styles.submit} disabled={status === 'sending'}>
          {status === 'sending' ? t('sending') : t('submit')}
        </button>
      </div>

      <p className={styles.consent}>
        {t.rich('consent', { link: (chunks) => <Link href="/privacy">{chunks}</Link> })}
      </p>

      {/* Sending failed: say so plainly, keep everything typed, offer WhatsApp instead. */}
      <div role="alert">
        {status === 'failed' ? (
          <div ref={failureRef} className={styles.failure} tabIndex={-1}>
            <p className={styles.failureText}>{t('errors.failed')}</p>
            {whatsappUrl ? (
              <a className={styles.failureWhatsapp} href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                {t('whatsappFallback')}
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </form>
  );
}
