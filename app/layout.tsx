import '@/app/globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const SITE_URL = 'https://lmps.dev';
const TITLE = 'Luigi Straccia | Software & Data Engineering';
const DESCRIPTION =
  'Full-stack engineer building CRMs, sales funnels, Stripe billing and real-time AI features, designed around how the business works.';

// Icons and social images come from app/icon.png, app/apple-icon.png,
// app/opengraph-image.png and app/twitter-image.png (Next.js file conventions).
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s | Luigi Straccia',
  },
  description: DESCRIPTION,
  authors: [{ name: 'Luigi Straccia', url: SITE_URL }],
  creator: 'Luigi Straccia',
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'LMPS.dev',
    title: TITLE,
    description: DESCRIPTION,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: '#07070a',
  colorScheme: 'dark',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body className={`${inter.className} bg-[#07070a] antialiased text-zinc-400`}>
        {children}
      </body>
    </html>
  );
}
