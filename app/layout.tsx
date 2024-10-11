import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import localFont from 'next/font/local';

import { Toaster } from '@/components/ui/toaster';

import './globals.css';
import './react-grid-layout.scss';

const saans = localFont({
  src: './saans-font.woff2',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Glow - The dynamic personal page builder - Link-in-bio',
  description:
    'The dynamic personal page builder. Glow makes it easy to create your own dynamic link-in-bio page.',
  metadataBase: new URL('https://glow.as'),
  openGraph: {
    images: [
      {
        url: 'https://glow.as/assets/og.png',
      },
    ],
    type: 'website',
    url: 'https://glow.as',
    title: 'Glow',
    description: 'The dynamic personal page builder',
    siteName: 'Glow',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@tryglow',
    creator: '@tryglow',
    images: 'https://glow.as/assets/og.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={saans.className}>
      <body className="bg-sys-bg-base min-h-screen">
        {children}
        <Toaster />
      </body>
      <Analytics />
    </html>
  );
}
