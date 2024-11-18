'use strict';

import { getBlockSchema, getEnabledBlockSchema } from './schemas';
import { createBlock, getBlockById, getEnabledBlocks } from './service';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { FastifyInstance, FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';

export default async function blocksRoutes(
  fastify: FastifyInstance,
  opts: any
) {
  fastify.post('/add', postCreateBlockHandler);
  fastify.get('/:blockId', { schema: getBlockSchema }, getBlockHandler);
  fastify.get(
    '/enabled-blocks',
    { schema: getEnabledBlockSchema },
    getEnabledBlocksHandler
  );
}

async function getBlockHandler(
  request: FastifyRequest<{ Params: { blockId: string } }>,
  response: FastifyReply
) {
  const { blockId } = request.params;

  const session = await request.server.authenticate(request, response);

  if (!session?.user) {
    return response.status(401).send({
      error: {
        message: 'Unauthorized',
      },
    });
  }

  const block = await getBlockById(blockId);

  if (!block?.page.publishedAt) {
    if (session?.currentTeamId !== block?.page.teamId) {
      return response.status(404).send({
        error: {
          message: 'Block not found',
        },
      });
    }
  }

  return response.status(200).send(block);
}

async function postCreateBlockHandler(
  request: FastifyRequest<{
    Body: { block: { type: string; id: string }; pageSlug: string };
  }>,
  response: FastifyReply
) {
  const session = await request.server.authenticate(request, response);

  if (!session?.user) {
    return response.status(401).send({
      error: {
        message: 'Unauthorized',
      },
    });
  }

  const { block, pageSlug } = request.body;

  if (!block || !pageSlug) {
    return response.status(400).send({
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
    return response.status(400).send({
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
    return response.status(400).send({
      error: {
        message: 'You have reached the maximum number of blocks per page',
      },
    });
  }

  const newBlock = await createBlock(block, pageSlug);

  return response.status(200).send({
    data: {
      block: newBlock,
    },
  });
}

async function getEnabledBlocksHandler(
  request: FastifyRequest,
  response: FastifyReply
) {
  const session = await request.server.authenticate(request, response);

  if (!session?.user) {
    return response.status(401).send([]);
  }

  const dbUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!dbUser) {
    return response.status(401).send([]);
  }

  const enabledBlocks = await getEnabledBlocks(dbUser);

  return response.status(200).send(enabledBlocks);
}
