import { Integration } from '@prisma/client';
import type { Metadata, ResolvingMetadata } from 'next';
import { getServerSession } from 'next-auth';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import { authOptions } from '@/lib/auth';
import { renderBlock } from '@/lib/blocks/ui';
import prisma from '@/lib/prisma';
import { isUserAgentMobile } from '@/lib/user-agent';

import { GlowProviders } from '../../components/GlowProviders';
import Grid, { PageConfig } from './grid';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const dynamicParams = true;

const fetchData = async (slug: string, domain: string) => {
  const useSlug =
    decodeURIComponent(domain) === process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  let isEditMode = false;

  const session = await getServerSession(authOptions);

  const user = session?.user;

  const data = await prisma.page.findUnique({
    where: useSlug ? { slug } : { customDomain: decodeURIComponent(domain) },
    include: {
      blocks: true,
      user: !!user,
    },
  });

  let integrations: any = [];

  if (user) {
    integrations = await prisma.integration.findMany({
      where: {
        userId: user.id,
      },
    });
  }

  if (!data) notFound();

  if (user && data?.teamId === session?.currentTeamId) {
    isEditMode = true;
  }

  if (data.publishedAt == null && !isEditMode) {
    return notFound();
  }

  const layout = {
    sm: data.config,
    xxs: data.mobileConfig,
  };

  return {
    data,
    integrations,
    layout,
    isEditMode,
    isLoggedIn: !!user,
  };
};

const fetchTeamInfo = async () => {
  const session = await getServerSession(authOptions);

  const user = session?.user;

  if (!user || !session?.currentTeamId)
    return {
      teamPages: null,
    };

  const teamPages = await prisma.page.findMany({
    where: {
      team: {
        id: session.currentTeamId,
        members: {
          some: {
            userId: user.id,
          },
        },
      },
    },
  });

  return {
    teamPages,
  };
};

export async function generateMetadata(
  { params }: { params: { slug: string; domain: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { data } = await fetchData(params.slug, params.domain);

  const parentMeta = await parent;

  return {
    title: `${data.metaTitle} - Glow` || parentMeta.title?.absolute,
    description: data.metaDescription || parentMeta.description,
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
  const { data, layout, integrations, isEditMode, isLoggedIn } =
    await fetchData(params.slug, params.domain);

  if (
    data.customDomain &&
    data.customDomain !== decodeURIComponent(params.domain) &&
    !isEditMode
  ) {
    redirect(`//${data.customDomain}`);
  }

  const headersList = headers();

  const isMobile = isUserAgentMobile(headersList.get('user-agent'));

  const { teamPages } = await fetchTeamInfo();
  const session = await getServerSession(authOptions);

  const pageLayout = layout as unknown as PageConfig;

  const initialData: Record<string, any> = {
    [`/api/pages/${params.slug}/layout`]: layout,
  };

  if (isEditMode) {
    initialData['/api/user/integrations'] = integrations;
  }

  data.blocks.forEach((block) => {
    initialData[`/api/blocks/${block.id}`] = block.data;
  });

  const mergedIds = [...pageLayout.sm, ...pageLayout.xxs].map((item) => item.i);

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
      <Grid
        isPotentiallyMobile={isMobile}
        layout={pageLayout}
        editMode={isEditMode}
        teamPages={teamPages}
        isLoggedIn={isLoggedIn}
      >
        {data.blocks
          .filter((block) => mergedIds.includes(block.id))
          .map((block) => {
            return (
              <section key={block.id}>
                {renderBlock(block, data.id, isEditMode)}
              </section>
            );
          })}
      </Grid>
    </GlowProviders>
  );
}
