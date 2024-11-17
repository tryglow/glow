import 'server-only';

import { getPageTheme } from '@/app/api/pages/[pageSlug]/theme/actions';
import {
  HeaderBlockConfig,
  defaults as headerDefaults,
} from '@/lib/blocks/header/config';
import prisma from '@/lib/prisma';

const getHeaderBlock = async (pageSlug: string) => {
  const header = await prisma.block.findFirst({
    where: {
      page: {
        slug: pageSlug,
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

  const [pageTheme, headerBlock] = await Promise.all([
    getPageTheme({ slug: params.pageSlug }),
    getHeaderBlock(pageSlug),
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

  if (avatarSrc !== headerDefaults.avatar.src) {
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
