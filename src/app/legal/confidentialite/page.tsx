import type { Metadata } from 'next';
import { LegalPage } from '@/features/legal/legal-page';
import { getMessages, t } from '@/lib/i18n';

export const metadata: Metadata = {
  title: t('legal.privacy.title'),
};

export default function PrivacyPage() {
  const messages = getMessages();

  return (
    <div className="page">
      <LegalPage title={messages.legal.privacy.title} paragraphs={messages.legal.privacy.paragraphs} />
    </div>
  );
}
