import { FunctionComponent } from 'react';
import { formatDistance } from 'date-fns';

import { CoreBlock } from '@/app/components/CoreBlock';
import { refreshLongLivedToken } from '@/app/api/services/instagram/callback/utils';
import prisma from '@/lib/prisma';
import Link from 'next/link';
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

const fetchData = async (pageId: string) => {
  try {
    const instagramIntegration = await prisma.integration.findFirst({
      where: {
        type: 'instagram',
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

const InstagramLogo = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
};

interface Props {
  pageId: string;
}

const InstagramLatestPost: FunctionComponent<Props> = async ({ pageId }) => {
  const data = await fetchData(pageId);

  const formattedDate = data?.timestamp
    ? formatDistance(data?.timestamp, new Date(), {
        addSuffix: true,
      })
    : null;

  if (!data) {
    return (
      <CoreBlock className="flex items-center justify-center">
        <span className="text-sm text-stone-500 text-center">
          Edit this block to connect your Instagram account.
        </span>
      </CoreBlock>
    );
  }

  return (
    <CoreBlock className="relative !p-0 overflow-hidden">
      <img
        src={data?.imageUrl}
        className="absolute w-full h-full object-cover"
      />
      <div className="absolute h-32 w-full bg-gradient-to-b from-transparent to-black bottom-0 z-10 px-6 py-6 flex flex-row justify-between items-end">
        <span className="flex flex-col">
          <span className="text-white font-bold text-base">
            @{data?.username}
          </span>
          <span className="text-white/70 text-sm">Posted {formattedDate}</span>
        </span>
        <Link target="_blank" rel="noopener noreferrer" href={data?.link}>
          <InstagramLogo />
        </Link>
      </div>
    </CoreBlock>
  );
};

export default InstagramLatestPost;
