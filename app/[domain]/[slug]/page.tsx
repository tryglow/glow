import { Integration } from '@prisma/client';
import type { Metadata, ResolvingMetadata } from 'next';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import { auth } from '@/app/lib/auth';
import { renderBlock } from '@/lib/blocks/ui';
import prisma from '@/lib/prisma';
import { isUserAgentMobile } from '@/lib/user-agent';

import { getPageLayout } from '@/app/api/pages/[pageSlug]/layout/actions';
import Grid, { PageConfig } from './grid';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const dynamicParams = true;

const getPageData = async ({
  slug,
  domain,
}: {
  slug?: string;
  domain?: string;
}) => {
  const session = await auth();

  const user = session?.user;

  const page = await prisma.page.findUnique({
    where: {
      deletedAt: null,
      slug,
      customDomain: domain ? decodeURIComponent(domain) : undefined,
    },
    include: {
      blocks: true,
      user: !!user,
    },
  });

  return page;
};

export async function generateMetadata(
  props: { params: Promise<{ slug: string; domain: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const useSlug =
    decodeURIComponent(params.domain) === process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  const page = await getPageData({
    slug: useSlug ? params.slug : undefined,
    domain: useSlug ? undefined : params.domain,
  });

  const parentMeta = await parent;

  return {
    title: `${page?.metaTitle} - Glow` || parentMeta.title?.absolute,
    description: page?.metaDescription || parentMeta.description,
  };
}

interface Params {
  slug: string;
  domain: string;
}

export type InitialDataUsersIntegrations = Pick<
  Integration,
  'id' | 'createdAt' | 'type'
>[];

export default async function Page(props: { params: Promise<Params> }) {
  const params = await props.params;
  const session = await auth();

  const isLoggedIn = !!session?.user;

  const useSlug =
    decodeURIComponent(params.domain) === process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  const commonParams = {
    slug: useSlug ? params.slug : undefined,
    domain: useSlug ? undefined : params.domain,
  };

  const [layout, page] = await Promise.all([
    getPageLayout(commonParams),
    getPageData(commonParams),
  ]);

  if (!page) {
    notFound();
  }

  let isEditMode = false;

  if (session && page?.teamId === session?.currentTeamId) {
    isEditMode = true;
  }

  if (page.publishedAt == null && !isEditMode) {
    return notFound();
  }

  if (
    page.customDomain &&
    page.customDomain !== decodeURIComponent(params.domain) &&
    !isEditMode
  ) {
    redirect(`//${page.customDomain}`);
  }

  const headersList = await headers();
  const isMobile = isUserAgentMobile(headersList.get('user-agent'));

  const pageLayout = layout as unknown as PageConfig;

  const mergedIds = [...pageLayout.sm, ...pageLayout.xxs].map((item) => item.i);

  return (
    <Grid
      isPotentiallyMobile={isMobile}
      layout={pageLayout}
      editMode={isEditMode}
      isLoggedIn={isLoggedIn}
    >
      {page.blocks
        .filter((block) => mergedIds.includes(block.id))
        .map((block) => {
          return (
            <section key={block.id}>
              {renderBlock(block, page.id, isEditMode)}
            </section>
          );
        })}
    </Grid>
  );
}
