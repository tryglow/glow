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
  title: 'Onedash - Your personal site builder',
  description: 'Your personal site builder',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={saans.className}>
      <body className="bg-system-bg-primary">
        {children}
        <Toaster />
      </body>
      <Analytics />
    </html>
  );
}
