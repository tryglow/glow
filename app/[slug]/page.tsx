import {notFound} from 'next/navigation';

import Grid from './grid';
import prisma from '@/lib/prisma';
import {getServerSession} from 'next-auth';
import {authOptions} from '@/lib/auth';
import {BlockConfig, renderBlock} from '@/lib/blocks/ui';
import {PencilSquareIcon} from '@heroicons/react/24/outline';
import {EditSectionToolbar} from '../components/EditSectionToolbar';

const fetchData = async (slug: string) => {
  let isEditMode = false;

  const session = await getServerSession(authOptions);

  const user = session?.user;

  const data = await prisma.page.findUnique({
    where: {
      slug,
    },
    include: {
      sections: true,
      user: !!user,
    },
  });

  if (!data) notFound();

  if (user && data?.userId === user.id) {
    isEditMode = true;
  }

  if (!data.sections || data.sections.length === 0) {
    console.log('Page exists, but no sections found for page', {
      extra: {
        pageSlug: data.slug,
        pageId: data.id,
      },
    });
    return notFound();
  }

  if (!data.config) {
    console.log('This page is completely fucked, no config found');
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
      {data.sections.map((section) => {
        return (
          <section key={section.id}>
            {isEditMode && <EditSectionToolbar sectionId={section.id} />}

            {renderBlock(section, data.id)}
          </section>
        );
      })}
    </Grid>
  );
}
