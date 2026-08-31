import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  detail: string;
  action?: ReactNode;
}

export function EmptyState({ title, detail, action }: EmptyStateProps) {
  return (
    <section className="state-card" aria-live="polite">
      <h2>{title}</h2>
      <p>{detail}</p>
      {action}
    </section>
  );
}
