import { track } from '@vercel/analytics/server';

import { auth } from '@/lib/auth';
import { blocksConfig } from '@/lib/blocks/config';
import { Blocks } from '@/lib/blocks/types';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const session = await auth();

  if (!session) {
    return Response.json({
      message: 'error',
      data: null,
    });
  }

  const bodyData = await req.json();

  const { block, pageSlug } = bodyData;

  if (!block || !pageSlug) {
    return Response.json({
      error: {
        message: 'Missing required fields',
      },
    });
  }

  const page = await prisma.page.findUnique({
    where: {
      team: {
        id: session.currentTeamId,
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
      slug: pageSlug,
    },
  });

  if (!page) {
    return Response.json({
      error: {
        message: 'Page not found',
      },
    });
  }

  const defaultData = blocksConfig[block.type as Blocks].defaults;

  const newBlock = await prisma.block.create({
    data: {
      type: block.type,
      id: block.id,
      config: {},
      data: defaultData,
      page: {
        connect: {
          slug: pageSlug,
        },
      },
    },
  });

  await track('blockCreated', {
    userId: session.user.id,
    blockId: newBlock.id,
    blockType: block.type,
  });

  return Response.json({
    data: {
      block: newBlock,
    },
  });
}
