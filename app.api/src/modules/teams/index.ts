import { getCurrentUserTeamsSchema } from '@/modules/teams/schemas';
import { getTeamsForUser } from '@/modules/teams/service';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export default async function teamsRoutes(fastify: FastifyInstance, opts: any) {
  fastify.get(
    '/me',
    { schema: getCurrentUserTeamsSchema },
    getCurrentUserTeamsHandler
  );
}

async function getCurrentUserTeamsHandler(
  request: FastifyRequest,
  response: FastifyReply
) {
  const session = await request.server.authenticate(request, response);

  const teams = await getTeamsForUser(session.user.id);

  return teams;
}
