import { getPageTheme } from '@/app/lib/actions/page-actions';
import prisma from '@/lib/prisma';
import { HeaderBlockConfig, headerBlockDefaults } from '@tryglow/blocks';
import 'server-only';

const getPageId = async (pageSlug: string) => {
  const page = await prisma.page.findUnique({
    where: { slug: pageSlug },
  });

  return page?.id;
};

const getHeaderBlock = async (pageId: string) => {
  const header = await prisma.block.findFirst({
    where: {
      page: {
        id: pageId,
        deletedAt: null,
      },
      type: 'header',
    },
    select: {
      data: true,
      page: {
        select: {
          publishedAt: true,
        },
      },
    },
  });

  return header;
};

export async function GET(
  req: Request,
  props: { params: Promise<{ pageSlug: string }> }
) {
  const params = await props.params;
  const pageSlug = params.pageSlug;

  if (!pageSlug) {
    return Response.json({
      error: {
        message: 'Missing required fields',
      },
    });
  }

  const pageId = await getPageId(pageSlug);

  if (!pageId) {
    return Response.json({
      error: {
        message: 'Page not found',
      },
    });
  }

  const [pageTheme, headerBlock] = await Promise.all([
    getPageTheme(pageId),
    getHeaderBlock(pageId),
  ]);

  if (!headerBlock || !headerBlock?.page.publishedAt) {
    return Response.json({
      error: {
        message: 'Page not found',
      },
    });
  }

  const headerBlockData = headerBlock?.data as unknown as HeaderBlockConfig;

  let avatarSrc = headerBlockData?.avatar?.src;

  if (avatarSrc !== headerBlockDefaults.avatar.src) {
    avatarSrc = `${avatarSrc}.png`;
  }

  return Response.json({
    data: {
      theme: {
        colorBgBase: pageTheme?.theme?.colorBgBase,
        colorLabelPrimary: pageTheme?.theme?.colorLabelPrimary,
        colorLabelSecondary: pageTheme?.theme?.colorLabelSecondary,
      },
      headerTitle: headerBlockData?.title ?? `@${pageSlug}`,
      headerDescription: headerBlockData?.description,
      avatarSrc,
    },
  });
}
