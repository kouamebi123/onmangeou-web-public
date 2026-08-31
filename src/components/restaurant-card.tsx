import Link from 'next/link';
import { Badge } from '@/components/badge';
import { Price } from '@/components/price';
import { StatusChip } from '@/components/status-chip';
import { serviceLabel, t } from '@/lib/i18n';
import type { RestaurantSummary } from '@/lib/types';

interface RestaurantCardProps {
  restaurant: RestaurantSummary;
  featured?: boolean;
}

function locationLabel(restaurant: RestaurantSummary): string {
  const parts = [restaurant.district, restaurant.city].filter((part): part is string => part !== null && part !== '');
  return parts.join(' · ');
}

export function RestaurantCard({ restaurant, featured = false }: RestaurantCardProps) {
  return (
    <Link
      className={featured ? 'restaurant-card restaurant-card--featured' : 'restaurant-card'}
      href={`/restaurants/${restaurant.slug}`}
    >
      <div className="card-cover-wrap">
        {restaurant.coverImageUrl !== null ? (
          <img className="card-cover" src={restaurant.coverImageUrl} alt="" />
        ) : (
          <div className="card-cover card-cover--placeholder" aria-hidden="true">
            <span>{restaurant.name.slice(0, 1)}</span>
          </div>
        )}
        <div className="card-cover__status">
          <StatusChip
            open={restaurant.open}
            closesInMinutes={restaurant.closesInMinutes}
            opensInMinutes={restaurant.opensInMinutes}
          />
        </div>
      </div>
      <div className="restaurant-card__body">
        <h3>{restaurant.name}</h3>
        <p className="muted">{locationLabel(restaurant)}</p>
        {restaurant.landmarkText !== null ? (
          <p className="muted">{t('restaurant.landmark', { landmark: restaurant.landmarkText })}</p>
        ) : null}
        <div className="card-meta">
          {restaurant.priceFrom !== null ? <Price value={restaurant.priceFrom} prefix={t('restaurant.priceFrom')} /> : null}
          {restaurant.averagePreparationMinutes !== null ? (
            <span className="muted">{t('restaurant.prepTime', { minutes: String(restaurant.averagePreparationMinutes) })}</span>
          ) : null}
        </div>
        <div className="card-meta">
          {restaurant.services.map((service) => (
            <Badge key={service}>{serviceLabel(service)}</Badge>
          ))}
        </div>
        <p className="card-cta">{t('restaurant.seeMenu')}</p>
      </div>
    </Link>
  );
}
