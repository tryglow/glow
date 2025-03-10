'use strict';

import {
  getFlagsForCurrentUserSchema,
  hideOnboardingTourSchema,
} from './schemas';
import prisma from '@/lib/prisma';
import { FastifyInstance, FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';

export default async function flagsRoutes(fastify: FastifyInstance, opts: any) {
  fastify.get(
    '/me',
    { schema: getFlagsForCurrentUserSchema },
    getFlagsForCurrentUserHandler
  );
  fastify.post(
    '/hide-onboarding-tour',
    { schema: hideOnboardingTourSchema },
    hideOnboardingTourHandler
  );
}

async function getFlagsForCurrentUserHandler(
  request: FastifyRequest,
  response: FastifyReply
) {
  const session = await request.server.authenticate(request, response);

  const userFlags = await prisma.userFlag.findMany({
    where: {
      userId: session?.user.id,
    },
    select: {
      key: true,
      value: true,
    },
  });

  return response.status(200).send({
    flags: userFlags,
  });
}

async function hideOnboardingTourHandler(
  request: FastifyRequest,
  response: FastifyReply
) {
  const session = await request.server.authenticate(request, response);

  await prisma.userFlag.updateMany({
    where: {
      userId: session?.user.id,
      key: 'showOnboardingTour',
    },
    data: {
      value: false,
    },
  });

  return response.status(200).send({
    success: true,
  });
}
