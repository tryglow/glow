'use strict';

import prisma from '@/lib/prisma';
import {
  connectBlockSchema,
  disconnectBlockSchema,
  disconnectIntegrationSchema,
  getCurrentUserTeamIntegrationsSchema,
} from '@/modules/integrations/schemas';
import {
  disconnectIntegration,
  getIntegrationsForTeamId,
} from '@/modules/integrations/service';
import { captureException } from '@sentry/node';
import { Blocks, blocks } from '@tryglow/blocks';
import { FastifyInstance, FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';

export default async function integrationsRoutes(
  fastify: FastifyInstance,
  opts: any
) {
  fastify.get(
    '/me',
    { schema: getCurrentUserTeamIntegrationsSchema },
    getCurrentUserTeamIntegrationsHandler
  );

  fastify.post(
    '/disconnect',
    { schema: disconnectIntegrationSchema },
    disconnectIntegrationHandler
  );

  fastify.post(
    '/connect-block',
    { schema: connectBlockSchema },
    connectBlockHandler
  );

  fastify.post(
    '/disconnect-block',
    { schema: disconnectBlockSchema },
    disconnectBlockHandler
  );
}

async function getCurrentUserTeamIntegrationsHandler(
  request: FastifyRequest,
  response: FastifyReply
) {
  const session = await request.server.authenticate(request, response);

  if (!session.currentTeamId || session.currentTeamId === '') {
    captureException(
      new Error('User tried to create a TikTok page without a team')
    );

    return response.status(400).send({
      error: 'No team found',
    });
  }

  const integrations = await getIntegrationsForTeamId(session.currentTeamId);

  return response.status(200).send(integrations);
}

async function disconnectIntegrationHandler(
  request: FastifyRequest<{ Body: { integrationId: string } }>,
  response: FastifyReply
) {
  const session = await request.server.authenticate(request, response);

  const { integrationId } = request.body;

  const integration = await prisma.integration.findUnique({
    where: {
      id: integrationId,
      team: {
        id: session.currentTeamId,
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    },
    select: {
      type: true,
    },
  });

  if (!integration) {
    return response.status(400).send({
      error: 'Integration not found',
    });
  }

  try {
    await disconnectIntegration(integrationId);
    return response.status(200).send({
      success: true,
    });
  } catch (error) {
    captureException(error);

    return response.status(500).send({
      error: 'Failed to disconnect integration',
    });
  }
}

async function connectBlockHandler(
  request: FastifyRequest<{ Body: { integrationId: string; blockId: string } }>,
  response: FastifyReply
) {
  const session = await request.server.authenticate(request, response);

  const { integrationId, blockId } = request.body;

  const integration = await prisma.integration.findUnique({
    where: {
      id: integrationId,
      deletedAt: null,
      team: {
        id: session.currentTeamId,
      },
    },
  });

  if (!integration) {
    return response.status(400).send({
      error: 'Integration not found',
    });
  }

  const block = await prisma.block.findUnique({
    where: {
      id: blockId,
      page: {
        teamId: session.currentTeamId,
      },
    },
  });

  if (!block) {
    return response.status(400).send({
      error: 'Block not found',
    });
  }

  const allowedIntegrationForBlock =
    blocks[block.type as Blocks].integrationType;

  if (allowedIntegrationForBlock !== integration.type) {
    return response.status(400).send({
      error: 'Invalid integration for block',
    });
  }

  try {
    await prisma.block.update({
      where: {
        id: blockId,
      },
      data: {
        integration: {
          connect: {
            id: integrationId,
          },
        },
      },
    });

    return response.status(200).send({
      success: true,
    });
  } catch (error) {
    captureException(error);

    return response.status(500).send({
      error: 'Failed to connect block to integration',
    });
  }
}

async function disconnectBlockHandler(
  request: FastifyRequest<{ Body: { blockId: string } }>,
  response: FastifyReply
) {
  const session = await request.server.authenticate(request, response);

  const { blockId } = request.body;

  const block = await prisma.block.findUnique({
    where: {
      id: blockId,
      page: {
        teamId: session.currentTeamId,
      },
    },
  });

  if (!block) {
    return response.status(400).send({
      error: 'Block not found',
    });
  }

  await prisma.block.update({
    where: {
      id: blockId,
    },
    data: {
      integration: {
        disconnect: true,
      },
    },
  });

  return response.status(200).send({
    success: true,
  });
}