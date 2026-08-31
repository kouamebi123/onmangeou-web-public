import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { t } from '@/lib/i18n';
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
