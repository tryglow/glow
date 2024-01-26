import { Integration } from '@prisma/client';
import type { Metadata, ResolvingMetadata } from 'next';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';
import { Layout } from 'react-grid-layout';

import { authOptions } from '@/lib/auth';
import { renderBlock } from '@/lib/blocks/ui';
import prisma from '@/lib/prisma';

import { SWRProvider } from '../components/SWRProvider';
import Grid, { PageConfig } from './grid';

// export const dynamic = 'force-dynamic';
// export const revalidate = 0;
// export const dynamicParams = true;

export const revalidate = 60;
export const dynamicParams = true;

const fetchData = async (slug: string) => {
  let isEditMode = false;

  const session = await getServerSession(authOptions);

  const user = session?.user;

  const data = await prisma.page.findUnique({
    where: {
      slug,
    },
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

  if (user && data?.userId === user.id) {
    isEditMode = true;
  }

  if (data.publishedAt == null && !isEditMode) {
    return notFound();
  }

  const smallLayout = (data.config as unknown as Layout[])?.map(
    (layoutItem: Layout) => ({
      ...layoutItem,
      w: 12,
    })
  );

  console.log('Page Generated', new Date().toLocaleString());

  const layout = {
    sm: data.config,
    xss: smallLayout,
  };

  return {
    data,
    integrations,
    layout,
    isEditMode,
  };
};

export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const pageSlug = params.slug;

  const { data } = await fetchData(pageSlug);

  const parentMeta = await parent;

  return {
    title: data.metaTitle || parentMeta.title?.absolute,
    description: data.metaDescription || parentMeta.description,
  };
}

interface Params {
  slug: string;
}

export type InitialDataUsersIntegrations = Pick<
  Integration,
  'id' | 'createdAt' | 'type'
>[];

export default async function Page({ params }: { params: Params }) {
  const { slug } = params;
  const { data, layout, integrations, isEditMode } = await fetchData(slug);

  const pageLayout = layout as unknown as PageConfig;

  const initialData: Record<string, any> = {
    [`/api/pages/${slug}/layout`]: layout,
  };

  if (isEditMode) {
    initialData['/api/user/integrations'] = integrations;
  }

  data.blocks.forEach((block) => {
    initialData[`/api/blocks/${block.id}`] = block.data;
  });

  return (
    <SWRProvider
      value={{
        fallback: initialData,
        revalidateOnFocus: isEditMode,
        revalidateOnReconnect: isEditMode,
        revalidateIfStale: isEditMode,
      }}
    >
      <Grid layout={pageLayout} editMode={isEditMode}>
        {data.blocks
          .filter((block) => pageLayout.sm?.find((conf) => conf.i === block.id))
          .map((block) => {
            return (
              <section key={block.id}>
                {renderBlock(block, data.id, isEditMode)}
              </section>
            );
          })}
      </Grid>
    </SWRProvider>
  );
}
