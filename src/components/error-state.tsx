'use client';

import Link from 'next/link';
import { t } from '@/lib/i18n';

interface ErrorStateProps {
  title?: string;
  detail?: string;
  retryHref?: string;
  onRetry?: () => void;
}

export function ErrorState({ title, detail, retryHref, onRetry }: ErrorStateProps) {
  const heading = title ?? t('errors.title');
  const message = detail ?? t('errors.detail');

  return (
    <section className="state-card state-card--error" role="alert">
      <h2>{heading}</h2>
      <p>{message}</p>
      {onRetry !== undefined ? (
        <button className="button" type="button" onClick={onRetry}>
          {t('errors.retry')}
        </button>
      ) : null}
      {retryHref !== undefined ? (
        <Link className="button" href={retryHref}>
          {t('errors.retry')}
        </Link>
      ) : null}
    </section>
  );
}
