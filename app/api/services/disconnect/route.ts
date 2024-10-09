import { track } from '@vercel/analytics/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const { integrationId } = await request.json();
  const session = await getServerSession(authOptions);

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
      userId: session.user.id,
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
