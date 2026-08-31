import type { Metadata } from 'next';
import { ContactForm } from '@/features/contact/contact-form';
import { t } from '@/lib/i18n';

export const metadata: Metadata = {
  title: t('contact.title'),
};

export default function ContactPage() {
  return (
    <div className="page">
      <article className="legal-card">
        <h1>{t('contact.title')}</h1>
        <p>{t('contact.intro')}</p>
        <ContactForm />
      </article>
    </div>
  );
}
