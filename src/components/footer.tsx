import Link from 'next/link';
import { t } from '@/lib/i18n';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <img src="/brand/onmangeou-logo-full-dark.svg" alt="" width={70} height={98} />
          <p>{t('footer.tagline')}</p>
        </div>
        <nav className="site-footer__col" aria-label={t('footer.discover')}>
          <h2>{t('footer.discover')}</h2>
          <Link href="/">{t('nav.home')}</Link>
          <Link href="/recherche">{t('nav.search')}</Link>
        </nav>
        <nav className="site-footer__col" aria-label={t('footer.support')}>
          <h2>{t('footer.support')}</h2>
          <Link href="/aide">{t('footer.help')}</Link>
          <Link href="/contact">{t('footer.contact')}</Link>
        </nav>
        <nav className="site-footer__col" aria-label={t('footer.legalGroup')}>
          <h2>{t('footer.legalGroup')}</h2>
          <Link href="/legal/mentions">{t('footer.legal')}</Link>
          <Link href="/legal/confidentialite">{t('footer.privacy')}</Link>
        </nav>
        <p className="site-footer__copy">{t('footer.copyright', { year: String(new Date().getFullYear()) })}</p>
      </div>
    </footer>
  );
}
