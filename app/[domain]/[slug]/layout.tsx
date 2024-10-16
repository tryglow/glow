import { Theme } from '@prisma/client';
import Link from 'next/link';

import {
  PremiumOnboardingDialog,
  TeamOnboardingDialog,
} from '@/app/components/PremiumOnboardingDialog';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { defaultThemeSeeds } from '@/lib/theme';

import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

const fetchUserLoggedinStatus = async () => {
  const session = await auth();

  const user = session?.user;

  return {
    user,
  };
};

const fetchPageTheme = (slug: string, domain: string) => {
  const useSlug =
    decodeURIComponent(domain) === process.env.NEXT_PUBLIC_ROOT_DOMAIN;
  return prisma.page.findUnique({
    where: useSlug
      ? { slug, deletedAt: null }
      : { customDomain: decodeURIComponent(domain), deletedAt: null },
    select: {
      theme: true,
      backgroundImage: true,
    },
  });
};

export default async function PageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    slug: string;
    domain: string;
  };
}) {
  const { user } = await fetchUserLoggedinStatus();

  let renderTheme: Partial<Theme> = defaultThemeSeeds.Default;

  const page = await fetchPageTheme(params.slug, params.domain);

  if (page?.theme?.id) {
    renderTheme = page.theme;
  }

  return (
    <>
      {!user && (
        <Button
          variant="default"
          asChild
          className="fixed z-50 top-3 right-3 font-bold flex"
        >
          <Link href="https://glow.as">Built with Glow</Link>
        </Button>
      )}

      <div className="w-full max-w-2xl mx-auto px-3 md:px-6 gap-3 pt-16 pb-8">
        {children}
      </div>

      {page?.backgroundImage && (
        <style>
          {`body {
            background: url(${page.backgroundImage}) no-repeat center center / cover fixed;
          }`}
        </style>
      )}
      <style>
        {`:root {
          --color-sys-bg-base: ${renderTheme.colorBgBase};
          --color-sys-bg-primary: ${renderTheme.colorBgPrimary};
          --color-sys-bg-secondary: ${renderTheme.colorBgSecondary};
          --color-sys-bg-border: ${renderTheme.colorBorderPrimary};
          
          --color-sys-label-primary: ${renderTheme.colorLabelPrimary};
          --color-sys-label-secondary: ${renderTheme.colorLabelSecondary};
          --color-sys-label-tertiary: ${renderTheme.colorLabelTertiary};
        }`}
      </style>

      {user && (
        <>
          <PremiumOnboardingDialog />
          <TeamOnboardingDialog />
        </>
      )}
    </>
  );
}
