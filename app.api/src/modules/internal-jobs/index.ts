'use strict';

import prisma from '@/lib/prisma';
import {
  disableExpiredTrialUsersSchema,
  remindTrialUsersSchema,
} from '@/modules/internal-jobs/schemas';
import {
  sendTrialEndedEmail,
  sendTrialReminderEmail,
} from '@/modules/notifications/service';
import { FastifyInstance, FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';

export default async function internalJobsRoutes(
  fastify: FastifyInstance,
  opts: any
) {
  fastify.post(
    '/cron/disable-expired-trial-users',
    { schema: disableExpiredTrialUsersSchema },
    disableExpiredTrialUsersHandler
  );

  fastify.post(
    '/cron/remind-trial-users',
    { schema: remindTrialUsersSchema },
    remindTrialUsersHandler
  );
}

async function disableExpiredTrialUsersHandler(
  request: FastifyRequest<{ Querystring: { cron_auth: string } }>,
  response: FastifyReply
) {
  const {
    query: { cron_auth },
  } = request;

  if (cron_auth !== process.env.INTERNAL_CRON_SECRET) {
    return response.status(403).send({
      error: 'Unauthorized',
    });
  }

  // Find all expired trial users without premium/team/beta access
  const expiredTrialUsers = await prisma.user.findMany({
    where: {
      createdAt: {
        // Only run this for users created after 16th February 2025
        gt: new Date('2025-02-16'),
      },
      stripeTrialEnd: {
        lt: new Date(), // Trial end date is in the past
        not: null,
      },
      hasPremiumAccess: false,
      hasTeamAccess: false,
      hasBetaAccess: false,
    },
    select: {
      id: true,
      email: true,
    },
  });

  const userIds = expiredTrialUsers.map((user) => user.id);

  const usersToNotify = expiredTrialUsers.filter((user) => user.email);

  // Find all personal teams for these users
  const personalTeams = await prisma.team.findMany({
    where: {
      members: {
        some: {
          userId: {
            in: userIds,
          },
        },
      },
      isPersonal: true,
    },
    select: {
      id: true,
    },
  });

  const teamIds = personalTeams.map((team) => team.id);

  // Update all pages for these teams to be unpublished
  const unpublishedPages = await prisma.page.updateMany({
    where: {
      teamId: {
        in: teamIds,
      },
      publishedAt: {
        not: null,
      },
    },
    data: {
      publishedAt: null,
    },
  });

  for (const user of usersToNotify) {
    if (user.email) {
      await sendTrialEndedEmail(user.email);
    }
  }

  return response.status(200).send({
    success: true,
    usersAffected: expiredTrialUsers.length,
    pagesUnpublished: unpublishedPages.count,
  });
}

async function remindTrialUsersHandler(
  request: FastifyRequest<{ Querystring: { cron_auth: string } }>,
  response: FastifyReply
) {
  const {
    query: { cron_auth },
  } = request;

  if (cron_auth !== process.env.INTERNAL_CRON_SECRET) {
    return response.status(403).send({
      error: 'Unauthorized',
    });
  }

  // Calculate the date for users whose trial ends in 7 days
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  // Find all users whose trial ends in 7 days and don't have premium/team/beta access
  const usersToRemind = await prisma.user.findMany({
    where: {
      createdAt: {
        // Only run this for users created after 16th February 2025
        gt: new Date('2025-02-16'),
      },
      stripeTrialEnd: {
        // Trial ends in exactly 7 days (within the same day)
        gte: new Date(sevenDaysFromNow.setHours(0, 0, 0, 0)),
        lt: new Date(sevenDaysFromNow.setHours(23, 59, 59, 999)),
        not: null,
      },
      hasPremiumAccess: false,
      hasTeamAccess: false,
      hasBetaAccess: false,
    },
    select: {
      id: true,
      email: true,
      name: true,
      stripeTrialEnd: true,
    },
  });

  for (const user of usersToRemind) {
    if (user.email) {
      await sendTrialReminderEmail(user.email);
    }
  }

  return response.status(200).send({
    success: true,
    usersReminded: usersToRemind.length,
  });
}
