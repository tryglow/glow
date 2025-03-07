import './globals.css';
import './react-grid-layout.scss';
import { getSession } from '@/app/lib/auth';
import { PostHogIdentify, PostHogProvider } from '@/app/posthog-provider';
import { Toaster } from '@tryglow/ui';
import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import localFont from 'next/font/local';
import { headers } from 'next/headers';
import Script from 'next/script';

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
  children: React.ReactNode;
}) {
  const session = await getSession({
    fetchOptions: { headers: await headers() },
  });

  const sessionData = session.data;

  const { user } = sessionData ?? {};

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
      <PostHogProvider>
        <body className="bg-stone-50 min-h-screen relative">
          {children}
          <Toaster />
        </body>
        {user && (
          <PostHogIdentify
            userId={user.id}
            organizationId={sessionData?.session.activeOrganizationId ?? ''}
          />
        )}
      </PostHogProvider>
      <Analytics />
    </html>
  );
}
