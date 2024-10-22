import { Integration } from '@prisma/client';
import type { Metadata, ResolvingMetadata } from 'next';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { renderBlock } from '@/lib/blocks/ui';
import prisma from '@/lib/prisma';
import { isUserAgentMobile } from '@/lib/user-agent';

import { getPageLayout } from '@/app/api/pages/[pageSlug]/layout/actions';
import Grid, { PageConfig } from './grid';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const dynamicParams = true;

const getPageData = async (slug: string, domain: string) => {
  const useSlug =
    decodeURIComponent(domain) === process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  const session = await auth();

  const user = session?.user;

  const page = await prisma.page.findUnique({
    where: useSlug
      ? { slug, deletedAt: null }
      : { customDomain: decodeURIComponent(domain), deletedAt: null },
    include: {
      blocks: true,
      user: !!user,
    },
  });

  return page;
};

export async function generateMetadata(
  { params }: { params: { slug: string; domain: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const page = await getPageData(params.slug, params.domain);

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

export default async function Page({ params }: { params: Params }) {
  const session = await auth();

  const isLoggedIn = !!session?.user;

  const [layout, page] = await Promise.all([
    getPageLayout(params.slug),
    getPageData(params.slug, params.domain),
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

  const headersList = headers();
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
