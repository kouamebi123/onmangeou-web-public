import type { RestaurantDetail } from './types';

export const DEFAULT_SITE_URL = 'https://onmangeou.binuxlabs.com';

const SCHEMA_DAYS: Record<string, string> = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday',
};

/** Adresse publique du site, sans barre finale. `SITE_URL` la remplace si le domaine change. */
export function siteUrl(configured: string | undefined = process.env.SITE_URL): string {
  const candidate = configured?.trim();
  if (candidate === undefined || candidate === '') {
    return DEFAULT_SITE_URL;
  }

  try {
    const url = new URL(candidate);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.origin : DEFAULT_SITE_URL;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export function absoluteUrl(path: string, base: string = siteUrl()): string {
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

function clock(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(normalized / 60)).padStart(2, '0')}:${String(normalized % 60).padStart(2, '0')}`;
}

/**
 * Fiche du restaurant au format schema.org, lue par les moteurs de recherche
 * pour afficher adresse, téléphone et horaires directement dans les résultats.
 * Seules les informations réellement renseignées sont publiées.
 */
export function restaurantJsonLd(restaurant: RestaurantDetail, url: string): Record<string, unknown> {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: restaurant.name,
    url,
    address: {
      '@type': 'PostalAddress',
      ...(restaurant.addressLine ? { streetAddress: restaurant.addressLine } : {}),
      addressLocality: restaurant.city,
      addressCountry: 'CI',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
    },
  };

  if (restaurant.description) data['description'] = restaurant.description;
  if (restaurant.coverImageUrl) data['image'] = restaurant.coverImageUrl;
  if (restaurant.phoneE164) data['telephone'] = restaurant.phoneE164;
  if (restaurant.priceFrom) data['priceRange'] = `À partir de ${restaurant.priceFrom.formatted}`;
  if (restaurant.services.includes('RESERVATION')) data['acceptsReservations'] = true;

  const hours = restaurant.hours.flatMap((slot) => {
    const day = SCHEMA_DAYS[slot.weekDay];
    return day === undefined
      ? []
      : [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: `https://schema.org/${day}`,
            opens: clock(slot.opensAtMinutes),
            closes: clock(slot.closesAtMinutes),
          },
        ];
  });
  if (hours.length > 0) data['openingHoursSpecification'] = hours;

  return data;
}

/**
 * Sérialise des données structurées pour une balise `<script>`.
 *
 * Les noms et descriptions viennent des restaurateurs : sans échappement, un
 * `</script>` glissé dans un texte fermerait la balise et injecterait du code.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(new RegExp(String.fromCharCode(0x2028), 'g'), '\\u2028')
    .replace(new RegExp(String.fromCharCode(0x2029), 'g'), '\\u2029');
}
