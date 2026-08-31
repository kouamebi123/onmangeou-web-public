'use client';

import { ErrorState } from '@/components/error-state';

export default function AppError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="page">
      <ErrorState onRetry={reset} />
    </div>
  );
}
