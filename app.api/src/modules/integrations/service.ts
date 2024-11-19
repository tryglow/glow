import prisma from '@/lib/prisma';

export async function getIntegrationsForTeamId(teamId: string) {
  const integrations = await prisma.integration.findMany({
    where: {
      teamId,
      deletedAt: null,
    },
    select: {
      id: true,
      createdAt: true,
      type: true,
    },
  });

  return integrations;
}
