'use server';

import { refreshLongLivedToken } from '@/app/api/services/tiktok/callback/utils';

import prisma from '@/lib/prisma';

import { TikTokIntegrationConfig } from '@/lib/blocks/tiktok-follower-count/config';
import { decrypt, encrypt } from '@/lib/encrypt';
import { captureException } from '@sentry/nextjs';

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

export const fetchData = async ({ pageId }: { pageId: string }) => {
  try {
    const tikTokIntegration = await prisma.integration.findFirst({
      where: {
        type: 'tiktok',
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

    if (!tikTokIntegration || !tikTokIntegration.encryptedConfig) {
      return null;
    }

    let decryptedConfig: TikTokIntegrationConfig | null = null;

    try {
      decryptedConfig = await decrypt<TikTokIntegrationConfig>(
        tikTokIntegration.encryptedConfig
      );
    } catch (error) {
      captureException(error);
      return null;
    }

    if (!decryptedConfig.accessToken) {
      captureException(
        new Error(
          `TikTok accessToken or refreshToken doesn't exist: Integration ID: ${tikTokIntegration.id}`
        )
      );

      return null;
    }

    const tikTokData = await fetchTikTokData(
      decryptedConfig,
      false,
      tikTokIntegration.id
    );

    return tikTokData;
  } catch (error) {
    captureException(error);

    return null;
  }
};
