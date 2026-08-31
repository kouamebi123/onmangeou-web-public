'use client';

import { useState, type FormEvent } from 'react';
import { z } from 'zod';
import { t } from '@/lib/i18n';

const contactSchema = z.object({
  name: z.string().trim().min(2, t('contact.errors.name')),
  email: z.email({ error: t('contact.errors.email') }),
  message: z.string().trim().min(10, t('contact.errors.message')),
});

type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>;

export function ContactForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const parsed = contactSchema.safeParse({
      name: form.get('name'),
      email: form.get('email'),
      message: form.get('message'),
    });

    if (!parsed.success) {
      const nextErrors: FieldErrors = {};

      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (field === 'name' || field === 'email' || field === 'message') {
          nextErrors[field] = issue.message;
        }
      }

      setErrors(nextErrors);
      setSubmitted(false);
      return;
    }

    setErrors({});
    setSubmitted(true);

    const subject = encodeURIComponent(t('contact.subject'));
    const body = encodeURIComponent(`${parsed.data.name}\n${parsed.data.email}\n\n${parsed.data.message}`);
    window.location.href = `mailto:${t('contact.emailAddress')}?subject=${subject}&body=${body}`;
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="contact-name">{t('contact.nameLabel')}</label>
        <input id="contact-name" name="name" type="text" autoComplete="name" placeholder={t('contact.namePlaceholder')} />
        {errors.name !== undefined ? <p className="field-error">{errors.name}</p> : null}
      </div>
      <div className="field">
        <label htmlFor="contact-email">{t('contact.emailLabel')}</label>
        <input id="contact-email" name="email" type="email" autoComplete="email" placeholder={t('contact.emailPlaceholder')} />
        {errors.email !== undefined ? <p className="field-error">{errors.email}</p> : null}
      </div>
      <div className="field">
        <label htmlFor="contact-message">{t('contact.messageLabel')}</label>
        <textarea id="contact-message" name="message" placeholder={t('contact.messagePlaceholder')} />
        {errors.message !== undefined ? <p className="field-error">{errors.message}</p> : null}
      </div>
      <button className="button" type="submit">
        {t('contact.submit')}
      </button>
      {submitted ? (
        <p role="status">{t('contact.successDetail', { email: t('contact.emailAddress') })}</p>
      ) : null}
    </form>
  );
}
