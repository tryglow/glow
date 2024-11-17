import { ValidationError } from 'yup';

import { auth } from '@/app/lib/auth';
import { blocksConfig } from '@/lib/blocks/config';
import { Blocks } from '@/lib/blocks/types';
import prisma from '@/lib/prisma';
import { captureException } from '@sentry/nextjs';

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

  const bodyData = await req.json();
  const blockId = params.blockId;

  const { newData } = bodyData;

  if (!blockId || !newData) {
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
  });

  if (!block) {
    return Response.json({
      error: {
        message: 'Block not found',
      },
    });
  }

  const schema = blocksConfig[block.type as Blocks].schema;

  if (!schema) {
    return Response.json({
      error: {
        message: 'Block schema not found',
      },
    });
  }

  try {
    const parsedData = await schema.validate(newData, { strict: true });

    const updatedBlock = await prisma.block.update({
      where: {
        id: blockId,
      },
      data: {
        data: parsedData,
      },
    });

    return Response.json({
      data: {
        block: updatedBlock,
      },
    });
  } catch (error) {
    captureException(error);
    if (error instanceof ValidationError) {
      return Response.json({
        error: {
          message: error.message,
        },
      });
    }
    return Response.json({
      error: {
        message: 'Something went wrong',
      },
    });
  }
}
