import Link from 'next/link';
import { EmptyState } from '@/components/empty-state';
import { t } from '@/lib/i18n';

export default function RestaurantNotFound() {
  return (
    <div className="page">
      <EmptyState
        title={t('restaurant.notFoundTitle')}
        detail={t('restaurant.notFoundDetail')}
        action={
          <Link className="button" href="/">
            {t('notFound.backHome')}
          </Link>
        }
      />
    </div>
  );
}
