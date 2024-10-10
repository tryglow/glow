'use server';

import { cookies } from 'next/headers';

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function switchTeam(teamId: string) {
  const session = await auth();
  const currentTeamId = session?.currentTeamId;

  if (currentTeamId === teamId) {
    return;
  }

  const checkIfUserIsInTeam = await prisma.teamUser.findFirst({
    where: {
      userId: session?.user.id,
      teamId,
    },
  });

  if (!checkIfUserIsInTeam) {
    return;
  }

  const updatedToken = {
    ...session?.user,
    currentTeamId: '123',
  };
  cookies().set('next-auth.session-token', JSON.stringify(updatedToken));

  return;
}
