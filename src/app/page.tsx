import { ErrorState } from '@/components/error-state';
import { NeighborhoodChips } from '@/components/neighborhood-chips';
import { OpenInAppButton } from '@/components/open-in-app-button';
import { RestaurantCard } from '@/components/restaurant-card';
import { SearchBar } from '@/components/search-bar';
import { HomeRestaurantList } from '@/features/discovery/restaurant-list';
import { discoverRestaurants, errorMessage } from '@/lib/api';
import { homeAppLink } from '@/lib/deep-link';
import { t } from '@/lib/i18n';
import type { RestaurantSummary } from '@/lib/types';

export const dynamic = 'force-dynamic';

async function loadHomeRestaurants(): Promise<
  { ok: true; restaurants: RestaurantSummary[] } | { ok: false; error: unknown }
> {
  try {
    const result = await discoverRestaurants({ city: 'Abidjan', sort: 'recent' });
    return { ok: true, restaurants: result.data };
  } catch (error) {
    return { ok: false, error };
  }
}

function HomeError({ error }: { error: unknown }) {
  const message = errorMessage(error);
  return <ErrorState title={message.title} detail={message.detail} retryHref="/" />;
}

export default async function HomePage() {
  const result = await loadHomeRestaurants();
  const restaurants = result.ok ? result.restaurants : [];
  const openNow = restaurants.filter((restaurant) => restaurant.open);
  const spotlight = openNow[0] ?? restaurants[0] ?? null;

  return (
    <div className="page page--home">
      <section className="hero-panel">
        <p className="eyebrow">{t('home.eyebrow')}</p>
        <h1>{t('home.title')}</h1>
        <p className="hero-panel__lede">{t('home.subtitle')}</p>
        <SearchBar />
        <div className="hero-panel__actions">
          <OpenInAppButton href={homeAppLink()} />
        </div>
        {result.ok ? (
          <ul className="trust-row">
            <li>{t('home.statRestaurants', { count: String(restaurants.length) })}</li>
            <li>{t('home.statOpen', { count: String(openNow.length) })}</li>
            <li>{t('home.statMenus')}</li>
          </ul>
        ) : null}
      </section>

      <section className="section">
        <header className="section-head">
          <h2>{t('home.neighborhoodsTitle')}</h2>
        </header>
        <NeighborhoodChips />
      </section>

      {result.ok ? (
        <>
          {spotlight ? (
            <section className="section">
              <header className="section-head">
                <p className="eyebrow eyebrow--on-cream">{t('home.spotlightKicker')}</p>
                <h2>{spotlight.name}</h2>
              </header>
              <RestaurantCard restaurant={spotlight} featured />
            </section>
          ) : null}

          {openNow.filter((restaurant) => restaurant.id !== spotlight?.id).length > 0 ? (
            <section className="section">
              <header className="section-head">
                <h2>{t('home.openNowTitle')}</h2>
              </header>
              <div className="card-grid">
                {openNow
                  .filter((restaurant) => restaurant.id !== spotlight?.id)
                  .slice(0, 6)
                  .map((restaurant) => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                  ))}
              </div>
            </section>
          ) : restaurants.length > 0 && openNow.length === 0 ? (
            <p className="muted">{t('home.openNowEmpty')}</p>
          ) : null}

          <section className="section">
            <header className="section-head">
              <h2>{t('home.howTitle')}</h2>
            </header>
            <ol className="step-grid">
              <li className="step-card">
                <span className="step-card__index">1</span>
                <h3>{t('home.how1Title')}</h3>
                <p>{t('home.how1Body')}</p>
              </li>
              <li className="step-card">
                <span className="step-card__index">2</span>
                <h3>{t('home.how2Title')}</h3>
                <p>{t('home.how2Body')}</p>
              </li>
              <li className="step-card">
                <span className="step-card__index">3</span>
                <h3>{t('home.how3Title')}</h3>
                <p>{t('home.how3Body')}</p>
              </li>
            </ol>
          </section>

          {openNow.length < restaurants.length ? (
            <section className="section">
              <header className="section-head">
                <h2>{t('home.listTitle')}</h2>
              </header>
              <HomeRestaurantList restaurants={restaurants} />
            </section>
          ) : null}

          <section className="cta-band">
            <div className="cta-band__copy">
              <h2>{t('home.ctaTitle')}</h2>
              <p>{t('home.ctaBody')}</p>
            </div>
            <OpenInAppButton href={homeAppLink()} />
          </section>
        </>
      ) : (
        <HomeError error={result.error} />
      )}
    </div>
  );
}
