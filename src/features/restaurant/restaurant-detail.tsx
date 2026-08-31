import Link from 'next/link';
import { Badge } from '@/components/badge';
import { OpenInAppButton } from '@/components/open-in-app-button';
import { Price } from '@/components/price';
import { StatusChip } from '@/components/status-chip';
import { RestaurantMenu } from '@/features/restaurant/restaurant-menu';
import { restaurantAppLink } from '@/lib/deep-link';
import { formatClockMinutes } from '@/lib/hours';
import { serviceLabel, t, weekdayLabel } from '@/lib/i18n';
import type { RestaurantDetail as RestaurantDetailType } from '@/lib/types';

interface RestaurantDetailProps {
  restaurant: RestaurantDetailType;
  reviews?: Array<{ id: string; score: number; body: string | null; author_name: string | null }>;
  events?: Array<{ id: string; title: string; body: string | null; starts_at: string }>;
}

function locationLines(restaurant: RestaurantDetailType): string[] {
  return [restaurant.addressLine, restaurant.district, restaurant.city, restaurant.landmarkText].filter(
    (part): part is string => part !== null && part !== '',
  );
}

export function RestaurantDetail({ restaurant, reviews = [], events = [] }: RestaurantDetailProps) {
  const location = locationLines(restaurant);

  return (
    <article className="stack restaurant-page">
      <Link className="crumb" href="/">
        {t('restaurant.backHome')}
      </Link>
      <header className="restaurant-hero">
        {restaurant.coverImageUrl !== null ? (
          <img className="restaurant-hero__cover" src={restaurant.coverImageUrl} alt="" />
        ) : null}
        <div className="card-meta">
          <StatusChip
            open={restaurant.open}
            closesInMinutes={restaurant.closesInMinutes}
            opensInMinutes={restaurant.opensInMinutes}
          />
          {restaurant.verified ? <Badge variant="accent">{t('restaurant.verified')}</Badge> : null}
          {restaurant.priceFrom !== null ? <Price value={restaurant.priceFrom} prefix={t('restaurant.priceFrom')} /> : null}
        </div>
        <h1>{restaurant.name}</h1>
        {restaurant.description !== null ? <p className="lede">{restaurant.description}</p> : null}
        <OpenInAppButton href={restaurantAppLink(restaurant.slug)} />
      </header>

      {restaurant.services.length > 0 ? (
        <section className="section">
          <h2>{t('restaurant.servicesTitle')}</h2>
          <div className="card-meta">
            {restaurant.services.map((service) => (
              <Badge key={service}>{serviceLabel(service)}</Badge>
            ))}
          </div>
        </section>
      ) : null}

      {location.length > 0 ? (
        <section className="section">
          <h2>{t('restaurant.locationTitle')}</h2>
          {location.map((line) => (
            <p key={line}>{line}</p>
          ))}
          {restaurant.phoneE164 !== null ? (
            <p>
              {t('restaurant.phone')} : {restaurant.phoneE164}
            </p>
          ) : null}
        </section>
      ) : null}

      {restaurant.hours.length > 0 ? (
        <section className="section">
          <h2>{t('restaurant.hoursTitle')}</h2>
          <ul className="hours-list">
            {restaurant.hours.map((slot) => (
              <li key={`${slot.weekDay}-${slot.opensAtMinutes}`}>
                <span>{weekdayLabel(slot.weekDay)}</span>
                <span>
                  {formatClockMinutes(slot.opensAtMinutes)} – {formatClockMinutes(slot.closesAtMinutes)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {events.length > 0 ? (
        <section className="section">
          <h2>Événements</h2>
          {events.map((event) => (
            <p key={event.id}>{event.title}</p>
          ))}
        </section>
      ) : null}
      {reviews.length > 0 ? (
        <section className="section">
          <h2>Avis</h2>
          {reviews.map((review) => (
            <p key={review.id}>
              {review.score}/5 — {review.body ?? review.author_name}
            </p>
          ))}
        </section>
      ) : null}
      <section className="section">
        <h2>{t('restaurant.menuTitle')}</h2>
        <RestaurantMenu menus={restaurant.menus} />
      </section>
    </article>
  );
}
