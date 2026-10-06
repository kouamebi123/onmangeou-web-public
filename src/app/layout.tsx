import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { t } from '@/lib/i18n';
import { siteUrl } from '@/lib/seo';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: t('meta.defaultTitle'),
    template: t('meta.titleTemplate', { title: '%s' }),
  },
  description: t('meta.defaultDescription'),
  metadataBase: new URL(siteUrl()),
  applicationName: 'OnMangeOu',
  openGraph: {
    type: 'website',
    siteName: 'OnMangeOu',
    locale: 'fr_CI',
    title: t('meta.defaultTitle'),
    description: t('meta.defaultDescription'),
  },
  twitter: {
    card: 'summary_large_image',
    title: t('meta.defaultTitle'),
    description: t('meta.defaultDescription'),
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#173b36',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr-CI" className={inter.variable}>
      <body className={inter.className}>
        <div className="site-shell">
          <a className="skip-link" href="#contenu">
            {t('nav.skipToContent')}
          </a>
          <Header />
          <main className="site-main" id="contenu">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
