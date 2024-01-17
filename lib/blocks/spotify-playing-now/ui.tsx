import {FunctionComponent} from 'react';

import styles from './styles.module.css';
import clsx from 'clsx';

import {CoreBlock} from '@/app/components/CoreBlock';
import {requestToken} from '@/app/api/services/spotify/callback/utils';
import prisma from '@/lib/prisma';

interface SpotifyConfig {
  accessToken: string;
  refreshToken: string;
}

function fetchPlayingNow(accessToken: string) {
  return fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    next: {
      revalidate: 500,
    },
  });
}

function fetchRecentlyPlayed(accessToken: string) {
  return fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    next: {
      revalidate: 500,
    },
  });
}

const fetchSpotifyData = async (
  config: SpotifyConfig,
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

    if (refreshTokenData?.access_token) {
      await prisma.integration.update({
        where: {
          id: integrationId,
        },
        data: {
          config: JSON.stringify({
            refresh_token: refreshTokenData.refresh_token,
            access_token: refreshTokenData.access_token,
          }),
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

    return {
      artistName: data?.item?.artists[0]?.name,
      name: data?.item?.name,
      imageUrl: data?.item?.album?.images[0]?.url,
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
      imageUrl: recentlyPlayedData?.items[0]?.track?.album?.images[0]?.url,
      isPlayingNow: false,
    };
  }
};

const fetchData = async (pageId: string) => {
  try {
    const data = await prisma.integration.findFirst({
      where: {
        type: 'spotify',
      },
      include: {
        user: {
          select: {
            pages: true,
          },
        },
      },
    });

    if (!data) {
      return null;
    }

    const config = data.config as unknown as SpotifyConfig;

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

interface Props {
  spotifyConfig: SpotifyConfig;
  pageId: string;
}

const SpotifyPlayingNow: FunctionComponent<Props> = async ({
  spotifyConfig,
  pageId,
}) => {
  const data = await fetchData(pageId);

  return (
    <CoreBlock className="bg-gradient-to-tr from-[#1DB954] to-[#37bc66]">
      <div className="flex gap-3">
        <img
          src={data?.imageUrl}
          className="w-16 h-16 object-cover rounded-xl"
          alt=""
        />

        <div className="flex flex-col justify-center">
          <p className="text-sm text-system-bg-primary uppercase font-medium">
            <span
              className={clsx(
                styles.bars,
                data?.isPlayingNow && styles.animate
              )}
            >
              <span />
              <span />
              <span />
            </span>
            {data?.isPlayingNow ? 'Playing Now' : 'Recently Played'}
          </p>
          <p className="text-md text-white font-bold">{data?.name}</p>
          <p className="text-sm text-white">{data?.artistName}</p>
        </div>
      </div>
    </CoreBlock>
  );
};

export const LoadingState = () => {
  return (
    <div className="bg-system-bg-primary bg-gradient-to-tr from-[#1DB954] to-[#37bc66] border-system-bg-secondary border p-6 rounded-3xl">
      <div className="flex gap-3">
        <div className="w-16 h-16 object-cover rounded-xl bg-white/20" />

        <div className="flex flex-col justify-center">
          <p className="text-sm text-system-bg-primary uppercase font-medium">
            ------
          </p>
          <p className="text-md text-white font-bold">----</p>
          <p className="text-sm text-white">---</p>
        </div>
      </div>
    </div>
  );
};

export default SpotifyPlayingNow;
