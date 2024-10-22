import { auth } from '@/app/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { blockId: string } }
) {
  const session = await auth();

  const blockId = params.blockId;

  if (!blockId) {
    return Response.json(null, {
      status: 400,
    });
  }

  const block = await prisma.block.findUnique({
    where: {
      id: blockId,
    },
    include: {
      page: {
        select: {
          publishedAt: true,
          teamId: true,
        },
      },
    },
  });

  if (!block?.page.publishedAt) {
    if (session?.currentTeamId !== block?.page.teamId) {
      return Response.json(
        {},
        {
          status: 404,
        }
      );
    }
  }

  if (!block) {
    return Response.json(
      {},
      {
        status: 404,
      }
    );
  }

  return Response.json(block.data);
}
