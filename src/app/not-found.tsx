import Link from 'next/link';
import { EmptyState } from '@/components/empty-state';
import { t } from '@/lib/i18n';

export default function NotFoundPage() {
  return (
    <div className="page">
      <EmptyState
        title={t('notFound.title')}
        detail={t('notFound.detail')}
        action={
          <Link className="button" href="/">
            {t('notFound.backHome')}
          </Link>
        }
      />
    </div>
  );
}
