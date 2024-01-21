import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

import { Blocks } from '@/lib/blocks/types';
import { blocksConfig } from '@/lib/blocks/config';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

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
      userId: session.user.id,
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

  return Response.json({
    data: {
      block: newBlock,
    },
  });
}
