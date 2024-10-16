'use server';

import { refreshLongLivedToken } from '@/app/api/services/instagram/callback/utils';

import prisma from '@/lib/prisma';

import { InstagramIntegrationConfig } from './config';

function fetchLatestInstagramPost(
  accessToken: string,
  instagramUserId: string
) {
  const options = {
    limit: '1',
    fields: 'id,media_url,permalink,username,timestamp,caption',
    access_token: accessToken,
  };

  const qs = new URLSearchParams(options).toString();

  return fetch(`https://graph.instagram.com/${instagramUserId}/media?${qs}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    next: {
      revalidate: 60,
    },
  });
}

const fetchInstagramData = async (
  config: InstagramIntegrationConfig,
  isRetry: boolean,
  integrationId: string
) => {
  const req = await fetchLatestInstagramPost(
    config.accessToken,
    config.instagramUserId
  );

  // The access token might have expired. Try to refresh it.
  if (req.status === 401 && !isRetry) {
    const refreshTokenRequest = await refreshLongLivedToken({
      accessToken: config.accessToken,
    });

    const refreshTokenData = await refreshTokenRequest.json();

    if (refreshTokenData?.access_token) {
      await prisma.integration.update({
        where: {
          id: integrationId,
        },
        data: {
          config: JSON.stringify({
            accessToken: refreshTokenData.access_token,
          }),
        },
      });

      fetchInstagramData(
        {
          accessToken: refreshTokenData.access_token,
          instagramUserId: config.instagramUserId,
        },
        true,
        integrationId
      );
    }
  }

  if (req.status === 200) {
    const data = await req.json();

    return {
      imageUrl: data.data[0].media_url,
      link: data.data[0].permalink,
      username: data.data[0].username,
      timestamp: data.data[0].timestamp,
      caption: data.data[0].caption,
    };
  }

  // Is this is a retry, bail out to prevent an infinite loop.
  if (isRetry) {
    return null;
  }
};

export const fetchData = async (pageId: string) => {
  try {
    const instagramIntegration = await prisma.integration.findFirst({
      where: {
        type: 'instagram',
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

    if (!instagramIntegration) {
      return null;
    }

    const config =
      instagramIntegration.config as unknown as InstagramIntegrationConfig;

    if (!config.accessToken) {
      console.log(
        `Instagram accessToken or refreshToken doesn't exist: Integration ID: ${instagramIntegration.id}`
      );
      return null;
    }

    const instagramData = await fetchInstagramData(
      config,
      false,
      instagramIntegration.id
    );
    return instagramData;
  } catch (error) {
    console.log(error);
    return null;
  }
};
