'use strict';

import { tikTokOrchestratorSchema } from '@/modules/orchestrators/schemas';
import { orchestrateTikTok } from '@/modules/orchestrators/tiktok';
import { FastifyInstance, FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';

export default async function orchestratorsRoutes(
  fastify: FastifyInstance,
  opts: any
) {
  fastify.post(
    '/tiktok/create',
    { schema: tikTokOrchestratorSchema },
    tikTokOrchestratorHandler
  );
}

async function tikTokOrchestratorHandler(
  request: FastifyRequest<{
    Body: {
      orchestrationId: string;
    };
  }>,
  response: FastifyReply
) {
  const session = await request.server.authenticate(request, response);

  const { orchestrationId } = request.body;

  const { error, data } = await orchestrateTikTok({
    orchestrationId,
    teamId: session.currentTeamId,
    userId: session.user.id,
  });

  if (error) {
    return response.status(400).send({
      error,
    });
  }

  return response.status(200).send({
    pageSlug: data?.pageSlug,
  });
}
