import {getServerSession} from 'next-auth';
import {authOptions} from '@/lib/auth';
import prisma from '@/lib/prisma';
import {Prisma} from '@prisma/client';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({
      message: 'error',
      data: null,
    });
  }

  const bodyData = await req.json();

  const {blockId} = bodyData;

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
        userId: session.user.id,
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
