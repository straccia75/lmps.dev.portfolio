import '@/app/globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { getSiteMode } from './lib/site-mode';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const SITE_URL = 'https://lmps.dev';
const TITLE = 'Luigi Straccia | Software & Data Engineering';
const DESCRIPTION =
  'Full-stack engineer building CRMs, sales funnels, Stripe billing and real-time AI features, designed around how the business works.';

// Icons and social images come from app/icon.png, app/apple-icon.png,
// app/opengraph-image.png and app/twitter-image.png (Next.js file conventions).
const OPEN_GRAPH = {
  type: 'website' as const,
  url: SITE_URL,
  siteName: 'LMPS.dev',
  title: TITLE,
  description: DESCRIPTION,
  locale: 'en_US',
};

const BASE_METADATA: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s | Luigi Straccia',
  },
  description: DESCRIPTION,
  authors: [{ name: 'Luigi Straccia', url: SITE_URL }],
  creator: 'Luigi Straccia',
  openGraph: OPEN_GRAPH,
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

// upwork.lmps.dev is a copy of the site for Upwork links: keep it out of search engines.
export async function generateMetadata(): Promise<Metadata> {
  const mode = await getSiteMode();
  if (mode !== 'upwork') return BASE_METADATA;
  return {
    ...BASE_METADATA,
    metadataBase: new URL('https://upwork.lmps.dev'),
    authors: [{ name: 'Luigi Straccia' }],
    openGraph: { ...OPEN_GRAPH, url: 'https://upwork.lmps.dev' },
    robots: { index: false, follow: false },
  };
}

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
