import { auth } from '@/app/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  props: { params: Promise<{ blockId: string }> }
) {
  const params = await props.params;
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
      integration: {
        select: {
          id: true,
          type: true,
          createdAt: true,
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

  return Response.json({
    blockData: block.data,
    integration: block.integration,
  });
}
