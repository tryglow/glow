'server-only';

import { requestToken } from '@/app/api/services/spotify/callback/utils';
import { decrypt, encrypt } from '@/lib/encrypt';
import prisma from '@/lib/prisma';
import { captureException, captureMessage } from '@sentry/nextjs';
import { SpotifyIntegrationConfig } from '@tryglow/blocks';
import safeAwait from 'safe-await';

async function fetchPlayingNow(accessToken: string) {
  const req = await fetch(
    'https://api.spotify.com/v1/me/player/currently-playing',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      next: {
        revalidate: 45,
      },
    }
  );

  return req;
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
  const [fetchPlayingNowError, fetchPlayingNowRequest] = await safeAwait(
    fetchPlayingNow(config.accessToken)
  );

  if (fetchPlayingNowError) {
    captureException(fetchPlayingNowError);
  }

  // Handle expired access token
  if (fetchPlayingNowRequest?.status === 401 && !isRetry) {
    const refreshTokenRequest = await requestToken({
      isRefreshToken: true,
      refreshToken: config.refreshToken,
    });

    const refreshTokenData = await refreshTokenRequest.json();

    if (refreshTokenData?.access_token) {
      const newConfig = {
        accessToken: refreshTokenData.access_token,
        refreshToken: refreshTokenData.refresh_token ?? config.refreshToken,
      };

      const [updateIntegrationError] = await safeAwait(
        prisma.integration.update({
          where: { id: integrationId },
          data: {
            config: {},
            encryptedConfig: await encrypt(newConfig),
          },
        })
      );

      if (updateIntegrationError) {
        captureException(updateIntegrationError);
      }

      return fetchSpotifyData(newConfig, true, integrationId);
    }
  }

  // Return currently playing track if available
  if (fetchPlayingNowRequest && fetchPlayingNowRequest?.status === 200) {
    const data = await fetchPlayingNowRequest.json();

    return {
      artistName: data?.item?.artists[0]?.name,
      name: data?.item?.name,
      imageUrl: data?.item?.album?.images[2]?.url,
      hyperlink: data?.item?.album?.external_urls?.spotify,
      isPlayingNow: true,
    };
  }

  // Prevent infinite loop on retry
  if (isRetry) {
    return null;
  }

  // Fall back to recently played track
  const recentlyPlayedReq = await fetchRecentlyPlayed(config.accessToken);
  const recentlyPlayedData = await recentlyPlayedReq.json();

  if (recentlyPlayedData) {
    return {
      artistName: recentlyPlayedData?.items[0]?.track?.artists[0]?.name,
      name: recentlyPlayedData?.items[0]?.track?.name,
      imageUrl: recentlyPlayedData?.items[0]?.track?.album?.images[2]?.url,
      hyperlink: recentlyPlayedData?.items[0]?.track?.external_urls?.spotify,
      isPlayingNow: false,
    };
  }

  return null;
};

export const fetchData = async (blockId: string) => {
  try {
    const block = await prisma.block.findUnique({
      where: { id: blockId },
      select: {
        integration: {
          where: {
            type: 'spotify',
          },
          select: {
            id: true,
            encryptedConfig: true,
          },
        },
      },
    });

    const integration = block?.integration;

    if (!integration || !integration.encryptedConfig) {
      console.info('No integration found for current page');
      return {
        noIntegration: true,
        data: null,
      };
    }

    const [decryptedConfigError, decryptedConfig] = await safeAwait(
      decrypt<SpotifyIntegrationConfig>(integration.encryptedConfig)
    );

    if (decryptedConfigError) {
      captureException(decryptedConfigError);

      return {
        data: null,
      };
    }

    if (!decryptedConfig.accessToken) {
      captureMessage(
        `Spotify accessToken or refreshToken doesn't exist: Integration ID: ${integration.id}`
      );

      return {
        data: null,
      };
    }

    const spotifyData = await fetchSpotifyData(
      decryptedConfig,
      false,
      integration.id
    );

    return {
      data: spotifyData,
    };
  } catch (error) {
    captureException(error);

    return {
      data: null,
    };
  }
};
