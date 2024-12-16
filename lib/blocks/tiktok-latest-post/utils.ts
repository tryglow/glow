'use server';

import { decrypt, encrypt } from '@/lib/encrypt';
import prisma from '@/lib/prisma';
import { captureException } from '@sentry/nextjs';
import { TikTokIntegrationConfig } from './config';

async function refreshLongLivedToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  return fetch(`https://open.tiktokapis.com/v2/oauth/token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });
}

function fetchTiktokLatestPost(accessToken: string) {
  const fields = [
    'id',
    'create_time',
    'cover_image_url',
    'title',
    'share_url',
    'video_description',
    'duration',
    'height',
    'width',
    'embed_html',
    'embed_link',
  ];

  const qs = new URLSearchParams({
    fields: fields.join(','),
  }).toString();

  return fetch(`https://open.tiktokapis.com/v2/video/list/?${qs}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: 'POST',
    next: {
      revalidate: 60,
    },
    body: JSON.stringify({
      max_count: 1,
    }),
  });
}

const fetchTikTokData = async (
  config: TikTokIntegrationConfig,
  isRetry: boolean,
  integrationId: string
) => {
  console.log('latest posts config => ', config);
  
  const latestPostReq = await fetchTiktokLatestPost(config.accessToken);

  // The access token might have expired. Try to refresh it.
  if (latestPostReq.status === 401 && !isRetry) {
    const refreshTokenRequest = await refreshLongLivedToken({
      refreshToken: config.refreshToken,
    });

    const refreshTokenData = await refreshTokenRequest.json();

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

  if (latestPostReq.status === 200) {
    const { data } = await latestPostReq.json();

    const videos = data.videos;

    return {
      videos: videos.map((video: any) => ({
        id: video.id,
        title: video.title,
        coverImageUrl: video.cover_image_url,
        embedHtml: video.embed_html,
        embedLink: video.embed_link,
      })),
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
