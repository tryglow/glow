'use server';

import { sendMemberAcceptedInvitationEmail } from '@/notifications/member-accepted-invitation';
import { createHmac } from 'crypto';

import { auth, unstable_update } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function acceptInvite(inviteCode: string) {
  const session = await auth();

  if (!session) {
    return {
      error: 'You must be logged in to accept an invite',
    };
  }

  const invite = await prisma.teamInvite.findUnique({
    where: {
      code: inviteCode,
      expiresAt: {
        gt: new Date(),
      },
      claimedAt: null,
    },
  });

  if (!invite) {
    return {
      error: 'Invite not found',
    };
  }

  const team = await prisma.team.findUnique({
    where: {
      id: invite.teamId,
      isPersonal: false,
    },
    select: {
      id: true,
      members: {
        select: {
          id: true,
          userId: true,
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });

  if (!team) {
    return {
      error: 'Team not found',
    };
  }

  if (team.members.length >= 5) {
    return {
      error: 'Team is full',
    };
  }

  if (team.members.some((member) => member.userId === session.user.id)) {
    return {
      error: 'You are already a member of this team',
    };
  }

  const newTeamUser = await prisma.teamUser.create({
    data: {
      teamId: invite.teamId,
      userId: session.user.id,
    },
  });

  await prisma.teamInvite.update({
    where: {
      id: invite.id,
    },
    data: {
      claimedAt: new Date(),
      claimedBy: {
        connect: {
          id: newTeamUser.id,
        },
      },
    },
  });

  await unstable_update({
    ...session?.user,
    currentTeamId: team.id,
  });

  const teamEmails = team.members
    .map((member) => member.user.email)
    .filter(Boolean) as string[];

  await sendMemberAcceptedInvitationEmail({
    teamEmails,
    newMemberName: session.user.name || session.user.email,
  });

  return {
    success: true,
  };
}

export async function createInviteCodeHash(inviteCode: string) {
  const secret = process.env.HASHING_SECRET;

  if (!secret) {
    throw new Error('HASHING_SECRET is not set');
  }

  return createHmac('sha256', secret).update(inviteCode).digest('hex');
}

export async function verifyInviteCodeHash(
  inviteCode: string,
  inviteCodeHash: string
) {
  const hashedInviteCode = await createInviteCodeHash(inviteCode);

  return hashedInviteCode === inviteCodeHash;
}
