import prisma from '@/lib/prisma';

export async function getTeamsForUser(userId: string) {
  const teams = await prisma.team.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
  });

  return teams;
}
