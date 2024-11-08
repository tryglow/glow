import { NextResponse } from 'next/server';

import { auth } from '@/app/lib/auth';
import { SpotifyIntegrationConfig } from '@/lib/blocks/spotify-playing-now/config';
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

    const existingIntegration = await prisma.integration.findFirst({
      where: {
        teamId: session.currentTeamId,
        deletedAt: null,
        type: 'spotify',
      },
      select: {
        id: true,
        encryptedConfig: true,
      },
    });

    let existingConfigDecrypted: SpotifyIntegrationConfig | null = null;

    if (existingIntegration?.encryptedConfig) {
      existingConfigDecrypted = await decrypt(
        existingIntegration.encryptedConfig
      );
    }

    const encryptedConfig = await encrypt({
      accessToken: json.access_token,
      refreshToken: json.refresh_token
        ? json.refresh_token
        : existingConfigDecrypted?.refreshToken,
    });

    const newData = {
      // TODO To be cleaned up once userId is dropped from the integration table
      userId: session.user.id,
      teamId: session.currentTeamId,
      type: 'spotify',
      encryptedConfig,
      // TODO Remove this once we drop the old config field.
      config: {},
    };

    if (existingIntegration) {
      console.info('Updating Spotify integration', existingIntegration.id);

      await prisma.integration.update({
        where: {
          id: existingIntegration.id,
          deletedAt: null,
        },
        data: newData,
      });
    } else {
      await prisma.integration.create({
        data: newData,
      });
    }

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/i/integration-callback/spotify`
    );
  } catch (error) {
    captureException(error);

    NextResponse.json({ error: 'Error getting token' });
  }
}
