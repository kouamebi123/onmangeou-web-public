import Link from 'next/link';
import { t } from '@/lib/i18n';

const AREAS = [
  { query: 'Cocody', labelKey: 'home.areaCocody' as const },
  { query: 'Plateau', labelKey: 'home.areaPlateau' as const },
  { query: 'Yopougon', labelKey: 'home.areaYopougon' as const },
  { query: 'Marcory', labelKey: 'home.areaMarcory' as const },
  { query: 'Angre', labelKey: 'home.areaAngre' as const },
];

export function NeighborhoodChips() {
  return (
    <nav className="chip-row" aria-label={t('home.neighborhoodsTitle')}>
      {AREAS.map((area) => (
        <Link key={area.query} className="choice-chip" href={`/recherche?q=${encodeURIComponent(area.query)}`}>
          {t(area.labelKey)}
        </Link>
      ))}
    </nav>
  );
}
