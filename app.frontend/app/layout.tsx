import './globals.css';
import './react-grid-layout.scss';
import { auth } from '@/app/lib/auth';
import { PostHogIdentify, PostHogProvider } from '@/app/posthog-provider';
import { Toaster } from '@/components/ui/toaster';
import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import localFont from 'next/font/local';

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
  const session = await auth();
  return (
    <html lang="en" className={saans.className}>
      <PostHogProvider>
        <body className="bg-stone-50 min-h-screen">
          {children}
          <Toaster />
        </body>
        {session?.user && (
          <PostHogIdentify
            userId={session.user.id}
            teamId={session.currentTeamId}
          />
        )}
      </PostHogProvider>
      <Analytics />
    </html>
  );
}
