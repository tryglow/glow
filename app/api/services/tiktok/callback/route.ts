import { NextResponse } from 'next/server';

import { auth } from '@/app/lib/auth';
import prisma from '@/lib/prisma';

import { encrypt, isEncrypted } from '@/lib/encrypt';
import { captureException } from '@sentry/nextjs';
import { requestToken } from './utils';

interface TikTokTokenResponse {
  open_id: string;
  scope: string;
  access_token: string;
  refresh_token: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const session = await auth();

  if (!session) {
    return Response.json({
      error: {
        message: 'Unauthorized',
      },
    });
  }

  const code = searchParams.get('code');

  if (!code) {
    return Response.json({
      error: {
        message: 'Error getting code',
      },
    });
  }

  try {
    const res = await requestToken({ code });

    const data = (await res.json()) as TikTokTokenResponse;
    
    const encryptedConfig = await encrypt({
      accessToken: data.access_token,
      tikTokOpenId: data.open_id,
      refreshToken: data.refresh_token,
    });
    

    if (!(await isEncrypted(encryptedConfig))) {
      return Response.json({
        error: {
          message: 'Failed to encrypt config',
        },
      });
    }

    await prisma.integration.create({
      data: {
        // To be cleaned up once userId is dropped from the integration table
        userId: session.user.id,
        teamId: session.currentTeamId,
        type: 'tiktok',
        config: {},
        encryptedConfig,
      },
    });

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/i/integration-callback/tiktok`
    );
  } catch (error) {
    captureException(error);
    return Response.json({
      error: {
        message: 'Error getting token',
      },
    });
  }
}
