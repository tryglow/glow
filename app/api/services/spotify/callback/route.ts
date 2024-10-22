import { NextResponse } from 'next/server';

import { auth } from '@/app/lib/auth';
import { SpotifyIntegrationConfig } from '@/lib/blocks/spotify-playing-now/config';
import prisma from '@/lib/prisma';

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
    });

    const newData = {
      // To be cleaned up once userId is dropped from the integration table
      userId: session.user.id,
      teamId: session.currentTeamId,
      type: 'spotify',
      config: {
        accessToken: json.access_token,
        refreshToken: json.refresh_token
          ? json.refresh_token
          : (existingIntegration?.config as unknown as SpotifyIntegrationConfig)
              ?.refreshToken,
      },
    };

    if (existingIntegration) {
      console.log('Updating Spotify integration', existingIntegration.id);
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
    console.error('Error getting token', error);

    NextResponse.json({ error: 'Error getting token' });
  }
}
