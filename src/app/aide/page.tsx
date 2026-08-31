import type { Metadata } from 'next';
import { getMessages, t } from '@/lib/i18n';

export const metadata: Metadata = {
  title: t('help.title'),
};

export default function HelpPage() {
  const messages = getMessages();

  return (
    <div className="page">
      <article className="legal-card">
        <h1>{messages.help.title}</h1>
        <p>{messages.help.intro}</p>
        {messages.help.sections.map((section) => (
          <section className="stack" key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </section>
        ))}
      </article>
    </div>
  );
}
