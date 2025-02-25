import './globals.css';
import { LoginWidget } from '@/components/LoginWidget';
import MarketingFooter from '@/components/MarketingFooter';
import MarketingNavigation from '@/components/MarketingNavigation';
import { Button } from '@tryglow/ui';
import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import { ReactNode } from 'react';

const saans = localFont({
  src: './saans-font.woff2',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Glow - A delightfully rich link-in-bio.',
  description:
    'Create your own dynamic link in bio page effortlessly with Glow, the personal page builder designed to help you stand out and connect with your audience.',
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
    description:
      'Create your own dynamic link in bio page effortlessly with Glow, the personal page builder designed to help you stand out and connect with your audience.',
    siteName: 'Glow',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@tryglow',
    creator: '@tryglow',
    images: 'https://glow.as/assets/og.png',
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={saans.className}>
      <head>
        {process.env.NODE_ENV === 'production' && (
          <Script
            src="https://analytics.ahrefs.com/analytics.js"
            data-key="eGiWH0Sy3k+uZwgupTFABw"
            defer={true}
          />
        )}
      </head>
      <body className="bg-stone-50 min-h-screen">
        <MarketingNavigation>
          <>
            <LoginWidget
              trigger={
                <Button variant="ghost" className="block">
                  Log in
                </Button>
              }
            />
            <LoginWidget
              isSignup
              trigger={<Button className="block">Get started</Button>}
            />
          </>
        </MarketingNavigation>
        <main className="bg-white min-h-full">{children}</main>
        <MarketingFooter />
      </body>

      <Analytics />
    </html>
  );
}
