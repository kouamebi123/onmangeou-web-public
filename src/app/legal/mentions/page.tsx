import type { Metadata } from 'next';
import { LegalPage } from '@/features/legal/legal-page';
import { getMessages, t } from '@/lib/i18n';

export const metadata: Metadata = {
  title: t('legal.mentions.title'),
};

export default function MentionsPage() {
  const messages = getMessages();

  return (
    <div className="page">
      <LegalPage title={messages.legal.mentions.title} paragraphs={messages.legal.mentions.paragraphs} />
    </div>
  );
}
