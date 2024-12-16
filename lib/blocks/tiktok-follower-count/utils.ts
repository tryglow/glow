'use server';

import { decrypt, encrypt } from '@/lib/encrypt';
import prisma from '@/lib/prisma';
import { captureException } from '@sentry/nextjs';
import { TikTokIntegrationConfig } from './config';
import { refreshLongLivedToken } from '@/app/api/services/tiktok/callback/utils';

function fetchTiktokProfile(accessToken: string) {
  const options = {
    fields: 'avatar_url,display_name,follower_count,username',
  };

  const qs = new URLSearchParams(options).toString();

  return fetch(`https://open.tiktokapis.com/v2/user/info/?${qs}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    next: {
      revalidate: 60,
    },
  });
}

const fetchTikTokData = async (
  config: TikTokIntegrationConfig,
  isRetry: boolean,
  integrationId: string
) => {
  const profileReq = await fetchTiktokProfile(config.accessToken);
  console.log('profileReq.status => ', profileReq.status);
  
  // The access token might have expired. Try to refresh it.
  if (profileReq.status === 401 && !isRetry) {
    const refreshTokenRequest = await refreshLongLivedToken({
      refreshToken: config.refreshToken,
    });

    const refreshTokenData = await refreshTokenRequest.json();
    console.log('refreshTokenData => ', refreshTokenData);
    

    if (refreshTokenData?.access_token) {
      const encryptedConfig = await encrypt({
        accessToken: refreshTokenData.access_token,
        refreshToken: config.refreshToken,
      });

      await prisma.integration.update({
        where: {
          id: integrationId,
        },
        data: {
          encryptedConfig,
        },
      });

      fetchTikTokData(
        {
          accessToken: refreshTokenData.access_token,
          refreshToken: config.refreshToken,
        },
        true,
        integrationId
      );
    }
  }

  if (profileReq.status === 200) {
    const profileData = await profileReq.json();
    console.log('profileData => ', profileData);
    

    const { data, error } = profileData;

    if (error.code !== 'ok') {
      captureException(error);
      return null;
    }

    return {
      followerCount: data.user.follower_count,
      profile: {
        username: data.user.username,
        displayName: data.user.display_name,
        avatarUrl: data.user.avatar_url,
      },
    };
  }

  // Is this is a retry, bail out to prevent an infinite loop.
  if (isRetry) {
    return null;
  }
};

export const fetchData = async (pageId: string) => {
  try {
    const tiktokIntegration = await prisma.integration.findFirst({
      where: {
        type: 'tiktok',
        deletedAt: null,
        team: {
          pages: {
            some: {
              id: pageId,
            },
          },
        },
      },
      include: {
        user: {
          select: {
            pages: true,
          },
        },
      },
    });

    console.log('tiktokIntegration => ', tiktokIntegration);
    

    if (!tiktokIntegration || !tiktokIntegration.encryptedConfig) {
      return null;
    }

    let decryptedConfig: any | null = null;

    try {
      console.log('TikTok decryption...');
      decryptedConfig = await decrypt<TikTokIntegrationConfig>(
        tiktokIntegration.encryptedConfig
      );
    } catch (error) {
      captureException(error);
      return null;
    }

    console.log('TikTok decryptedConfig => ', decryptedConfig);
    

    if (!decryptedConfig.accessToken) {
      captureException(
        new Error(
          `TikTok accessToken or refreshToken doesn't exist: Integration ID: ${tiktokIntegration.id}`
        )
      );

      return null;
    }

    const tikTokData = await fetchTikTokData(
      decryptedConfig,
      false,
      tiktokIntegration.id
    );

    return tikTokData;
  } catch (error) {
    captureException(error);

    return null;
  }
};
