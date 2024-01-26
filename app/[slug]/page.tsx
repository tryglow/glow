import { Integration } from '@prisma/client';
import type { Metadata, ResolvingMetadata } from 'next';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

import { authOptions } from '@/lib/auth';
import { BlockConfig, renderBlock } from '@/lib/blocks/ui';
import prisma from '@/lib/prisma';

import { SWRProvider } from '../components/SWRProvider';
import Grid from './grid';

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

  return {
    data,
    integrations,
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
  const { data, integrations, isEditMode } = await fetchData(slug);

  const config = data.config as unknown as BlockConfig[];

  const initialData: Record<string, any> = {
    [`/api/pages/${slug}/layout`]: config,
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
      <Grid layout={config} editMode={isEditMode}>
        {data.blocks
          .filter((block) => config.find((conf) => conf.i === block.id))
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
