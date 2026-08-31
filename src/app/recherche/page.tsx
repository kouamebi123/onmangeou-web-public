import type { Metadata } from 'next';
import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
import { NeighborhoodChips } from '@/components/neighborhood-chips';
import { SearchBar } from '@/components/search-bar';
import { RestaurantList } from '@/features/discovery/restaurant-list';
import { discoverRestaurants, errorMessage } from '@/lib/api';
import { t } from '@/lib/i18n';
import type { RestaurantSummary } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: t('meta.searchTitle'),
  description: t('meta.searchDescription'),
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

async function loadSearchResults(
  query: string,
): Promise<{ ok: true; restaurants: RestaurantSummary[] } | { ok: false; error: unknown }> {
  try {
    const result = await discoverRestaurants({ q: query, city: 'Abidjan', sort: 'recent' });
    return { ok: true, restaurants: result.data };
  } catch (error) {
    return { ok: false, error };
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? '';

  return (
    <div className="page">
      <section className="hero">
        <h1>{t('search.title')}</h1>
        {query !== '' ? <p>{t('search.queryLabel', { query })}</p> : null}
        <SearchBar initialQuery={query} />
      </section>
      {query === '' ? (
        <section className="section">
          <EmptyState title={t('search.emptyQueryTitle')} detail={t('search.emptyQueryDetail')} />
          <h2>{t('home.neighborhoodsTitle')}</h2>
          <NeighborhoodChips />
        </section>
      ) : (
        <SearchResults query={query} />
      )}
    </div>
  );
}

async function SearchResults({ query }: { query: string }) {
  const result = await loadSearchResults(query);

  if (!result.ok) {
    const message = errorMessage(result.error);
    return <ErrorState title={message.title} detail={message.detail} retryHref={`/recherche?q=${encodeURIComponent(query)}`} />;
  }

  return (
    <section className="section">
      <RestaurantList
        restaurants={result.restaurants}
        emptyTitle={t('search.emptyTitle')}
        emptyDetail={t('search.emptyDetail', { query })}
      />
    </section>
  );
}
