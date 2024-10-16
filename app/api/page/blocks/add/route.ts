import { createContact } from '@/notifications/create-contact';
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
      deletedAt: null,
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
    include: {
      blocks: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!page) {
    return Response.json({
      error: {
        message: 'Page not found',
      },
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  const maxNumberOfBlocks =
    user?.hasPremiumAccess || user?.hasTeamAccess ? 1000 : 5;
  if (page.blocks.length >= maxNumberOfBlocks) {
    return Response.json({
      error: {
        message: 'You have reached the maximum number of blocks per page',
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
