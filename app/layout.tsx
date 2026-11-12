import '@/app/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Luigi Straccia | Software & Data Engineering',
  description:
    'Full-stack engineer building CRMs, sales funnels, Stripe billing and real-time AI features. Case study: ProSpeak.',
  icons: {
    icon: '/logo1.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body className={`${inter.className} bg-[#050505] antialiased text-zinc-400`}>
        {children}
      </body>
    </html>
  );
}