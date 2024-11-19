'use strict';

import { getCurrentUserTeamIntegrationsSchema } from '@/modules/integrations/schemas';
import { getIntegrationsForTeamId } from '@/modules/integrations/service';
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

  const integrations = await getIntegrationsForTeamId(session.currentTeamId);

  return response.status(200).send(integrations);
}
