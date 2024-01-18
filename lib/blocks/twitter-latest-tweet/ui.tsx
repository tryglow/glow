import { FunctionComponent } from 'react'

import { CoreBlock } from '@/app/components/CoreBlock'
import { requestToken } from '@/app/api/services/twitter/callback/utils'
import prisma from '@/lib/prisma'

interface TwitterConfig {
  accessToken: string
  twitterUserId: string
}

function fetchLatestTweet(accessToken: string, twitterUserId: string) {
  return fetch(`https://api.twitter.com/2/users/${twitterUserId}/tweets`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    next: {
      revalidate: 60,
    },
  })
}

const fetchTwitterData = async (
  config: TwitterConfig,
  isRetry: boolean,
  integrationId: string
) => {
  const req = await fetchLatestTweet(config.accessToken, config.twitterUserId)

  const data = await req.json()

  console.log('Request Latest Tweet', data)

  // The access token might have expired. Try to refresh it.
  if (req.status === 401 && !isRetry) {
    const refreshTokenRequest = await requestToken({
      isRefreshToken: true,
      code: config.accessToken,
    })

    const refreshTokenData = await refreshTokenRequest.json()

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
      })

      fetchTwitterData(
        {
          accessToken: refreshTokenData.access_token,
          twitterUserId: config.twitterUserId,
        },
        true,
        integrationId
      )
    }
  }

  if (req.status === 200) {
    const data = await req.json()

    console.log('Tweet 200', data)

    return {
      fakeData: true,
    }
  }

  // Is this is a retry, bail out to prevent an infinite loop.
  if (isRetry) {
    return null
  }
}

const fetchData = async (pageId: string) => {
  try {
    const twitterIntegration = await prisma.integration.findFirst({
      where: {
        type: 'twitter',
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
    })

    console.log('Twitter Integration', twitterIntegration)

    if (!twitterIntegration) {
      return null
    }

    const config = twitterIntegration.config as unknown as TwitterConfig

    if (!config.accessToken) {
      console.log(
        `Twitter accessToken or refreshToken doesn't exist: Integration ID: ${twitterIntegration.id}`
      )
      return null
    }

    const twitterData = await fetchTwitterData(
      config,
      false,
      twitterIntegration.id
    )
    return twitterData
  } catch (error) {
    console.log(error)
    return null
  }
}

interface Props {
  twitterConfig: TwitterConfig
  pageId: string
}

const TwitterLatestTweet: FunctionComponent<Props> = async ({ pageId }) => {
  const data = await fetchData(pageId)

  return (
    <CoreBlock className="bg-gradient-to-tr from-[#1DB954] to-[#37bc66]">
      <div className="flex gap-2">
        <span>Twitter Logo</span>
        <span>Latest tweet</span>
      </div>
      <div className="mt-4">
        <span className="text-xl font-semibold">
          This is where the tweet will go
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        <img src="" className="rounded-full w-8 h-8" alt="" />
        <div className="flex flex-col">
          <span className="font-bold text-md">Tweet Author</span>
          <span className="font-bold text-md">Tweet username</span>
        </div>
      </div>
    </CoreBlock>
  )
}

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
  )
}

export default TwitterLatestTweet
