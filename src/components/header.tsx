import Link from 'next/link';
import { t } from '@/lib/i18n';

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="site-logo" href="/">
          <img src="/brand/onmangeou-logo-full-dark.svg" alt={t('header.logoAlt')} width={132} height={38} />
        </Link>
        <nav className="site-nav" aria-label={t('brand.name')}>
          <Link href="/">{t('nav.home')}</Link>
          <Link href="/recherche">{t('nav.search')}</Link>
          <Link href="/aide">{t('nav.help')}</Link>
          <Link href="/contact">{t('nav.contact')}</Link>
          <Link className="site-nav__cta" href="/recherche">
            {t('nav.find')}
          </Link>
        </nav>
      </div>
    </header>
  );
}
