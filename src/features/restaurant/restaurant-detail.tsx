import Link from 'next/link';
import { Badge } from '@/components/badge';
import { OpenInAppButton } from '@/components/open-in-app-button';
import { Price } from '@/components/price';
import { StatusChip } from '@/components/status-chip';
import { RestaurantMenu } from '@/features/restaurant/restaurant-menu';
import { restaurantAppLink } from '@/lib/deep-link';
import { weekDayInZone, weekSchedule } from '@/lib/hours';
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
  const week = weekSchedule(restaurant.hours);
  const today = weekDayInZone(new Date(), restaurant.timezone ?? 'Africa/Abidjan');
  const hasInfo = restaurant.services.length > 0 || location.length > 0 || restaurant.hours.length > 0;

  return (
    <article className="stack restaurant-page">
      <Link className="crumb" href="/">
        {t('restaurant.backHome')}
      </Link>
      <header className="restaurant-hero">
        {restaurant.coverImageUrl !== null ? (
          <img className="restaurant-hero__cover" src={restaurant.coverImageUrl} alt="" />
        ) : null}
        <div className="restaurant-hero__body">
          <div className="card-meta">
            <StatusChip
              open={restaurant.open}
              closesInMinutes={restaurant.closesInMinutes}
              opensInMinutes={restaurant.opensInMinutes}
            />
            {restaurant.verified ? <Badge variant="accent">{t('restaurant.verified')}</Badge> : null}
            {restaurant.priceFrom !== null ? (
              <Price value={restaurant.priceFrom} prefix={t('restaurant.priceFrom')} />
            ) : null}
          </div>
          <h1>{restaurant.name}</h1>
          {restaurant.description !== null ? <p className="lede">{restaurant.description}</p> : null}
          <div className="restaurant-hero__actions">
            <OpenInAppButton href={restaurantAppLink(restaurant.slug)} />
          </div>
        </div>
      </header>

      <div className="restaurant-layout">
        {hasInfo ? (
          <aside className="restaurant-aside" aria-label={t('restaurant.infoTitle')}>
            {restaurant.services.length > 0 ? (
              <section className="info-card">
                <h2>{t('restaurant.servicesTitle')}</h2>
                <div className="card-meta">
                  {restaurant.services.map((service) => (
                    <Badge key={service}>{serviceLabel(service)}</Badge>
                  ))}
                </div>
              </section>
            ) : null}

            {location.length > 0 ? (
              <section className="info-card">
                <h2>{t('restaurant.locationTitle')}</h2>
                <address className="info-card__lines">
                  {location.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </address>
                {restaurant.phoneE164 !== null ? (
                  <p>
                    {t('restaurant.phone')} :{' '}
                    <a className="info-card__link" href={`tel:${restaurant.phoneE164}`}>
                      {restaurant.phoneE164}
                    </a>
                  </p>
                ) : null}
              </section>
            ) : null}

            {restaurant.hours.length > 0 ? (
              <section className="info-card">
                <h2>{t('restaurant.hoursTitle')}</h2>
                <ul className="hours-list">
                  {week.map((day) => (
                    <li key={day.weekDay} className={day.weekDay === today ? 'hours-list__today' : undefined}>
                      <span>
                        {weekdayLabel(day.weekDay)}
                        {day.weekDay === today ? (
                          <span className="hours-list__tag">{t('restaurant.today')}</span>
                        ) : null}
                      </span>
                      <span className={day.ranges.length === 0 ? 'hours-list__closed' : undefined}>
                        {day.ranges.length === 0
                          ? t('restaurant.closedToday')
                          : day.ranges.map((range) => (
                              <span className="hours-list__range" key={range}>
                                {range}
                              </span>
                            ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </aside>
        ) : null}

        <div className="restaurant-main">
          {events.length > 0 ? (
            <section className="section">
              <h2>{t('restaurant.eventsTitle')}</h2>
              <ul className="note-list">
                {events.map((event) => (
                  <li key={event.id}>
                    <strong>{event.title}</strong>
                    {event.body !== null && event.body !== '' ? <span className="muted">{event.body}</span> : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="section">
            <h2>{t('restaurant.menuTitle')}</h2>
            <RestaurantMenu menus={restaurant.menus} />
          </section>

          {reviews.length > 0 ? (
            <section className="section">
              <h2>{t('restaurant.reviewsTitle')}</h2>
              <ul className="note-list">
                {reviews.map((review) => (
                  <li key={review.id}>
                    <strong>
                      {t('restaurant.reviewScore', { score: String(review.score) })}
                      {review.author_name !== null && review.author_name !== '' ? ` · ${review.author_name}` : ''}
                    </strong>
                    {review.body !== null && review.body !== '' ? <span className="muted">{review.body}</span> : null}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </article>
  );
}
