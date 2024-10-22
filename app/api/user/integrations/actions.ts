'use server';

import { auth } from '@/app/lib/auth';
import prisma from '@/lib/prisma';

export async function getTeamIntegrations() {
  const session = await auth();

  if (!session) {
    return null;
  }

  const teamId = session?.currentTeamId;

  if (!teamId) {
    return null;
  }

  const integrations = await prisma.integration.findMany({
    select: {
      id: true,
      createdAt: true,
      type: true,
    },
    where: {
      teamId,
      deletedAt: null,
    },
  });

  return integrations;
}
