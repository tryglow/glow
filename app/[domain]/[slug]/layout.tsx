import Link from 'next/link';

import {
  PremiumOnboardingDialog,
  TeamOnboardingDialog,
} from '@/components/PremiumOnboardingDialog';

import { auth } from '@/app/lib/auth';
import prisma from '@/lib/prisma';

import { RenderPageTheme } from '@/app/[domain]/[slug]/render-page-theme';
import { getEnabledBlocks } from '@/app/api/blocks/enabled-blocks/actions';
import { getPageLayout } from '@/app/api/pages/[pageSlug]/layout/actions';
import { getPageSettings } from '@/app/api/pages/[pageSlug]/settings/actions';
import { getPageTheme } from '@/app/api/pages/[pageSlug]/theme/actions';
import { getTeamIntegrations } from '@/app/api/user/integrations/actions';
import { GlowProviders } from '@/app/components/GlowProviders';
import { UserOnboardingDialog } from '@/app/components/UserOnboardingDialog';
import { Button } from '@/components/ui/button';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

const getPageData = async ({
  slug,
  domain,
}: {
  slug?: string;
  domain?: string;
}) => {
  let isEditMode = false;

  const session = await auth();

  const user = session?.user;

  const data = await prisma.page.findUnique({
    where: {
      slug,
      customDomain: domain ? decodeURIComponent(domain) : undefined,
      deletedAt: null,
    },
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

export default async function PageLayout(props: {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
    domain: string;
  }>;
}) {
  const params = await props.params;

  const { children } = props;

  const session = await auth();

  const isCustomDomain =
    decodeURIComponent(params.domain) !== process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  const commonParams = {
    slug: isCustomDomain ? undefined : params.slug,
    domain: isCustomDomain ? params.domain : undefined,
  };

  const [
    { data: page, isEditMode },
    integrations,
    layout,
    pageTheme,
    pageSettings,
    enabledBlocks,
  ] = await Promise.all([
    getPageData(commonParams),
    getTeamIntegrations(),
    getPageLayout(commonParams),
    getPageTheme(commonParams),
    getPageSettings(commonParams),
    getEnabledBlocks(),
  ]);

  const currentUserIsOwner = pageTheme?.teamId === session?.currentTeamId;

  const initialData: Record<string, any> = {
    [`/api/pages/${params.slug}/layout`]: layout,
    [`/api/pages/${params.slug}/theme`]: pageTheme,
  };

  if (isEditMode) {
    initialData['/api/user/integrations'] = integrations;
    initialData['/api/blocks/enabled-blocks'] = enabledBlocks;
    initialData[`/api/pages/${params.slug}/settings`] = pageSettings;
  }

  page?.blocks.forEach((block) => {
    initialData[`/api/blocks/${block.id}`] = block;
  });

  return (
    <GlowProviders
      session={session}
      currentUserIsOwner={currentUserIsOwner}
      value={{
        fallback: initialData,
        revalidateOnFocus: isEditMode,
        revalidateOnReconnect: isEditMode,
        revalidateIfStale: isEditMode,
      }}
    >
      {/* {!session?.user && (
        <Button
          variant="default"
          asChild
          className="fixed z-50 top-3 right-3 font-bold flex"
        >
          <Link href="https://glow.as">Built with Glow</Link>
        </Button>
      )} */}

      {pageTheme?.publishedAt && !currentUserIsOwner ? (
        <main className="bg-sys-bg-base min-h-screen">
          <div className="w-full max-w-[672px] mx-auto px-3 md:px-6 gap-3 pt-16 pb-8">
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
          <UserOnboardingDialog />
        </>
      )}
    </GlowProviders>
  );
}
