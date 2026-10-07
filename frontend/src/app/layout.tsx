import type { Metadata, Viewport } from 'next';
import { Barlow } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SITE_NAME, SITE_URL } from '@/lib/config';
import './globals.css';

// next/font self-hosts the font at build time: no render-blocking request to Google, no layout shift.
const barlow = Barlow({ subsets: ['latin'], weight: ['300', '400', '500', '600'], display: 'swap', variable: '--font-barlow' });

/** Site-wide metadata. metadataBase lets child pages use relative canonical/OG URLs. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `Discover our products | ${SITE_NAME}`, template: `%s | ${SITE_NAME}` },
  description: 'Browse bags, clothing, jewelery and electronics. Filter by category and price, sort and search.',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

/**
 * RootLayout: wraps every page with skip-link, Header, <main> and Footer.
 * The skip link lets keyboard users jump past the navigation (accessibility).
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={barlow.variable}>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
