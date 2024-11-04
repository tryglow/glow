import 'server-only';

import { captureException } from '@sentry/nextjs';

import { createLoopsClient, transactionalEmailIds } from '@/lib/loops';

export async function sendMemberAcceptedInvitationEmail({
  teamEmails,
  newMemberName,
}: {
  teamEmails: string[];
  newMemberName: string;
}) {
  const loops = createLoopsClient();

  for (const email of teamEmails) {
    try {
      await loops.sendTransactionalEmail({
        transactionalId: transactionalEmailIds.memberAcceptedInvitation,
        email,
        dataVariables: {
          newMemberName,
        },
      });
    } catch (error) {
      captureException(error);
    }
  }
}
