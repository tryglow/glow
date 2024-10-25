import { auth } from '@/app/lib/auth';
import prisma from '@/lib/prisma';

import { encrypt } from '@/lib/encrypt';
import { fetchTwitterUserData, requestToken } from './utils';

interface TwitterTokenResponse {
  token_type: 'bearer';
  expires_in: 7200;
  access_token: string;
  scope: string;
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
    const res = await requestToken({ code, isRefreshToken: false });

    const data = (await res.json()) as TwitterTokenResponse;

    const userReq = await fetchTwitterUserData({
      accessToken: data.access_token,
    });

    const userData = await userReq.json();

    const encryptedConfig = await encrypt({
      accessToken: data.access_token,
      twitterUsername: userData.data.username,
      twitterUserId: userData.data.id,
    });

    await prisma.integration.create({
      data: {
        userId: session.user.id,
        type: 'twitter',
        config: {},
        encryptedConfig,
      },
    });

    return Response.json({
      data: userData,
    });
  } catch (error) {
    console.error('Error getting token', error);
    return Response.json({
      error: {
        message: 'Error getting token',
      },
    });
  }
}
