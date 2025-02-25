'use strict';

import { getPageAnalyticsSchema } from './schemas';
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

  const now = new Date();
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  );
  const sevenDaysAgo = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 7
  );
  sevenDaysAgo.setHours(0, 0, 0, 0);

  try {
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const analyticsResponse = await fetch(
      `https://api.us-west-2.aws.tinybird.co/v0/pipes/page_analytics.json?pageId=${pageId}&fromDate=${formatDate(sevenDaysAgo)}&toDate=${formatDate(endOfToday)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TINYBIRD_API_KEY}`,
        },
      }
    );

    if (!analyticsResponse.ok) {
      return response.status(500).send({});
    }

    const analyticsData = await analyticsResponse.json();

    const totalViews = analyticsData.data.reduce(
      (acc: number, curr: any) => acc + curr.total_views,
      0
    );

    const totalUniqueVisitors = analyticsData.data.reduce(
      (acc: number, curr: any) => acc + curr.unique_visitors,
      0
    );

    return response.status(200).send({
      totals: {
        total_views: totalViews,
        unique_visitors: totalUniqueVisitors,
      },
      data: analyticsData.data,
    });
  } catch (error) {
    captureException(error);
    return response.status(500).send({});
  }
}
