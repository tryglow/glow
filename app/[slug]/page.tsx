import {notFound} from 'next/navigation';

import Grid from './grid';
import prisma from '@/lib/prisma';
import {getServerSession} from 'next-auth';
import {authOptions} from '@/lib/auth';
import {BlockConfig, renderBlock} from '@/lib/blocks/ui';
import {EditBlockToolbar} from '../components/EditBlockToolbar';
import {Blocks} from '@/lib/blocks/types';

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

export default async function Page({params}: {params: Params}) {
  const {slug} = params;
  const {data, isEditMode} = await fetchData(slug);

  const config = data.config as unknown as BlockConfig[];

  return (
    <Grid layout={config} editMode={isEditMode}>
      {data.blocks.map((block) => {
        return (
          <section key={block.id}>
            {isEditMode && (
              <EditBlockToolbar
                blockId={block.id}
                blockType={block.type as Blocks}
              />
            )}

            {renderBlock(block, data.id)}
          </section>
        );
      })}
    </Grid>
  );
}
