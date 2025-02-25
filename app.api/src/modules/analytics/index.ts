'use strict';

import { getPageAnalyticsSchema } from './schemas';
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

  if (pageId !== 'c1c5aa2f-f5ff-4245-a1d9-2a18cfcba6b6') {
    return response.status(404).send({});
  }

  const session = await request.server.authenticate(request, response);

  const userHasAccess = await checkUserHasAccessToPage(pageId, session.user.id);

  if (!userHasAccess) {
    return response.status(403).send({});
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
