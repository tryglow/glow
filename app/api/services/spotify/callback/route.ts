import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth';
import { SpotifyIntegrationConfig } from '@/lib/blocks/spotify-playing-now/config';
import prisma from '@/lib/prisma';

import { requestToken } from './utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const session = await getServerSession(authOptions);

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
        userId: session.user.id,
        type: 'spotify',
      },
    });

    const newData = {
      userId: session.user.id,
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
        },
        data: newData,
      });
    } else {
      await prisma.integration.create({
        data: newData,
      });
    }

    return NextResponse.json({ json });
  } catch (error) {
    console.error('Error getting token', error);

    NextResponse.json({ error: 'Error getting token' });
  }
}
