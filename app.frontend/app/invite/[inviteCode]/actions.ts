'use server';

import { authClient, getSession } from '@/app/lib/auth';
import { createHmac } from 'crypto';

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
