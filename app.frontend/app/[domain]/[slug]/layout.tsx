import { RenderPageTheme } from '@/app/[domain]/[slug]/render-page-theme';
import { getPageSettings } from '@/app/api/pages/[pageSlug]/settings/actions';
import { getTeamIntegrations } from '@/app/api/user/integrations/actions';
import { GlowProviders } from '@/app/components/GlowProviders';
import { UserOnboardingDialog } from '@/app/components/UserOnboardingDialog';
import {
  getPageIdBySlugOrDomain,
  getPageLayout,
  getPageTheme,
} from '@/app/lib/actions/page';
import { auth } from '@/app/lib/auth';
import {
  PremiumOnboardingDialog,
  TeamOnboardingDialog,
} from '@/components/PremiumOnboardingDialog';
import { Button } from '@/components/ui/button';
import { getEnabledBlocks } from '@/lib/actions';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Script from 'next/script';

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

  const pageId = await getPageIdBySlugOrDomain(params.slug, params.domain);

  const [
    { data: page, isEditMode },
    integrations,
    pageLayout,
    pageTheme,
    pageSettings,
    enabledBlocks,
  ] = await Promise.all([
    getPageData(commonParams),
    getTeamIntegrations(),
    getPageLayout(pageId),
    getPageTheme(pageId),
    getPageSettings(commonParams),
    getEnabledBlocks(),
  ]);

  const currentUserIsOwner = pageTheme?.teamId === session?.currentTeamId;

  const initialData: Record<string, any> = {
    // [`/api/pages/${params.slug}/layout`]: layout,
    [`/pages/${pageId}/layout`]: pageLayout,
    [`/pages/${pageId}/theme`]: pageTheme,
  };

  if (isEditMode) {
    initialData['/api/user/integrations'] = integrations;
    initialData[`/blocks/enabled-blocks`] = enabledBlocks;
    initialData[`/api/pages/${params.slug}/settings`] = pageSettings;
  }

  page?.blocks.forEach((block: any) => {
    initialData[`/api/blocks/${block.id}`] = {
      blockData: block.data,
    };
  });

  return (
    <GlowProviders
      session={session}
      currentUserIsOwner={currentUserIsOwner}
      pageId={pageId}
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

      <RenderPageTheme pageId={pageId} />

      {session?.user && (
        <>
          <PremiumOnboardingDialog />
          <TeamOnboardingDialog />
          <UserOnboardingDialog />
        </>
      )}

      {!isEditMode && process.env.NEXT_PUBLIC_TINYBIRD_TRACKER_TOKEN && (
        <Script
          defer
          src="https://unpkg.com/@tinybirdco/flock.js"
          data-host="https://api.us-west-2.aws.tinybird.co"
          data-token={process.env.NEXT_PUBLIC_TINYBIRD_TRACKER_TOKEN}
        />
      )}
    </GlowProviders>
  );
}
