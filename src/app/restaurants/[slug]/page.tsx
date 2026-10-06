import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ErrorState } from '@/components/error-state';
import { RestaurantDetail } from '@/features/restaurant/restaurant-detail';
import { errorMessage, getRestaurantBySlug, getRestaurantEvents, getRestaurantReviews, isNotFound } from '@/lib/api';
import { t } from '@/lib/i18n';
import { absoluteUrl, restaurantJsonLd, serializeJsonLd } from '@/lib/seo';
import type { RestaurantDetail as RestaurantDetailType } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface RestaurantPageProps {
  params: Promise<{ slug: string }>;
}

type RestaurantLoad =
  | { ok: true; restaurant: RestaurantDetailType }
  | { ok: false; error: unknown };

async function loadRestaurant(slug: string): Promise<RestaurantLoad> {
  try {
    const { data } = await getRestaurantBySlug(slug);
    return { ok: true, restaurant: data };
  } catch (error) {
    return { ok: false, error };
  }
}

export async function generateMetadata({ params }: RestaurantPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await loadRestaurant(slug);

  if (!result.ok) {
    return {
      title: t('restaurant.notFoundTitle'),
      description: t('restaurant.notFoundDetail'),
    };
  }

  const description =
    result.restaurant.description !== null && result.restaurant.description !== ''
      ? result.restaurant.description
      : t('meta.restaurantDescription', { name: result.restaurant.name, city: result.restaurant.city });

  const path = `/restaurants/${encodeURIComponent(result.restaurant.slug)}`;
  const images = result.restaurant.coverImageUrl !== null ? [{ url: result.restaurant.coverImageUrl }] : undefined;

  return {
    title: result.restaurant.name,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: 'OnMangeOu',
      locale: 'fr_CI',
      url: path,
      title: result.restaurant.name,
      description,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: images ? 'summary_large_image' : 'summary',
      title: result.restaurant.name,
      description,
      ...(images ? { images: images.map((image) => image.url) } : {}),
    },
  };
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { slug } = await params;
  const result = await loadRestaurant(slug);

  if (!result.ok) {
    if (isNotFound(result.error)) {
      notFound();
    }

    const message = errorMessage(result.error);
    return (
      <div className="page">
        <ErrorState title={message.title} detail={message.detail} retryHref={`/restaurants/${slug}`} />
      </div>
    );
  }

  const canMarket = result.restaurant.enabledModules?.includes('marketing.promotions') === true;
  const [reviews, events] = await Promise.all([
    getRestaurantReviews(result.restaurant.id).then((envelope) => envelope.data).catch(() => []),
    canMarket
      ? getRestaurantEvents(result.restaurant.id).then((envelope) => envelope.data).catch(() => [])
      : Promise.resolve([]),
  ]);

  return (
    <div className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            restaurantJsonLd(
              result.restaurant,
              absoluteUrl(`/restaurants/${encodeURIComponent(result.restaurant.slug)}`),
            ),
          ),
        }}
      />
      <RestaurantDetail restaurant={result.restaurant} reviews={reviews} events={events} />
    </div>
  );
}
