'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { auth, unstable_update } from '@/lib/auth';
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
    return {
      error: 'You are not in this team',
    };
  }

  try {
    await unstable_update({
      ...session?.user,
      currentTeamId: teamId,
    });
  } catch (error) {
    console.log('Error', error);
    return {
      error: 'Unable to switch team',
    };
  }

  return {
    success: true,
  };
}
