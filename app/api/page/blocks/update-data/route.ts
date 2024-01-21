import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { blocksConfig } from '@/lib/blocks/config';
import { Blocks } from '@/lib/blocks/types';
import { ValidationError } from 'yup';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({
      message: 'error',
      data: null,
    });
  }

  const bodyData = await req.json();

  const { blockId, newData } = bodyData;

  console.log('New Data', newData);

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
        userId: session.user.id,
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
