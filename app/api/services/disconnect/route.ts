import { track } from '@vercel/analytics/server';

import { auth } from '@/app/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const { integrationId } = await request.json();
  const session = await auth();

  if (!integrationId) {
    return Response.json({
      error: {
        message: 'Missing integrationId',
      },
    });
  }

  if (!session) {
    return Response.json({
      error: {
        message: 'Unauthorized',
      },
    });
  }

  const integration = await prisma.integration.findUnique({
    where: {
      id: integrationId,
      team: {
        id: session.currentTeamId,
        members: {
          some: {
            userId: session.user.id,
          },
        },
      },
    },
  });

  if (!integration) {
    return Response.json({
      error: {
        message: 'Integration not found',
      },
    });
  }

  await prisma.integration.update({
    where: {
      id: integrationId,
    },
    data: {
      deletedAt: new Date(),
      config: {},
    },
  });

  await track('integrationDisconnected', {
    userId: session.user.id,
    integrationId: integrationId,
    integrationType: integration.type,
  });

  return Response.json({
    message: 'Integration disconnected',
  });
}
