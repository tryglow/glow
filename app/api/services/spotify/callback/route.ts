import { NextResponse } from 'next/server';

import { auth } from '@/app/lib/auth';
import prisma from '@/lib/prisma';

import { decrypt, encrypt } from '@/lib/encrypt';
import { captureException } from '@sentry/nextjs';
import { requestToken } from './utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const session = await auth();

  if (!session) {
    NextResponse.json({ error: 'Unauthorized' });
    return;
  }

  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    NextResponse.json({ error: 'Error getting token' });
    return;
  }

  try {
    const res = await requestToken({ code });
    const json = await res.json();

    if (!json.access_token) {
      return Response.json({ error: 'Error getting access_token' });
    }

    const encryptedConfig = await encrypt({
      accessToken: json.access_token,
      refreshToken: json.refresh_token,
    });

    const integration = await prisma.integration.create({
      data: {
        // TODO To be cleaned up once userId is dropped from the integration table
        userId: session.user.id,
        teamId: session.currentTeamId,
        type: 'spotify',
        encryptedConfig,
        // TODO Remove this once we drop the old config field.
        config: {},
      },
    });

    // If the state is present, we need to update the block with the integration id
    if (state) {
      const decryptedState = await decrypt<{ blockId: string }>(state);

      if (decryptedState?.blockId) {
        const blockId = decryptedState.blockId;

        await prisma.block.update({
          where: { id: blockId },
          data: { integrationId: integration.id },
        });
      }
    }

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/i/integration-callback/spotify`
    );
  } catch (error) {
    captureException(error);

    NextResponse.json({ error: 'Error getting token' });
  }
}
