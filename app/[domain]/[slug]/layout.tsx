import Link from 'next/link';

import {
  PremiumOnboardingDialog,
  TeamOnboardingDialog,
} from '@/components/PremiumOnboardingDialog';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

import { RenderPageTheme } from '@/app/[domain]/[slug]/render-page-theme';
import { getPageLayout } from '@/app/api/pages/[pageSlug]/layout/actions';
import { getPageSettings } from '@/app/api/pages/[pageSlug]/settings/actions';
import { getPageTheme } from '@/app/api/pages/[pageSlug]/theme/actions';
import { getTeamIntegrations } from '@/app/api/user/integrations/actions';
import { GlowProviders } from '@/app/components/GlowProviders';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

const fetchData = async (slug: string, domain: string) => {
  const useSlug =
    decodeURIComponent(domain) === process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  let isEditMode = false;

  const session = await auth();

  const user = session?.user;

  const data = await prisma.page.findUnique({
    where: useSlug
      ? { slug, deletedAt: null }
      : { customDomain: decodeURIComponent(domain), deletedAt: null },
    include: {
      blocks: true,
      user: !!user,
    },
  });

  if (!data) notFound();

  if (user && data?.teamId === session?.currentTeamId) {
    isEditMode = true;
  }

  if (data.publishedAt == null && !isEditMode) {
    return notFound();
  }

  return {
    data,
    isEditMode,
  };
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

  const [integrations, layout, pageTheme, pageSettings] = await Promise.all([
    getTeamIntegrations(),
    getPageLayout(params.slug),
    getPageTheme(params.slug, params.domain),
    getPageSettings(params.slug),
  ]);

  const { data, isEditMode } = await fetchData(params.slug, params.domain);

  const currentUserIsOwner = pageTheme?.teamId === session?.currentTeamId;

  const initialData: Record<string, any> = {
    [`/api/pages/${params.slug}/layout`]: layout,
    [`/api/pages/${params.slug}/theme`]: pageTheme,
  };

  if (isEditMode) {
    initialData['/api/user/integrations'] = integrations;
    initialData[`/api/pages/${params.slug}/settings`] = pageSettings;
  }

  data.blocks.forEach((block) => {
    initialData[`/api/blocks/${block.id}`] = block.data;
  });

  return (
    <GlowProviders
      session={session}
      value={{
        fallback: initialData,
        revalidateOnFocus: isEditMode,
        revalidateOnReconnect: isEditMode,
        revalidateIfStale: isEditMode,
      }}
    >
      {!session?.user && (
        <Button
          variant="default"
          asChild
          className="fixed z-50 top-3 right-3 font-bold flex"
        >
          <Link href="https://glow.as">Built with Glow</Link>
        </Button>
      )}

      {pageTheme?.publishedAt && !currentUserIsOwner ? (
        <main className="bg-sys-bg-base">
          <div className="w-full max-w-[768px] mx-auto px-3 md:px-6 gap-3 pt-16 pb-8">
            {children}
          </div>
        </main>
      ) : (
        children
      )}

      {(pageTheme?.publishedAt || currentUserIsOwner) && (
        <>
          {pageTheme?.backgroundImage && (
            <style>
              {`body {
                background: url(${pageTheme.backgroundImage}) no-repeat center center / cover fixed;
                }`}
            </style>
          )}
        </>
      )}

      <RenderPageTheme pageSlug={params.slug} />

      {session?.user && (
        <>
          <PremiumOnboardingDialog />
          <TeamOnboardingDialog />
        </>
      )}
    </GlowProviders>
  );
}
