import type { MetadataRoute } from 'next';
import { discoverRestaurants } from '@/lib/api';
import { absoluteUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 50;
/** Garde-fou : 40 pages de 50, soit 2 000 fiches, bien au-delà du catalogue actuel. */
const MAX_PAGES = 40;

async function restaurantSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  let cursor: string | undefined;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const result = await discoverRestaurants({ sort: 'name', limit: PAGE_SIZE, cursor });
    slugs.push(...result.data.map((restaurant) => restaurant.slug));
    if (result.meta.nextCursor === null) break;
    cursor = result.meta.nextCursor;
  }

  return slugs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), changeFrequency: 'daily', priority: 1 },
    { url: absoluteUrl('/recherche'), changeFrequency: 'daily', priority: 0.8 },
    { url: absoluteUrl('/aide'), changeFrequency: 'monthly', priority: 0.3 },
    { url: absoluteUrl('/contact'), changeFrequency: 'monthly', priority: 0.3 },
    { url: absoluteUrl('/legal/mentions'), changeFrequency: 'yearly', priority: 0.1 },
    { url: absoluteUrl('/legal/confidentialite'), changeFrequency: 'yearly', priority: 0.1 },
  ];

  // Si l'API ne répond pas, le plan du site reste valide avec les pages fixes.
  const slugs = await restaurantSlugs().catch(() => []);

  return [
    ...pages,
    ...[...new Set(slugs)].map((slug) => ({
      url: absoluteUrl(`/restaurants/${encodeURIComponent(slug)}`),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
