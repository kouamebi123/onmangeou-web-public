interface LegalPageProps {
  title: string;
  paragraphs: readonly string[];
}

export function LegalPage({ title, paragraphs }: LegalPageProps) {
  return (
    <article className="legal-card">
      <h1>{title}</h1>
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </article>
  );
}
