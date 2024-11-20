'use strict';

import { getCurrentUserTeamIntegrationsSchema } from '@/modules/integrations/schemas';
import { getIntegrationsForTeamId } from '@/modules/integrations/service';
import { captureException } from '@sentry/node';
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
