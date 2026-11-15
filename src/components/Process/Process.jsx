import { getTranslations } from 'next-intl/server';
import SectionHeading from '@/components/SectionHeading/SectionHeading';
import ProcessLights from '@/components/ProcessLights/ProcessLights';
import styles from './Process.module.css';

export default async function Process() {
  const t = await getTranslations('process');
  const steps = t.raw('steps');

  return (
    <section className={styles.process} aria-labelledby="process-heading" data-thread="process">
      <div className="page-container">
        <SectionHeading id="process-heading" label={t('label')} title={t('title')} />
        <ol className={styles.timeline}>
          {steps.map((step, index) => {
            const number = String(index + 1).padStart(2, '0');
            return (
              <li key={step.title} className={styles.step} data-process-step>
                {/* The thread runs through these markers; each lights up when it arrives. */}
                <span className={styles.stepMarker} data-process-marker aria-hidden="true">
                  <span className={styles.stepNumber}>{number}</span>
                  <span className={styles.stepMarkerLit} data-step-lit>
                    <span className={styles.stepNumber}>{number}</span>
                  </span>
                </span>
                <div className={styles.stepCopy} data-step-copy>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepText}>{step.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      <ProcessLights />
    </section>
  );
}
