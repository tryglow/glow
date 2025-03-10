'use server';

import { authClient, getSession } from '@/app/lib/auth';

export async function acceptInvite(invitationId: string) {
  const session = await getSession();

  if (!session) {
    return {
      error: 'You must be logged in to accept an invite',
    };
  }

  try {
    await authClient.organization.acceptInvitation({
      invitationId,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error(error);

    return {
      error: 'Failed to accept invite',
    };
  }
}
