'use server';

import { requestToken } from '@/app/api/services/spotify/callback/utils';

import prisma from '@/lib/prisma';

import { SpotifyIntegrationConfig } from './config';

function fetchPlayingNow(accessToken: string) {
  return fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    next: {
      revalidate: 60,
    },
  });
}

function fetchRecentlyPlayed(accessToken: string) {
  return fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    next: {
      revalidate: 60,
    },
  });
}

const fetchSpotifyData = async (
  config: SpotifyIntegrationConfig,
  isRetry: boolean,
  integrationId: string
) => {
  const req = await fetchPlayingNow(config.accessToken);

  // The access token might have expired. Try to refresh it.
  if (req.status === 401 && !isRetry) {
    const refreshTokenRequest = await requestToken({
      isRefreshToken: true,
      refreshToken: config.refreshToken,
    });

    const refreshTokenData = await refreshTokenRequest.json();

    console.log('refreshTokenData', refreshTokenData);

    if (refreshTokenData?.access_token) {
      console.log('utils.ts, Updating Spotify integration', integrationId);
      console.log(
        'Updating Spotify integration refreshTokenData',
        refreshTokenData
      );

      await prisma.integration.update({
        where: {
          id: integrationId,
        },
        data: {
          config: {
            refreshToken: refreshTokenData.refresh_token,
            accessToken: refreshTokenData.access_token,
          },
        },
      });

      fetchSpotifyData(
        {
          accessToken: refreshTokenData.access_token,
          refreshToken: config.refreshToken,
        },
        true,
        integrationId
      );
    }
  }

  if (req.status === 200) {
    const data = await req.json();

    const timestampDate = new Date(data.timestamp);
    console.log('Data last fetched:', timestampDate.toLocaleString());

    return {
      artistName: data?.item?.artists[0]?.name,
      name: data?.item?.name,
      imageUrl: data?.item?.album?.images[2]?.url,
      isPlayingNow: true,
    };
  }

  // Is this is a retry, bail out to prevent an infinite loop.
  if (isRetry) {
    return null;
  }

  const recentlyPlayedReq = await fetchRecentlyPlayed(config.accessToken);
  const recentlyPlayedData = await recentlyPlayedReq.json();

  if (recentlyPlayedData) {
    return {
      artistName: recentlyPlayedData?.items[0]?.track?.artists[0]?.name,
      name: recentlyPlayedData?.items[0]?.track?.name,
      imageUrl: recentlyPlayedData?.items[0]?.track?.album?.images[2]?.url,
      isPlayingNow: false,
    };
  }
};

export const fetchData = async (pageId: string) => {
  try {
    const data = await prisma.integration.findFirst({
      where: {
        type: 'spotify',
        user: {
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

    if (!data || !data.config) {
      console.log('No integration found for current page');
      return null;
    }

    const config = data.config as unknown as SpotifyIntegrationConfig;

    if (!config.accessToken) {
      console.log(
        `Spotify accessToken or refreshToken doesn't exist: Integration ID: ${data.id}`
      );
      return null;
    }

    const spotifyData = await fetchSpotifyData(config, false, data.id);
    return spotifyData;
  } catch (error) {
    console.log(error);
    return null;
  }
};
