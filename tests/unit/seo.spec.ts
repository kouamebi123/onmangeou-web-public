import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { DEFAULT_SITE_URL, absoluteUrl, restaurantJsonLd, serializeJsonLd, siteUrl } from '../../src/lib/seo.ts';
import type { RestaurantDetail } from '../../src/lib/types.ts';

const restaurant: RestaurantDetail = {
  id: 'r1',
  slug: 'chez-tante-marie',
  name: 'Chez Tante Marie',
  city: 'Abidjan',
  district: 'Cocody',
  landmarkText: null,
  latitude: 5.36,
  longitude: -3.98,
  distanceMeters: null,
  coverImageUrl: null,
  averagePreparationMinutes: null,
  services: ['DINE_IN', 'RESERVATION'],
  open: true,
  closesInMinutes: null,
  opensInMinutes: null,
  priceFrom: null,
  isFavorite: false,
  enabledModules: [],
  description: null,
  phoneE164: '+2250700000001',
  addressLine: 'Rue des Jardins',
  verified: true,
  hours: [
    { weekDay: 'MONDAY', opensAtMinutes: 660, closesAtMinutes: 1380 },
    { weekDay: 'SATURDAY', opensAtMinutes: 720, closesAtMinutes: 1560 },
  ],
  menus: [],
};

describe('siteUrl', () => {
  it('falls back to the public address when nothing usable is configured', () => {
    assert.equal(siteUrl(undefined), DEFAULT_SITE_URL);
    assert.equal(siteUrl('  '), DEFAULT_SITE_URL);
    assert.equal(siteUrl('pas une adresse'), DEFAULT_SITE_URL);
    assert.equal(siteUrl('javascript:alert(1)'), DEFAULT_SITE_URL);
  });

  it('keeps only the origin of a configured address', () => {
    assert.equal(siteUrl('https://onmangeou.ci/accueil/'), 'https://onmangeou.ci');
    assert.equal(absoluteUrl('recherche', 'https://onmangeou.ci'), 'https://onmangeou.ci/recherche');
    assert.equal(absoluteUrl('/aide', 'https://onmangeou.ci'), 'https://onmangeou.ci/aide');
  });
});

describe('restaurantJsonLd', () => {
  it('publishes address, phone and opening hours on the clock', () => {
    const data = restaurantJsonLd(restaurant, 'https://onmangeou.ci/restaurants/chez-tante-marie');

    assert.equal(data['@type'], 'Restaurant');
    assert.equal(data['telephone'], '+2250700000001');
    assert.equal(data['acceptsReservations'], true);
    assert.deepEqual(data['address'], {
      '@type': 'PostalAddress',
      streetAddress: 'Rue des Jardins',
      addressLocality: 'Abidjan',
      addressCountry: 'CI',
    });
    assert.deepEqual(data['openingHoursSpecification'], [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'https://schema.org/Monday', opens: '11:00', closes: '23:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'https://schema.org/Saturday', opens: '12:00', closes: '02:00' },
    ]);
  });

  it('leaves out what the restaurant has not filled in', () => {
    const data = restaurantJsonLd(
      { ...restaurant, phoneE164: null, addressLine: null, hours: [], services: ['DINE_IN'] },
      'https://onmangeou.ci/restaurants/chez-tante-marie',
    );

    assert.equal('telephone' in data, false);
    assert.equal('description' in data, false);
    assert.equal('image' in data, false);
    assert.equal('openingHoursSpecification' in data, false);
    assert.equal('acceptsReservations' in data, false);
    assert.deepEqual(data['address'], { '@type': 'PostalAddress', addressLocality: 'Abidjan', addressCountry: 'CI' });
  });
});

describe('serializeJsonLd', () => {
  it('cannot close the script tag from a restaurant text', () => {
    const output = serializeJsonLd(
      restaurantJsonLd({ ...restaurant, name: '</script><script>alert(1)</script>' }, 'https://onmangeou.ci/r'),
    );

    assert.equal(output.includes('<'), false);
    assert.equal(output.includes('>'), false);
    assert.equal(JSON.parse(output).name, '</script><script>alert(1)</script>');
  });
});
