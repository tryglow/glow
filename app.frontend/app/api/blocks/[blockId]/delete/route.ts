import { Prisma } from '@prisma/client';

import { auth } from '@/app/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(
  req: Request,
  props: { params: Promise<{ blockId: string }> }
) {
  const params = await props.params;
  const session = await auth();

  if (!session) {
    return Response.json({
      message: 'error',
      data: null,
    });
  }

  const blockId = params.blockId;

  if (!blockId) {
    return Response.json({
      error: {
        message: 'Missing required fields',
      },
    });
  }

  const block = await prisma.block.findUnique({
    where: {
      id: blockId,
      page: {
        team: {
          id: session.currentTeamId,
          members: {
            some: {
              userId: session.user.id,
            },
          },
        },
      },
    },
    include: {
      page: true,
    },
  });

  if (!block) {
    return Response.json({
      error: {
        message: 'Block not found',
      },
    });
  }

  if (block.type === 'header') {
    return Response.json({
      error: {
        message: 'You cannot delete the header block',
      },
    });
  }

  // Delete the block
  const deletedBlock = await prisma.block.delete({
    where: {
      id: blockId,
    },
  });

  if (block.page.config && Array.isArray(block.page.config)) {
    await prisma.page.update({
      where: {
        id: block.page.id,
      },
      data: {
        config: block.page?.config?.filter(
          (blck) => (blck as Prisma.JsonObject)?.i !== blockId
        ),
      },
    });
  }

  return Response.json({
    data: {
      block: deletedBlock.id,
    },
  });
}
