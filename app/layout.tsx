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
  title: 'Glow - The dynamic link-in-bio',
  description: 'The dynamic link-in-bio',
  openGraph: {
    images: [
      {
        url: 'https://glow.as/og.png',
      },
    ],
    type: 'website',
    url: 'https://glow.as',
    title: 'Glow',
    description: 'The dynamic link-in-bio',
    siteName: 'Glow',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@tryglow',
    creator: '@tryglow',
    images: 'https://glow.as/og.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={saans.className}>
      <body className="bg-sys-bg-base">
        {children}
        <Toaster />
      </body>
      <Analytics />
    </html>
  );
}
