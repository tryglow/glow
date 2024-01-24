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

  if (!data) notFound();

  if (user && data?.userId === user.id) {
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

interface Params {
  slug: string;
}

export default async function Page({ params }: { params: Params }) {
  const { slug } = params;
  const { data, isEditMode } = await fetchData(slug);

  const config = data.config as unknown as BlockConfig[];

  const initialData: Record<string, any> = {};

  data.blocks.forEach((block) => {
    initialData[`/api/blocks/${block.id}`] = block.data;
  });

  initialData[`/api/pages/${slug}/layout`] = config;

  return (
    <SWRProvider
      value={{
        fallback: initialData,
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
