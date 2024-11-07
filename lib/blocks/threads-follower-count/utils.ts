'use server';

import { refreshLongLivedToken } from '@/app/api/services/threads/callback/utils';

import prisma from '@/lib/prisma';

import { ThreadsIntegrationConfig } from '@/lib/blocks/threads-follower-count/config';
import { decrypt, encrypt } from '@/lib/encrypt';
import { captureException } from '@sentry/nextjs';

function fetchThreadsFollowerCount(accessToken: string, threadsUserId: string) {
  const options = {
    metric: 'followers_count',
  };

  const qs = new URLSearchParams(options).toString();

  return fetch(
    `https://graph.threads.net/v1.0/${threadsUserId}/threads_insights?${qs}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        revalidate: 60,
      },
    }
  );
}

function fetchThreadsProfileInfo(accessToken: string, threadsUserId: string) {
  const options = {
    fields: 'username,threads_profile_picture_url,name',
  };

  const qs = new URLSearchParams(options).toString();

  return fetch(`https://graph.threads.net/v1.0/${threadsUserId}?${qs}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    next: {
      revalidate: 60,
    },
  });
}

const fetchThreadsData = async (
  config: ThreadsIntegrationConfig,
  isRetry: boolean,
  integrationId: string
) => {
  const [followerCountReq, profileInfoReq] = await Promise.all([
    fetchThreadsFollowerCount(config.accessToken, config.threadsUserId),
    fetchThreadsProfileInfo(config.accessToken, config.threadsUserId),
  ]);

  // The access token might have expired. Try to refresh it.
  if (followerCountReq.status === 401 && !isRetry) {
    const refreshTokenRequest = await refreshLongLivedToken({
      accessToken: config.accessToken,
    });

    const refreshTokenData = await refreshTokenRequest.json();

    if (refreshTokenData?.access_token) {
      const encryptedConfig = await encrypt({
        accessToken: refreshTokenData.access_token,
        threadsUserId: config.threadsUserId,
      });

      await prisma.integration.update({
        where: {
          id: integrationId,
        },
        data: {
          encryptedConfig,
        },
      });

      fetchThreadsData(
        {
          accessToken: refreshTokenData.access_token,
          threadsUserId: config.threadsUserId,
        },
        true,
        integrationId
      );
    }
  }

  if (followerCountReq.status === 200) {
    const [followerCountData, profileInfoData] = await Promise.all([
      followerCountReq.json(),
      profileInfoReq.json(),
    ]);

    return {
      followerCount: followerCountData.data[0]?.total_value?.value ?? 0,
      profile: {
        username: profileInfoData.username,
        profilePictureUrl: profileInfoData.threads_profile_picture_url,
        name: profileInfoData.name,
      },
    };
  }

  // Is this is a retry, bail out to prevent an infinite loop.
  if (isRetry) {
    return null;
  }
};

export const fetchData = async ({ pageId }: { pageId: string }) => {
  try {
    const threadsIntegration = await prisma.integration.findFirst({
      where: {
        type: 'threads',
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

    if (!threadsIntegration || !threadsIntegration.encryptedConfig) {
      return null;
    }

    let decryptedConfig: ThreadsIntegrationConfig | null = null;

    try {
      decryptedConfig = await decrypt<ThreadsIntegrationConfig>(
        threadsIntegration.encryptedConfig
      );
    } catch (error) {
      captureException(error);
      return null;
    }

    if (!decryptedConfig.accessToken) {
      captureException(
        new Error(
          `Threads accessToken or refreshToken doesn't exist: Integration ID: ${threadsIntegration.id}`
        )
      );

      return null;
    }

    const threadsData = await fetchThreadsData(
      decryptedConfig,
      false,
      threadsIntegration.id
    );

    return threadsData;
  } catch (error) {
    captureException(error);

    return null;
  }
};
