'use strict';

import { getPageAnalyticsSchema } from './schemas';
import prisma from '@/lib/prisma';
import { fetchTopLocations } from '@/modules/analytics/service';
import { fetchStats } from '@/modules/analytics/service';
import { checkUserHasAccessToPage } from '@/modules/pages/service';
import { captureException } from '@sentry/node';
import { FastifyInstance, FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';

export default async function analyticsRoutes(
  fastify: FastifyInstance,
  opts: any
) {
  fastify.get(
    '/pages/:pageId',
    { schema: getPageAnalyticsSchema },
    getPageAnalyticsHandler
  );
}

async function getPageAnalyticsHandler(
  request: FastifyRequest<{ Params: { pageId: string } }>,
  response: FastifyReply
) {
  const { pageId } = request.params;

  const session = await request.server.authenticate(request, response);

  const userHasAccess = await checkUserHasAccessToPage(pageId, session.user.id);

  if (!userHasAccess) {
    return response.status(403).send({});
  }

  const page = await prisma.page.findFirst({
    where: {
      id: pageId,
      deletedAt: null,
    },
    select: {
      createdAt: true,
    },
    take: 1,
  });

  if (!page) {
    return response.status(404).send({});
  }

  // If the page was created less than 7 days ago, return null
  if (
    new Date(page.createdAt).getTime() >
    new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).getTime()
  ) {
    return response.status(400).send({
      error: {
        code: 'NOT_ENOUGH_DATA',
        message: 'There is not enough data to show analytics yet.',
      },
    });
  }

  try {
    const [stats, topLocations] = await Promise.all([
      fetchStats(pageId),
      fetchTopLocations(pageId),
    ]);

    return response.status(200).send({
      stats,
      locations: topLocations,
    });
  } catch (error) {
    captureException(error);
    return response.status(500).send({});
  }
}
