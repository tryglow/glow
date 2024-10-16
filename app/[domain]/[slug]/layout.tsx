import { Theme } from '@prisma/client';
import Link from 'next/link';

import {
  PremiumOnboardingDialog,
  TeamOnboardingDialog,
} from '@/components/PremiumOnboardingDialog';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { defaultThemeSeeds, themeColorToCssValue } from '@/lib/theme';

import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

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
      publishedAt: true,
      teamId: true,
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
  const session = await auth();

  let renderTheme: Partial<Theme> = defaultThemeSeeds.Default;

  const page = await fetchPageTheme(params.slug, params.domain);

  const currentUserIsOwner = page?.teamId === session?.currentTeamId;

  // We should only show the custom theme if the page is published or the user is logged in
  if (page?.publishedAt || currentUserIsOwner) {
    if (page?.theme?.id) {
      renderTheme = page.theme;
    }
  }

  return (
    <>
      {!session?.user && (
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

      {(page?.publishedAt || currentUserIsOwner) && (
        <>
          {page?.backgroundImage && (
            <style>
              {`body {
                background: url(${page.backgroundImage}) no-repeat center center / cover fixed;
                }`}
            </style>
          )}
        </>
      )}

      <style>
        {`:root {
          --color-sys-bg-base: ${themeColorToCssValue(renderTheme.colorBgBase)};
          --color-sys-bg-primary: ${themeColorToCssValue(renderTheme.colorBgPrimary)};
          --color-sys-bg-secondary: ${themeColorToCssValue(renderTheme.colorBgSecondary)};
          --color-sys-bg-border: ${themeColorToCssValue(renderTheme.colorBorderPrimary)};
          
          --color-sys-label-primary: ${themeColorToCssValue(renderTheme.colorLabelPrimary)};
          --color-sys-label-secondary: ${themeColorToCssValue(renderTheme.colorLabelSecondary)};
          --color-sys-label-tertiary: ${themeColorToCssValue(renderTheme.colorLabelTertiary)};
        }`}
      </style>

      {session?.user && (
        <>
          <PremiumOnboardingDialog />
          <TeamOnboardingDialog />
        </>
      )}
    </>
  );
}
