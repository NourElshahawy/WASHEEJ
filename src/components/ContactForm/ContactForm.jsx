'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { submitProjectRequest } from '@/lib/submitProjectRequest';
import styles from './ContactForm.module.css';

/**
 * Project request form: name, company, country, service type (chips) and a
 * message. It validates on submit, then hands the payload to
 * submitProjectRequest() — the single function to connect to a backend later —
 * and shows a "request received" state with a knot tying itself.
 *
 * Arriving from a project (/contact?project=<slug>), the service and a first
 * message are filled in from `prefills` (built from projects.json).
 */
export default function ContactForm({ services, prefills = {} }) {
  const t = useTranslations('pages.contact');
  const locale = useLocale();
  const formRef = useRef(null);
  const successRef = useRef(null);
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
    const data = new FormData(event.currentTarget);
    const payload = {
      name: String(data.get('name') || '').trim(),
      company: String(data.get('company') || '').trim(),
      country: String(data.get('country') || '').trim(),
      service,
      ...(project ? { project } : {}),
      message: String(data.get('message') || '').trim(),
      locale,
      sentAt: new Date().toISOString(),
    };

    const found = {};
    if (!payload.name) found.name = t('errors.name');
    if (!payload.service) found.service = t('errors.service');
    if (!payload.message) found.message = t('errors.message');
    setErrors(found);
    if (Object.keys(found).length) {
      // Move focus to the first field that needs attention.
      const first = ['name', 'service', 'message'].find((key) => found[key]);
      formRef.current.querySelector(`[data-field="${first}"]`)?.focus();
      return;
    }

    setStatus('sending');
    try {
      await submitProjectRequest(payload);
      setStatus('sent');
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setStatus('failed');
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

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate aria-labelledby="contact-form-title">
      <h2 id="contact-form-title" className={styles.formTitle}>
        {t('formTitle')}
      </h2>

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
          {errors.name ? (
            <span id="error-name" className={styles.error}>
              {errors.name}
            </span>
          ) : null}
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
        {errors.service ? (
          <span id="error-service" className={styles.error}>
            {errors.service}
          </span>
        ) : null}
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
        {errors.message ? (
          <span id="error-message" className={styles.error}>
            {errors.message}
          </span>
        ) : null}
      </label>

      <div className={styles.actions}>
        <button type="submit" className={styles.submit} disabled={status === 'sending'}>
          {status === 'sending' ? t('sending') : t('submit')}
        </button>
        <span className={styles.error} role="alert">
          {status === 'failed' ? t('errors.failed') : ''}
        </span>
      </div>
    </form>
  );
}
