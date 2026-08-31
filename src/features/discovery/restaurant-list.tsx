import { EmptyState } from '@/components/empty-state';
import { RestaurantCard } from '@/components/restaurant-card';
import { t } from '@/lib/i18n';
import type { RestaurantSummary } from '@/lib/types';

interface RestaurantListProps {
  restaurants: RestaurantSummary[];
  emptyTitle: string;
  emptyDetail: string;
}

export function RestaurantList({ restaurants, emptyTitle, emptyDetail }: RestaurantListProps) {
  if (restaurants.length === 0) {
    return <EmptyState title={emptyTitle} detail={emptyDetail} />;
  }

  return (
    <div className="card-grid">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
}

export function HomeRestaurantList({ restaurants }: { restaurants: RestaurantSummary[] }) {
  return (
    <RestaurantList
      restaurants={restaurants}
      emptyTitle={t('home.emptyTitle')}
      emptyDetail={t('home.emptyDetail')}
    />
  );
}
