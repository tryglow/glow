import { NextResponse } from 'next/server';

import { auth } from '@/app/lib/auth';
import prisma from '@/lib/prisma';

import { encrypt, isEncrypted } from '@/lib/encrypt';
import { captureException } from '@sentry/nextjs';
import { requestLongLivedToken, requestToken } from './utils';

interface InstagramTokenResponse {
  access_token: string;
  user_id: number;
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

    const data = (await res.json()) as InstagramTokenResponse;

    const longLivedTokenResponse = await requestLongLivedToken({
      accessToken: data.access_token,
    });

    const longLivedToken = await longLivedTokenResponse.json();

    const encryptedConfig = await encrypt({
      accessToken: longLivedToken.access_token,
      instagramUserId: data.user_id,
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
        type: 'instagram',
        config: {},
        encryptedConfig,
      },
    });

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/i/integration-callback/instagram`
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
