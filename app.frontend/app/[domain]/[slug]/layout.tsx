import { RenderPageTheme } from '@/app/[domain]/[slug]/render-page-theme';
import { GlowProviders } from '@/app/components/GlowProviders';
import { UserOnboardingDialog } from '@/app/components/UserOnboardingDialog';
import { getEnabledBlocks } from '@/app/lib/actions/blocks';
import { getTeamIntegrations } from '@/app/lib/actions/integrations';
import {
  getPageBlocks,
  getPageIdBySlugOrDomain,
  getPageLayout,
  getPageSettings,
  getPageTheme,
} from '@/app/lib/actions/page-actions';
import { auth } from '@/app/lib/auth';
import {
  PremiumOnboardingDialog,
  TeamOnboardingDialog,
} from '@/components/PremiumOnboardingDialog';
import { Button } from '@/components/ui/button';
import { pages } from 'next/dist/build/templates/app-page';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Script from 'next/script';

export const dynamic = 'force-dynamic';

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

  const page = await getPageIdBySlugOrDomain(params.slug, params.domain);

  if (!page) {
    return notFound();
  }

  if (!page.publishedAt && session?.currentTeamId !== page.teamId) {
    return notFound();
  }

  let integrations: any;
  let enabledBlocks: any;
  let pageSettings: any;

  if (session?.user) {
    [integrations, enabledBlocks, pageSettings] = await Promise.all([
      getTeamIntegrations(),
      getEnabledBlocks(),
      getPageSettings(page.id),
    ]);
  }

  const [{ blocks, currentUserIsOwner }, pageLayout, pageTheme] =
    await Promise.all([
      getPageBlocks(page.id),
      getPageLayout(page.id),
      getPageTheme(page.id),
    ]);

  const initialData: Record<string, any> = {
    [`/pages/${page.id}/layout`]: pageLayout,
    [`/pages/${page.id}/theme`]: pageTheme,
  };

  if (currentUserIsOwner) {
    initialData['/integrations/me'] = integrations;
    initialData[`/blocks/enabled-blocks`] = enabledBlocks;
    initialData[`/pages/${page.id}/settings`] = pageSettings;
  }

  blocks.forEach((block: any) => {
    initialData[`/blocks/${block.id}`] = {
      blockData: block.data,
    };
  });

  return (
    <GlowProviders
      session={session}
      currentUserIsOwner={currentUserIsOwner}
      pageId={page.id}
      value={{
        fallback: initialData,
        revalidateOnFocus: currentUserIsOwner,
        revalidateOnReconnect: currentUserIsOwner,
        revalidateIfStale: currentUserIsOwner,
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

      <RenderPageTheme pageId={page.id} />

      {session?.user && (
        <>
          <PremiumOnboardingDialog />
          <TeamOnboardingDialog />
          <UserOnboardingDialog />
        </>
      )}

      {!currentUserIsOwner &&
        process.env.NEXT_PUBLIC_TINYBIRD_TRACKER_TOKEN && (
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
