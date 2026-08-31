import { t } from '@/lib/i18n';

interface SkeletonProps {
  count?: number;
}

export function RestaurantListSkeleton({ count = 6 }: SkeletonProps) {
  return (
    <div className="card-grid" aria-busy="true" aria-label={t('loading.label')}>
      {Array.from({ length: count }, (_, index) => (
        <div className="skeleton restaurant-card" key={index}>
          <div className="skeleton__block skeleton__cover" />
          <div className="skeleton__block skeleton__line" />
          <div className="skeleton__block skeleton__line skeleton__line--short" />
        </div>
      ))}
    </div>
  );
}

export function RestaurantDetailSkeleton() {
  return (
    <div className="skeleton" aria-busy="true" aria-label={t('loading.label')}>
      <div className="skeleton__block skeleton__cover" />
      <div className="skeleton__block skeleton__line" />
      <div className="skeleton__block skeleton__line skeleton__line--short" />
      <div className="skeleton__block skeleton__line" />
    </div>
  );
}
