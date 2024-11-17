'use server';

import { sendTeamInvitationEmail } from '@/notifications/team-invitation';

import { auth } from '@/app/lib/auth';
import prisma from '@/lib/prisma';

import { FormValues } from './EditTeamSettingsGeneralForm';
import { TeamInviteFormValues } from './EditTeamSettingsMembersForm';
import { teamInviteSchema } from './shared';

export const fetchTeamSettings = async () => {
  const session = await auth();

  if (!session) {
    return null;
  }

  const team = await prisma.team.findFirst({
    where: {
      id: session.currentTeamId,
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  return {
    team,
  };
};

export const fetchTeamMembers = async () => {
  const session = await auth();

  if (!session) {
    return {
      members: [],
      invites: [],
    };
  }

  const team = await prisma.team.findFirst({
    where: {
      id: session.currentTeamId,
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  if (team?.isPersonal) {
    return {
      members: [],
      invites: [],
    };
  }

  const members = await prisma.teamUser.findMany({
    where: {
      teamId: team?.id,
    },
    select: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  const invites = await prisma.teamInvite.findMany({
    where: {
      teamId: team?.id,
      claimedAt: null,
      claimedById: null,
    },
  });

  return {
    members,
    invites,
  };
};

export const updateGeneralTeamSettings = async (values: FormValues) => {
  const session = await auth();

  if (!session) {
    return {
      error: { message: 'You must be logged in to update team settings' },
    };
  }

  const teamId = session.currentTeamId;

  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  if (!team) {
    return {
      error: { message: 'You must be in a team to update team settings' },
    };
  }

  // TODO: Update team settings
};

export const createTeamInvite = async (values: TeamInviteFormValues) => {
  const session = await auth();

  if (!session) {
    return {
      error: { message: 'You must be logged in to create a team invite' },
    };
  }

  const teamId = session.currentTeamId;

  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  if (!team) {
    return {
      error: { message: 'You must be in a team to create a team invite' },
    };
  }

  const validatedValues = teamInviteSchema.safeParse(values);

  if (!validatedValues.success) {
    return {
      error: { message: validatedValues.error.message },
    };
  }

  const invite = await prisma.teamInvite.create({
    data: {
      teamId,
      email: validatedValues.data.email,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week
    },
  });

  await sendTeamInvitationEmail(invite);

  return {
    invite,
  };
};
