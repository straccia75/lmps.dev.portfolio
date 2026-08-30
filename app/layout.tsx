import '@/app/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  // Cambia el título si quieres que diga otra cosa en la pestaña
  title: 'Portfolio | ProSpeak in Progress',
  description: 'Portafolio personal y proyectos en desarrollo.',
  // ESTO ES LO QUE CAMBIA EL ICONO DE LA PESTAÑA
  icons: {
    icon: '/logo2.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#050505] antialiased text-zinc-400`}>
        {children}
      </body>
    </html>
  );
}