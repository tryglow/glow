import 'server-only';

import { TeamInvite } from '@prisma/client';

import { createLoopsClient, transactionalEmailIds } from '@/lib/loops';
import { captureException } from '@sentry/nextjs';

export async function sendTeamInvitationEmail(invite: TeamInvite) {
  const loops = createLoopsClient();

  try {
    await loops.sendTransactionalEmail({
      transactionalId: transactionalEmailIds.invitationToTeam,
      email: invite.email,
      dataVariables: {
        inviteUrl: `https://glow.as/i/invite/${invite.code}`,
      },
    });
  } catch (error) {
    captureException(error);
  }
}
