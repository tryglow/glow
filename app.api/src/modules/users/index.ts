'use strict';

import prisma from '@/lib/prisma';
import { getCurrentUserPlanSchema } from '@/modules/users/schemas';
import { getUserPlanDetails } from '@/modules/users/utils';
import { FastifyInstance, FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';

export default async function usersRoutes(fastify: FastifyInstance, opts: any) {
  fastify.get(
    '/me/plan',
    { schema: getCurrentUserPlanSchema },
    getCurrentUserPlanHandler
  );
}

async function getCurrentUserPlanHandler(
  request: FastifyRequest,
  response: FastifyReply
) {
  const session = await request.server.authenticate(request, response);

  const user = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
  });

  if (!user) {
    return response.status(400).send({
      error: 'User not found',
    });
  }

  return response.status(200).send(getUserPlanDetails(user));
}
