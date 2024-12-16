'use server';

import { refreshLongLivedToken } from '@/app/api/services/instagram/callback/utils';

import prisma from '@/lib/prisma';

import { decrypt, encrypt } from '@/lib/encrypt';
import { captureException } from '@sentry/nextjs';
import { InstagramIntegrationConfig } from './config';

function fetchLatestInstagramPostsID(
  accessToken: string,
  instagramUserId: any,
  numberOfPosts: number
) {
  // const options = {
  //   limit: numberOfPosts.toString(),
  //   fields: 'id,media_url,permalink,username,timestamp,caption,media_type',
  //   access_token: accessToken, 
  // };

  // const qs = new URLSearchParams(options).toString();

  return fetch(`https://graph.instagram.com/v21.0/${instagramUserId}/media?access_token=${accessToken}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    next: {
      revalidate: 60,
    },
  });
}

async function fetchLatestInstagramPostsData(
  data: any, 
  numberOfPosts: number,
  accessToken: string,
) {
  const fields = 'id,media_url,permalink,username,timestamp,caption,media_type'

  try {
    // Use Promise.all to fetch data concurrently
    const postsData = await Promise.all(
      data.slice(0, numberOfPosts).map(async (post: {id: string}) => {
        const response = await fetch(`https://graph.instagram.com/v21.0/${post?.id}?fields=${fields}&access_token=${accessToken}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          next: {
            revalidate: 60,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data for ID ${post?.id}: ${response.statusText}`);
        }

        return response.json(); // Resolve the response as JSON
      })
    );

    return postsData;
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return [];
  }
}

const fetchInstagramData = async (
  config: InstagramIntegrationConfig,
  isRetry: boolean,
  integrationId: string,
  numberOfPosts: number
) => {

  console.log('config => ', config);
  
  const req = await fetchLatestInstagramPostsID(
    config.accessToken,
    config.instagramUserId,
    numberOfPosts
  );

  console.log('req.status => ', req.status);
  

  // The access token might have expired. Try to refresh it.
  if (req.status === 401 && !isRetry) {
    const refreshTokenRequest = await refreshLongLivedToken({
      accessToken: config.accessToken,
    });

    const refreshTokenData = await refreshTokenRequest.json();

    if (refreshTokenData?.access_token) {
      const encryptedConfig = await encrypt({
        accessToken: refreshTokenData.access_token,
        instagramUserId: config.instagramUserId,
      });

      await prisma.integration.update({
        where: {
          id: integrationId,
        },
        data: {
          encryptedConfig,
        },
      });

      fetchInstagramData(
        {
          accessToken: refreshTokenData.access_token,
          instagramUserId: config.instagramUserId,
        },
        true,
        integrationId,
        numberOfPosts
      );
    }
  }

  if (req.status === 200) {
    const data = await req.json();

    const resp = await fetchLatestInstagramPostsData(data.data, numberOfPosts, config.accessToken)

    console.log('Post response... => ', resp);

    const mappedData = resp.map((post: any) => ({
      imageUrl: post.media_url,
      link: post.permalink,
      username: post.username,
      timestamp: post.timestamp,
      caption: post.caption,
      mediaType: post.media_type === 'VIDEO' ? 'video' : 'image',
    }));

    console.log('mappedData => ', mappedData);
    

    return mappedData;
  }

  if (req.status !== 200) {
    captureException(new Error(`Failed to fetch Instagram posts: ${req.statusText}`));
    return null;
  }

  // Is this is a retry, bail out to prevent an infinite loop.
  if (isRetry) {
    return null;
  }
};

export const fetchData = async ({
  pageId,
  numberOfPosts = 1,
}: {
  pageId: string;
  numberOfPosts: number;
}) => {
  try {
    const instagramIntegration = await prisma.integration.findFirst({
      where: {
        type: 'instagram',
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

    if (!instagramIntegration || !instagramIntegration.encryptedConfig) {
      return null;
    }

    let decryptedConfig: InstagramIntegrationConfig | null = null;

    try {
      decryptedConfig = await decrypt<InstagramIntegrationConfig>(
        instagramIntegration.encryptedConfig
      );
    } catch (error) {
      captureException(error);
      return null;
    }

    if (!decryptedConfig.accessToken) {
      captureException(
        new Error(
          `Instagram accessToken or refreshToken doesn't exist: Integration ID: ${instagramIntegration.id}`
        )
      );

      return null;
    }

    const instagramData = await fetchInstagramData(
      decryptedConfig,
      false,
      instagramIntegration.id,
      numberOfPosts
    );

    return instagramData;
  } catch (error) {
    captureException(error);

    return null;
  }
};
